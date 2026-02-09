import * as THREE from "three";
import { getInstancedGeometry } from "../geometry";
import { FlowerDandelionMaterial, FlowerRoseMaterial } from "../material";
import { RenderGeometry } from "../../Block/base/Block";

export function initRoseHandMesh() {
    const geometry = getInstancedGeometry(RenderGeometry.Flower)
    const mesh = new THREE.Mesh(geometry, FlowerRoseMaterial);
    mesh.scale.set(0.4, 0.4, 0.4);
    mesh.rotation.x = Math.PI * 1.3;
    mesh.position.set(0, -0.4, 0.1);
    return mesh;
}

export function initDandelionHandMesh() {
    const geometry = getInstancedGeometry(RenderGeometry.Flower)
    const mesh = new THREE.Mesh(geometry, FlowerDandelionMaterial);
    mesh.scale.set(0.4, 0.4, 0.4);
    mesh.rotation.x = Math.PI * 1.3;
    mesh.position.set(0, -0.4, 0.1);
    return mesh;
}