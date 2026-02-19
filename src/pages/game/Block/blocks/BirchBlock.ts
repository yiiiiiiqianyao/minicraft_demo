import { Block, RenderGeometry } from "../base/Block";
import { BlockID } from "..";
import { TreeMaterial } from "../../engine/material";
import { ItemImage } from "../../gui/items";
import { DropLimit } from "../../world/drop/literal";

/**@desc 白桦木原木块 */
export class BirchBlock extends Block {
  id = BlockID.BirchLog;
  material = TreeMaterial;
  uiTexture = ItemImage.birchLog;
  geometry = RenderGeometry.Tree;
  transparent = false;
  canPassThrough = false;
  canDrop = true;
  breakCount = 10;
  dropBlockId = BlockID.BirchLog;
  dropLimit = DropLimit;
  /**@desc 当前方块是否可交互 */
  interactive = true;
  uvRange = undefined;
}

export const getEmptyBirchBlockData = () => {
    return {
    blockId: BlockID.BirchLog,
    instanceIds: [],
    blockData: {
      breakCount: 10,
    },
  }
}
