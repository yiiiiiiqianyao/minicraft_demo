import * as THREE from "three";
import { CubeGeometry } from "../geometry";
import { CraftingTableMaterial } from "../material";

/** @desc 创建工作台的手持 Mesh */
export function initCreatingTableMesh() {
    const mesh = new THREE.Mesh(CubeGeometry, CraftingTableMaterial);
    mesh.scale.set(0.4, 0.4, 0.4);
    mesh.rotation.x = Math.PI * 1.3;
    mesh.position.set(0, -0.4, 0.1);
    return mesh;
}