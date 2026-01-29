import { Block, RenderGeometry } from "../base/Block";
import { BlockID } from "..";
import { StoneMaterial } from "../../engine/material";
import { ItemImage } from "../../gui/items";

/**@desc 石头方块 */
export class StoneBlock extends Block {
  id = BlockID.Stone;
  material = StoneMaterial;
  uiTexture = ItemImage.stone;
  geometry = RenderGeometry.Cube;
  transparent = false;
  canPassThrough = false;
  canDrop = true;
  breakCount = 1;
}
