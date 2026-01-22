import { Block, RenderGeometry } from "../base/Block";
import { uiTextures } from "../textures";
import { BlockID } from "..";
import { StoneMaterial } from "../../engine/material";

/**@desc 石头方块 */
export class StoneBlock extends Block {
  id = BlockID.Stone;
  material = StoneMaterial;
  uiTexture = uiTextures.stone;
  geometry = RenderGeometry.Cube;
  transparent = false;
  canPassThrough = false;
  canDrop = true;
}
