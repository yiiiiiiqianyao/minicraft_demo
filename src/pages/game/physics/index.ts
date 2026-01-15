import * as THREE from "three";

import { BlockID } from "../Block";
import { BlockFactory } from "../Block/BlockFactory";
import { Player } from "../player/Player";
import { World } from "../world/World";
import { PlayerParams } from "../player/literal";
import { Candidate, Collision } from "./interface";
import { PhysicsHelper } from "../helper";
import { PhysicsParams } from "./literal";
import { DevControl } from "../dev";
import { getBlockUnderneath } from "../player/utils";

export class Physics {
  // Physics simulation rate 物理模拟的半径
  simulationRate = 250;
  // 控制物理碰撞计算的精度（减少性能消耗）
  stepSize = 1 / this.simulationRate;
  // Accumulator to keep track of leftover dt
  accumulator = 0;

  helpers: PhysicsHelper | null = null;
  constructor(scene: THREE.Scene) {
    if (DevControl.physicsHelperVisible) {
      this.helpers = new PhysicsHelper();
      this.helpers.visible = true;
      scene.add(this.helpers);
    }
  }

  // physics 更新物理碰撞
  update(dt: number, player: Player, world: World) {
    this.accumulator += dt;
    // 获取玩家脚下的方块
    const blockUnderneath = getBlockUnderneath(player, world)?.block || BlockID.Air;

    const { x: o_x, y: o_y, z: o_z } = player.position;
    while (this.accumulator >= this.stepSize) {
      // 玩家下落的速度
      player.velocity.y += PhysicsParams.GRAVITY * this.stepSize;
      player.applyInputs(this.stepSize, blockUnderneath);
      // 检测玩家与环境的碰撞
      this.detectCollisions(player, world);
      this.accumulator -= this.stepSize;

      player.update(world);
    
      // player 发生位移的时候触发更新
      const { x, y, z } = player.position;
      const positionUpdate = x !== o_x || y !== o_y || z !== o_z;
      positionUpdate && player.updatePosition();
    }
    
  }

  detectCollisions(player: Player, world: World) {
    // 碰撞检测的时候假定玩家不在地面 可能会下落
    player.onGround = false;
    // 清除之前的碰撞辅助可视化
    this.helpers?.clear();

    const candidates = this.broadPhase(player, world);
    // narrowPhase 检测玩家是否会下落
    const collisions = this.narrowPhase(candidates, player);

    if (collisions.length > 0) {
      this.resolveCollisions(collisions, player);
    }
  }

  /**
   * @desc 获取当前 player 周围不能穿过的 block
   * @param player 
   * @param world 
   * @returns 
   */
  broadPhase(player: Player, world: World): Candidate[] {
    const { position } = player;
    const { radius, height } = PlayerParams;
    const candidates: Candidate[] = [];

    // Get the block extents of the player
    // 获取玩家角色的包围盒范围
    const minX = Math.floor(position.x - radius);
    const maxX = Math.ceil(position.x + radius);
    const minY = Math.floor(position.y - height);
    const maxY = Math.ceil(position.y);
    const minZ = Math.floor(position.z - radius);
    const maxZ = Math.ceil(position.z + radius);

    // Iterate over the player's AABB
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        for (let z = minZ; z <= maxZ; z++) {
          const blockData = world.getBlock(x, y, z);
          if (!blockData) continue;
          // If the block is solid, add it to the list of candidates
          const blockClass = BlockFactory.getBlock(blockData.block);
          if(!blockClass || blockClass.canPassThrough) continue;
          const aroundBlock = {
            block: blockData.block,
            x: x + 0.5,
            y: y + 0.5,
            z: z + 0.5,
          };
          candidates.push(aroundBlock);
          this.helpers?.addBlockCollisionHelper(aroundBlock);
        }
      }
    }
    return candidates;
  }

  /**
   * 检测玩家与环境的碰撞 靠近检测
   * @param candidates 
   * @param player 
   * @returns 
   */
  narrowPhase(candidates: Candidate[], player: Player): Collision[] {
    const collisions: Collision[] = [];

    for (const candidate of candidates) {
      // Get the point of the block closest to the center of the player's bounding cylinder
      const closestPoint = new THREE.Vector3(
        Math.max(
          candidate.x - 0.5,
          Math.min(player.position.x, candidate.x + 0.5)
        ),
        Math.max(
          candidate.y - 0.5,
          Math.min(player.position.y - PlayerParams.height / 2, candidate.y + 0.5)
        ),
        Math.max(
          candidate.z - 0.5,
          Math.min(player.position.z, candidate.z + 0.5)
        )
      );

      // Get distance along each exist between closest point and center
      const dx = closestPoint.x - player.position.x;
      const dy = closestPoint.y - (player.position.y - PlayerParams.height / 2);
      const dz = closestPoint.z - player.position.z;

      if (this.pointInPlayerBoundingCylinder(closestPoint, player)) {
        const overlapY = PlayerParams.height / 2 - Math.abs(dy);
        const overlapXZ = PlayerParams.radius - Math.sqrt(dx * dx + dz * dz);
        // Compute the normal of the collision (pointing away from content point)
        // As well as overlap between the point and the player's bounding cylinder
        let normal: THREE.Vector3;
        let overlap: number;
        if (overlapY < overlapXZ) {
          normal = new THREE.Vector3(0, -Math.sign(dy), 0);
          overlap = overlapY;
          player.onGround = true;
        } else {
          normal = new THREE.Vector3(-dx, 0, -dz).normalize();
          overlap = overlapXZ;
        }

        collisions.push({
          candidate,
          contactPoint: closestPoint,
          normal,
          overlap,
        });

        this.helpers?.addContactPointerHelper(closestPoint);
      }
    }

    return collisions;
  }

  /**
   * Check if contact point is inside the player's bounding cylinder
   * @param p 
   * @param player 
   * @returns 
   */
  pointInPlayerBoundingCylinder(p: THREE.Vector3, player: Player) {
    const dx = p.x - player.position.x;
    const dy = p.y - (player.position.y - PlayerParams.height / 2);
    const dz = p.z - player.position.z;
    const r_sq = dx * dx + dz * dz;
    return (
      Math.abs(dy) < PlayerParams.height / 2 && r_sq < PlayerParams.radius * PlayerParams.radius
    );
  }

  resolveCollisions(collisions: Collision[], player: Player) {
    // Resolve collisions in order of smallest overlap to largest
    collisions.sort((a, b) => a.overlap - b.overlap);

    for (const collision of collisions) {
      // re-check if contact player is inside the player's bounding cylinder
      // since the player position is updated after each collision is resolved
      if (!this.pointInPlayerBoundingCylinder(collision.contactPoint, player)) {
        continue;
      }

      // Adjust position of player so that block and player are no longer overlapping
      const deltaPosition = collision.normal.clone();
      deltaPosition.multiplyScalar(collision.overlap);

      // Don't apply vertical change if player is not on ground
      if (!player.onGround && deltaPosition.y !== 0) {
        deltaPosition.y = 0;
      }
      
      // player.updatePosition(deltaPosition);
      player.position.add(deltaPosition);

      // If player is stuck underneath a block, boost him up
      if (collision.normal.y < 0) {
        player.velocity.y += 10;
      }

      // Get the magnitude of player's velocity along collision normal
      const magnitude = player.worldVelocity.dot(collision.normal);
      // remove that part of velocity from the player's velocity
      const velocityAdj = collision.normal.clone().multiplyScalar(magnitude);
      // 根据与环境的碰撞 作用于玩家的速度
      player.applyWorldDeltaVelocity(velocityAdj.negate());
    }
  }
}
