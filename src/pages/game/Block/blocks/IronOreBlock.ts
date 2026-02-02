import { RenderGeometry } from "../base/Block";
import { OreBlock } from "../base/OreBlock";
import { BlockID } from "..";
import { oreConfig } from "../../world/generate/resource";
import { IronBlockMaterial } from "../../engine/material";
import { ItemImage } from "../../gui/items";

/**@desc 铁矿方块 */
export const IronOreBlock = class extends OreBlock {
  id = BlockID.IronOre;
  scale = oreConfig["iron"].scale;
  scarcity = oreConfig["iron"].scarcity;
  material = IronBlockMaterial;
  uiTexture = ItemImage.iron;
  geometry = RenderGeometry.Cube;
  transparent = false;
  canPassThrough = false;
  canDrop = true;
  breakCount = 1;
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

