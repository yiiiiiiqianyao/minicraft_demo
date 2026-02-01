import { Block, RenderGeometry } from "../base/Block";
import { BlockID } from "..";
import { oakLogSideMaterial, combineOkaMaterial } from "../../engine/material";
import { ItemImage } from "../../gui/items";
import { DevControl } from "../../dev";

/**@desc 橡木原木块 */
export class OakLogBlock extends Block {
  id = BlockID.OakLog;
  material = DevControl.instanceMerge ? combineOkaMaterial : oakLogSideMaterial;
  uiTexture = ItemImage.oakLog;
  geometry = RenderGeometry.Cube;
  transparent = false;
  canPassThrough = false;
  canDrop = true;
  breakCount = 1;
}
