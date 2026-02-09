import { Block, RenderGeometry } from "../base/Block";
import { BlockID } from "..";
import { ItemImage } from "../../gui/items";
import { StoneBrickMaterial } from "../../engine/material";

/**@desc 石头砖方块 */
export class StoneBrickBlock extends Block {
  id = BlockID.StoneBrick;
  material = StoneBrickMaterial;
  uiTexture = ItemImage.stoneBrick;
  geometry = RenderGeometry.Cube;
  transparent = false;
  canPassThrough = false;
  canDrop = true;
  breakCount = 10;
  /**@desc 石头砖方块被破坏后掉落的石头砖方块 */
  dropBlockId = BlockID.StoneBrick;
}

export const getEmptyStoneBrickBlockData = () => {
  return {
    blockId: BlockID.StoneBrick,
    instanceIds: [],
    blockData: {
      breakCount: 10,
    },
  }
}

