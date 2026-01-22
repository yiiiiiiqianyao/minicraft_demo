import * as THREE from "three";
import { CubeGeometry } from "../geometry";
import { DirtBlockMaterial, GrassBlockMaterial, StoneMaterial } from "../material";

const CubeScale = 0.3;
export function initGrassBlockMesh() {
    const mesh = new THREE.Mesh(CubeGeometry, GrassBlockMaterial);
    return setUp(mesh);
}

export function initDirtBlockMesh() {
    const mesh = new THREE.Mesh(CubeGeometry, DirtBlockMaterial);
    return setUp(mesh);
}

export function initStoneBlockMesh() {
    const mesh = new THREE.Mesh(CubeGeometry, StoneMaterial);
    return setUp(mesh);
}

function setUp(mesh: THREE.Mesh) {
    mesh.scale.set(CubeScale, CubeScale, CubeScale);
    mesh.rotation.x = Math.PI * 1.55;
    mesh.rotation.y = Math.PI * 0.12;
    mesh.position.set(0, -0.4, 0.05);
    return mesh;
}