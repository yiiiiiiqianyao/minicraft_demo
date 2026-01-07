import * as THREE from "three";
import { BlockID, blockIDValues } from "../../Block";
import { BlockFactory } from "../../Block/BlockFactory";
import { getDropInstancedGeometry } from "../geometry";
import { IInstanceData } from "../interface";


// TIP 暂定每种掉落物的最大数量为 1000 个
const maxCount = 1000;

export class DropGroup extends THREE.Group {
    private meshes: Partial<Record<BlockID, THREE.InstancedMesh>> = {};
    constructor() {
       super();
       this.initInstanceMesh();
    }

    private initInstanceMesh() {
        const meshes = this.meshes
        blockIDValues.forEach((blockId) => {
            const block = BlockFactory.getBlock(blockId);
            const blockGeometry = block.geometry;
            const dropGeometry = getDropInstancedGeometry(blockGeometry) as THREE.BoxGeometry | THREE.PlaneGeometry;
            const mesh = new THREE.InstancedMesh(dropGeometry, block.material, maxCount);
            mesh.name = block.constructor.name;
            mesh.count = 0;
            mesh.userData.type = 'drop';
            // mesh.castShadow = !block.canPassThrough;
            // 暂时关闭阴影投射
            mesh.castShadow = false;
            mesh.receiveShadow = false;
            mesh.matrixAutoUpdate = false;
            meshes[block.id] = mesh;
            this.add(mesh);
        });
        // console.log('meshes', meshes);
    }

    drop(blockType: BlockID, x: number, y: number, z: number) {
        const mesh = this.meshes[blockType];
        if (!mesh) return;
        // TODO 增加掉过动画 & 掉落物品的旋转角度 & 掉落物品的缩放比例 & 粒子效果 …… 
        this.addInstance(mesh, x, y, z);
    }

    attract(block: IInstanceData) {
        // TODO 吸引掉落物品到玩家位置 待优化
        // Get the mesh of the block
        const mesh = this.meshes[block.block]
        if (!mesh) return;

        block.instanceIds.forEach((instanceId) => {
            this.deleteInstance(mesh, instanceId);
        });
    }

    private addInstance(mesh: THREE.InstancedMesh, x: number, y: number, z: number) {
        const instanceId = mesh.count++;
        // Update the appropriate instanced mesh and re-compute the bounding sphere so raycasting works
        const matrix = new THREE.Matrix4();
        matrix.setPosition(x + 0.5, y + 0.5, z + 0.5);
        mesh.setMatrixAt(instanceId, matrix);
        mesh.instanceMatrix.needsUpdate = true;
        
        // 重新计算实例化网格的边界，确保相机正常渲染 or 射线碰撞检测正常工作
        mesh.computeBoundingSphere();
        return instanceId;
    }

    private deleteInstance(mesh: THREE.InstancedMesh, instanceId: number) {
        const lastMatrix = new THREE.Matrix4();
        mesh.getMatrixAt(mesh.count - 1, lastMatrix);

        // Also need to get block coords of instance to update instance id of the block
        const lastBlockCoords = new THREE.Vector3();
        lastBlockCoords.setFromMatrixPosition(lastMatrix);
 
        // Swap transformation matrices
        mesh.setMatrixAt(instanceId, lastMatrix);

        // Decrement instance count
        mesh.count--;

        // Notify the instanced mesh we updated the instance matrix
        mesh.instanceMatrix.needsUpdate = true;
        mesh.computeBoundingSphere();
    }
}