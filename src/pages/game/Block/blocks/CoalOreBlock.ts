import { RenderGeometry } from "../base/Block";
import { OreBlock } from "../base/OreBlock";
import { BlockID } from "../constant";
import { OreConfig } from "../../world/generate/constant";
import { CoalOreMaterial } from "../../engine/material";
import { ItemImage } from "../../gui/items";
import { DropLimit } from "../../world/drop/literal";

/**@desc 煤炭矿石块 */
export const CoalOreBlock = class extends OreBlock {
  id = BlockID.CoalOre;
  scale = OreConfig["coal"].scale;
  scarcity = OreConfig["coal"].scarcity;
  material = CoalOreMaterial;
  uiTexture = ItemImage.coal;
  geometry = RenderGeometry.Cube;
  transparent = false;
  canPassThrough = false;
  canDrop = true;
  breakCount = 10;
  // TODO 掉落煤碳
  dropBlockId = BlockID.CoalOre;
  dropLimit = DropLimit;
  /**@desc 当前方块是否可交互 */
  interactive = true;
  uvRange = undefined;
};

export const getEmptyCoalOreBlockData = () => {
  return {
    blockId: BlockID.CoalOre,
    instanceIds: [],
    blockData: {
      breakCount: 10,
    },
  }
}
