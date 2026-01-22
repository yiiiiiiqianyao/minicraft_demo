import * as THREE from "three";
import type { IChunkKey, ICurrentChunk, INearFourChunks, ISelectedCoords } from "./interface";
import { Player } from "./Player";

export const PlayerInitPosition = new THREE.Vector3(32, 72, 32);
export class PlayerParams {
    /**@desc 玩家实例 */
    static playerInstance: Player | null = null;
    /**@desc 玩家的位置 初始值为 PlayerInitPosition */
    static position = new THREE.Vector3().copy(PlayerInitPosition);
    /**@desc 玩家的高度 */
    static height = 1.75;
    /**@desc 玩家的高度的一半 */
    static halfHeight = 1.75 / 2;
    /**@desc 玩家的碰撞盒半径应该调整为 0.25 较为合适 */
    static radius = 0.25;
    /**@desc 玩家最大移动速度 */
    static maxSpeed = 4.317;
    /**@desc 玩家最大奔跑速度 */
    static maxSprintSpeed = 5.612;
    /**@desc 玩家跳跃速度 */
    static jumpSpeed = 10;
    /**@desc 玩家选中的方块坐标 可能未选中 */
    static selectedCoords: ISelectedCoords = null;
    /**@desc 玩家是否处于 chunk 中心 */
    static isInChunkCenter = false;
    /**@desc 玩家所处的 chunkID */
    static currentChunk: ICurrentChunk = null;
    /**@desc 玩家相邻的最小 4 个 chunkID */
    static nearFourChunks: INearFourChunks = [];
    /**@desc 玩家当前活动的 chunkID 列表 1 or 4 */
    static activeChunks: IChunkKey[] = [];
}

// 玩家视线中心 鼠标屏幕坐标
export const RayCenterScreen = new THREE.Vector2(0, 0);