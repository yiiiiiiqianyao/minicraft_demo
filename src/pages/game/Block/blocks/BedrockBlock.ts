import { Block, RenderGeometry } from "../base/Block";
import { BlockID } from "..";
import { ItemImage } from "../../gui/items";
import { BedrockMaterial } from "../../engine/material";
import { DropLimit } from "../../world/drop/literal";

/**@desc 基岩石块 */
export class BedrockBlock extends Block {
  id = BlockID.Bedrock;
  material = BedrockMaterial;
  uiTexture = ItemImage.bedrock;
  geometry = RenderGeometry.Cube;
  transparent = false;
  canPassThrough = false;
  canDrop = false;
  breakCount = -1;
  dropBlockId = undefined;
  dropLimit = DropLimit;
  /**@desc 当前方块是否可交互 */
  interactive = true;
  uvRange = undefined;
}

export const getEmptyBedrockBlockData = () => {
  return {
    blockId: BlockID.Bedrock,
    instanceIds: [],
    blockData: {
      breakCount: Infinity,
    },
  }
}
