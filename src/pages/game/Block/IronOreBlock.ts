import * as THREE from "three";

import { RenderGeometry } from "./Block";
import { OreBlock } from "./OreBlock";
import { textures, uiTextures } from "./textures";
import { BlockID } from ".";
import { oreConfig } from "../world/generate/resource";

const ironMaterial = new THREE.MeshLambertMaterial({ map: textures.iron });

export const IronOreBlock = class extends OreBlock {
  id = BlockID.IronOre;
  scale = oreConfig["iron"].scale;
  scarcity = oreConfig["iron"].scarcity;
  material = ironMaterial;
  uiTexture = uiTextures.iron;
  geometry = RenderGeometry.Cube;
  transparent = false;
  canPassThrough = false;
  canDrop = true;
};
