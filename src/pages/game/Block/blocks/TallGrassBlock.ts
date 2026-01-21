import { Block, RenderGeometry } from "../base/Block";
import { uiTextures } from "../textures";
import { BlockID } from "..";
import { TallGrassMaterial } from "../../engine/material";


/**@desc 长草方块 */
export class TallGrassBlock extends Block {
  id = BlockID.TallGrass;
  material = TallGrassMaterial;
  uiTexture = uiTextures.tallGrass;
  geometry = RenderGeometry.Cross;
  transparent = true;
  canPassThrough = true;
  canDrop = false;
}
