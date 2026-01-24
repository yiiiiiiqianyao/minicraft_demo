import * as THREE from "three";
import { BlockID, blockIDValues } from "../../Block";
import { BlockFactory } from "../../Block/base/BlockFactory";
import type { IDrop } from "./interface";
import { WorldChunk } from "../WorldChunk";
import { jitterNumber } from "../../utils";
import { DropDt, DropLimit, MaxCount } from "./literal";
import { GameLayers } from "../../engine";
import { ToolBar } from "../../gui";
import { getDropInstancedGeometry } from "../../engine/geometry";

const DropMatrix = new THREE.Matrix4();
const DropPosition = new THREE.Vector3();
const DropQuaternion = new THREE.Quaternion();
const DropRotateYQuaternion = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(0, 1, 0), // Y轴方向
    0.006 // 旋转弧度
)

// TODO 在 regenerate chunk 的时候 也需要更新 chunk 中的掉落物
/**@desc 掉落物的 Group */
export class DropGroup extends THREE.Group {
    private meshes: Partial<Record<BlockID, THREE.InstancedMesh>> = {};
    private chunkPosition: THREE.Vector3;
    private chunk: WorldChunk;
    private dropList: IDrop[] = [];
    
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
            mesh.layers.set(GameLayers.One);
            mesh.userData.type = 'drop';
            mesh.userData.blockId = blockId;
            mesh.userData.instanceCache = {};
            // 初始时将所有实例设为不可见
            mesh.visible = false;
            // mesh.castShadow = !block.canPassThrough;
            // 暂时关闭阴影投射
            mesh.castShadow = false;
            mesh.receiveShadow = false;
            mesh.matrixAutoUpdate = false;
            meshes[block.id] = mesh;
            mesh.instanceMatrix.setUsage(THREE.StaticDrawUsage);
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
        // TODO 待优化性能
        availableMeshes.forEach((mesh) => {
            // 当前 InstancedMesh 中被拾取的实例 ID
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
            if(toDeleteIds.length > 0) {
                // 批量删除距离小于 maxDistance 的实例
                this.deleteInstance(mesh, toDeleteIds, tempMatrix);
                ToolBar.pushBlockId(mesh.userData.blockId);
            }
        });
    }

    /**@desc 在 physics 中触发更新 检测掉落 */
    update() {
        this.dropList.forEach((drop: IDrop) => {
            const { state, mesh, instanceId } = drop;
            if (state === 'stable') return;
            // TODO 下落、旋转的动画需要、性能需要调整优化 float 状态看看是不是加上上下浮动
            mesh.getMatrixAt(instanceId, DropMatrix);
            if (state === 'float') {
                this.handleFloat(mesh, drop);
            } else {
                this.handleFall(mesh, drop);
            }
        })
    }

    /**@desc 处理 drop instance 在 float 状态下的旋转 */
    private handleFloat(mesh: THREE.InstancedMesh, drop: IDrop) {
        const { instanceId } = drop;
        const scale = new THREE.Vector3();
        // TIP 分解矩阵为位置、四元数、缩放（核心：自身坐标系）
        DropMatrix.decompose(DropPosition, DropQuaternion, scale);
        // TIP 围绕自身Y轴旋转（更新四元数） 直接旋转四元数（推荐，绕自身Y轴）
        DropQuaternion.multiply(DropRotateYQuaternion);
        // 重新组合矩阵
        DropMatrix.compose(DropPosition, DropQuaternion, scale);
        mesh.setMatrixAt(instanceId, DropMatrix);
        mesh.instanceMatrix.needsUpdate = true;
    }

    /**@desc 处理 drop instance 的下落 */
    private handleFall(mesh: THREE.InstancedMesh, drop: IDrop) {
        const { x, y, z, instanceId, dropLimit } = drop;
        const posX = DropMatrix.elements[12];
        const posY = DropMatrix.elements[13];
        const posZ = DropMatrix.elements[14];
        const isOverFloatHeight = posY % 1 >= dropLimit;
        if (isOverFloatHeight || drop.state === 'fall_cross') {
            /*** TIP: 直接下落的场景
             * 1. 当前 drop instance 在当前 block 内的高度大于悬浮高度 + 下落高度 dt
             * 2. 当前 drop instance 的状态为 fall_cross（drop instance 还在当前位置的 block 内且当前位置下方的 block 可以穿过）
             */
            const nextY = posY - DropDt;
            drop.y = nextY;
            if(isOverFloatHeight) {
                drop.state = 'fall';
            }
            DropMatrix.setPosition(posX, nextY, posZ);
            mesh.setMatrixAt(instanceId, DropMatrix)
            mesh.instanceMatrix.needsUpdate = true;
            return;
        }
        /**
         * 在当前 block 内的高度不足的时候 需要检测当前位置的 block 下方的 block 是否支持掉落穿过
        */
        const blockX = Math.floor(x);
        const underBlockY = Math.floor(y) - 1;
        const blockZ = Math.floor(z);
        const underBlockData = this.chunk.getBlock(blockX, underBlockY, blockZ);
        if (!underBlockData) {
            // ERROR 下方的 block 不存在的时候
            console.warn('drop 下方的 block 不存在！！');
            drop.state = 'stable';
            return;
        }
        const blockClass = BlockFactory.getBlock(underBlockData.block);
        // 穿过下方的 block
        if (blockClass.canPassThrough) {
            const nextY = posY - DropDt;
            DropMatrix.setPosition(posX, nextY, posZ);
            drop.y = nextY;
            drop.state = 'fall_cross';
            mesh.setMatrixAt(instanceId, DropMatrix)
            mesh.instanceMatrix.needsUpdate = true;
        } else {
            // 下方的 block 不支持穿过下落 则 drop 进入 float 状态
            drop.state = 'float';
            mesh.computeBoundingSphere();
        }  
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
        const dropY = jitterNumber(y + 0.65, 0.05);
        const dropZ = jitterNumber(z + 0.5, 0.1);
        const instanceId = mesh.count++;
        const matrix = new THREE.Matrix4();
        matrix.setPosition(dropX, dropY, dropZ);
        mesh.setMatrixAt(instanceId, matrix);
        mesh.instanceMatrix.needsUpdate = true;
        // 当存在一个 instance 时，将其设为可见
        mesh.visible = true
        mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); // 开启动态更新
        // 重新计算实例化网格的边界，确保相机正常渲染 or 射线碰撞检测正常工作
        // Tip 在掉落 落地的时候计算
        // mesh.computeBoundingSphere();
        const drop: IDrop = {
            dt: 0,
            // drop instance 对应的 uuid
            uuid: THREE.MathUtils.generateUUID(),
            state: 'init',
            mesh,
            instanceId,
            needUpdate: true,
            // block xyz
            x, y, z,
            dropLimit: jitterNumber(DropLimit, 0.01),
        };
        this.dropList.push(drop);
        mesh.userData.instanceCache[drop.uuid] = drop;
        // console.log('add drop instance', drop.uuid);
    }

    /**@desc 在指定的 InstanceMesh 中删除 drop 实例 */
    private deleteInstance(mesh: THREE.InstancedMesh, toDeleteIds: number[], tempMatrix: THREE.Matrix4) {
        // 批量处理待删ID
        for (const instanceId of toDeleteIds) {
            // console.log('instanceId', instanceId, mesh.count, mesh.count - 1);
            const lastInstanceId = mesh.count - 1;

            let currentInstanceUUID = 'none';
            let lastInstanceUUID = 'none';
            const instanceCache = mesh.userData.instanceCache;
            Object.keys(instanceCache).forEach((uuid) => {
                // console.log('uuid', uuid, instanceCache[uuid].instanceId);
                if(instanceCache[uuid].instanceId === instanceId) {
                    currentInstanceUUID = uuid;
                }
                if(instanceCache[uuid].instanceId === lastInstanceId) {
                    lastInstanceUUID = uuid;
                }
            })
            instanceCache[lastInstanceUUID].instanceId = instanceId;
            delete instanceCache[currentInstanceUUID];
            this.deleteDrop(currentInstanceUUID);
            // 仅当待删ID不是最后一个实例时，执行覆盖
            if (instanceId !== lastInstanceId) {
                // 读取最后一个实例的矩阵（覆盖待删位置）
                mesh.getMatrixAt(lastInstanceId, tempMatrix);
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
        if(mesh.count === 0) {
            // 当所有 instance 都被删除时，将 mesh 设为不可见
            mesh.instanceMatrix.setUsage(THREE.StaticDrawUsage);
            mesh.visible = false;
        }
    }

    /**@desc 更新在 x、z block 坐标垂直方向上的 drop 实例的状态，看是否继续下落 */
    private updateDropState(x: number, z: number) {
        // console.log('updateDropState', this.dropList, x, z);
        this.dropList.forEach(drop => {
            if(x === Math.floor(drop.x) && z === Math.floor(drop.z)) {
                // 重新设置 drop 的状态
                drop.state = 'init';
            }
        });
    }

    /**@desc 在删除 instance 的时候 更新 dropList */
    private deleteDrop(uuid: string) {
        this.dropList = this.dropList.filter((d => {
            return d.uuid !== uuid
        }));
    }
}