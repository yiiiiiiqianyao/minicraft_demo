import { Block, RenderGeometry } from "../base/Block";
import { uiTextures } from "../textures";
import { BlockID } from "..";
import { FlowerRoseMaterial } from "../../engine/material";


/**@desc 玫瑰花 */
export class FlowerRoseBlock extends Block {
  id = BlockID.FlowerRose;
  material = FlowerRoseMaterial;
  uiTexture = uiTextures.flowerRose;
  geometry = RenderGeometry.Flower;
  transparent = true;
  canPassThrough = true;
  canDrop = true;
}
