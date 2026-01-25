import { Block, RenderGeometry } from "../base/Block";
import { uiTextures } from "../textures";
import { BlockID } from "..";
import { OkaLogMaterial } from "../../engine/material";

/**@desc 橡木原木块 */
export class OakLogBlock extends Block {
  id = BlockID.OakLog;
  material = OkaLogMaterial;
  uiTexture = uiTextures.oakLog;
  geometry = RenderGeometry.Cube;
  transparent = false;
  canPassThrough = false;
  canDrop = true;
}
