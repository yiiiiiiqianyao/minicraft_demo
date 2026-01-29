import { Block, RenderGeometry } from "../base/Block";
import { BlockID } from "..";
import { FlowerRoseMaterial } from "../../engine/material";
import { ItemImage } from "../../gui/items";


/**@desc 玫瑰花 */
export class FlowerRoseBlock extends Block {
  id = BlockID.FlowerRose;
  material = FlowerRoseMaterial;
  uiTexture = ItemImage.flowerRose;
  geometry = RenderGeometry.Flower;
  transparent = true;
  canPassThrough = true;
  canDrop = true;
  breakCount = 1;
}
