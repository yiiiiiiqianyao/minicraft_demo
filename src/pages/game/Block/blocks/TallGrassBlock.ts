import { Block, RenderGeometry } from "../base/Block";
import { BlockID } from "..";
import { CrossPlantMaterial } from "../../engine/material";
import { ItemImage } from "../../gui/items";
import { DropLimit } from "../../world/drop/literal";


/**@desc 长草方块 */
export class TallGrassBlock extends Block {
  id = BlockID.TallGrass;
  material = CrossPlantMaterial;
  uiTexture = ItemImage.tallGrass;
  geometry = RenderGeometry.Cross;
  transparent = true;
  canPassThrough = true;
  canDrop = false;
  breakCount = 1;
  dropBlockId = undefined;
  dropLimit = DropLimit;
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
