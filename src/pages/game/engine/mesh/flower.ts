import * as THREE from "three";
import { FlowerGeometry } from "../geometry";
import { FlowerDandelionMaterial, FlowerRoseMaterial } from "../material";

export function initRoseMesh() {
    return new THREE.Mesh(FlowerGeometry, FlowerRoseMaterial);
}

export function initDandelionMesh() {
    return new THREE.Mesh(FlowerGeometry, FlowerDandelionMaterial);
}