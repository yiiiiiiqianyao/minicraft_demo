import { Block, RenderGeometry } from "../base/Block";
import { BlockID } from "..";
import { CrossPlantMaterial } from "../../engine/material";
import { ItemImage } from "../../gui/items";
import { DropLimit } from "../../world/drop/literal";

/**@desc 蒲公英花 */
export class FlowerDandelionBlock extends Block {
  id = BlockID.FlowerDandelion;
  material = CrossPlantMaterial;
  uiTexture = ItemImage.flowerDandelion;
  geometry = RenderGeometry.Cross;
  transparent = true;
  canPassThrough = true;
  canDrop = true;
  breakCount = 1;
  dropBlockId = BlockID.FlowerDandelion;
  dropLimit = DropLimit + 0.25;
  /**@desc 当前方块是否可交互 */
  interactive = true;
}

export const getEmptyFlowerDandelionBlockData = () => {
  return {
    blockId: BlockID.FlowerDandelion,
    instanceIds: [],
    blockData: {
      breakCount: 1,
    },
  }
}
