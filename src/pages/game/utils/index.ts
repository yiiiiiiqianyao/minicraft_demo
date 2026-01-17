import * as THREE from "three";

/**@desc 给一个数字添加随机抖动 */
export function jitterNumber(num: number, jitterRange: number) {
    return num + (Math.random() - 0.5) * jitterRange;
}

export function getPositionFromMatrix(matrix: THREE.Matrix4) {
    return [
        matrix.elements[12],
        matrix.elements[13],
        matrix.elements[14],
    ];
}