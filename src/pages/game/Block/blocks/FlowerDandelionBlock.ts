import { Block, RenderGeometry } from "../base/Block";
import { BlockID } from "..";
import { FlowerDandelionMaterial } from "../../engine/material";
import { ItemImage } from "../../gui/items";

/**@desc 蒲公英花 */
export class FlowerDandelionBlock extends Block {
  id = BlockID.FlowerDandelion;
  material = FlowerDandelionMaterial;
  uiTexture = ItemImage.flowerDandelion;
  geometry = RenderGeometry.Flower;
  transparent = true;
  canPassThrough = true;
  canDrop = true;
  breakCount = 1;
  dropBlockId = BlockID.FlowerDandelion;
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
