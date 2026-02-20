import { Block, RenderGeometry } from "../base/Block";
import { BlockID } from "..";
import { LeavesMaterial } from "../../engine/material";
import { ItemImage } from "../../gui/items";
import { DropLimit } from "../../world/drop/literal";

// TODO 需要增加白桦树的树叶
/**@desc 橡木树叶方块 */
export class OakLeavesBlock extends Block {
  id = BlockID.OakLeaves;
  material = LeavesMaterial;
  uiTexture = ItemImage.leaves;
  geometry = RenderGeometry.Cube;
  transparent = true;
  canPassThrough = false;
  canDrop = true;
  breakCount = 1;
  // TODO 树叶方块可能掉落苹果 和树苗
  dropBlockId = undefined;
  dropLimit = DropLimit;
  /**@desc 当前方块是否可交互 */
  interactive = true;
  uvRange = undefined;
}

export const getEmptyOakLeaveBlockData = () => {
  return {
    blockId: BlockID.OakLeaves,
    instanceIds: [],
    blockData: {
      breakCount: 1,
    },
  }
}