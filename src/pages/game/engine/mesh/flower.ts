import * as THREE from "three";
import { FlowerGeometry } from "../geometry";
import { FlowerDandelionMaterial, FlowerRoseMaterial } from "../material";

export function initRoseMesh() {
    const mesh = new THREE.Mesh(FlowerGeometry, FlowerRoseMaterial);
    mesh.scale.set(0.4, 0.4, 0.4);
    mesh.rotation.x = Math.PI * 1.3;
    mesh.position.set(0, -0.4, 0.1);
    return mesh;
}

export function initDandelionMesh() {
    const mesh = new THREE.Mesh(FlowerGeometry, FlowerDandelionMaterial);
    mesh.scale.set(0.4, 0.4, 0.4);
    mesh.rotation.x = Math.PI * 1.3;
    mesh.position.set(0, -0.4, 0.1);
    return mesh;
}