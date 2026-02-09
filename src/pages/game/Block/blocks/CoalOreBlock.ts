import { RenderGeometry } from "../base/Block";
import { OreBlock } from "../base/OreBlock";
import { BlockID } from "../constant";
import { oreConfig } from "../../world/generate/resource";
import { CoalOreMaterial } from "../../engine/material";
import { ItemImage } from "../../gui/items";
import { DropLimit } from "../../world/drop/literal";

/**@desc 煤炭矿石块 */
export const CoalOreBlock = class extends OreBlock {
  id = BlockID.CoalOre;
  scale = oreConfig["coal"].scale;
  scarcity = oreConfig["coal"].scarcity;
  material = CoalOreMaterial;
  uiTexture = ItemImage.coal;
  geometry = RenderGeometry.Cube;
  transparent = false;
  canPassThrough = false;
  canDrop = true;
  breakCount = 10;
  dropBlockId = BlockID.CoalOre;
  dropLimit = DropLimit;
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
