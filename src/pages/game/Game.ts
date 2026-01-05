import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { createUI, initMainMenu } from "./gui";
import { Physics } from "./Physics";
import { Player } from "./player/Player";
import { World } from "./world/World";
import { SkyManager, sunSettings } from "./sky";
import { updateRenderInfoGUI, updateStats } from "./dev";
import audioManager from "./audio/AudioManager";
import { initOrbitCamera, updateOrbitControls } from "./dev/orbitCamera";

export default class Game {
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
    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x80abfe);

    const wrap = document.getElementById('canvas_wrap');
    wrap?.appendChild(this.renderer.domElement);

    const { orbitCamera, controls } = initOrbitCamera(this.renderer);
    this.orbitCamera = orbitCamera;
    this.controls = controls;

    // Skybox
    this.skyManager = new SkyManager(this.scene);
    
    this.world = new World(0, this.scene);
    this.scene.add(this.world);

    this.player = new Player(this.scene, this.world);
    this.physics = new Physics(this.scene);

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

  onWindowResize() {
    this.orbitCamera.aspect = window.innerWidth / window.innerHeight;
    this.orbitCamera.updateProjectionMatrix();
    this.player.camera.aspect = window.innerWidth / window.innerHeight;
    this.player.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  draw() {
    const currentTime = performance.now();
    const deltaTime = (currentTime - this.previousTime) / 1000;

    requestAnimationFrame(() => {
      this.draw();
    });

    // TODO 更新天空应该放置在更新世界中
    this.skyManager.updateSkyColor(this.clock, this.player);

    // 更新物理模拟
    this.physics.update(deltaTime, this.player, this.world);

    // 更新世界 chunk
    this.world.update(this.player);

    // update triangle count
    updateRenderInfoGUI(this.renderer);
    updateStats();

    TWEEN.update();

    // player.controls.isLocked === true 第一人称模式
    // player.controls.isLocked === false 观察者模式
    this.renderer.render(
      this.scene,
      this.player.controls.isLocked ? this.player.camera : this.orbitCamera
    );
    // 更新观察相机位置和目标位置
    updateOrbitControls(this.orbitCamera, this.controls, this.player);

    this.previousTime = currentTime;
  }
}
