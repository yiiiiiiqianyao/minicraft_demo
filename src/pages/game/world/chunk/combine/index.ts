import * as THREE from "three";
import { BlockID } from "../../../Block";
import { getInstancedGeometry } from "../../../engine/geometry";
import { ChunkParams } from "../literal";
import type { Block } from "../../../Block/base/Block";

const uvScaleArray = new Float32Array(ChunkParams.maxCount * 2);   // 实例UV缩放
const scale = 1 / 6;

export function initCombineInstanceMesh(blockEntity: Block) {
    const { maxCount } = ChunkParams;
    const material = blockEntity.material;
    const geometry = getInstancedGeometry(blockEntity.geometry)?.clone() as THREE.BoxGeometry;
    
    const uvOffsetArray = new Float32Array(maxCount * 2); // 实例UV偏移
    const uvOffsetArray2 = new Float32Array(maxCount * 2); // 实例UV偏移
    // 核心：直接添加到geometry.attributes，类型为InstancedBufferAttribute
    geometry.attributes.uvScale = new THREE.InstancedBufferAttribute(uvScaleArray, 2, true);
    geometry.attributes.uvOffset = new THREE.InstancedBufferAttribute(uvOffsetArray, 2, true);
    geometry.attributes.uvOffset2 = new THREE.InstancedBufferAttribute(uvOffsetArray2, 2, true);
    
    for (let i = 0; i < maxCount; i++) {
        uvScaleArray[i * 2] = scale;           // UV水平缩放
        uvScaleArray[i * 2 + 1] = scale;       // UV垂直缩放
        if (blockEntity.id === BlockID.Leaves) {
            uvOffsetArray[i * 2] = 0;    // UV水平偏移
            uvOffsetArray[i * 2 + 1] = scale * 4; // UV垂直偏移
        } else if (blockEntity.id === BlockID.OakLog) {
            uvOffsetArray[i * 2] = 0;    // UV水平偏移
            uvOffsetArray[i * 2 + 1] = scale * 5; // UV垂直偏移
            uvOffsetArray2[i * 2] = 1;    // UV水平偏移
            uvOffsetArray2[i * 2 + 1] = scale * 5; // UV垂直偏移 
        }
    }
    geometry.attributes.uvScale.needsUpdate = true;
    geometry.attributes.uvOffset.needsUpdate = true;
    geometry.attributes.uvOffset2.needsUpdate = true;
    
    return new THREE.InstancedMesh(geometry,material,maxCount);
}