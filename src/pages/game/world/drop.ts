import * as THREE from "three";
import { BlockID, blockIDValues } from "../Block";
import { BlockFactory } from "../Block/BlockFactory";
import { getInstancedGeometry } from "./geometry";


// TIP 暂定每种掉落物的最大数量为 1000 个
const maxCount = 1000;

export class DropManager {
    private meshes: Partial<Record<BlockID, THREE.InstancedMesh>> = {};
    constructor() {
       this.initInstanceMesh();
    }

    private initInstanceMesh() {
        const meshes = this.meshes
        blockIDValues.forEach((blockId) => {
            const block = BlockFactory.getBlock(blockId);
            const blockGeometry = block.geometry;
            const geo = getInstancedGeometry(blockGeometry) as THREE.BoxGeometry | THREE.PlaneGeometry;
            geo.scale(0.5, 0.5, 0.5);
            const mesh = new THREE.InstancedMesh(geo, block.material, maxCount);
            mesh.name = block.constructor.name;
            mesh.count = 0;
            // mesh.castShadow = !block.canPassThrough;
            // 暂时关闭阴影投射
            mesh.castShadow = false;
            mesh.receiveShadow = false;
            mesh.matrixAutoUpdate = false;
            meshes[block.id] = mesh;
        })
    }

    drop(blockType: BlockID, dropPosition: THREE.Vector3) {
        const mesh = this.meshes[blockType];
        if (!mesh) {
            return;
        }
        const { x, y, z } = dropPosition;
        const instanceId = mesh.count++;
        // Update the appropriate instanced mesh and re-compute the bounding sphere so raycasting works
        const matrix = new THREE.Matrix4();
        matrix.setPosition(x + 0.5, y + 0.5, z + 0.5);
        mesh.setMatrixAt(instanceId, matrix);
        mesh.instanceMatrix.needsUpdate = true;
        // TIP 实例化网格的边界计算比较耗时，调落无暂时不需要计算
        // 重新计算实例化网格的边界，确保相机正常渲染 or 射线碰撞检测正常工作
        // mesh.computeBoundingSphere();
    }
}