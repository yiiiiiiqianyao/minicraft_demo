import { Block, RenderGeometry } from "../base/Block";
import { BlockID } from "..";
import { GrassBlockMaterial } from "../../engine/material";
import { ItemImage } from "../../gui/items";

/**@desc 草地方块 */
export class GrassBlock extends Block {
  id = BlockID.Grass;
  material = GrassBlockMaterial;
  uiTexture = ItemImage.grass;
  geometry = RenderGeometry.Cube;
  transparent = false;
  canPassThrough = false;
  canDrop = true;
}
