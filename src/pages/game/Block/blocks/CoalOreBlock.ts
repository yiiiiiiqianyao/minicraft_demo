import { RenderGeometry } from "../base/Block";
import { OreBlock } from "./OreBlock";
import { uiTextures } from "../textures";
import { BlockID } from "../constant";
import { oreConfig } from "../../world/generate/resource";
import { CoalOreMaterial } from "../../engine/material";

export const CoalOreBlock = class extends OreBlock {
  id = BlockID.CoalOre;
  scale = oreConfig["coal"].scale;
  scarcity = oreConfig["coal"].scarcity;
  material = CoalOreMaterial;
  uiTexture = uiTextures.coal;
  geometry = RenderGeometry.Cube;
  transparent = false;
  canPassThrough = false;
  canDrop = true;
};
