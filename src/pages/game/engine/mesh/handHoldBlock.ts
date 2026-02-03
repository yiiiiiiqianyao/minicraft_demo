import * as THREE from "three";
import { getInstancedGeometry } from "../geometry";
import { CoalOreMaterial, DirtBlockMaterial, GrassBlockMaterial, LeavesMaterial, OkaLogMaterial, StoneMaterial } from "../material";
import { RenderGeometry } from "../../Block/base/Block";

/**@desc 玩家手上拿的方块 */
const CubeScale = 0.3;

/**@desc 草地块 */
export function initGrassBlockMesh() {
    const geometry = getInstancedGeometry(RenderGeometry.Cube)
    const mesh = new THREE.Mesh(geometry, GrassBlockMaterial);
    return setUp(mesh);
}

/**@desc 泥土块 */
export function initDirtBlockMesh() {
    const geometry = getInstancedGeometry(RenderGeometry.Cube)
    const mesh = new THREE.Mesh(geometry, DirtBlockMaterial);
    return setUp(mesh);
}

/**@desc 圆石块 */
export function initStoneBlockMesh() {
    const geometry = getInstancedGeometry(RenderGeometry.Cube)
    const mesh = new THREE.Mesh(geometry, StoneMaterial);
    return setUp(mesh);
}

/**@desc 煤炭块 */
export function initCoalOreMesh() {
    const geometry = getInstancedGeometry(RenderGeometry.Cube)
    const mesh = new THREE.Mesh(geometry, CoalOreMaterial);
    return setUp(mesh);
}

/**@desc 树叶块 */
export function initLeavesBlockMesh() {
    const geometry = getInstancedGeometry(RenderGeometry.Cube)
    const mesh = new THREE.Mesh(geometry, LeavesMaterial);
    return setUp(mesh);
}

/**@desc 橡木原木 */
export function initOakLogMesh() {
    const geometry = getInstancedGeometry(RenderGeometry.Cube)
    const mesh = new THREE.Mesh(geometry, OkaLogMaterial);
    return setUp(mesh);
}

function setUp(mesh: THREE.Mesh) {
    mesh.scale.set(CubeScale, CubeScale, CubeScale);
    mesh.rotation.x = Math.PI * 1.55;
    mesh.rotation.y = Math.PI * 0.12;
    mesh.position.set(0, -0.4, 0.05);
    return mesh;
}