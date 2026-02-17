import { Block, RenderGeometry } from "../base/Block";
import { BlockID } from "..";
import { CrossPlantMaterial } from "../../engine/material";
import { ItemImage } from "../../gui/items";
import { DropLimit } from "../../world/drop/literal";

/**@desc 短草方块 */
export class ShortGrassBlock extends Block {
  id = BlockID.ShortGrass;
  material = CrossPlantMaterial;
  // TODO 后续替换 目前没有用到
  uiTexture = ItemImage.tallGrass;
  geometry = RenderGeometry.Cross;
  transparent = true;
  canPassThrough = true;
  canDrop = false;
  breakCount = 1;
  dropBlockId = undefined;
  dropLimit = DropLimit;
  /**@desc 当前方块是否可交互 */
  interactive = true;
}

export const getEmptyShortGrassBlockData = () => {
  return {
    blockId: BlockID.ShortGrass,
    instanceIds: [],
    blockData: {
      breakCount: 1,
    },
  }
}
