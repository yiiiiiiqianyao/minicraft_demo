import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { createUI, initMainMenu, swapMenuScreenGUI } from "./gui";
import { Player } from "./player/Player";
import { World } from "./world/World";
import { SkyManager } from "./sky";
import audioManager from "./audio/AudioManager";
import { initOrbitCamera, updateOrbitControls } from "./dev/orbitCamera";
import { ScreenViewer } from "./gui/viewer";
import { Physics } from "./physics";
import { Engine } from "./engine";
import { SunSettings } from "./sky/literal";
import { PhysicsParams } from "./physics/literal";
import { ChunkParams } from "./world/chunk/literal";
import { PlayerInitPosition } from "./player/literal";
import { BlockID } from "./Block";
import { GameTimeManager, hourDuration } from "./time";
import { DevControl } from "./dev";

export default class Game {
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private orbitCamera!: THREE.PerspectiveCamera;

  private controls!: OrbitControls;

  private skyManager!: SkyManager;
  private world!: World;
  private player!: Player;
  private physics!: Physics;

  private previousTime = 0;
  

  constructor() {
    this.previousTime = performance.now();
    initMainMenu(() => {
      this.initScene();
      // this.initListeners();
      window.addEventListener("resize", this.onWindowResize.bind(this), false);
      audioManager.playBGM();
    });
  }

  initScene() {
    Engine.init();
    this.renderer = Engine.renderer;
    this.scene = Engine.scene;
        
    const { orbitCamera, controls } = initOrbitCamera(this.renderer);
    this.orbitCamera = orbitCamera;
    this.controls = controls;

    // Skybox
    this.skyManager = new SkyManager(this.scene);
    
    this.world = new World(0, this.scene);
    this.scene.add(this.world);

    this.player = new Player(this.scene, this.world);
    this.physics = new Physics(this.scene, this.player, this.world);

    // Tip: 设置游戏开始时间 6点
    GameTimeManager.startTime = hourDuration * 6;
    this.world.onLoad = () => {
      this.onStart();
    }
    // TODO 暂时关掉 具体的调试打开待优化
    if(Math.random() < 0) {
      createUI(
        this.world,
        this.player,
        this.physics,
        this.scene,
        this.renderer,
        SunSettings,
        this.skyManager.sunHelper,
        this.skyManager.shadowHelper
      );
    }
    this.draw();
  }

  private onWindowResize() {
    const { width, height } = Engine.screenWrap.getBoundingClientRect();
    ScreenViewer.width = width;
    ScreenViewer.height = height;

    const aspect = ScreenViewer.width / ScreenViewer.height;
    if(this.orbitCamera) {
      this.orbitCamera.aspect = aspect;
      this.orbitCamera.updateProjectionMatrix();
    }
    if (this.player) {
      this.player.camera.aspect = aspect;
      this.player.camera.updateProjectionMatrix();
    }
    if (this.renderer) {
      this.renderer.setSize(ScreenViewer.width, ScreenViewer.height);
    }
  }

  /**@desc 游戏主循环 */
  private draw() {
    const currentTime = performance.now();
    const deltaTime = (currentTime - this.previousTime) / 1000;

    requestAnimationFrame(() => {
      this.draw();
    });

    // TODO 更新天空应该放置在更新世界中
    this.skyManager.updateSkyColor();

    // 更新物理模拟
    this.physics.update(deltaTime);

    // 更新世界 chunk
    this.world.update();

    // update triangle count
    DevControl.update(this.renderer);

    TWEEN.update();    
    const renderCamera = this.getRenderCamera();
    this.renderer.render(this.scene, renderCamera);
    // 更新观察相机位置和目标位置
    updateOrbitControls(this.orbitCamera, this.controls, this.player);

    this.previousTime = currentTime;
  }

  private getRenderCamera() {
    // TODO 第三人称视角 增加支持角色的控制移动
    // player.controls.isLocked === true 第一人称模式
    // player.controls.isLocked === false 观察者模式
    if(DevControl.v !== -1) {
      if(DevControl.v === 1) {
        return this.player.camera;
      } else {
        return this.orbitCamera;
      }
    }
    const renderMode = this.player.controls.isLocked ? 'firstPerson' : 'thirdPerson';
    switch(renderMode) {
      case 'firstPerson':
        return this.player.camera;
      case 'thirdPerson':
        return this.orbitCamera;
    }
  }

  /**@desc world chunk 初始化完成后 开始游戏*/
  private onStart() {
    const startX = PlayerInitPosition.x;
    const startZ = PlayerInitPosition.z;
      
    this.player.updateByPosition();
          
    const startingPlayerPosition = new THREE.Vector3().copy(PlayerInitPosition);
    for (let y = ChunkParams.height; y > 0; y--) {
      // TODO: 角色初始位置 y 轴坐标需要根据当前 chunk 高度进行调整
      if (this.world.getBlock( startX, y,startZ)?.block === BlockID.Grass) {
        startingPlayerPosition.y = y;
        break;
      }
    }
    // 角色从离地面 10 个单位的位置开始
    this.player.position.set(startX,startingPlayerPosition.y + 10,startZ);
    // 角色 PointerLockControls 控制器解锁
    this.player.controls.lock();
    this.player.updateByPosition();
    this.player.updateHand();
    PhysicsParams.enabled = true;
    swapMenuScreenGUI();
  }
}
