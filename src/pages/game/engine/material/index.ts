import * as THREE from 'three';
import { textures } from '../../Block/textures';

const wireframeMaterial = new THREE.MeshBasicMaterial({ wireframe: true });

const collisionHelperMaterial = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  transparent: true,
  opacity: 0.2,
});

// textures for material
const GrassSideMaterial = new THREE.MeshLambertMaterial({ map: textures.grassSide });
const GrassTopMaterial = new THREE.MeshLambertMaterial({ map: textures.grassTop });
const DirtMaterial = new THREE.MeshLambertMaterial({ map: textures.dirt });
const IronMaterial = new THREE.MeshLambertMaterial({ map: textures.iron });
const StoneMaterial = new THREE.MeshLambertMaterial({ map: textures.stone });
const CoalOreMaterial = new THREE.MeshLambertMaterial({ map: textures.coal });

// 树叶
const LeavesMaterial = new THREE.MeshLambertMaterial({
  map: textures.leaves,
});
LeavesMaterial.transparent = true;
LeavesMaterial.side = THREE.DoubleSide;

// 长草
const TallGrassMaterial = new THREE.MeshBasicMaterial({
  map: textures.tallGrass,
});
// TODO: 修改草的贴图，使草的贴图和实际大小保持一致

TallGrassMaterial.transparent = true;
TallGrassMaterial.side = THREE.DoubleSide;
TallGrassMaterial.depthWrite = false;

// block material
const GrassBlockMaterial = [
  GrassSideMaterial, // right
  GrassSideMaterial, // left
  GrassTopMaterial, // top
  DirtMaterial, // bottom
  GrassSideMaterial, // front
  GrassSideMaterial, // back
];
const DirtBlockMaterial = DirtMaterial;
const IronBlockMaterial = IronMaterial;

export {
  wireframeMaterial,
  collisionHelperMaterial,
  // block material
  GrassBlockMaterial,
  IronBlockMaterial,
  DirtBlockMaterial,
  StoneMaterial,
  CoalOreMaterial,
  // 
  LeavesMaterial,
  TallGrassMaterial,
}

export * from './flower';