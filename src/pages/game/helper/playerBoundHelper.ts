import * as THREE from "three";
import { PlayerParams } from "../player/literal";

function initBoundsHelper() {
    const { radius, height } = PlayerParams;
    return new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, height, 16),
    new THREE.MeshBasicMaterial({ wireframe: true })
  );
}

export const boundsHelper = initBoundsHelper();