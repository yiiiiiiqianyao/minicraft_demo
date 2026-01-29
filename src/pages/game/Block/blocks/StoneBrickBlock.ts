import { Block, RenderGeometry } from "../base/Block";
import { BlockID } from "..";
import { ItemImage } from "../../gui/items";
import { StoneBrickMaterial } from "../../engine/material";

/**@desc 石头砖方块 */
export class StoneBrickBlock extends Block {
  id = BlockID.StoneBrick;
  material = StoneBrickMaterial;
  uiTexture = ItemImage.stoneBrick;
  geometry = RenderGeometry.Cube;
  transparent = false;
  canPassThrough = false;
  canDrop = true;
  breakCount = 1;
}
