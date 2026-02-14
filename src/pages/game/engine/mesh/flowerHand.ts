import * as THREE from "three";
import { getInstancedGeometry } from "../geometry";
import { CrossPlantMaterial } from "../material";
import { RenderGeometry } from "../../Block/base/Block";

export function initRoseHandMesh() {
    const geometry = getInstancedGeometry(RenderGeometry.Cross).clone();
    for(let i = 0; i < geometry.attributes.aCrossOffset.array.length; i += 2) {
        geometry.attributes.aCrossOffset.array[i] = 0.0;
        geometry.attributes.aCrossOffset.array[i + 1] = 0.8;
    }
    geometry.attributes.aCrossOffset.needsUpdate = true;
    const mesh = new THREE.Mesh(geometry, CrossPlantMaterial);
    mesh.scale.set(0.4, 0.4, 0.4);
    mesh.rotation.x = Math.PI * 1.3;
    mesh.position.set(0, -0.4, 0.1);
    return mesh;
}

export function initDandelionHandMesh() {
    const geometry = getInstancedGeometry(RenderGeometry.Cross).clone();
    for(let i = 0; i < geometry.attributes.aCrossOffset.array.length; i += 2) {
        geometry.attributes.aCrossOffset.array[i] = 0.2;
        geometry.attributes.aCrossOffset.array[i + 1] = 0.8;
    }
    geometry.attributes.aCrossOffset.needsUpdate = true;
    const mesh = new THREE.Mesh(geometry, CrossPlantMaterial);
    mesh.scale.set(0.4, 0.4, 0.4);
    mesh.rotation.x = Math.PI * 1.3;
    mesh.position.set(0, -0.4, 0.1);
    return mesh;
}