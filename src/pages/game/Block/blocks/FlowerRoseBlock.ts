import { Block, RenderGeometry } from "../base/Block";
import { BlockID } from "..";
import { CrossPlantMaterial } from "../../engine/material";
import { ItemImage } from "../../gui/items";
import { DropLimit } from "../../world/drop/literal";


/**@desc 玫瑰花 */
export class FlowerRoseBlock extends Block {
  id = BlockID.FlowerRose;
  material = CrossPlantMaterial;
  uiTexture = ItemImage.flowerRose;
  geometry = RenderGeometry.Cross;
  transparent = true;
  canPassThrough = true;
  canDrop = true;
  breakCount = 1;
  dropBlockId = BlockID.FlowerRose;
  dropLimit = DropLimit + 0.25;
  /**@desc 当前方块是否可交互 */
  interactive = true;
}

export const getEmptyFlowerRoseBlockData = () => {
  return {
    blockId: BlockID.FlowerRose,
    instanceIds: [],
    blockData: {
      breakCount: 1,
    },
  }
}

