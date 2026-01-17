import * as THREE from "three";

export interface IDrop {
    /**
     * @desc 掉落物的状态
     * - init 初始状态 进入检测下落
     * - fall 下落状态（在当前 block 内）
     * - fall_cross 下落状态（下落到下方的可穿越 block 如 Air TallGrass）
     * - float 落地的悬浮状态
     * - stable 错误/冻结状态
    */
    state: 'init' | 'fall' | 'fall_cross' | 'float' | 'stable';
    mesh: THREE.InstancedMesh;
    instanceId: number;
    needUpdate: boolean;
    x: number;
    y: number;
    z: number;
}