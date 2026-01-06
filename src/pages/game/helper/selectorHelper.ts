
import * as THREE from "three";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { ScreenViewer } from "../gui/viewer";

function cuboid(width: number, height: number, depth: number) {
  const hw = width * 0.5;
  const hh = height * 0.5;
  const hd = depth * 0.5;

  const position = [
    [-hw, -hh, -hd],
    [-hw, hh, -hd],
    [hw, hh, -hd],
    [hw, -hh, -hd],
    [-hw, -hh, -hd],

    [-hw, -hh, hd],
    [-hw, hh, hd],
    [-hw, hh, -hd],
    [-hw, hh, hd],

    [hw, hh, hd],
    [hw, hh, -hd],
    [hw, hh, hd],

    [hw, -hh, hd],
    [hw, -hh, -hd],
    [hw, -hh, hd],
    [-hw, -hh, hd],
  ].flat();

  return position;
}

const selectionMaterial = new LineMaterial({
  color: 0x000000,
  opacity: 0.9,
  linewidth: 1,
  resolution: new THREE.Vector2(ScreenViewer.width, ScreenViewer.height),
});
const selectionLineGeometry = new LineGeometry();
selectionLineGeometry.setPositions(cuboid(1.001, 1.001, 1.001));

export const selectionHelper = new Line2(selectionLineGeometry, selectionMaterial);