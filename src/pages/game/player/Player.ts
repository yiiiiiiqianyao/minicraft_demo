import TWEEN from "@tweenjs/tween.js";
import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import audioManager from "../audio/AudioManager";
import { BlockID } from "../Block";
import { World } from "../world/World";
import { updatePositionGUI } from "../gui";
import { PlayerInitPosition, PlayerParams } from "./literal";
import { KeyboardInput } from "./keyboard";
import { MouseInput } from "./mouse";
import { initBoundsHelper, selectionHelper, updateBoundsHelper } from "../helper";
import { Action } from "./action";
import { playerToChunkCoords, worldToCeilBlockCoord } from "../world/chunk/utils";
import { updateWorldBlockCoordGUI } from "../dev";
import { updatePlayerNear } from "../helper/chunkHelper";
import { Layers } from "../engine";
import { initPlayerCamera } from "./camera";
import { Selector } from "./selector";

export class Player {
  onGround = false;
  input = new THREE.Vector3();
  velocity = new THREE.Vector3();
  #worldVelocity = new THREE.Vector3();
  // 玩家是否处于冲刺状态
  isSprinting = false;

  lastStepSoundPlayed = 0;
  world: World;
  keyboardInput = new KeyboardInput(this);
  camera: THREE.PerspectiveCamera;
  cameraHelper: THREE.CameraHelper;
  controls: PointerLockControls;
  boundsHelper: THREE.Mesh;
  private rayCaster: THREE.Raycaster;


    /*
   * Returns the velocity of the player in world coordinates
   */
  get worldVelocity() {
    this.#worldVelocity.copy(this.velocity);
    this.#worldVelocity.applyEuler(
      new THREE.Euler(0, this.camera.rotation.y, 0)
    );
    return this.#worldVelocity;
  }

  get position() {
    return this.camera.position;
  }

  constructor(scene: THREE.Scene, world: World) {
    this.world = world;

    this.camera = initPlayerCamera();
    this.cameraHelper = new THREE.CameraHelper(this.camera);
    this.cameraHelper.layers.set(Layers.One);
    this.cameraHelper.visible = false;
    
    this.controls = new PointerLockControls(this.camera, document.body);

    this.rayCaster = new THREE.Raycaster(
      new THREE.Vector3(),
      new THREE.Vector3(),
      0,
      5
    );
    this.rayCaster.layers.set(Layers.Zero);
    
    scene.add(this.camera);
    scene.add(this.cameraHelper);
    // for dev test
    this.boundsHelper = initBoundsHelper();
    this.boundsHelper.visible = false;
    scene.add(this.boundsHelper);

    selectionHelper.visible = false;
    scene.add(selectionHelper);

    setTimeout(() => {
      this.controls.lock();
    }, 2000);
    new MouseInput(this, world);
  }
  
  /**
   * Apply a world delta velocity to the player
   */
  applyWorldDeltaVelocity(dv: THREE.Vector3) {
    dv.applyEuler(new THREE.Euler(0, -this.camera.rotation.y, 0));
    this.velocity.add(dv);
  }

  /**@desc 应用玩家输入 Normalize the input vector if more than one key is pressed */
  applyInputs(dt: number, blockUnderneath: BlockID) {
    if (this.input.length() > 1) {
      this.input
        .normalize()
        .multiplyScalar(this.isSprinting ? PlayerParams.maxSprintSpeed : PlayerParams.maxSpeed);
    }

    // 玩家当前水平的速度
    this.velocity.x = this.input.x;
    this.velocity.z = this.input.z;

    // play step sound 在地面上发生移动的时候
    if (this.onGround && this.input.length() > 0) {
      const minTimeout = this.isSprinting ? 300 : 400;
      if (performance.now() - this.lastStepSoundPlayed > minTimeout) {
        audioManager.playWalkSound(blockUnderneath);
        this.lastStepSoundPlayed = performance.now();
      }
    }
    // TODO 在角色起跳之前需要判断角色上方是否有足够的空间
    if (KeyboardInput.spacePressed && this.onGround) {
      this.velocity.y = PlayerParams.jumpSpeed;
    }
    // 使用控制器根据速度控制玩家在水平面上移动
    this.controls.moveRight(this.velocity.x * dt);
    this.controls.moveForward(this.velocity.z * dt);
    // 根据速度 * 时间 更新玩家在垂直方向上的位置
    this.position.y += this.velocity.y * dt;

    updatePositionGUI(this.position);
  }

  /**@desc 更新玩家 */
  update(world: World) {
    this.boundsHelper.visible && updateBoundsHelper(this.camera.position, this.boundsHelper);
    // 更新用户的拾取选中方块
    Selector.update(this.camera, world, selectionHelper);
    Selector.select(this.camera, world, selectionHelper);
    this.updateCameraFOV();
    // prevent player from falling through
    if (this.position.y < 0) {
      this.position.copy(PlayerInitPosition);
      this.velocity.set(0, 0, 0);
    }
  }

  /**
   * 更新角色的位置 水平 垂直
   * @param deltaPosition 
   */
  updatePosition() {
    this.updateByPosition();
  }

  /**
   * 随着角色的位置变化而刷新的一些属性 PlayerParams
   */
  updateByPosition() {
    const { x, y, z } = this.position;
    const { isInChunkCenter, chunk, nearFourChunks } = playerToChunkCoords(x, y, z);
    PlayerParams.position.copy(this.position);
    
    // 更新角色所处的 currentChunk
    updatePlayerNear(chunk, nearFourChunks, this.world, isInChunkCenter);  
    // 更新角色所处的 chunk blockID
    // const ceilBlockCoords = worldToCeilBlockCoord(block.x, block.y, block.z);
    // updateBlockCoordGUI(ceilBlockCoords[0], ceilBlockCoords[1], ceilBlockCoords[2]);
    // 更新角色所处的世界 blockID
    const ceilWorldBlockCoord = worldToCeilBlockCoord(x, y, z);
    updateWorldBlockCoordGUI(ceilWorldBlockCoord[0], ceilWorldBlockCoord[1], ceilWorldBlockCoord[2]);

    // 角色移动后检测吸收掉落的物品
    Action.absorbDrops(this.world);
    // 更新角色相邻的最小 4 个chunk => 角色移动的时候需要计算相邻 4 个 chunk 中 drop 掉落物体是否被吸收
    // 角色一定距离内执行粒子动画、野怪刷新、植物生长
  }

  /**@desc 更新 player 的拾取射线 */
  private updateRayCaster(world: World) {
    
  }

  /**@desc 更新 player 角色相机的 FOV */
  private updateCameraFOV() {
    // TODO 需要根据玩家是否 sprinting 来动态调整相机 FOV 待优化
    const currentFov = { fov: this.camera.fov };
    const targetFov = this.isSprinting ? 80 : 70;
    const update = () => {
      this.camera.fov = currentFov.fov;
      this.camera.updateProjectionMatrix();
    };
    new TWEEN.Tween(currentFov)
      .to({ fov: targetFov }, 30)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(update)
      .start();
  }
}
