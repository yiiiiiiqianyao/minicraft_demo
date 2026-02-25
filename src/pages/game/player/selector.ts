import * as THREE from "three";
import { World } from "../world/World";
import { PlayerParams, RayCenterScreen } from "./literal";
import { getNearChunks } from "./utils";
import { GameLayers } from "../engine";
import { ToolBar } from "../gui";
import { BlockFactory, BlockID } from "../Block";
import { worldToCeilBlockCoord } from "../world/chunk/utils";

/**@desc 玩家的拾取/选择器 */
export class Selector {
    private static _rayCaster: THREE.Raycaster | null = null;
    /**@desc 垂直同步次数 性能优化使用 */
    private static _vSyncCount = 4;
    private static _updateCount = 0;
    static blockPlacementCoords: THREE.Vector3 = new THREE.Vector3();
    static blockPlacementNormal: THREE.Vector3 = new THREE.Vector3();
    /**@desc 是否是放置在方块的上方 */
    static get isPlacementUpper() {
        return Selector.blockPlacementNormal.y === 1;
    }
    /**@desc 选中的 mesh Updates the raycaster used for block selection*/
    static selectedMesh: THREE.Object3D | null = null;
    /**@desc 选中的 block*/
    static selectedBlock: BlockID | null = null;
    static get rayCaster() {
        if(!Selector._rayCaster) {
            const origin = new THREE.Vector3();
            const direction = new THREE.Vector3();
            Selector._rayCaster = new THREE.Raycaster(origin, direction, 0,5);
            this.rayCaster.layers.set(GameLayers.Zero);
        }
        return Selector._rayCaster;
    }

    static update(camera: THREE.PerspectiveCamera, world: World, selectionHelper: THREE.Mesh) {
        // if (Math.random() > 0) return;
        Selector._updateCount++;
        if(Selector._updateCount === Selector._vSyncCount) {
            Selector.select(camera, world, selectionHelper);
            Selector._updateCount = 0;
        }
    }

    // TODO 当相机控制器没有变化的时候 可以优化拾取过滤
    /**@desc 玩家拾取/选择方块 */
    static select(camera: THREE.PerspectiveCamera, world: World, selectionHelper: THREE.Mesh) {
        const rayCaster = Selector.rayCaster;
        rayCaster.setFromCamera(RayCenterScreen, camera);
        
        // 过滤 player 所在的 chunk or 相邻 4 个 chunk
        const chunks = getNearChunks(world);
        const interactiveObjects: THREE.Object3D[] = [];
        chunks.map(chunk => {
            const meshes = chunk.getInteractiveMeshes();
            interactiveObjects.push(...meshes);
        });
        // TODO 实际的拾取对象 可以使用 layer 进行过滤优化
        const intersectionObjects = rayCaster.intersectObjects(interactiveObjects, false);
        const intersection0 = intersectionObjects[0];
        const intersection1 = intersectionObjects[1];
        if (intersection0) {
            // TODO 目前只能选中 chunk 中的 InstancedMesh 方块 后续待扩展支持其他类型方块
            const chunkObject = intersection0.object.parent;
            if (intersection0.instanceId == null || !chunkObject) return Selector._unSelect(selectionHelper);

            // Update the selected coordinates
            Selector._updateSelectCoord(intersection0, chunkObject);
            const pos = Selector.getBlockPositionInWorld();
            if (!pos) {
                console.warn("Selector.getBlockPositionInWorld() return null");
                return Selector._unSelect(selectionHelper); 
            }   

            const selectedBlockData = world.getBlockData(pos[0], pos[1], pos[2]);
            if (!selectedBlockData) {
                console.warn("world.getBlockData() return null");
                return Selector._unSelect(selectionHelper);
            }
            const blockId = selectedBlockData.blockId;
            const uvRange = BlockFactory.getBlock(blockId)?.uvRange;
            let selectedIntersection = intersection0;
            
        
            // TODO short grass 的拾取待优化
            // 根据 uv 优化拾取
            if (uvRange && intersection0.uv) {
                const { x: uvXRange, y: uvYRange } = uvRange;
                const { x: uvX, y: uvY } = intersection0.uv;
                
                if (uvX < uvXRange[0] || uvX > uvXRange[1] || uvY < uvYRange[0] || uvY > uvYRange[1]) {
                    // 点击的 uv 坐标不在方块的有效 uv 范围内
                    if (intersection1) {
                        Selector._unSelect(selectionHelper);
                        selectedIntersection = intersection1;
                    } else {
                        return Selector._unSelect(selectionHelper);
                    }
                }
            }

            Selector.selectedMesh = selectedIntersection.object;
            // Update the block placement coordinates
            Selector._updateBlockPlacementCoords(selectedIntersection);
            // Update the selection helper
            Selector._updateSelectionHelper(blockId, selectionHelper);
        } else {
            Selector.selectedMesh = null;
            Selector._unSelect(selectionHelper);
        }
    }

