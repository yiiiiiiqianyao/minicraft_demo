import { Block, RenderGeometry } from "../base/Block";
import { uiTextures } from "../textures";
import { BlockID } from "..";
import { FlowerDandelionMaterial } from "../../engine/material";

/**@desc 蒲公英花 */
export class FlowerDandelionBlock extends Block {
  id = BlockID.FlowerDandelion;
  material = FlowerDandelionMaterial;
  uiTexture = uiTextures.flowerDandelion;
  geometry = RenderGeometry.Flower;
  transparent = true;
  canPassThrough = true;
  canDrop = true;
}
