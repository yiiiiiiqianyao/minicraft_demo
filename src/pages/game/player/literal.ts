import * as THREE from "three";
import { IPlayerParams } from "./interface";

export const PlayerParams: IPlayerParams = {
    position: new THREE.Vector3(),
    height: 1.75,
    // height: 2.75,
    // radius: 0.5,
    // 玩家的碰撞盒半径应该调整为 0.25 较为合适
    radius: 0.25,
    // 玩家最大移动速度
    maxSpeed: 4.317,
    // 玩家最大奔跑速度
    maxSprintSpeed: 5.612,
    // 玩家跳跃速度
    jumpSpeed: 10,
    // 玩家选中的方块坐标 可能未选中
    selectedCoords: null,
    // 玩家选中的方块大小 可能未选中
    selectedBlockSize: null,
    // 玩家是否处于 chunk 中心
    isInChunkCenter: false,
    // 玩家所处的 chunkID
    chunkID: null,
    // 玩家相邻的最小 4 个 chunkID
    nearFourChunks: [],
}

export const PlayerInitPosition = new THREE.Vector3(32, 72, 32);

// 玩家视线中心 鼠标屏幕坐标
export const RayCenterScreen = new THREE.Vector2(0, 0);