    /**@desc 根据射线的相交位置 获取玩家选中的方块在世界坐标中的位置 */
    static getBlockPositionInWorld() {
        if(!PlayerParams.selectedCoords) return null;
        const { x, y, z } = PlayerParams.selectedCoords;
        return worldToCeilBlockCoord(x, y, z);
    }

    private static _unSelect(selectionHelper: THREE.Mesh) {
        // 没有选中的方块时，将选中坐标设为 null
        PlayerParams.selectedCoords = null;
        Selector.selectedBlock = null;
        selectionHelper.visible = false;
    }

    static _tempBlockMatrix = new THREE.Matrix4();
    private static _updateSelectCoord(intersection: THREE.Intersection, chunk: THREE.Object3D) {
        if (intersection.instanceId == null) return;

        // TODO 目前只能选中 InstancedMesh 类型的方块 后续待扩展支持其他类型 object / mesh 如不同的生物
        // Get the transformation matrix for the selected block
        (intersection.object as THREE.InstancedMesh).getMatrixAt(
            intersection.instanceId,
            Selector._tempBlockMatrix
        );

        // Undo rotation from block matrix
        const rotationMatrix = new THREE.Matrix4().extractRotation(Selector._tempBlockMatrix);
        const inverseRotationMatrix = rotationMatrix.invert();
        Selector._tempBlockMatrix.multiply(inverseRotationMatrix);

        // Set the selected coordinates to origin of chunk
        // Then apply transformation matrix of block to get block coords
        PlayerParams.selectedCoords = chunk.position.clone();
        PlayerParams.selectedCoords.applyMatrix4(Selector._tempBlockMatrix);
    }

    /**
     * @desc 更新玩家方块放置坐标
     */
    private static _updateBlockPlacementCoords(intersection: THREE.Intersection) {
        // 未选中方块 或 缺少法线 时 不更新方块放置坐标
        if (!PlayerParams.selectedCoords || !intersection.normal) return;
        // TODO flower 类型的方块 放置坐标位置错误 后续需要修复
        if (ToolBar.activeBlockId !== undefined && ToolBar.activeBlockId !== BlockID.Air) {
            // Update block placement coords to be 1 block over in the direction of the normal       
            Selector.blockPlacementCoords.copy(PlayerParams.selectedCoords);
            Selector.blockPlacementCoords.add(intersection.normal);
            Selector.blockPlacementNormal.copy(intersection.normal);
        }
    }

    /**@desc 更新选择框的位置和大小 显示玩家选中方块的位置和大小 */
    private static _updateSelectionHelper(selectedBlockId: BlockID, selectionHelper: THREE.Mesh) {
        if (!PlayerParams.selectedCoords) return;
        Selector.selectedBlock = selectedBlockId;
        selectionHelper.position.copy(PlayerParams.selectedCoords);
        if(selectedBlockId === BlockID.FlowerDandelion || selectedBlockId === BlockID.FlowerRose) {
            selectionHelper.scale.set(0.3, 0.6, 0.3);
            selectionHelper.position.y -= 0.2;
        } else if (selectedBlockId === BlockID.ShortGrass) {
            selectionHelper.scale.set(0.7, 0.3, 0.7);
            selectionHelper.position.y -= 0.4;
        } else if (selectedBlockId === BlockID.TallGrass) {
            selectionHelper.scale.set(0.75, 1, 0.75);
        } else {
            selectionHelper.scale.set(1, 1, 1);
        }
        selectionHelper.visible = true;
    }
}