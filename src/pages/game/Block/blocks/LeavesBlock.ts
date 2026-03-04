import { Block, RenderGeometry } from "../base/Block";
import { BlockID } from "..";
import { SingleBlockMaterial } from "../../engine/material";
import { ItemImage } from "../../gui/items";
import { DropLimit } from "../../world/drop/literal";

/**@desc 橡木树叶方块 */
export class OakLeavesBlock extends Block {
  id = BlockID.OakLeaves;
  material = SingleBlockMaterial;
  uiTexture = ItemImage.leaves;
  geometry = RenderGeometry.SingleCube;
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

/**@desc 橡木树叶方块 */
export class BirchLogLeavesBlock extends Block {
  id = BlockID.BirchLeaves;
  material = SingleBlockMaterial;
  uiTexture = ItemImage.leaves;
  geometry = RenderGeometry.SingleCube;
  transparent = true;
  canPassThrough = false;
  canDrop = true;
  breakCount = 1;
  dropBlockId = undefined;
  dropLimit = DropLimit;
  /**@desc 当前方块是否可交互 */
  interactive = true;
  uvRange = undefined;
}

export const getEmptyBirchLogLeaveBlockData = () => {
  return {
    blockId: BlockID.BirchLeaves,
    instanceIds: [],
    blockData: {
      breakCount: 1,
    },
  }
}