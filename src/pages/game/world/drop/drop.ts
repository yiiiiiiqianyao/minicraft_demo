import * as THREE from "three";
import { BlockID, blockIDValues } from "../../Block";
import { BlockFactory } from "../../Block/BlockFactory";
import { getDropInstancedGeometry } from "../geometry";
import { IDrop } from "./interface";
import { WorldChunk } from "../WorldChunk";
import { jitterNumber } from "../../utils";
import { DropDt, DropLimit, MaxCount } from "./literal";
import { Layers } from "../../engine";

/**@desc 掉落物的 Group */
export class DropGroup extends THREE.Group {
    private meshes: Partial<Record<BlockID, THREE.InstancedMesh>> = {};
    private chunkPosition: THREE.Vector3;
    private chunk: WorldChunk;
    private dropList: IDrop[] = [];
    private dropMatrix = new THREE.Matrix4;
    
    constructor(chunkPosition: THREE.Vector3, chunk: WorldChunk) {
       super();
       this.chunkPosition = chunkPosition;
       this.chunk = chunk;
       this.initInstanceMesh();
    }

    /** @desc 初始化掉落物的 InstancedMesh */
    private initInstanceMesh() {
        const meshes = this.meshes
        blockIDValues.forEach((blockId) => {
            const block = BlockFactory.getBlock(blockId);
            const blockGeometry = block.geometry;
            const dropGeometry = getDropInstancedGeometry(blockGeometry) as THREE.BoxGeometry | THREE.PlaneGeometry;
            const mesh = new THREE.InstancedMesh(dropGeometry, block.material, MaxCount);
            mesh.name = block.constructor.name;
            mesh.count = 0;
            mesh.layers.set(Layers.One);
            mesh.userData.type = 'drop';
            // 初始时将所有实例设为不可见
            mesh.visible = false;
            // mesh.castShadow = !block.canPassThrough;
            // 暂时关闭阴影投射
            mesh.castShadow = false;
            mesh.receiveShadow = false;
            mesh.matrixAutoUpdate = false;
            meshes[block.id] = mesh;
            this.add(mesh);
        });
    }

    drop(blockType: BlockID, x: number, y: number, z: number) {
        const mesh = this.meshes[blockType];
        if (!mesh) return;
        // TODO 增加掉过动画 & 掉落物品的旋转角度 & 掉落物品的缩放比例 & 粒子效果 …… 
        this.addInstance(mesh, x, y, z);
        this.updateDropState(x, z);
    }

    /**
     * @desc 吸引物品到指定位置
     * @param origin 吸引物品的目标位置
     */
    attract(origin: THREE.Vector3) {
        const availableMeshes = this.getAvailableMeshes();
        if (availableMeshes.length === 0) return;
         // 距离筛选 + 批量删除
        const tempMatrix = new THREE.Matrix4(); // 存储单个实例的矩阵
        const instancePos = new THREE.Vector3(); // 存储单个实例的位置

        // 吸收的物品最大距离
        const maxDistance = 1.8;
        availableMeshes.forEach((mesh) => {
            const toDeleteIds = [];
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
            // 批量删除距离小于 maxDistance 的实例
            this.deleteInstance(mesh, toDeleteIds, tempMatrix);
        });
    }

