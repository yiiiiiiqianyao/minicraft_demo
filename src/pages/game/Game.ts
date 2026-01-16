import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { createUI, initMainMenu } from "./gui";
import { Player } from "./player/Player";
import { World } from "./world/World";
import { SkyManager, sunSettings } from "./sky";
import { updateRenderInfoGUI, updateStats } from "./dev";
import audioManager from "./audio/AudioManager";
import { initOrbitCamera, updateOrbitControls } from "./dev/orbitCamera";
import { ScreenViewer } from "./gui/viewer";
import { Physics } from "./physics";
import { Engine } from "./engine";

export default class Game {
  static v = -1;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private orbitCamera!: THREE.PerspectiveCamera;

  private controls!: OrbitControls;
  private clock!: THREE.Clock;

  private skyManager!: SkyManager;
  private world!: World;
  private player!: Player;
  private physics!: Physics;

  private previousTime = 0;
  

  constructor() {
    this.previousTime = performance.now();
    this.clock = new THREE.Clock();
    initMainMenu(() => {
      this.initScene();
      // this.initListeners();
      window.addEventListener("resize", this.onWindowResize.bind(this), false);
      audioManager.playBtm();
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
    this.physics = new Physics(this.scene, this.player);

    this.skyManager.updateSunPosition(0, this.player);

    createUI(
      this.world,
      this.player,
      this.physics,
      this.scene,
      this.renderer,
      sunSettings,
      this.skyManager.sunHelper,
      this.skyManager.shadowHelper
    );

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
    this.skyManager.updateSkyColor(this.clock, this.player);

    // 更新物理模拟
    this.physics.update(deltaTime);

    // 更新世界 chunk
    this.world.update(this.player);

    // update triangle count
    updateRenderInfoGUI(this.renderer);
    updateStats();

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
    if(Game.v !== -1) {
      if(Game.v === 1) {
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
}
