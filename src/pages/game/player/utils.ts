import * as THREE from "three";
import { ScreenViewer } from "../gui/viewer";

export function initPlayerCamera() {
    return new THREE.PerspectiveCamera(
        70,
        ScreenViewer.width / ScreenViewer.height,
        0.1,
        5000
      );
}