import { RenderGeometry } from "../base/Block";
import { OreBlock } from "./OreBlock";
import { uiTextures } from "../textures";
import { BlockID } from "..";
import { oreConfig } from "../../world/generate/resource";
import { IronBlockMaterial } from "../../engine/material";

/**@desc 铁矿方块 */
export const IronOreBlock = class extends OreBlock {
  id = BlockID.IronOre;
  scale = oreConfig["iron"].scale;
  scarcity = oreConfig["iron"].scarcity;
  material = IronBlockMaterial;
  uiTexture = uiTextures.iron;
  geometry = RenderGeometry.Cube;
  transparent = false;
  canPassThrough = false;
  canDrop = true;
};
