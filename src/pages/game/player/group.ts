import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";
import { Scene } from "three";
import { initPlayerCamera } from "./camera";
import { Layers } from "../engine";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import { quadraticFunction } from "../engine/math";

/**
 * @desc player group 描述 player 模型、相机、附件（手、武器）等物品的集合
 * 核心点是 camera 相机，其余内容都挂载在相机节点上
 */
const handleOriginRotationX = Math.PI * 0.5;
const handleOriginRotationY = Math.PI * 0.08;
const handleOriginRotationZ = Math.PI * 0.05;
const WaveStepX = -Math.PI / 8;

const handLength = 0.5;
export class PlayerGroup {
    controls!: PointerLockControls;
    cameraHelper!: THREE.CameraHelper;
    hand!: THREE.Group;
    private scene: Scene;
    private basePoint!: THREE.PerspectiveCamera;
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
        cameraHelper.layers.set(Layers.One);
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

        const geometry = new THREE.BoxGeometry(0.1, handLength, 0.15);
        const material = new THREE.MeshLambertMaterial();
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0, -handLength / 2, 0);
        handPoint.add(mesh);

        this.hand = handPoint;
    }

    protected waveHand() {
        if (!this.hand) return;
        const update = (o: { t: number }) => {
            this.hand.rotation.x =  quadraticFunction(o.t) * WaveStepX;
            this.hand.rotation.z =  quadraticFunction(o.t) * WaveStepX * 0.5;
            // this.hand.position.z = quadraticFunction(o.t) * 0.1;
            // this.hand.position.x = -quadraticFunction(o.t) * 0.1;
            // this.hand.position.y = -quadraticFunction(o.t) * 0.1;
        };
        new TWEEN.Tween({t: 0})
            .to({ t: 1 }, 200)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(update)
            .start();
    }
}