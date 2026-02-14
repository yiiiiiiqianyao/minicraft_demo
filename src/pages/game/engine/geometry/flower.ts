import * as THREE from "three";
import { ChunkParams } from "../../world/chunk/literal";

export function initCrossPlantGeometry() {
    const FlowerGeometry = new THREE.PlaneGeometry(1, 1);
    const nonIndexedGeom = FlowerGeometry.toNonIndexed(); 
    const aCrossPlantArray = new Float32Array(ChunkParams.maxCount * 2);
    nonIndexedGeom.name = 'cross_plant';
    nonIndexedGeom.attributes.aCrossOffset = new THREE.InstancedBufferAttribute(aCrossPlantArray, 2, true);
    return nonIndexedGeom;
}

export function initDropCrossGeometry(width = 0.5, height = 0.5) {
    const FlowerGeometry = new THREE.PlaneGeometry(width, height);
    const nonIndexedGeom = FlowerGeometry.toNonIndexed(); 
    const aCrossPlantArray = new Float32Array(ChunkParams.maxCount * 2);
    nonIndexedGeom.name = 'drop_cross_plant';
    nonIndexedGeom.attributes.aCrossOffset = new THREE.InstancedBufferAttribute(aCrossPlantArray, 2, true);
    return nonIndexedGeom;
}