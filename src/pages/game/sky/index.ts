import * as THREE from "three";
import { fragmentShader, vertexShader } from "./shader";
import { AmbientIntensity, SunSettings, uniforms } from "./literal";
import { GameTimeManager, hourDuration, ShadowUpdateDuration } from "../time";
import { getBottomColor, getTopColor } from "./utils";
import { PlayerParams } from "../player/literal";

/** @desc sun、ambient、fog */
export class SkyManager {
  scene!: THREE.Scene;
  sky!: THREE.Mesh;
  sun!: THREE.DirectionalLight;
  sunHelper!: THREE.DirectionalLightHelper;
  shadowHelper!: THREE.CameraHelper;
  private lastShadowUpdate = 0;
  private ambient!: THREE.AmbientLight;
  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.initSky(scene);
    this.initLight(scene);
    this.updateSun();
  }

  initSky(scene: THREE.Scene) {
    // TODO. 后续需要优化天空盒 跟随用户移动
    const skyGeo = new THREE.SphereGeometry(4000, 32, 15);
    const skyMat = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: uniforms,
      side: THREE.BackSide,
    });
    this.sky = new THREE.Mesh(skyGeo, skyMat);
    scene.add(this.sky);

    scene.fog = new THREE.Fog(0x80a0e0, 50, 100);
    scene.fog.color.copy(uniforms.bottomColor.value);
  }

  initLight(scene: THREE.Scene) {
    const sun = new THREE.DirectionalLight();
    // this.sun.position.set(50, 50, 50);
    sun.intensity = 1.5;
    sun.castShadow = true;
    sun.shadow.bias = -0.002; // 调整深度偏差
    // sun.shadow.normalBias = 0.05; // 调整法线偏差

    // Set the size of the sun's shadow box
    sun.shadow.camera.left = -64;
    sun.shadow.camera.right = 64;
    sun.shadow.camera.top = 64;
    sun.shadow.camera.bottom = -64;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 500;
    // sun.shadow.bias = -0.005;
    // 阴影贴图不建议过小：512×512 分辨率在手动更新时，像素差异较明显，易出现轻微闪烁，1024×1024 是最低无闪烁分辨率，2048×2048 为最优。
    sun.shadow.mapSize = new THREE.Vector2(512, 512);
    // sun.shadow.mapSize = new THREE.Vector2(1024, 1024);

    scene.add(sun);
    scene.add(sun.target);

    const sunHelper = new THREE.DirectionalLightHelper(sun);
    sunHelper.visible = false;
    scene.add(sunHelper);

    const shadowHelper = new THREE.CameraHelper(sun.shadow.camera);
    shadowHelper.visible = false;
    scene.add(shadowHelper);

    const ambient = new THREE.AmbientLight();
    ambient.intensity = 0;
    this.ambient = ambient;
    scene.add(ambient);

    this.sun = sun;
    this.sunHelper = sunHelper;
    this.shadowHelper = shadowHelper;
    return { sun, sunHelper, shadowHelper };
  }

  update() {
    const { topColor, sunIntensity } = getTopColor();
    this.sun.intensity = sunIntensity; 
    
    const skyMaterial = this.sky.material as THREE.ShaderMaterial;
    const bottomColor = getBottomColor();
    skyMaterial.uniforms.topColor.value = topColor;
    skyMaterial.uniforms.bottomColor.value = bottomColor;

    // Desaturate the fog slightly
    this.scene.fog?.color.copy(topColor).multiplyScalar(0.2);

    // 凌晨 4 点到晚上 20 点, 太阳角度变化
    // const anglePreSecond = Math.PI / (SunSettings.cycleLength * (16 / 24));
    if (performance.now() - this.lastShadowUpdate < ShadowUpdateDuration) return;
    this.updateSun();
    GameTimeManager.updateDayHourGUI();
    this.lastShadowUpdate = performance.now();
  }

  /**
   * @desc 更新太阳的角度和环境光亮度
   * 6 点钟 开始 日出
   * 14 点钟 太阳垂直向上 90 度的位置
   * 18 点钟 开始 日落
   * 20 点钟 开始 晚上开始
   */
  private updateSun() { 
    const dayTime = GameTimeManager.currentDayTime;
    if (!PlayerParams.playerInstance) return;
    let angle = -1;
    if(dayTime < 4 * hourDuration || dayTime > 20 * hourDuration) {
      angle = -1;
    } else {
      const sunAngle =  (dayTime - 4 * hourDuration) / (16 * hourDuration) * Math.PI;
      angle = sunAngle;
    }

    // 更新亮度
    if (this.ambient) {
      this.ambient.intensity = AmbientIntensity * Math.sin(Math.max(angle, 0)) + 0.2;
    }
    
    const sunX = SunSettings.distance * Math.cos(angle); // Calculate the X position of the sun
    const sunY = SunSettings.distance * Math.sin(angle); // Calculate the Y position of the sun
    const playerPosition = PlayerParams.position;

    this.sun.position.set(sunX, sunY, playerPosition.z); // Update the position of the sun
    this.sun.position.add(playerPosition);

    this.sun.target.position.copy(playerPosition);
    this.sun.target.updateMatrixWorld();

    if (this.sunHelper.visible) {
      this.sunHelper.update();
    }
    if (this.shadowHelper.visible) {
      this.shadowHelper.update();
    }
  }
}