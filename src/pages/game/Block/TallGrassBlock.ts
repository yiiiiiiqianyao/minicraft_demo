import * as THREE from "three";

import { Block, RenderGeometry } from "./Block";
import { textures, uiTextures } from "./textures";

import { BlockID } from ".";

const tallGrassMaterial = new THREE.MeshBasicMaterial({
  map: textures.tallGrass,
});
// TODO: 修改草的贴图，使草的贴图和实际大小保持一致

tallGrassMaterial.transparent = true;
tallGrassMaterial.side = THREE.DoubleSide;
tallGrassMaterial.depthWrite = false;

/**@desc 长草方块 */
export class TallGrassBlock extends Block {
  id = BlockID.TallGrass;
  material = tallGrassMaterial;
  uiTexture = uiTextures.tallGrass;
  geometry = RenderGeometry.Cross;
  transparent = true;
  canPassThrough = true;
  canDrop = false;
}
