import TWEEN from "@tweenjs/tween.js";
import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import audioManager from "../audio/AudioManager";
import { BlockID } from "../Block";
import { World } from "../world/World";
import { ToolBar, updatePositionGUI } from "../gui";
import { initPlayerCamera } from "./utils";
import { PlayerInitPosition, PlayerParams, RayCenterScreen } from "./literal";
import { KeyboardInput } from "./keyboard";
import { MouseInput } from "./mouse";
import { RenderGeometry } from "../Block/Block";
import { boundsHelper, selectionHelper } from "../helper";
import { Action } from "./action";
import { playerToChunkCoords, worldToCeilBlockCoord } from "../world/chunk/utils";
import { updateWorldBlockCoordGUI } from "../dev";
import { updatePlayerNear } from "../helper/chunkHelper";

export class Player {
  onGround = false;
  input = new THREE.Vector3();
  velocity = new THREE.Vector3();
  #worldVelocity = new THREE.Vector3();
  // 玩家是否处于冲刺状态
  isSprinting = false;

  lastStepSoundPlayed = 0;
  world: World;
  camera = initPlayerCamera();
  cameraHelper = new THREE.CameraHelper(this.camera);
  
  controls = new PointerLockControls(this.camera, document.body);
  rayCaster = new THREE.Raycaster(
    new THREE.Vector3(),
    new THREE.Vector3(),
    0,
    5
  );
  public keyboardInput = new KeyboardInput(this);
  /**
   * Updates the raycaster used for block selection
   */
  private selectedBlockUuid: string | null = null;

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
    this.camera.position.copy(PlayerInitPosition);
    this.cameraHelper.visible = false;
    
    scene.add(this.camera);
    scene.add(this.cameraHelper);
    // for dev test
    boundsHelper.visible = false;
    scene.add(boundsHelper);

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

  applyInputs(dt: number, blockUnderneath: BlockID) {
    // Normalize the input vector if more than one key is pressed
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
        this.playWalkSound(blockUnderneath);
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

  update(world: World) {
    this.updateBoundsHelper();
    this.updateRayCaster(world);
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
    // console.log('this.position', this.position);
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

  private playWalkSound(blockUnderneath: BlockID) {
    switch (blockUnderneath) {
      case BlockID.Grass:
      case BlockID.Dirt:
      case BlockID.Leaves:
        audioManager.play("step.grass");
        break;
      case BlockID.OakLog:
        audioManager.play("step.wood");
        break;
      case BlockID.Stone:
      case BlockID.CoalOre:
      case BlockID.IronOre:
      case BlockID.Bedrock:
        audioManager.play("step.stone");
        break;
    }
  }

  /**
   * Update the player's bounding cylinder helper
   */
  private updateBoundsHelper() {
    boundsHelper.position.copy(this.camera.position);
    boundsHelper.position.y -= PlayerParams.height / 2; // set to eye level
  }

  private updateRayCaster(world: World) {
    const rayCaster = this.rayCaster;
    if(!rayCaster) return;
    rayCaster.setFromCamera(RayCenterScreen, this.camera);
    const intersections = rayCaster.intersectObjects(world.children, true).filter((intersection) => {
      // 排除掉掉落的方块
      return intersection.object.userData.type !== 'drop';
    });

    if (intersections.length > 0) {
      const intersection = intersections[0];
      if(this.selectedBlockUuid !== intersection.object.uuid) {
        this.selectedBlockUuid = intersection.object.uuid;
        // console.log(intersection.object);
      }
      
      // Get the chunk associated with the seclected block
      const chunk = intersection.object.parent;

      if (intersection.instanceId == null || !chunk) {
        selectionHelper.visible = false;
        return;
      }

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
      const boundingBox = new THREE.Box3().setFromObject(intersection.object);
      PlayerParams.selectedBlockSize = boundingBox.getSize(new THREE.Vector3());

      if (ToolBar.activeBlockId !== BlockID.Air && intersection.normal) {
        // Update block placement coords to be 1 block over in the direction of the normal
        Action.blockPlacementCoords = PlayerParams.selectedCoords
          .clone()
          .add(intersection.normal);
      }
      if(intersection.object.userData.renderGeometry === RenderGeometry.Flower) {
        selectionHelper.scale.set(0.3, 0.6, 0.3);
      } else {
        selectionHelper.scale.set(1, 1, 1);
      } 
      // TODO TallGrass 草方块的选择框需要调整大小
      selectionHelper.position.copy(PlayerParams.selectedCoords);
      selectionHelper.visible = true;
    } else {
      // 没有选中的方块时，将选中坐标设为 null
      PlayerParams.selectedCoords = null;
      // 没有选中的方块时，将选中方块大小设为 null
      PlayerParams.selectedBlockSize = null;
      selectionHelper.visible = false;
    }
  }

  private updateCameraFOV() {
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
