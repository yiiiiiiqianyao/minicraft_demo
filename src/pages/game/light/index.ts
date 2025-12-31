import * as THREE from "three";
export function initLight(scene: THREE.Scene) {
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

    return { sun, sunHelper, shadowHelper };
}