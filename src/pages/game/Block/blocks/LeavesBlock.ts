import * as THREE from "three";

import { Block, RenderGeometry } from "../base/Block";
import { textures, uiTextures } from "../textures";

import { BlockID } from "..";

const leavesMaterial = new THREE.MeshLambertMaterial({
  map: textures.leaves,
});
leavesMaterial.transparent = true;
leavesMaterial.side = THREE.DoubleSide;

/**@desc 树叶方块 */
export class LeavesBlock extends Block {
  id = BlockID.Leaves;
  material = leavesMaterial;
  uiTexture = uiTextures.leaves;
  geometry = RenderGeometry.Cube;
  transparent = true;
  canPassThrough = false;
  canDrop = true;
}
