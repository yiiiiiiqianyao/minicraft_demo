import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { swapMenuScreenGUI, ToolBar } from "./gui";
import { Player } from "./player/Player";
import { World } from "./world/World";
import { SkyManager } from "./sky";
import { AudioManager } from "./audio/AudioManager";
import { initOrbitCamera, updateOrbitControls } from "./dev/orbitCamera";
import { ScreenViewer } from "./gui/viewer";
import { Physics } from "./physics";
import { Engine } from "./engine";
import { PhysicsParams } from "./physics/literal";
import { PlayerInitPosition } from "./player/literal";
import { GameTimeManager, hourDuration } from "./time";
import { DevControl, initStats } from "./dev";
import { EventSystem } from "../EventSystem";
import { isMobile } from "../utils";
import { GameState, RenderView } from "./constant";
import { getRenderCamera } from "./engine/draw";

/**@desc 游戏主类入口 */
export default class Game {
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private orbitCamera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;
  private skyManager!: SkyManager;
  private world!: World;
  private player!: Player;
  private physics!: Physics;

  constructor() {
    this.registerEvents();
  }

  registerEvents() {
    EventSystem.subscribe('StartGame', () => {
      if (isMobile()) {
        alert("移动端暂不支持打开游戏，请在PC端打开游戏");
        return;
      } else {
        this.initScene();
        window.addEventListener("resize", this.onWindowResize, false);
        AudioManager.play("gui.button.press");
      }
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
    GameTimeManager.start();
    this.world.onLoad = () => {
      this.onStart();
    }

    // 开始绘制游戏循环
    this.draw();
  }

  private onWindowResize = () => {
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
    const deltaTime = GameTimeManager.update();
    // TODO 更新天空应该放置在更新世界中
    this.skyManager.updateSkyColor();

    // 更新物理模拟
    this.physics.update(deltaTime);

    // 更新世界 chunk
    this.world.update();
    TWEEN.update();

    // update triangle count
    DevControl.update(this.renderer);
  
    const renderCamera = getRenderCamera(this.player, this.orbitCamera);
    this.renderer.render(this.scene, renderCamera);

    if (renderCamera.userData.type === RenderView.ThirdPerson) {
      // 更新观察相机位置和目标位置
      updateOrbitControls(this.orbitCamera, this.controls, this.player);
    } else if (this.player.boundsHelper.visible) {
      // 隐藏玩家 boundsHelper
      this.player.boundsHelper.visible = false;
    }

    requestAnimationFrame(() => {
      this.draw();
    });
  }


  /**@desc world chunk 初始化完成后 开始游戏*/
  private onStart() {
    GameState.isStarted = true;
    // Tip: 设置游戏开始时间 12 点
    GameTimeManager.startDayTime = hourDuration * 12;
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
    // 播放背景音乐
    AudioManager.playBGM();
    // 初始化统计信息
    initStats();
    // 广播游戏加载完成事件
    EventSystem.broadcast('GameLoaded');
  }
}
