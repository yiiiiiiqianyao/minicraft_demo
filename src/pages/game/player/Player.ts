import TWEEN from "@tweenjs/tween.js";
import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import audioManager from "../audio/AudioManager";
import { BlockID } from "../Block";
import { World } from "../world/World";
import { updatePositionGUI } from "../gui";
import { initBoundsHelper, initPlayerCamera } from "./utils";
import { PlayerInitPosition, PlayerParams, RayCenterScreen } from "./literal";
import { KeyboardInput } from "./keyboard";
import { MouseInput } from "./mouse";
import { RenderGeometry } from "../Block/Block";
import { ScreenViewer } from "../gui/viewer";

function cuboid(width: number, height: number, depth: number) {
  const hw = width * 0.5;
  const hh = height * 0.5;
  const hd = depth * 0.5;

  const position = [
    [-hw, -hh, -hd],
    [-hw, hh, -hd],
    [hw, hh, -hd],
    [hw, -hh, -hd],
    [-hw, -hh, -hd],

    [-hw, -hh, hd],
    [-hw, hh, hd],
    [-hw, hh, -hd],
    [-hw, hh, hd],

    [hw, hh, hd],
    [hw, hh, -hd],
    [hw, hh, hd],

    [hw, -hh, hd],
    [hw, -hh, -hd],
    [hw, -hh, hd],
    [-hw, -hh, hd],
  ].flat();

  return position;
}

const selectionMaterial = new LineMaterial({
  color: 0x000000,
  opacity: 0.9,
  linewidth: 1,
  resolution: new THREE.Vector2(ScreenViewer.width, ScreenViewer.height),
});
const selectionLineGeometry = new LineGeometry();
selectionLineGeometry.setPositions(cuboid(1.001, 1.001, 1.001));

export class Player {
  onGround = false;

  input = new THREE.Vector3();
  velocity = new THREE.Vector3();
  #worldVelocity = new THREE.Vector3();
  
  spacePressed = false;
  wKeyPressed = false;
  lastWPressed = 0;
  // 玩家是否处于冲刺状态
  isSprinting = false;

  lastStepSoundPlayed = 0;

  camera = initPlayerCamera();
  cameraHelper = new THREE.CameraHelper(this.camera);
  boundsHelper = initBoundsHelper();
  selectionHelper = new Line2(selectionLineGeometry, selectionMaterial);
  controls = new PointerLockControls(this.camera, document.body);
  rayCaster = new THREE.Raycaster(
    new THREE.Vector3(),
    new THREE.Vector3(),
    0,
    5
  );
  blockPlacementCoords: THREE.Vector3 | null = null;
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
    this.camera.position.set(
      PlayerInitPosition.x,
      PlayerInitPosition.y,
      PlayerInitPosition.z
    );
    this.boundsHelper.visible = false;
    this.cameraHelper.visible = false;
    this.selectionHelper.visible = false;
    scene.add(this.camera);
    scene.add(this.cameraHelper);
    scene.add(this.boundsHelper);
    scene.add(this.selectionHelper);

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

    if (this.spacePressed && this.onGround) {
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
    this.boundsHelper.position.copy(this.camera.position);
    this.boundsHelper.position.y -= PlayerParams.height / 2; // set to eye level
  }

  private updateRayCaster(world: World) {
    const rayCaster = this.rayCaster;
    if(!rayCaster) return;
    rayCaster.setFromCamera(RayCenterScreen, this.camera);
    const intersections = rayCaster.intersectObjects(world.children, true);

    if (intersections.length > 0) {
      const intersection = intersections[0];
      if(this.selectedBlockUuid !== intersection.object.uuid) {
        this.selectedBlockUuid = intersection.object.uuid;
        // console.log(intersection.object);
      }
      
      // Get the chunk associated with the seclected block
      const chunk = intersection.object.parent;

      if (intersection.instanceId == null || !chunk) {
        this.selectionHelper.visible = false;
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

      if (this.keyboardInput.activeBlockId !== BlockID.Air && intersection.normal) {
        // Update block placement coords to be 1 block over in the direction of the normal
        this.blockPlacementCoords = PlayerParams.selectedCoords
          .clone()
          .add(intersection.normal);
      }
      if(intersection.object.userData.renderGeometry === RenderGeometry.Flower) {
        this.selectionHelper.scale.set(0.3, 0.6, 0.3);
      } else {
        this.selectionHelper.scale.set(1, 1, 1);
      } 
      // TODO 草方块的选择框需要调整大小
      this.selectionHelper.position.copy(PlayerParams.selectedCoords);
      this.selectionHelper.visible = true;
    } else {
      // 没有选中的方块时，将选中坐标设为 null
      PlayerParams.selectedCoords = null;
      // 没有选中的方块时，将选中方块大小设为 null
      PlayerParams.selectedBlockSize = null;
      this.selectionHelper.visible = false;
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
