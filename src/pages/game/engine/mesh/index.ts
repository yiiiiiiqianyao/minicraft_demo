import * as THREE from "three";
import { MeshType } from "./constant";
import { initRoseMesh } from "./flower";

/**@desc 网格池 */
export class MeshPool {
    private static pool: Map<MeshType, THREE.Mesh> = new Map();
    static getMesh(type: MeshType) {
        if (MeshPool.pool.get(type)) {
            return MeshPool.pool.get(type)!;
        }
        if (type === MeshType.FlowerRose) {
            const mesh = initRoseMesh();
            MeshPool.pool.set(type, mesh);
            return mesh;
        }
    }
}