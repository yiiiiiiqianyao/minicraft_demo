import { Block, RenderGeometry } from "../base/Block";
import { uiTextures } from "../textures";
import { BlockID } from "..";
import { CraftingTableMaterial } from "../../engine/material";

/**@desc 工作台方块 */
export class CraftBlock extends Block {
  id = BlockID.CraftingTable;
  material = CraftingTableMaterial;
  uiTexture = uiTextures.craftingTable;
  geometry = RenderGeometry.Cube;
  transparent = false;
  canPassThrough = false;
  canDrop = true;
}
