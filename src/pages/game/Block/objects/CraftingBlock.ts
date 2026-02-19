import { Block, RenderGeometry } from "../base/Block";
import { BlockID } from "..";
import { CraftingTableMaterial } from "../../engine/material";
import { ItemImage } from "../../gui/items";
import { DropLimit } from "../../world/drop/literal";

/**@desc 工作台方块 */
export class CraftBlock extends Block {
  id = BlockID.CraftingTable;
  material = CraftingTableMaterial;
  uiTexture = ItemImage.craftingTable;
  geometry = RenderGeometry.Cube;
  transparent = false;
  canPassThrough = false;
  canDrop = true;
  breakCount = 5;
  /**@desc 工作台方块被破坏后掉落的工作台方块 */
  dropBlockId = BlockID.CraftingTable;
  dropLimit = DropLimit;
  /**@desc 当前方块是否可交互 */
  interactive = true;
  uvRange = undefined;
}

export const getEmptyCraftBlockData = () => {
  return {
    blockId: BlockID.CraftingTable,
    instanceIds: [],
    blockData: {
      breakCount: 5,
    },
  }
}
