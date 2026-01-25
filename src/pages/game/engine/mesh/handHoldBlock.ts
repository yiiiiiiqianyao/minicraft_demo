import * as THREE from "three";
import { CubeGeometry } from "../geometry";
import { CoalOreMaterial, DirtBlockMaterial, GrassBlockMaterial, LeavesMaterial, OkaLogMaterial, StoneMaterial } from "../material";

/**@desc 玩家手上拿的方块 */
const CubeScale = 0.3;

/**@desc 草地块 */
export function initGrassBlockMesh() {
    const mesh = new THREE.Mesh(CubeGeometry, GrassBlockMaterial);
    return setUp(mesh);
}

/**@desc 泥土块 */
export function initDirtBlockMesh() {
    const mesh = new THREE.Mesh(CubeGeometry, DirtBlockMaterial);
    return setUp(mesh);
}

/**@desc 圆石块 */
export function initStoneBlockMesh() {
    const mesh = new THREE.Mesh(CubeGeometry, StoneMaterial);
    return setUp(mesh);
}

/**@desc 煤炭块 */
export function initCoalOreMesh() {
    const mesh = new THREE.Mesh(CubeGeometry, CoalOreMaterial);
    return setUp(mesh);
}

/**@desc 树叶块 */
export function initLeavesBlockMesh() {
    const mesh = new THREE.Mesh(CubeGeometry, LeavesMaterial);
    return setUp(mesh);
}

/**@desc 橡木原木 */
export function initOakLogMesh() {
    const mesh = new THREE.Mesh(CubeGeometry, OkaLogMaterial);
    return setUp(mesh);
}

function setUp(mesh: THREE.Mesh) {
    mesh.scale.set(CubeScale, CubeScale, CubeScale);
    mesh.rotation.x = Math.PI * 1.55;
    mesh.rotation.y = Math.PI * 0.12;
    mesh.position.set(0, -0.4, 0.05);
    return mesh;
}