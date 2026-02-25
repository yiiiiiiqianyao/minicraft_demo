import { Block, RenderGeometry } from "../base/Block";
import { BlockID } from "..";
import { TopSideMaterial } from "../../engine/material";
import { ItemImage } from "../../gui/items";
import { DropLimit } from "../../world/drop/literal";

/**@desc 草地方块 */
export class GrassBlock extends Block {
  id = BlockID.GrassBlock;
  material = TopSideMaterial;
  uiTexture = ItemImage.grassBlock;
  geometry = RenderGeometry.TopSide;
  transparent = false;
  canPassThrough = false;
  canDrop = true;
  breakCount = 5;
  /**@desc 草方块被破坏后掉落的泥土方块 */
  dropBlockId = BlockID.Dirt;
  dropLimit = DropLimit;
  /**@desc 当前方块是否可交互 */
  interactive = true;
  uvRange = undefined;
}

export const getEmptyGrassBlockData = () => {
  return {
    blockId: BlockID.GrassBlock,
    instanceIds: [],
    blockData: {
      breakCount: 5,
    },
  }
}
