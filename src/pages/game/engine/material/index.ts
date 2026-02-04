import * as THREE from 'three';
import { textures } from '../../Block/textures';

const wireframeMaterial = new THREE.MeshBasicMaterial({ wireframe: true });

const collisionHelperMaterial = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  transparent: true,
  opacity: 0.2,
});

// textures for material
// const GrassSideMaterial = new THREE.MeshLambertMaterial({ map: textures.grassSide });
// const GrassTopMaterial = new THREE.MeshLambertMaterial({ map: textures.grassTop });
const DirtMaterial = new THREE.MeshLambertMaterial({ map: textures.dirt });
const IronMaterial = new THREE.MeshLambertMaterial({ map: textures.iron });
const StoneMaterial = new THREE.MeshLambertMaterial({ map: textures.stone });
const CoalOreMaterial = new THREE.MeshLambertMaterial({ map: textures.coal });
const BedrockMaterial = new THREE.MeshLambertMaterial({ map: textures.bedrock });
const StoneBrickMaterial = new THREE.MeshLambertMaterial({ map: textures.stoneBrick });
const GrassBlockMaterial = new THREE.MeshLambertMaterial({ map: textures.grassBlock });
// block material
// const GrassBlockMaterial = [
//   GrassSideMaterial, // right
//   GrassSideMaterial, // left
//   GrassTopMaterial, // top
//   DirtMaterial, // bottom
//   GrassSideMaterial, // front
//   GrassSideMaterial, // back
// ];

const DirtBlockMaterial = DirtMaterial;
const IronBlockMaterial = IronMaterial;

const CraftingTableMaterial = [
  new THREE.MeshLambertMaterial({ map: textures.CraftingTableSide }), // right
  new THREE.MeshLambertMaterial({ map: textures.CraftingTableSide }), // left
  new THREE.MeshLambertMaterial({ map: textures.craftingTableTop }), // top
  new THREE.MeshLambertMaterial({ map: textures.craftingTableTop }), // bottom
  new THREE.MeshLambertMaterial({ map: textures.craftingTableFront }), // front
  new THREE.MeshLambertMaterial({ map: textures.CraftingTableSide }), // back
];

const BreakMaterial = new THREE.MeshLambertMaterial({ map: textures.breakBlock, transparent: true, opacity: 0 });
export {
  wireframeMaterial,
  collisionHelperMaterial,
  // block material
  GrassBlockMaterial,
  IronBlockMaterial,
  DirtBlockMaterial,
  StoneMaterial,
  CoalOreMaterial,
  BedrockMaterial,
  StoneBrickMaterial,

  // objects material
  CraftingTableMaterial,
  // break block material
  BreakMaterial,
}
export * from './tree';
export * from './flower';
export * from './grass';