import * as THREE from "three";
import { MeshType } from "./constant";
import { initDandelionHandMesh, initRoseHandMesh } from "./flowerHand";
import { initCreatingTableHandMesh } from "./objects";
import { initBirchLogHandMesh, initCoalOreMesh, initDirtBlockMesh, initGrassBlockMesh, initLeavesBlockMesh, initOakLogHandMesh, initStoneBlockMesh } from "./handHoldBlock";

/**@desc 网格池 */
export class MeshPool {
    private static pool: Map<MeshType, THREE.Mesh> = new Map();
    static getHandMesh(type: MeshType) {
        if (MeshPool.pool.get(type)) {
            return MeshPool.pool.get(type)!;
        }
        // 默认设置为 Hand Mesh
        let mesh: THREE.Mesh = initHandMesh();
        if (type === MeshType.GrassBlock) {
            mesh = initGrassBlockMesh();
        } else if (type === MeshType.FlowerRose) {
            mesh = initRoseHandMesh();            
        } else if (type === MeshType.FlowerDandelion) {
            mesh = initDandelionHandMesh();
        } else if (type === MeshType.DirtBlock) {
            mesh = initDirtBlockMesh();
        } else if(type === MeshType.StoneBlock) {
            mesh = initStoneBlockMesh();
        } else if(type === MeshType.CoalOreBlock) {
            mesh = initCoalOreMesh();
        } else if(type === MeshType.LeavesBlock) {
            mesh = initLeavesBlockMesh();
        } else if(type === MeshType.OakLogBlock) {
            mesh = initOakLogHandMesh();
        } else if (type === MeshType.BirchLogBlock) {
            mesh = initBirchLogHandMesh();
        } else if (type === MeshType.CraftingTable) {
            mesh = initCreatingTableHandMesh();
        }
        MeshPool.pool.set(type, mesh);
        return mesh;
    }
}

/**@desc 初始化模拟的玩家小手 mesh */
function initHandMesh() {
    const handLength = 0.5;
    const geometry = new THREE.BoxGeometry(0.1, handLength, 0.15);
    const material = new THREE.MeshLambertMaterial();
    const hand = new THREE.Mesh(geometry, material);
    hand.position.set(0, -handLength / 2, 0);
    return hand;
}