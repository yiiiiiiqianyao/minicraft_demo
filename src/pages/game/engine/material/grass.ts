import * as THREE from 'three';
import { textures } from '../../Block/textures';

// 长草
const TallGrassMaterial = new THREE.MeshBasicMaterial({
  map: textures.tallGrass,
});
// TODO: 修改草的贴图，使草的贴图和实际大小保持一致
TallGrassMaterial.transparent = true;
TallGrassMaterial.side = THREE.DoubleSide;
TallGrassMaterial.depthWrite = false;

export {
  TallGrassMaterial,
}