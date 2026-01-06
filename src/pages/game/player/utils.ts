import * as THREE from "three";
import { PlayerParams } from "./literal";
import { ScreenViewer } from "../gui/viewer";

export function initPlayerCamera() {
    return new THREE.PerspectiveCamera(
        70,
        ScreenViewer.width / ScreenViewer.height,
        0.1,
        5000
      );
}

export function initBoundsHelper() {
    const { radius, height } = PlayerParams;
    return new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, height, 16),
    new THREE.MeshBasicMaterial({ wireframe: true })
  );
}