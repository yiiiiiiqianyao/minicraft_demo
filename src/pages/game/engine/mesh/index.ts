import * as THREE from "three";
import { MeshType } from "./constant";
import { initDandelionMesh, initRoseMesh } from "./flower";
import { initDirtBlockMesh, initGrassBlockMesh } from "./block";

/**@desc 网格池 */
export class MeshPool {
    private static pool: Map<MeshType, THREE.Mesh> = new Map();
    static getMesh(type: MeshType) {
        if (MeshPool.pool.get(type)) {
            return MeshPool.pool.get(type)!;
        }
       
        if (type === MeshType.Hand) {
            const mesh = initHandMesh();
            MeshPool.pool.set(type, mesh);
            return mesh;
        } else if (type === MeshType.GrassBlock) {
            const mesh = initGrassBlockMesh();
            MeshPool.pool.set(type, mesh);
            return mesh;
        } else if (type === MeshType.FlowerRose) {
            const mesh = initRoseMesh();
            MeshPool.pool.set(type, mesh);
            return mesh;
        } else if (type === MeshType.FlowerDandelion) {
            const mesh = initDandelionMesh();
            MeshPool.pool.set(type, mesh);
            return mesh;
        } else if (type === MeshType.DirtBlock) {
            const mesh = initDirtBlockMesh();
            MeshPool.pool.set(type, mesh);
            return mesh;
        }
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