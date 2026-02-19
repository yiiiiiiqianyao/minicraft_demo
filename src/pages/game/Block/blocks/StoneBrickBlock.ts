import { Block, RenderGeometry } from "../base/Block";
import { BlockID } from "..";
import { ItemImage } from "../../gui/items";
import { StoneBrickMaterial } from "../../engine/material";
import { DropLimit } from "../../world/drop/literal";

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
  dropLimit = DropLimit;
  /**@desc 当前方块是否可交互 */
  interactive = true;
  uvRange = undefined;
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

