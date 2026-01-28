import { Block, RenderGeometry } from "../base/Block";
import { uiTextures } from "../textures";
import { BlockID } from "..";
import { StoneMaterial } from "../../engine/material";

/**@desc 工作台方块 */
export class CraftBlock extends Block {
  id = BlockID.CraftingTable;
  material = StoneMaterial;
  uiTexture = uiTextures.stone;
  geometry = RenderGeometry.Cube;
  transparent = false;
  canPassThrough = false;
  canDrop = true;
}
