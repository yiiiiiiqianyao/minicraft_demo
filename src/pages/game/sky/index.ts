import * as THREE from "three";
import { Player } from "../player/Player";
import { fragmentShader, vertexShader } from "./shader";
import { dayColor, nightColor, sunsetColor, sunSettings, uniforms } from "./literal";

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

  updateSunPosition(angle: number, player: Player) {
    const sunX = sunSettings.distance * Math.cos(angle); // Calculate the X position of the sun
    const sunY = sunSettings.distance * Math.sin(angle); // Calculate the Y position of the sun
    this.sun.position.set(sunX, sunY, player.camera.position.z); // Update the position of the sun
    this.sun.position.add(player.camera.position);

    this.sun.target.position.copy(player.camera.position);
    this.sun.target.updateMatrixWorld();

    this.sunHelper.update();
    this.shadowHelper.update();
  }

  updateSkyColor(clock: THREE.Clock, player: Player) {
    const elapsedTime = clock.getElapsedTime();
    const cycleDuration = sunSettings.cycleLength; // Duration of a day in seconds
    const cycleTime = elapsedTime % cycleDuration;
    const { sun, sky } = this;
    let topColor: THREE.Color;
    let bottomColor: THREE.Color;

    if (cycleTime < cycleDuration / 2) {
      // Day time
      topColor = dayColor
        .clone()
        .lerp(nightColor, cycleTime / (cycleDuration / 2));
      sun.intensity = 1 - cycleTime / (cycleDuration / 2); // Sun intensity decreases as the day progresses
    } else {
      // Night time
      topColor = nightColor
        .clone()
        .lerp(
          dayColor,
          (cycleTime - cycleDuration / 2) / (cycleDuration / 2)
        );
      sun.intensity =
        (cycleTime - cycleDuration / 2) / (cycleDuration / 2); // Sun intensity increases as the night progresses
    }

    const dayStart = 0;
    const sunsetStart = cycleDuration * 0.4; // Start sunset at 40% of the cycle
    const nightStart = cycleDuration * 0.5; // Start night at 50% of the cycle
    const sunriseStart = cycleDuration * 0.9; // Start sunrise at 90% of the cycle

    if (cycleTime >= dayStart && cycleTime < sunsetStart) {
      // Day time
      bottomColor = dayColor
        .clone()
        .lerp(
          sunsetColor,
          (cycleTime - dayStart) / (sunsetStart - dayStart)
        );
    } else if (cycleTime >= sunsetStart && cycleTime < nightStart) {
      // Sunset
      bottomColor = sunsetColor
        .clone()
        .lerp(
          nightColor,
          (cycleTime - sunsetStart) / (nightStart - sunsetStart)
        );
    } else if (cycleTime >= nightStart && cycleTime < sunriseStart) {
      // Night time
      bottomColor = nightColor
        .clone()
        .lerp(
          sunsetColor,
          (cycleTime - nightStart) / (sunriseStart - nightStart)
        );
    } else {
      // Sunrise
      bottomColor = sunsetColor
        .clone()
        .lerp(
          dayColor,
          (cycleTime - sunriseStart) / (cycleDuration - sunriseStart)
        );
    }

    (sky.material as THREE.ShaderMaterial).uniforms.topColor.value = topColor;
    (sky.material as THREE.ShaderMaterial).uniforms.bottomColor.value = bottomColor;

    // Desaturate the fog slightly
    this.scene.fog?.color.copy(topColor).multiplyScalar(0.2);

    if (performance.now() - this.lastShadowUpdate < sunSettings.cycleLength) return;

    const sunAngle =
      ((2 * Math.PI) / cycleDuration) * (cycleTime + cycleDuration / 6); // Calculate the angle of the sun based on the cycle time with a phase shift of T/4
    this.updateSunPosition(sunAngle, player);

    this.lastShadowUpdate = performance.now();
  }
}