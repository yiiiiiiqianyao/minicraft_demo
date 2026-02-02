import { Block, RenderGeometry } from "../base/Block";
import { BlockID } from "..";
import { TallGrassMaterial } from "../../engine/material";
import { ItemImage } from "../../gui/items";


/**@desc 长草方块 */
export class TallGrassBlock extends Block {
  id = BlockID.TallGrass;
  material = TallGrassMaterial;
  uiTexture = ItemImage.tallGrass;
  geometry = RenderGeometry.Cross;
  transparent = true;
  canPassThrough = true;
  canDrop = false;
  breakCount = 1;
}

export const getEmptyTallGrassBlockData = () => {
  return {
    blockId: BlockID.TallGrass,
    instanceIds: [],
    blockData: {
      breakCount: 1,
    },
  }
}
