import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { createUI, initMainMenu, swapMenuScreenGUI, ToolBar } from "./gui";
import { Player } from "./player/Player";
import { World } from "./world/World";
import { SkyManager } from "./sky";
import { AudioManager } from "./audio/AudioManager";
import { initOrbitCamera, updateOrbitControls } from "./dev/orbitCamera";
import { ScreenViewer } from "./gui/viewer";
import { Physics } from "./physics";
import { Engine } from "./engine";
import { SunSettings } from "./sky/literal";
import { PhysicsParams } from "./physics/literal";
import { PlayerInitPosition } from "./player/literal";
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
      AudioManager.playBGM();
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
    // Tip: 设置游戏开始时间 12 点
    GameTimeManager.startTime = hourDuration * 12;
    // 初始化更新工具栏
    ToolBar.updateToolBarGUI();
    
    // 角色初始位置 y 轴坐标需要根据当前 chunk 高度进行调整
    const { x: startX, z: startZ } = PlayerInitPosition;
    const groundHeight = this.world.getGroundHeight(startX, startZ);
    this.player.position.set(startX, groundHeight + 10, startZ);
    this.player.updateByPosition();

    // 角色 PointerLockControls 控制器解锁
    this.player.controls.lock();

    // 更新玩家手的模型
    this.player.updateHand();

    // 开启物理模拟
    PhysicsParams.enabled = true;

    // 切换到游戏主界面
    swapMenuScreenGUI();
  }
}
