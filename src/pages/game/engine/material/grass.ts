import * as THREE from 'three';
import { textures } from '../../Block/textures';

// 长草
const TallGrassMaterial = new THREE.MeshBasicMaterial({
  map: textures.tallGrass,
  alphaTest: 0.1,
});
TallGrassMaterial.side = THREE.DoubleSide;

export {
  TallGrassMaterial,
}