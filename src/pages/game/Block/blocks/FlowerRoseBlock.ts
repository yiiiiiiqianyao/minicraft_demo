import * as THREE from "three";
import { Block, RenderGeometry } from "../base/Block";
import { textures, uiTextures } from "../textures";
import { BlockID } from "..";

const flowerRoseMaterial = new THREE.MeshBasicMaterial({
  map: textures.flowerRose,
});
textures.flowerRose.repeat.set(0.45, 0.6 );
textures.flowerRose.offset.set(0.275, 0);

flowerRoseMaterial.transparent = true;
flowerRoseMaterial.side = THREE.DoubleSide;
flowerRoseMaterial.depthWrite = false;

export class FlowerRoseBlock extends Block {
  id = BlockID.FlowerRose;
  material = flowerRoseMaterial;
  uiTexture = uiTextures.flowerRose;
  geometry = RenderGeometry.Flower;
  transparent = true;
  canPassThrough = true;
  canDrop = true;
}
