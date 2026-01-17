import * as THREE from "three";
import { World } from "../world/World";
import { PlayerParams, RayCenterScreen } from "./literal";
import { getNearChunks } from "./utils";
import { Layers } from "../engine";
import { Action } from "./action";
import { RenderGeometry } from "../Block/Block";
import { ToolBar } from "../gui";
import { BlockID } from "../Block";

export class Selector {
    private static _rayCaster: THREE.Raycaster | null = null;
    /**@desc 垂直同步次数 性能优化使用 */
    private static _vSyncCount = 2;
    private static _updateCount = 0;
    /**
     * Updates the raycaster used for block selection
     */
    static selectedBlockUuid: string | null = null;
    static get rayCaster() {
        if(!Selector._rayCaster) {
            Selector._rayCaster = new THREE.Raycaster(
                new THREE.Vector3(),
                new THREE.Vector3(),
                0,
                5
            );
            this.rayCaster.layers.set(Layers.Zero);
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

    static select(camera: THREE.PerspectiveCamera, world: World, selectionHelper: THREE.Mesh) {
        const rayCaster = Selector.rayCaster;
        rayCaster.setFromCamera(RayCenterScreen, camera);
        
        // 过滤 player 所在的 chunk or 相邻 4 个 chunk
        const chunks = getNearChunks(world);
        // TODO 实际的拾取对象 可以使用 layer 进行过滤优化
        const intersection = rayCaster.intersectObjects(chunks, true)[0];
        if (intersection) {
            Selector.selectedBlockUuid = intersection.object.uuid;
            
            // Get the chunk associated with the seclected block
            // TODO 目前只能选中 chunk 中的 InstancedMesh 方块 后续待扩展支持其他类型方块
            const chunk = intersection.object.parent;
            if (intersection.instanceId == null || !chunk) return Selector.unSelect(selectionHelper);

            // Update the selected coordinates
            Selector.updateSelectCoord(intersection, chunk);
            // Update the block placement coordinates
            Selector.updateBlockPlacementCoords(intersection);
            // Update the selection helper
            Selector.updateSelectionHelper(intersection, selectionHelper);
        } else {
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

    static updateSelectCoord(intersection: THREE.Intersection, chunk: THREE.Object3D) {
        if (intersection.instanceId == null) return;

        // TODO 目前只能选中 InstancedMesh 类型的方块
        // Get the transformation matrix for the selected block
        const blockMatrix = new THREE.Matrix4();
        (intersection.object as THREE.InstancedMesh).getMatrixAt(
            intersection.instanceId,
            blockMatrix
        );

        // Undo rotation from block matrix
        const rotationMatrix = new THREE.Matrix4().extractRotation(blockMatrix);
        const inverseRotationMatrix = rotationMatrix.invert();
        blockMatrix.multiply(inverseRotationMatrix);

        // Set the selected coordinates to origin of chunk
        // Then apply transformation matrix of block to get block coords
        PlayerParams.selectedCoords = chunk.position.clone();
        PlayerParams.selectedCoords.applyMatrix4(blockMatrix);

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
        if (ToolBar.activeBlockId !== BlockID.Air) {
            // Update block placement coords to be 1 block over in the direction of the normal
            Action.blockPlacementCoords = PlayerParams.selectedCoords
            .clone()
            .add(intersection.normal);
        }
    }

    static updateSelectionHelper(intersection: THREE.Intersection, selectionHelper: THREE.Mesh) {
        if (!PlayerParams.selectedCoords) return;
        if(intersection.object.userData.renderGeometry === RenderGeometry.Flower) {
            selectionHelper.scale.set(0.3, 0.6, 0.3);
        } else {
            selectionHelper.scale.set(1, 1, 1);
        } 
        // TODO TallGrass 草方块的选择框需要调整大小
        selectionHelper.position.copy(PlayerParams.selectedCoords);
        selectionHelper.visible = true;
    }
}