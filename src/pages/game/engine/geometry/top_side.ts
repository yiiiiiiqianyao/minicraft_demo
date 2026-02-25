import * as THREE from "three";
import { ChunkParams } from "../../world/chunk/literal";

/**@desc 初始化顶面、侧面、底面 uv 取不同值的几何体，用于实例化渲染  */
export function initTopSideGeometry(size = 1) {
    let geometry: THREE.BufferGeometry = new THREE.BoxGeometry(size, size, size);
    geometry.name = 'top_side_block';
    geometry = geometry.toNonIndexed()
    const aTopSideArray = new Float32Array(ChunkParams.maxCount * 2);
    geometry.attributes.aTopSideOffset = new THREE.InstancedBufferAttribute(aTopSideArray, 2, true);
    geometry.attributes.aTopSideOffset.needsUpdate = true;
  
    const uv = geometry.getAttribute('uv') as THREE.BufferAttribute
    const normal = geometry.getAttribute('normal') as THREE.BufferAttribute

    const sliceW = 1 / 3
    for (let i = 0; i < uv.count; i += 1) {
        const ny = normal.getY(i)

        // 默认侧面：中间 1/3
        let start = 1 / 3
        if (ny > 0.5) {
            start = 0 // 顶面：左 1/3
        } else if (ny < -0.5) {
            start = 2 / 3 // 底面：右 1/3
        }

        const u = uv.getX(i)
        const v = uv.getY(i)

        uv.setXY(i, start + u * sliceW, v) // 仅重新映射 U，保持 V 不变
    }
    uv.needsUpdate = true
    return geometry;
}