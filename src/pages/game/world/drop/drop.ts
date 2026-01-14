import * as THREE from "three";
import { BlockID, blockIDValues } from "../../Block";
import { BlockFactory } from "../../Block/BlockFactory";
import { getDropInstancedGeometry } from "../geometry";


// TIP 暂定每种掉落物的最大数量为 1000 个
const maxCount = 1000;

export class DropGroup extends THREE.Group {
    private meshes: Partial<Record<BlockID, THREE.InstancedMesh>> = {};
    private chunkPosition: THREE.Vector3;
    constructor(chunkPosition: THREE.Vector3) {
       super();
       this.chunkPosition = chunkPosition;
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

    /**
     * @desc 吸引物品到指定位置
     * @param origin 吸引物品的目标位置
     */
    attract(origin: THREE.Vector3) {
        const meshes = this.meshes;
        blockIDValues.map((key) => {
            const mesh = meshes[key];
            if (!mesh || mesh.count === 0) return;
            // 距离筛选 + 批量删除
            const tempMatrix = new THREE.Matrix4(); // 存储单个实例的矩阵
            const instancePos = new THREE.Vector3(); // 存储单个实例的位置
            const toDeleteIds = [];
            // 吸收的物品最大距离
            const maxDistance = 1.8;

            // 遍历所有有效实例，筛选距离 <2 的 ID
            for (let instanceId = 0; instanceId < mesh.count; instanceId++) {
                mesh.getMatrixAt(instanceId, tempMatrix);
                instancePos.setFromMatrixPosition(tempMatrix);
                instancePos.add(this.chunkPosition);
                const distanceSq = instancePos.distanceTo(origin);
                
                if (distanceSq < maxDistance) {
                    toDeleteIds.push(instanceId);
                }
            }
            
            // 批量处理待删ID
            for (const instanceId of toDeleteIds) {
                // 跳过已因缩容失效的ID（批量删除中count会动态减少）
                if (instanceId >= mesh.count) continue;

                const lastIndex = mesh.count - 1;
                // 仅当待删ID不是最后一个实例时，执行覆盖
                if (instanceId !== lastIndex) {
                    // 读取最后一个实例的矩阵（覆盖待删位置）
                    mesh.getMatrixAt(lastIndex, tempMatrix);
                    mesh.setMatrixAt(instanceId, tempMatrix);

                    mesh.count--;

                } else {
                    // 最后一个实例直接删除
                    mesh.count--;
                }
            }
            // toDeleteIds 
            mesh.instanceMatrix.needsUpdate = true;
            mesh.computeBoundingSphere();
        })
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
}