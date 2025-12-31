import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { createUI, initMainMenu } from "./gui";
import { Physics } from "./Physics";
import { Player } from "./player/Player";
import { World } from "./world/World";
import { initSky } from "./sky";
import { initLight, sunSettings } from "./light";
import { updateRenderInfoGUI, updateStats } from "./dev";
import audioManager from "./audio/AudioManager";
import { PlayerParams } from "./player/literal";
import { initOrbitCamera, updateOrbitControls } from "./dev/orbitCamera";

export default class Game {
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private orbitCamera!: THREE.PerspectiveCamera;

  private controls!: OrbitControls;
  private clock!: THREE.Clock;

  private sky!: THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>;
  private sun!: THREE.DirectionalLight;
  private sunHelper!: THREE.DirectionalLightHelper;
  private shadowHelper!: THREE.CameraHelper;
  private world!: World;
  private player!: Player;
  private physics!: Physics;

  private previousTime = 0;
  private lastShadowUpdate = 0;

  private dayColor = new THREE.Color(0xc0d8ff);
  private nightColor = new THREE.Color(0x10121e);
  private sunsetColor = new THREE.Color(0xcc7a00);

  constructor() {
    this.previousTime = performance.now();
    this.clock = new THREE.Clock();
    initMainMenu(() => {
      this.initScene();
      this.initListeners();
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
    this.sky = initSky(this.scene);
    this.scene.add(this.sky);

    // init light
    const { sun, sunHelper, shadowHelper } = initLight(this.scene);
    this.sun = sun;
    this.sunHelper = sunHelper;
    this.shadowHelper = shadowHelper;
    
    this.world = new World(0, this.scene);
    this.scene.add(this.world);

    this.player = new Player(this.scene);
    this.physics = new Physics(this.scene);

    this.updateSunPosition(0);

    createUI(
      this.world,
      this.player,
      this.physics,
      this.scene,
      this.renderer,
      sunSettings,
      this.sunHelper,
      this.shadowHelper
    );

    this.draw();
  }

  // 处理鼠标点击事件 目前是移除选中的方块和放置方块
  onMouseDown(event: MouseEvent) {
    if (this.player.controls.isLocked) {
      if (event.button === 0 && this.player.selectedCoords) {
        // Left click 移除选中的方块
        this.world.removeBlock(
          Math.ceil(this.player.selectedCoords.x - 0.5),
          Math.ceil(this.player.selectedCoords.y - 0.5),
          Math.ceil(this.player.selectedCoords.z - 0.5)
        );
      } else if (event.button === 2 && this.player.blockPlacementCoords) {
        // console.log("adding block", this.player.activeBlockId);
        if (this.player.activeBlockId != null) {
          const playerPos = new THREE.Vector3(
            Math.floor(this.player.position.x),
            Math.floor(this.player.position.y) - 1,
            Math.floor(this.player.position.z)
          );
          const blockPos = new THREE.Vector3(
            Math.floor(this.player.blockPlacementCoords.x - 0.5),
            Math.floor(this.player.blockPlacementCoords.y - 0.5),
            Math.floor(this.player.blockPlacementCoords.z - 0.5)
          );

          // 检查是否超出可以放置方块的距离
          if (playerPos.distanceTo(blockPos) <= PlayerParams.radius * 2) return;

          // Right click 放置方块
          this.world.addBlock(
            blockPos.x,
            blockPos.y,
            blockPos.z,
            this.player.activeBlockId
          );
        }
      }
    }
  }

  initListeners() {
    window.addEventListener("resize", this.onWindowResize.bind(this), false);
    document.addEventListener("mousedown", this.onMouseDown.bind(this), false);
  }

  onWindowResize() {
    this.orbitCamera.aspect = window.innerWidth / window.innerHeight;
    this.orbitCamera.updateProjectionMatrix();
    this.player.camera.aspect = window.innerWidth / window.innerHeight;
    this.player.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  updateSkyColor() {
    const elapsedTime = this.clock.getElapsedTime();
    const cycleDuration = sunSettings.cycleLength; // Duration of a day in seconds
    const cycleTime = elapsedTime % cycleDuration;

    let topColor: THREE.Color;
    let bottomColor: THREE.Color;

    if (cycleTime < cycleDuration / 2) {
      // Day time
      topColor = this.dayColor
        .clone()
        .lerp(this.nightColor, cycleTime / (cycleDuration / 2));
      this.sun.intensity = 1 - cycleTime / (cycleDuration / 2); // Sun intensity decreases as the day progresses
    } else {
      // Night time
      topColor = this.nightColor
        .clone()
        .lerp(
          this.dayColor,
          (cycleTime - cycleDuration / 2) / (cycleDuration / 2)
        );
      this.sun.intensity =
        (cycleTime - cycleDuration / 2) / (cycleDuration / 2); // Sun intensity increases as the night progresses
    }

    const dayStart = 0;
    const sunsetStart = cycleDuration * 0.4; // Start sunset at 40% of the cycle
    const nightStart = cycleDuration * 0.5; // Start night at 50% of the cycle
    const sunriseStart = cycleDuration * 0.9; // Start sunrise at 90% of the cycle

    if (cycleTime >= dayStart && cycleTime < sunsetStart) {
      // Day time
      bottomColor = this.dayColor
        .clone()
        .lerp(
          this.sunsetColor,
          (cycleTime - dayStart) / (sunsetStart - dayStart)
        );
    } else if (cycleTime >= sunsetStart && cycleTime < nightStart) {
      // Sunset
      bottomColor = this.sunsetColor
        .clone()
        .lerp(
          this.nightColor,
          (cycleTime - sunsetStart) / (nightStart - sunsetStart)
        );
    } else if (cycleTime >= nightStart && cycleTime < sunriseStart) {
      // Night time
      bottomColor = this.nightColor
        .clone()
        .lerp(
          this.sunsetColor,
          (cycleTime - nightStart) / (sunriseStart - nightStart)
        );
    } else {
      // Sunrise
      bottomColor = this.sunsetColor
        .clone()
        .lerp(
          this.dayColor,
          (cycleTime - sunriseStart) / (cycleDuration - sunriseStart)
        );
    }

    this.sky.material.uniforms.topColor.value = topColor;
    this.sky.material.uniforms.bottomColor.value = bottomColor;

    // Desaturate the fog slightly
    this.scene.fog?.color.copy(topColor).multiplyScalar(0.2);

    if (performance.now() - this.lastShadowUpdate < sunSettings.cycleLength) return;

    const sunAngle =
      ((2 * Math.PI) / cycleDuration) * (cycleTime + cycleDuration / 6); // Calculate the angle of the sun based on the cycle time with a phase shift of T/4
    this.updateSunPosition(sunAngle);

    this.lastShadowUpdate = performance.now();
  }

  updateSunPosition(angle: number) {
    const sunX = sunSettings.distance * Math.cos(angle); // Calculate the X position of the sun
    const sunY = sunSettings.distance * Math.sin(angle); // Calculate the Y position of the sun
    this.sun.position.set(sunX, sunY, this.player.camera.position.z); // Update the position of the sun
    this.sun.position.add(this.player.camera.position);

    this.sun.target.position.copy(this.player.camera.position);
    this.sun.target.updateMatrixWorld();

    this.sunHelper.update();
    this.shadowHelper.update();
  }

  draw() {
    const currentTime = performance.now();
    const deltaTime = (currentTime - this.previousTime) / 1000;

    requestAnimationFrame(() => {
      this.draw();
    });

    // TODO 更新天空应该放置在更新世界中
    this.updateSkyColor();

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
