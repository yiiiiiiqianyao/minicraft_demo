import { Block, RenderGeometry } from "../base/Block";
import { BlockID } from "..";
import { ItemImage } from "../../gui/items";
import { BedrockMaterial } from "../../engine/material";

/**@desc 基岩石块 */
export class BedrockBlock extends Block {
  id = BlockID.Bedrock;
  material = BedrockMaterial;
  uiTexture = ItemImage.bedrock;
  geometry = RenderGeometry.Cube;
  transparent = false;
  canPassThrough = false;
  canDrop = false;
}
