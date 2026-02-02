import { Block, RenderGeometry } from "../base/Block";
import { BlockID } from "..";
import { OkaLogMaterial } from "../../engine/material";
import { ItemImage } from "../../gui/items";

/**@desc 橡木原木块 */
export class OakLogBlock extends Block {
  id = BlockID.OakLog;
  material = OkaLogMaterial;
  uiTexture = ItemImage.oakLog;
  geometry = RenderGeometry.Tree;
  transparent = false;
  canPassThrough = false;
  canDrop = true;
  breakCount = 10;
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
