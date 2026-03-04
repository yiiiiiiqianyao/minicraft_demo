import * as THREE from "three";
import { ChunkParams } from "../../world/chunk/literal";

/**@desc 所有面使用一个纹理的 cube 几何体  */
export function initSingleBlockGeometry(size = 1) {
    const geometry: THREE.BufferGeometry = new THREE.BoxGeometry(size, size, size);
    geometry.name = 'single_block';
    const nonIndexedGeom = geometry.toNonIndexed()
    const aSingleBlockArray = new Float32Array(ChunkParams.maxCount * 2);
    nonIndexedGeom.attributes.aSingleBlockOffset = new THREE.InstancedBufferAttribute(aSingleBlockArray, 2, true);
    nonIndexedGeom.attributes.aSingleBlockOffset.needsUpdate = true;

    return nonIndexedGeom;
}