import * as THREE from "three";
import { ScreenViewer } from "../gui/viewer";
import { PlayerParams } from "./literal";
import { worldToCeilBlockCoord, worldToChunkCoords } from "../world/chunk/utils";
import { updateBlockCoordGUI, updateChunkCoordGUI, updateWorldBlockCoordGUI } from "../dev";

export function initPlayerCamera() {
    return new THREE.PerspectiveCamera(
        70,
        ScreenViewer.width / ScreenViewer.height,
        0.1,
        5000
      );
}

export function updatePlayerCoords() {
  const { x, y, z } = PlayerParams.position;
  const { chunk, block } = worldToChunkCoords(x, y, z);
  const ceilBlockCoords = worldToCeilBlockCoord(block.x, block.y, block.z);
  const ceilWorldBlockCoord = worldToCeilBlockCoord(x, y, z);
  updateChunkCoordGUI(chunk.x, chunk.z);
  updateBlockCoordGUI(ceilBlockCoords[0], ceilBlockCoords[1], ceilBlockCoords[2]);
  updateWorldBlockCoordGUI(ceilWorldBlockCoord[0], ceilWorldBlockCoord[1], ceilWorldBlockCoord[2]);
}