import * as THREE from "three";

import { Block, RenderGeometry } from "./Block";
import { textures, uiTextures } from "./textures";

import { BlockID } from ".";

const flowerDandelionMaterial = new THREE.MeshBasicMaterial({
  map: textures.flowerDandelion,
});
// 修改花纹理的scale和offset，使花的贴图和实际大小保持一致
textures.flowerDandelion.repeat.set(0.45, 0.6 );
textures.flowerDandelion.offset.set(0.275, 0);

flowerDandelionMaterial.transparent = true;
flowerDandelionMaterial.side = THREE.DoubleSide;
flowerDandelionMaterial.depthWrite = false;

export class FlowerDandelionBlock extends Block {
  id = BlockID.FlowerDandelion;
  material = flowerDandelionMaterial;
  uiTexture = uiTextures.flowerDandelion;
  geometry = RenderGeometry.Flower;
  transparent = true;
  canPassThrough = true;
  canDrop = true;
}
