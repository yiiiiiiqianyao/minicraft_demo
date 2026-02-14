import * as THREE from "three";
import { Player } from "../player/Player";
import { World } from "../world/World";
import { BlockID } from "../Block";
import { PhysicsParams } from "./literal";
import { PlayerParams } from "../player/literal";
import { PhysicsHelper } from "../helper";
import { getBlockUnderneath } from "../player/utils";
import type { Candidate, Collision } from "./interface";
import { BlockFactory } from "../Block/base/BlockFactory";
import { KeyboardInput } from "../player/keyboard";

/**@desc 玩家的物理模拟 */
export class PlayerPhysics {
    player: Player;
    world: World;
    private helpers?: PhysicsHelper;
    private cachePosition = new THREE.Vector3();
    constructor(player: Player, helpers: PhysicsHelper | null) {
        this.player = player;
        this.world = player.world;
        this.cachePosition.copy(this.player.position);
        helpers && (this.helpers = helpers);
    }

    update() {
        const { player, world } = this;
        const { x: o_x, y: o_y, z: o_z } = this.cachePosition;
        // 获取玩家脚下的方块
        const blockUnderneath = getBlockUnderneath(player, world)?.blockId || BlockID.Air;
        // 玩家重力模拟
        player.velocity.y += PhysicsParams.GRAVITY * PhysicsParams.stepSize;
        // 玩家输入模拟: 根据玩家输入更新玩家的速度
        player.applyInputs(PhysicsParams.stepSize, blockUnderneath);
        // 检测玩家与环境的碰撞
        this.detectCollisions(player, world);

        player.update(world);

        // player 发生位移的时候触发更新
        const { x, y, z } = this.player.position;
        const positionUpdate = x !== o_x || y !== o_y || z !== o_z;
        // Tip: 玩家位置更新 或者 玩家所处的 chunk 未设置初始值的时候 需要刷新
        if (positionUpdate || PlayerParams.activeChunks.length === 0) {
            this.cachePosition.copy(player.position);
            this.player.updatePosition();
        }
    }

    /**
     * @desc 碰撞检测
     * @param player 
     * @param world 
     */
    private detectCollisions(player: Player, world: World) {
        // 碰撞检测的时候假定玩家不在地面 可能会下落
        player.onGround = false;

        const candidates = this.broadPhase(player, world);
        const collisions = this.narrowPhase(candidates, player);

        if (collisions.length > 0) {
            this.resolveCollisions(collisions, player);
        }
    }

    /**
     * @desc 碰撞检测的宽阶段处理 筛选出玩家周边的碰撞候选方块
     * @param player 
     * @param world 
     * @returns 
     */
    private broadPhase(player: Player, world: World): Candidate[] {
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
                    const blockData = world.getBlockData(x, y, z);
                    if (!blockData) continue;
                    // If the block is solid, add it to the list of candidates
                    const blockClass = BlockFactory.getBlock(blockData.blockId);
                    if (!blockClass || blockClass.canPassThrough) continue;
                    const aroundBlock = {
                        block: blockData.blockId,
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
     * @desc 碰撞检测的窄阶段处理 根据 player 对每个候选方块做精准碰撞计算，最终返回包含「接触点、碰撞法向量、重叠量」的碰撞信息数组
     * @param candidates 
     * @param player 
     * @returns 
     */
    private narrowPhase(candidates: Candidate[], player: Player): Collision[] {
        const { position } = player;
        const { halfHeight, radius } = PlayerParams;
        // 玩家圆柱中心
        const playerCenter = position.y - halfHeight;
        const collisions: Collision[] = [];
        for (const candidate of candidates) {
            // Get the point of the block closest to the center of the player's bounding cylinder
            // 获取 player 周围的 block 距离 player 最近的一个 point
            const closestPointX = Math.max(candidate.x - 0.5, Math.min(position.x, candidate.x + 0.5));
            const closestPointY = Math.max(candidate.y - 0.5, Math.min(playerCenter, candidate.y + 0.5));
            const closestPointZ = Math.max(candidate.z - 0.5, Math.min(position.z, candidate.z + 0.5));
            const closePoint = [closestPointX, closestPointY, closestPointZ];

            // 过滤掉在 player 碰撞体内的 point 点位
            if (!this.pointInPlayerBoundingCylinder(closePoint, player)) continue;
            // Get distance along each exist between closest point and center
            // 计算最近点距离碰撞体圆柱中心的偏移量
            const dx = closestPointX - position.x;
            const dy = closestPointY - playerCenter;
            const dz = closestPointZ - position.z;
            /**
             * 碰撞重叠量: 正数表示有碰撞，数值是 “玩家需要向法向量方向移动的距离” 才能脱离碰撞；负数 or 零表示无碰撞
             * 取重叠量更小的方向作为主要碰撞方向（因为更小的重叠量代表 “更先接触” 的方向）
             */
            const overlapY = halfHeight - Math.abs(dy);
            const overlapXZ = radius - Math.sqrt(dx * dx + dz * dz);
            if (overlapY <= 0 && overlapXZ <= 0) continue; // 无重叠，跳过
            // Compute the normal of the collision (pointing away from content point)
            // As well as overlap between the point and the player's bounding cylinder
            let normal: THREE.Vector3; // 最终的作用力
            let overlap: number;
            if (overlapY < overlapXZ) {
                normal = new THREE.Vector3(0, -Math.sign(dy), 0);
                overlap = overlapY;
                player.onGround = true;
                // TIP: 避免空格跳跃后 松开空格失效的情况（触发反复跳跃）
                KeyboardInput.spacePressed = false;
            } else {
                normal = new THREE.Vector3(-dx, 0, -dz).normalize();
                overlap = overlapXZ;
            }
            collisions.push({
                candidate,
                contactPoint: closePoint, // 碰撞点
                normal, // 法向量
                overlap, // 重叠量
            });
            this.helpers?.addContactPointerHelper(closePoint);
        }
        return collisions;
    }

    /**
     * Check if contact point is inside the player's bounding cylinder
     * @param p 
     * @param player 
     * @returns 
     */
    private pointInPlayerBoundingCylinder(p: number[], player: Player) {
        const { radius, halfHeight } = PlayerParams;
        const { x, y, z } = player.position;
        const dx = p[0] - x;
        const dy = p[1] - (y - halfHeight);
        const dz = p[2] - z;
        const r_sq = dx * dx + dz * dz;
        return Math.abs(dy) < halfHeight && r_sq < radius * radius;
    }

    private resolveCollisions(collisions: Collision[], player: Player) {
        // Resolve collisions in order of smallest overlap to largest
        // 根据重叠量进行排序 重叠量越小越先发生碰撞
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

            // 反作用力 玩家需要向法向量方向移动的距离
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