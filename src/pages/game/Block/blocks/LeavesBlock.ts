import { Block, RenderGeometry } from "../base/Block";
import { BlockID } from "..";
import { LeavesMaterial, combineLeaveMaterial } from "../../engine/material";
import { ItemImage } from "../../gui/items";
import { DevControl } from "../../dev";

/**@desc 树叶方块 */
export class LeavesBlock extends Block {
  id = BlockID.Leaves;
  material = DevControl.instanceMerge ? combineLeaveMaterial : LeavesMaterial;
  uiTexture = ItemImage.leaves;
  geometry = RenderGeometry.Cube;
  transparent = true;
  canPassThrough = false;
  canDrop = true;
  breakCount = 1;
}

export const getEmptyLeaveBlockData = () => {
  return {
    blockId: BlockID.Leaves,
    instanceIds: [],
    blockData: {
      breakCount: 1,
    },
  }
}