import { Block, RenderGeometry } from "../base/Block";
import { BlockID } from "..";
import { LeavesMaterial } from "../../engine/material";
import { ItemImage } from "../../gui/items";

/**@desc 树叶方块 */
export class LeavesBlock extends Block {
  id = BlockID.Leaves;
  material = LeavesMaterial;
  uiTexture = ItemImage.leaves;
  geometry = RenderGeometry.Cube;
  transparent = true;
  canPassThrough = false;
  canDrop = true;
}
