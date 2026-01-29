import * as THREE from "three";

import { Block, RenderGeometry } from "../base/Block";
import { textures } from "../textures";

import { BlockID } from "..";
import { ItemImage } from "../../gui/items";

const stoneBrickMaterial = new THREE.MeshLambertMaterial({
  map: textures.stoneBrick,
});

/**@desc 石头砖方块 */
export class StoneBrickBlock extends Block {
  id = BlockID.StoneBrick;
  material = stoneBrickMaterial;
  uiTexture = ItemImage.stoneBrick;
  geometry = RenderGeometry.Cube;
  transparent = false;
  canPassThrough = false;
  canDrop = true;
}
