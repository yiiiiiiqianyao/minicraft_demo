import { Block, RenderGeometry } from "../base/Block";
import { uiTextures } from "../textures";
import { BlockID } from "..";
import { GrassBlockMaterial } from "../../engine/material";

/**@desc 草地方块 */
export class GrassBlock extends Block {
  id = BlockID.Grass;
  material = GrassBlockMaterial;
  uiTexture = uiTextures.grass;
  geometry = RenderGeometry.Cube;
  transparent = false;
  canPassThrough = false;
  canDrop = true;
}
