import * as THREE from "three";
import { CubeGeometry } from "../geometry";
import { DirtBlockMaterial, TallGrossBlockMaterial } from "../material";

const CubeScale = 0.3;
export function initGrassBlockMesh() {
    const mesh = new THREE.Mesh(CubeGeometry, TallGrossBlockMaterial);
    mesh.scale.set(CubeScale, CubeScale, CubeScale);
    mesh.rotation.x = Math.PI * 1.55;
    mesh.rotation.y = Math.PI * 0.12;
    mesh.position.set(0, -0.4, 0.05);
    return mesh;
}

export function initDirtBlockMesh() {
    const mesh = new THREE.Mesh(CubeGeometry, DirtBlockMaterial);
    mesh.scale.set(CubeScale, CubeScale, CubeScale);
    mesh.rotation.x = Math.PI * 1.55;
    mesh.rotation.y = Math.PI * 0.12;
    mesh.position.set(0, -0.4, 0.05);
    return mesh;
}