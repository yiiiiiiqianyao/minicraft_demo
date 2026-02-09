import { Block, RenderGeometry } from "../base/Block";
import { BlockID } from "..";
import { StoneMaterial } from "../../engine/material";
import { ItemImage } from "../../gui/items";
import { DropLimit } from "../../world/drop/literal";

/**@desc 石头方块 */
export class StoneBlock extends Block {
  id = BlockID.Stone;
  material = StoneMaterial;
  uiTexture = ItemImage.stone;
  geometry = RenderGeometry.Cube;
  transparent = false;
  canPassThrough = false;
  canDrop = true;
  breakCount = 10;
  // TODO 需要增加原石方块
  /**@desc 石头方块被破坏后掉落的石头方块 */
  dropBlockId = BlockID.Stone;
  dropLimit = DropLimit;
}

export const getEmptyStoneBlockData = () => {
  return {
    blockId: BlockID.Stone,
    instanceIds: [],
    blockData: {
      breakCount: 10,
    },
  }
} 
