import * as THREE from "three";

import { BlockID } from "../Block";
import { BlockFactory } from "../Block/BlockFactory";
import { Player } from "../player/Player";
import { World } from "../world/World";
import { PlayerParams } from "../player/literal";

type Candidate = {
  block: BlockID;
  x: number;
  y: number;
  z: number;
};

type Collision = {
  candidate: Candidate;
  contactPoint: THREE.Vector3;
  normal: THREE.Vector3;
  overlap: number;
};

const collisionMaterial = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  transparent: true,
  opacity: 0.2,
});
const collisionGeometry = new THREE.BoxGeometry(1.001, 1.001, 1.001);

const contactMaterial = new THREE.MeshBasicMaterial({
  wireframe: true,
  color: 0x00ff00,
});
const contactGeometry = new THREE.SphereGeometry(0.05, 6, 6);

export class Physics {
  // Acceleration due to gravity
  static GRAVITY = -32;

  // Physics simulation rate 物理模拟的半径
  simulationRate = 250;
  stepSize = 1 / this.simulationRate;
  // Accumulator to keep track of leftover dt
  accumulator = 0;

  helpers: THREE.Group;

  constructor(scene: THREE.Scene) {
    this.helpers = new THREE.Group();
    this.helpers.visible = false;
    scene.add(this.helpers);
  }

  update(dt: number, player: Player, world: World) {
    this.accumulator += dt;
    // 获取玩家脚下的方块
    const blockUnderneath =
      this.getBlockUnderneath(player, world)?.block || BlockID.Air;

    const { x: o_x, y: o_y, z: o_z } = player.position;
    while (this.accumulator >= this.stepSize) {
      // 玩家下落的速度
      player.velocity.y += Physics.GRAVITY * this.stepSize;
      player.applyInputs(this.stepSize, blockUnderneath);
      // 检测玩家与环境的碰撞
      this.detectCollisions(player, world);
      this.accumulator -= this.stepSize;
    }
    player.update(world);
    const { x, y, z } = player.position;
    const positionUpdate = x !== o_x || y !== o_y || z !== o_z;
    
    // player 发生位移的时候触发更新
    positionUpdate && player.updatePosition();
  }

  /**
   * 获取玩家脚下的方块
   * @param player 
   * @param world 
   * @returns 
   */
  getBlockUnderneath(player: Player, world: World) {
    return world.getBlock(
      Math.floor(player.position.x),
      Math.floor(player.position.y - PlayerParams.height / 2 - 1),
      Math.floor(player.position.z)
    );
  }

  detectCollisions(player: Player, world: World) {
    // 碰撞检测的时候假定玩家不在地面 可能会下落
    player.onGround = false;
    this.helpers.clear();

    const candidates = this.broadPhase(player, world);
    // narrowPhase 检测玩家是否会下落
    const collisions = this.narrowPhase(candidates, player);

    if (collisions.length > 0) {
      this.resolveCollisions(collisions, player);
    }
  }

  broadPhase(player: Player, world: World): Candidate[] {
    const candidates: Candidate[] = [];

    // Get the block extents of the player
    const minX = Math.floor(player.position.x - PlayerParams.radius);
    const maxX = Math.ceil(player.position.x + PlayerParams.radius);
    const minY = Math.floor(player.position.y - PlayerParams.height);
    const maxY = Math.ceil(player.position.y);
    const minZ = Math.floor(player.position.z - PlayerParams.radius);
    const maxZ = Math.ceil(player.position.z + PlayerParams.radius);

    // Iterate over the player's AABB
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        for (let z = minZ; z <= maxZ; z++) {
          const block = world.getBlock(x, y, z);
          // If the block is solid, add it to the list of candidates
          if (block) {
            const blockClass = BlockFactory.getBlock(block.block);
            if (!blockClass.canPassThrough) {
              candidates.push({
                block: block.block,
                x: x + 0.5,
                y: y + 0.5,
                z: z + 0.5,
              });
              this.addCollisionHelper({
                block: block.block,
                x: x + 0.5,
                y: y + 0.5,
                z: z + 0.5,
              });
            }
          }
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

        this.addContactPointerHelper(closestPoint);
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

  // visualizes the block the player is colliding with
  addCollisionHelper(candidate: Candidate) {
    const blockMesh = new THREE.Mesh(collisionGeometry, collisionMaterial);
    blockMesh.position.copy(
      new THREE.Vector3(candidate.x, candidate.y, candidate.z)
    );
    this.helpers.add(blockMesh);
  }

  /**
   * Visualizes the contact at the point 'p'
   */
  addContactPointerHelper(p: THREE.Vector3) {
    const contactMesh = new THREE.Mesh(contactGeometry, contactMaterial);
    contactMesh.position.copy(new THREE.Vector3(p.x, p.y, p.z));
    this.helpers.add(contactMesh);
  }
}
