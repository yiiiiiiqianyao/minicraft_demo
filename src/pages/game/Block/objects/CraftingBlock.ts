import { Block, RenderGeometry } from "../base/Block";
import { BlockID } from "..";
import { CraftingTableMaterial } from "../../engine/material";
import { ItemImage } from "../../gui/items";

/**@desc 工作台方块 */
export class CraftBlock extends Block {
  id = BlockID.CraftingTable;
  material = CraftingTableMaterial;
  uiTexture = ItemImage.craftingTable;
  geometry = RenderGeometry.Cube;
  transparent = false;
  canPassThrough = false;
  canDrop = true;
  breakCount = 10;
  /**@desc 工作台方块被破坏后掉落的工作台方块 */
  dropBlockId = BlockID.CraftingTable;
}
