import * as THREE from "three";
import { getInstancedGeometry } from "../../../engine/geometry";
import { ChunkParams } from "../literal";
import type { Block } from "../../../Block/base/Block";

/**@desc combine 使用的是不同的 mesh、相同的 material，draw call 可以合并*/
export function initCombineInstanceMesh(blockEntity: Block) {
    const { maxCount } = ChunkParams;
    const material = blockEntity.material;
    const geometry = getInstancedGeometry(blockEntity.geometry)?.clone() as THREE.BoxGeometry;
    
    // const aTreeOffsetArray = new Float32Array(maxCount * 1);   // 实例UV缩放
    // aTreeOffsetArray.fill(0.5);

    // geometry.attributes.aTreeOffset = new THREE.InstancedBufferAttribute(aTreeOffsetArray, 1, true);
    // geometry.attributes.aTreeOffset.needsUpdate = true;

    return new THREE.InstancedMesh(geometry, material,maxCount);
}