import { ScreenViewer } from "../gui/viewer";
import * as THREE from "three";
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