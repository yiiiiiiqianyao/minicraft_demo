import { RenderGeometry } from "../base/Block";
import { OreBlock } from "./OreBlock";
import { BlockID } from "../constant";
import { oreConfig } from "../../world/generate/resource";
import { CoalOreMaterial } from "../../engine/material";
import { ItemImage } from "../../gui/items";

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
};
