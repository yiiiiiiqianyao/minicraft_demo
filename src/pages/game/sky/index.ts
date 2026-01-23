import * as THREE from "three";
import { fragmentShader, vertexShader } from "./shader";
import { SunSettings, uniforms } from "./literal";
import { GameTimeManager, hourDuration, ShadowUpdateDuration } from "../time";
import { getBottomColor, getTopColor } from "./utils";
import { PlayerParams } from "../player/literal";

export class SkyManager {
  scene!: THREE.Scene;
  sky!: THREE.Mesh;
  sun!: THREE.DirectionalLight;
  sunHelper!: THREE.DirectionalLightHelper;
  shadowHelper!: THREE.CameraHelper;
  private lastShadowUpdate = 0;
  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.initSky(scene);
    this.initLight(scene);
  }

  initSky(scene: THREE.Scene) {
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

    // Set the size of the sun's shadow box
    sun.shadow.camera.left = -80;
    sun.shadow.camera.right = 80;
    sun.shadow.camera.top = 80;
    sun.shadow.camera.bottom = -80;
    sun.shadow.camera.near = 0.1;
    sun.shadow.camera.far = 600;
    sun.shadow.bias = -0.005;
    sun.shadow.mapSize = new THREE.Vector2(512, 512);

    scene.add(sun);
    scene.add(sun.target);

    const sunHelper = new THREE.DirectionalLightHelper(sun);
    sunHelper.visible = false;
    scene.add(sunHelper);

    const shadowHelper = new THREE.CameraHelper(sun.shadow.camera);
    shadowHelper.visible = false;
    scene.add(shadowHelper);

    const ambient = new THREE.AmbientLight();
    ambient.intensity = 0.2;
    scene.add(ambient);

    this.sun = sun;
    this.sunHelper = sunHelper;
    this.shadowHelper = shadowHelper;
    return { sun, sunHelper, shadowHelper };
  }

  updateSunPosition(angle: number) { 
    if (PlayerParams.playerInstance) {
      const sunX = SunSettings.distance * Math.cos(angle); // Calculate the X position of the sun
      const sunY = SunSettings.distance * Math.sin(angle); // Calculate the Y position of the sun
      const playerPosition = PlayerParams.position;

      this.sun.position.set(sunX, sunY, playerPosition.z); // Update the position of the sun
      this.sun.position.add(playerPosition);

      this.sun.target.position.copy(playerPosition);
      this.sun.target.updateMatrixWorld();

      this.sunHelper.update();
      this.shadowHelper.update();
    }
  }

  updateSkyColor() {
    const { topColor, sunIntensity } = getTopColor();
    this.sun.intensity = sunIntensity; 
    
    const bottomColor = getBottomColor();
    
    const skyMaterial = this.sky.material as THREE.ShaderMaterial;
    skyMaterial.uniforms.topColor.value = topColor;
    skyMaterial.uniforms.bottomColor.value = bottomColor;

    // Desaturate the fog slightly
    this.scene.fog?.color.copy(topColor).multiplyScalar(0.2);

    // 凌晨 4 点到晚上 20 点, 太阳角度变化
    // const anglePreSecond = Math.PI / (SunSettings.cycleLength * (16 / 24));
    if (performance.now() - this.lastShadowUpdate < ShadowUpdateDuration) return;
    /**
     * @desc 计算太阳的角度
     * 6 点钟 开始 日出
     * 14 点钟 太阳垂直向上 90 度的位置
     * 18 点钟 开始 日落
     * 20 点钟 开始 晚上开始
     */
    const dayTime = GameTimeManager.currentDayTime;
    if(dayTime < 4 * hourDuration || dayTime > 20 * hourDuration) {
      this.updateSunPosition(-1);
    } else {
      const sunAngle =  (dayTime - 4 * hourDuration) / (16 * hourDuration) * Math.PI;
      this.updateSunPosition(sunAngle);
    }
    GameTimeManager.updateDayHourGUI();

    this.lastShadowUpdate = performance.now();
  }
}