    /**@desc 在 physics 中触发更新 检测掉落 */
    update() {
        this.dropList.forEach((drop) => {
            const { state, mesh, instanceId, x, y, z } = drop;
            if (state === 'float' || state === 'stable') return;
            
            // TODO 暂时先加上下落 后续需要加上动画 下落的速度需要调整 性能需要调整优化
            mesh.getMatrixAt(instanceId, this.dropMatrix);
            const posX = this.dropMatrix.elements[12];
            const posY = this.dropMatrix.elements[13];
            const posZ = this.dropMatrix.elements[14];

            const isOverFloatHeight = posY % 1 >= DropLimit;
            if (isOverFloatHeight || state === 'fall_cross') {
                // 在当前 block 内的高度大于悬浮高度 + 下落高度 dt，直接下落
                const nextY = posY - DropDt;
                drop.y = nextY;
                if(isOverFloatHeight) {
                    drop.state = 'fall';
                }
                this.dropMatrix.setPosition(posX, nextY, posZ);
                mesh.setMatrixAt(instanceId, this.dropMatrix)
                mesh.instanceMatrix.needsUpdate = true;
                return;
            }
            // 在当前 block 内的高度不足的时候 需要检测下方的 block 是否支持掉落
            const blockX = Math.floor(x);
            const underBlockY = Math.floor(y) - 1;
            const blockZ = Math.floor(z);
            const underBlockData = this.chunk.getBlock(blockX, underBlockY, blockZ);
            if (!underBlockData) {
                // ERROR 下方的 block 不存在的时候
                console.warn('下方的 block 不存在');
                drop.state = 'stable';
                return;
            }
            // console.log('underBlockData', underBlockData);
            const blockClass = BlockFactory.getBlock(underBlockData.block);
            // 穿过下方的 block
            if (blockClass.canPassThrough) {
                const nextY = posY - DropDt;
                this.dropMatrix.setPosition(posX, nextY, posZ);
                drop.y = nextY;
                drop.state = 'fall_cross';
                mesh.setMatrixAt(instanceId, this.dropMatrix)
                mesh.instanceMatrix.needsUpdate = true;
            } else {
                // 下方的 block 不支持穿过下落 则 drop 进入 float 状态
                drop.state = 'float';
                mesh.computeBoundingSphere();
                // console.log('drop float:', drop);
            }           
        })
    }

    /**@desc 获取当前 chunk 中所有可见的 drop 实例的 InstancedMesh */
    private getAvailableMeshes() {
        const availableMeshes: THREE.InstancedMesh[] = [];
        blockIDValues.map((key) => {
            const mesh = this.meshes[key];
            if(mesh && mesh.count > 0) {
                availableMeshes.push(mesh);
            }
        })
        return availableMeshes;
    }

    /**
     * @desc 增加一个 drop 实例
     * 一个 drop instance 对应一个实际的 THREE.Object
     */
    private addInstance(mesh: THREE.InstancedMesh, x: number, y: number, z: number) {
        // 给 drop 实例添加随机抖动
        const dropX = jitterNumber(x + 0.5, 0.1);
        const dropY = jitterNumber(y + 0.5, 0.05);
        const dropZ = jitterNumber(z + 0.5, 0.1);
        const instanceId = mesh.count++;
        const matrix = new THREE.Matrix4();
        matrix.setPosition(dropX, dropY, dropZ);
        mesh.setMatrixAt(instanceId, matrix);
        mesh.instanceMatrix.needsUpdate = true;
        // 当存在一个 instance 时，将其设为可见
        mesh.visible = true
        // 重新计算实例化网格的边界，确保相机正常渲染 or 射线碰撞检测正常工作
        // mesh.computeBoundingSphere();

        this.dropList.push({
            state: 'init',
            mesh,
            instanceId,
            needUpdate: true,
            // block xyz
            x, y, z,
        });
    }

    /**@desc 在指定的 InstanceMesh 中删除 drop 实例 */
    private deleteInstance(mesh: THREE.InstancedMesh, toDeleteIds: number[], tempMatrix: THREE.Matrix4) {
        this.deleteDropList(toDeleteIds);
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
        // mesh.computeBoundingSphere();
        if(mesh.count === 0) {
            // 当所有 instance 都被删除时，将 mesh 设为不可见
            mesh.visible = false;
        }
    }

    /**@desc 更新在 x、z block 坐标垂直方向上的 drop 实例的状态，看是否继续下落 */
    private updateDropState(x: number, z: number) {
        this.dropList.forEach(drop => {
            if(x === Math.floor(drop.x) && z === Math.floor(drop.z)) {
                // 重新设置 drop 的状态
                drop.state = 'init';
            }
        });
    }

    /**@desc 在删除 instance 的时候 更新 dropList */
    private deleteDropList(toDeleteIds: number[]) {
        // TODO 更新错误需要优化
        this.dropList = this.dropList.filter((d => {
            return !toDeleteIds.includes(d.instanceId);
        }));
    }
}