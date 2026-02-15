import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";
import { Scene } from "three";
import { initPlayerCamera } from "./camera";
import { GameLayers } from "../engine";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import { quadraticFunction } from "../engine/math";
import { MeshPool } from "../engine/mesh";
import { MeshType } from "../engine/mesh/constant";
import { BlockID } from "../Block";
import { ToolBar } from "../gui";

/**
 * @desc player group 描述 player 模型、相机、附件（手、武器）等物品的集合
 * 核心点是 camera 相机，其余内容都挂载在相机节点上
 */
const handleOriginRotationX = Math.PI * 0.5;
const handleOriginRotationY = Math.PI * 0.08;
const handleOriginRotationZ = Math.PI * 0.05;
const WaveStepX = -Math.PI / 8;

export class PlayerGroup {
    controls!: PointerLockControls;
    cameraHelper!: THREE.CameraHelper;
    private handPoint!: THREE.Group;
    private scene: Scene;
    private basePoint!: THREE.PerspectiveCamera;
    private currentHandBlockID: BlockID | null | undefined = null;
    get position() {
        return this.basePoint.position;
    }
    get rotation() {
        return this.basePoint.rotation;
    }
    get camera() {
        return this.basePoint;
    }
    constructor(scene: Scene) {
        this.scene = scene;
        this.initBasePoint();
        this.initHand();
    }

    initBasePoint() {
        const camera = initPlayerCamera();
        const cameraHelper = new THREE.CameraHelper(camera);
        cameraHelper.layers.set(GameLayers.One);
        cameraHelper.visible = false;
        this.controls = new PointerLockControls(camera, document.body);
        this.basePoint = camera;
        this.cameraHelper = cameraHelper;
        this.scene.add(camera);
        this.scene.add(cameraHelper);
    }

    initHand() {
        const point = new THREE.Group();
        point.position.set(0.3, -0.2, -0.2);
        point.rotation.set(
            handleOriginRotationX,
            handleOriginRotationY,
            handleOriginRotationZ,
        );
        this.basePoint.add(point);

        const handPoint = new THREE.Group();
        point.add(handPoint);

        this.handPoint = handPoint;
        // this.updateHand(null);
    }

    /**
     * @desc 根据 blockID 更新手的模型
     */
    updateHand() {
        const blockID = ToolBar.activeBlockId
        if (this.currentHandBlockID === blockID) return;
        this.currentHandBlockID = blockID;
        this.handPoint.clear();
        if (!blockID) {
            this.handPoint.add(MeshPool.getHandMesh(MeshType.Hand) as THREE.Mesh);
        } else {
            // TODO 待补全
            switch (blockID) {
                case BlockID.GrassBlock:
                    return this.handPoint.add(MeshPool.getHandMesh(MeshType.GrassBlock) as THREE.Mesh);
                case BlockID.Dirt:
                    return this.handPoint.add(MeshPool.getHandMesh(MeshType.DirtBlock) as THREE.Mesh);
                case BlockID.Stone:
                    return this.handPoint.add(MeshPool.getHandMesh(MeshType.StoneBlock) as THREE.Mesh);
                case BlockID.CoalOre:
                    return this.handPoint.add(MeshPool.getHandMesh(MeshType.CoalOreBlock) as THREE.Mesh);
                case BlockID.IronOre:
                case BlockID.Bedrock:
                    // TODO 待补全 其他矿物
                    return this.handPoint.add(MeshPool.getHandMesh(MeshType.StoneBlock) as THREE.Mesh);
                case BlockID.OakLog:
                    return this.handPoint.add(MeshPool.getHandMesh(MeshType.OakLogBlock) as THREE.Mesh);
                case BlockID.BirchLog:
                    return this.handPoint.add(MeshPool.getHandMesh(MeshType.BirchLogBlock) as THREE.Mesh);
                case BlockID.Leaves:
                    return this.handPoint.add(MeshPool.getHandMesh(MeshType.LeavesBlock) as THREE.Mesh);
                case BlockID.TallGrass:
                case BlockID.FlowerRose:
                    return this.handPoint.add(MeshPool.getHandMesh(MeshType.FlowerRose) as THREE.Mesh);
                case BlockID.FlowerDandelion:
                    return this.handPoint.add(MeshPool.getHandMesh(MeshType.FlowerDandelion) as THREE.Mesh);
                case BlockID.RedstoneLamp:
                case BlockID.StoneBrick:
                case BlockID.CraftingTable:
                    return this.handPoint.add(MeshPool.getHandMesh(MeshType.CraftingTable) as THREE.Mesh);
            }
        }
    }

    /**@desc 挥手/工具/挖 动作待优化 */
    waveHand() {
        if (!this.handPoint) return;
        const update = (o: { t: number }) => {
            this.handPoint.rotation.x =  quadraticFunction(o.t) * WaveStepX;
            this.handPoint.rotation.z =  quadraticFunction(o.t) * WaveStepX * 0.5;
            // this.handPoint.position.z = quadraticFunction(o.t) * 0.1;
            // this.handPoint.position.x = -quadraticFunction(o.t) * 0.1;
            // this.handPoint.position.y = -quadraticFunction(o.t) * 0.1;
        };
        new TWEEN.Tween({t: 0})
            .to({ t: 1 }, 200)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(update)
            .start();
    }

    /**@desc 放置方块时候手的动作 */
    placementHand() {
        // TODO 暂时使用 wave hand 的动作 后续待优化
        this.waveHand();
    }
}