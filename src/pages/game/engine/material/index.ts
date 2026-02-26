import * as THREE from 'three';
import { textures } from '../../Block/textures';
import { initBreakMaterial } from './break';

const wireframeMaterial = new THREE.MeshBasicMaterial({ wireframe: true });

const collisionHelperMaterial = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  transparent: true,
  opacity: 0.2,
});

// textures for material
const DirtMaterial = new THREE.MeshLambertMaterial({ map: textures.dirt });
const IronMaterial = new THREE.MeshLambertMaterial({ map: textures.iron });
const StoneMaterial = new THREE.MeshLambertMaterial({ map: textures.stone });
const CoalOreMaterial = new THREE.MeshLambertMaterial({ map: textures.coal });
const BedrockMaterial = new THREE.MeshLambertMaterial({ map: textures.bedrock });
const StoneBrickMaterial = new THREE.MeshLambertMaterial({ map: textures.stoneBrick });

/**@desc 树叶材质 使用 alpha 剔除取代 transparent 模式  避免渲染时出现闪烁 */
const LeavesMaterial = new THREE.MeshLambertMaterial({
  map: textures.leaves,
  alphaTest: 0.1,
});
// block material
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

/**@desc 破坏方块时候 展示挖掘进度的材质 */ 
const BreakMaterial = initBreakMaterial(textures.breakBlock);

export {
  wireframeMaterial,
  collisionHelperMaterial,
  // block material
  IronBlockMaterial,
  DirtBlockMaterial,
  StoneMaterial,
  CoalOreMaterial,
  BedrockMaterial,
  StoneBrickMaterial,
  LeavesMaterial,
  // objects material
  CraftingTableMaterial,
  // break block material
  BreakMaterial,
}

export * from './cross_plant';
export * from './top_side';
