import { Block, RenderGeometry } from "../base/Block";
import { uiTextures } from "../textures";

import { BlockID } from "..";
import { DirtBlockMaterial } from "../../engine/material";

/**@desc Dirt block */
export class DirtBlock extends Block {
  id = BlockID.Dirt;
  material = DirtBlockMaterial;
  uiTexture = uiTextures.dirt;
  geometry = RenderGeometry.Cube;
  transparent = false;
  canPassThrough = false;
  canDrop = true;
}
