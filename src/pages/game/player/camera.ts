import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";
import { ScreenViewer } from "../gui/viewer";
import { PlayerInitPosition } from "./literal";
import { Layers } from "../engine";
export function initPlayerCamera() {
    const camera = new THREE.PerspectiveCamera(
    70,
    ScreenViewer.width / ScreenViewer.height,
    0.1,
    5000
    );

    camera.position.copy(PlayerInitPosition);
    camera.layers.disableAll();
    camera.layers.enable(Layers.Zero);
    camera.layers.enable(Layers.One);
    return camera;
}


let lastIsSprinting = false;
/**@desc 更新 player 角色相机的 FOV */
export function updateCameraFOV(camera: THREE.PerspectiveCamera, isSprinting: boolean) {
    // 避免重复更新
    if (lastIsSprinting === isSprinting) return;
    lastIsSprinting = isSprinting;

    const currentFov = { fov: camera.fov };
    const targetFov = isSprinting ? 80 : 70;
    const update = () => {
        camera.fov = currentFov.fov;
        camera.updateProjectionMatrix();
    };
    new TWEEN.Tween(currentFov)
        .to({ fov: targetFov }, 150)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(update)
        .start();
}