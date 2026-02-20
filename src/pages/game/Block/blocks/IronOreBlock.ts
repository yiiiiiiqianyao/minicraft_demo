import { RenderGeometry } from "../base/Block";
import { OreBlock } from "../base/OreBlock";
import { BlockID } from "..";
import { OreConfig } from "../../world/generate/constant";
import { IronBlockMaterial } from "../../engine/material";
import { ItemImage } from "../../gui/items";
import { DropLimit } from "../../world/drop/literal";

/**@desc 铁矿方块 */
export const IronOreBlock = class extends OreBlock {
  id = BlockID.IronOre;
  scale = OreConfig["iron"].scale;
  scarcity = OreConfig["iron"].scarcity;
  material = IronBlockMaterial;
  uiTexture = ItemImage.iron;
  geometry = RenderGeometry.Cube;
  transparent = false;
  canPassThrough = false;
  canDrop = true;
  breakCount = 10;
  // TODO 掉落铁锭
  dropBlockId = BlockID.IronOre;
  dropLimit = DropLimit;
  /**@desc 当前方块是否可交互 */
  interactive = true;
  uvRange = undefined;
};

export const getEmptyIronOreBlockData = () => {
  return {
    blockId: BlockID.IronOre,
    instanceIds: [],
    blockData: {
      breakCount: 10,
    },
  }
}

