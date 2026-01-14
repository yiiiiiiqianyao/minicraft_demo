import * as THREE from "three";
import { PlayerParams } from "../player/literal";
import { wireframeMaterial } from "../engine/material";

function initBoundsHelper() {
    const { radius, height } = PlayerParams;
    return new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, height, 16),
    wireframeMaterial,
  );
}

export const boundsHelper = initBoundsHelper();