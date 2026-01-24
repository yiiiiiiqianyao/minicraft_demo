import * as THREE from "three";
import { PlayerParams } from "../player/literal";
import { wireframeMaterial } from "../engine/material";
import { GameLayers } from "../engine";

export function initBoundsHelper() {
  const { radius, height } = PlayerParams;
  const boundsHelper = new THREE.Mesh(
  new THREE.CylinderGeometry(radius, radius, height, 16),
  wireframeMaterial,
  );
  boundsHelper.layers.set(GameLayers.One);
  return boundsHelper;
}


/**
 *@desc Update the player's bounding cylinder helper
*/
export function updateBoundsHelper(position: THREE.Vector3, boundsHelper: THREE.Mesh) {
  boundsHelper.position.copy(position);
  boundsHelper.position.y -= PlayerParams.height / 2;
}