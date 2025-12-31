import * as THREE from "three";

export const PlayerParams = {
    height: 1.75,
    radius: 0.5,
    // 玩家最大移动速度
    maxSpeed: 4.317,
    // 玩家最大奔跑速度
    maxSprintSpeed: 5.612,
    // 玩家跳跃速度
    jumpSpeed: 10,
}

export const PlayerInitPosition = new THREE.Vector3(32, 72, 32);