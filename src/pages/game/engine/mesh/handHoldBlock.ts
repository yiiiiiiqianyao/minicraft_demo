import * as THREE from "three";
import { getInstancedGeometry } from "../geometry";
import { CoalOreMaterial, DirtBlockMaterial, GrassBlockMaterial, LeavesMaterial, TreeMaterial, StoneMaterial } from "../material";
import { RenderGeometry } from "../../Block/base/Block";
import { BlockID } from "../../Block";
import { initTreeGeometry } from "../geometry/tree";

/**@desc 玩家手上拿的方块 */
const CubeScale = 0.3;

/**@desc 草地块 */
export function initGrassBlockMesh() {
    const geometry = getInstancedGeometry(RenderGeometry.GrassBlock);
    const mesh = new THREE.Mesh(geometry, GrassBlockMaterial);
    return setUp(mesh);
}

/**@desc 泥土块 */
export function initDirtBlockMesh() {
    const geometry = getInstancedGeometry(RenderGeometry.Cube);
    const mesh = new THREE.Mesh(geometry, DirtBlockMaterial);
    return setUp(mesh);
}

/**@desc 圆石块 */
export function initStoneBlockMesh() {
    const geometry = getInstancedGeometry(RenderGeometry.Cube);
    const mesh = new THREE.Mesh(geometry, StoneMaterial);
    return setUp(mesh);
}

/**@desc 煤炭块 */
export function initCoalOreMesh() {
    const geometry = getInstancedGeometry(RenderGeometry.Cube);
    const mesh = new THREE.Mesh(geometry, CoalOreMaterial);
    return setUp(mesh);
}

/**@desc 树叶块: 橡木树叶、白桦木树叶... */
export function initLeavesBlockMesh() {
    const geometry = getInstancedGeometry(RenderGeometry.Cube);
    const mesh = new THREE.Mesh(geometry, LeavesMaterial);
    return setUp(mesh);
}

/**@desc 橡木原木 */
export function initOakLogHandMesh() {
    const geometry = initTreeGeometry(1, BlockID.OakLog);
    const mesh = new THREE.Mesh(geometry, TreeMaterial);
    return setUp(mesh);
}

/**@desc 白桦木原木 */
export function initBirchLogHandMesh() {
    const geometry = initTreeGeometry(1, BlockID.BirchLog);
    const mesh = new THREE.Mesh(geometry, TreeMaterial);
    return setUp(mesh);
}

function setUp(mesh: THREE.Mesh) {
    mesh.scale.set(CubeScale, CubeScale, CubeScale);
    mesh.rotation.x = Math.PI * 1.55;
    mesh.rotation.y = Math.PI * 0.12;
    mesh.position.set(0, -0.4, 0.05);
    return mesh;
}