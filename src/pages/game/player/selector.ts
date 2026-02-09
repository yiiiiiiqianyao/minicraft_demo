import * as THREE from "three";
import { World } from "../world/World";
import { PlayerParams, RayCenterScreen } from "./literal";
import { getNearChunks } from "./utils";
import { GameLayers } from "../engine";
import { RenderGeometry } from "../Block/base/Block";
import { ToolBar } from "../gui";
import { BlockID } from "../Block";
import { worldToCeilBlockCoord } from "../world/chunk/utils";

/**@desc 玩家的拾取/选择器 */
export class Selector {
    private static _rayCaster: THREE.Raycaster | null = null;
    /**@desc 垂直同步次数 性能优化使用 */
    private static _vSyncCount = 2;
    private static _updateCount = 0;
    static blockPlacementCoords: THREE.Vector3 = new THREE.Vector3();
    static blockPlacementNormal: THREE.Vector3 = new THREE.Vector3();
    /**
     * Updates the raycaster used for block selection
     */
    // static selectedBlockUuid: string | null = null;
    static selectedMesh: THREE.Object3D | null = null;
    static get rayCaster() {
        if(!Selector._rayCaster) {
            Selector._rayCaster = new THREE.Raycaster(
                new THREE.Vector3(),
                new THREE.Vector3(),
                0,
                5
            );
            this.rayCaster.layers.set(GameLayers.Zero);
        }
        return Selector._rayCaster;
    }

    static update(camera: THREE.PerspectiveCamera, world: World, selectionHelper: THREE.Mesh) {
        Selector._updateCount++;
        if(Selector._updateCount === Selector._vSyncCount) {
            Selector.select(camera, world, selectionHelper);
            Selector._updateCount = 0;
        }
    }

    // TODO 当相机控制器没有变化的时候 可以优化拾取过滤
    static select(camera: THREE.PerspectiveCamera, world: World, selectionHelper: THREE.Mesh) {
        const rayCaster = Selector.rayCaster;
        rayCaster.setFromCamera(RayCenterScreen, camera);
        
        // 过滤 player 所在的 chunk or 相邻 4 个 chunk
        const chunks = getNearChunks(world);
        // TODO 实际的拾取对象 可以使用 layer 进行过滤优化
        const intersection = rayCaster.intersectObjects(chunks, true)[0];
        if (intersection) {
            // Selector.selectedBlockUuid = intersection.object.uuid;
            Selector.selectedMesh = intersection.object;
            // Get the chunk associated with the seclected block
            // TODO 目前只能选中 chunk 中的 InstancedMesh 方块 后续待扩展支持其他类型方块
            const chunk = intersection.object.parent;
            if (intersection.instanceId == null || !chunk) return Selector.unSelect(selectionHelper);
            
            // 根据 uv 优化拾取
            if (intersection.object.userData.uvRange && intersection.uv) {
                const { x: uvXRange, y: uvYRange } = intersection.object.userData.uvRange;
                const { x: uvX, y: uvY } = intersection.uv;
                if (uvX < uvXRange[0] || uvX > uvXRange[1] && uvY < uvYRange[0] && uvY > uvYRange[1]) {
                    // 点击的 uv 坐标不在方块的有效 uv 范围内
                    return Selector.unSelect(selectionHelper);
                }
            }
            // Update the selected coordinates
            Selector.updateSelectCoord(intersection, chunk);
            // Update the block placement coordinates
            Selector.updateBlockPlacementCoords(intersection);
            // Update the selection helper
            Selector.updateSelectionHelper(intersection, selectionHelper);
        } else {
            Selector.selectedMesh = null;
            Selector.unSelect(selectionHelper);
        }
    }

    static unSelect(selectionHelper: THREE.Mesh) {
        // 没有选中的方块时，将选中坐标设为 null
        PlayerParams.selectedCoords = null;
        // 没有选中的方块时，将选中方块大小设为 null
        // PlayerParams.selectedBlockSize = null;
        selectionHelper.visible = false;
    }

    /**@desc 根据射线的相交位置 获取玩家选中的方块在世界坐标中的位置 */
    static getBlockPositionInWorld() {
        if(!PlayerParams.selectedCoords) return null;
        const { x, y, z } = PlayerParams.selectedCoords;
        return worldToCeilBlockCoord(x, y, z);
    }

    static _tempBlockMatrix = new THREE.Matrix4();
    static updateSelectCoord(intersection: THREE.Intersection, chunk: THREE.Object3D) {
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

        // Get the bounding box of the selected block
        // const boundingBox = new THREE.Box3().setFromObject(intersection.object);
        // PlayerParams.selectedBlockSize = boundingBox.getSize(new THREE.Vector3());
    }

    /**
     * @desc 更新玩家方块放置坐标
     */
    static updateBlockPlacementCoords(intersection: THREE.Intersection) {
        // 未选中方块 或 缺少法线 时 不更新方块放置坐标
        if (!PlayerParams.selectedCoords || !intersection.normal) return;
        // TODO 待优化
        // TODO flower 类型的方块 放置坐标位置错误 后续需要修复
        if (ToolBar.activeBlockId !== undefined && ToolBar.activeBlockId !== BlockID.Air) {
            // Update block placement coords to be 1 block over in the direction of the normal       
            Selector.blockPlacementCoords.copy(PlayerParams.selectedCoords);
            Selector.blockPlacementCoords.add(intersection.normal);
            Selector.blockPlacementNormal.copy(intersection.normal);
        }
    }

    /**@desc 更新选择框的位置和大小 显示玩家选中方块的位置和大小 */
    static updateSelectionHelper(intersection: THREE.Intersection, selectionHelper: THREE.Mesh) {
        if (!PlayerParams.selectedCoords) return;
        selectionHelper.position.copy(PlayerParams.selectedCoords);
        if(intersection.object.userData.renderGeometry === RenderGeometry.Flower) {
            selectionHelper.scale.set(0.3, 0.6, 0.3);
            selectionHelper.position.y -= 0.2;
        } else {
            selectionHelper.scale.set(1, 1, 1);
        } 
        // TODO TallGrass 草方块的选择框需要调整大小
        selectionHelper.visible = true;
    }
}