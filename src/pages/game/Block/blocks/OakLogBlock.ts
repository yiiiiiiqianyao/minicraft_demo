import { Block, RenderGeometry } from "../base/Block";
import { BlockID } from "..";
import { TreeMaterial } from "../../engine/material";
import { ItemImage } from "../../gui/items";

/**@desc 橡木原木块 */
export class OakLogBlock extends Block {
  id = BlockID.OakLog;
  material = TreeMaterial;
  uiTexture = ItemImage.oakLog;
  geometry = RenderGeometry.Tree;
  transparent = false;
  canPassThrough = false;
  canDrop = true;
  breakCount = 10;
  /**@desc 橡木原木块被破坏后掉落的原木方块 */
  dropBlockId = BlockID.OakLog;
}

export const getEmptyOkaBlockData = () => {
    return {
    blockId: BlockID.OakLog,
    instanceIds: [],
    blockData: {
      breakCount: 10,
    },
  }
}
