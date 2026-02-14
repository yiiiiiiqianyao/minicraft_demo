import { Block, RenderGeometry } from "../base/Block";
import { BlockID } from "..";
import { DirtBlockMaterial } from "../../engine/material";
import { ItemImage } from "../../gui/items";
import { DropLimit } from "../../world/drop/literal";

/**@desc Dirt block */
export class DirtBlock extends Block {
  id = BlockID.Dirt;
  material = DirtBlockMaterial;
  uiTexture = ItemImage.dirt;
  geometry = RenderGeometry.Cube;
  transparent = false;
  canPassThrough = false;
  canDrop = true;
  breakCount = 5;
  dropBlockId = BlockID.Dirt;
  dropLimit = DropLimit;
  /**@desc 当前方块是否可交互 */
  interactive = true;
}

export const getEmptyDirtBlockData = () => {
  return {
    blockId: BlockID.Dirt,
    instanceIds: [],
    blockData: {
      breakCount: 5,
    },
  }
}