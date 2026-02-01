import * as THREE from 'three';
import { textures } from '../../Block/textures';

// 橡木原木
const oakLogSideMaterial = new THREE.MeshLambertMaterial({
    map: textures.oakLogSide,
});

const oakLogTopMaterial = new THREE.MeshLambertMaterial({
    map: textures.oakLogTop,
});

const OkaLogMaterial =  [
  oakLogSideMaterial, // right
  oakLogSideMaterial, // left
  oakLogTopMaterial, // top
  oakLogTopMaterial, // bottom
  oakLogSideMaterial, // front
  oakLogSideMaterial, // back
]

// 树叶
const LeavesMaterial = new THREE.MeshLambertMaterial({
  map: textures.leaves,
});
LeavesMaterial.transparent = true;
LeavesMaterial.side = THREE.DoubleSide;

export {
  oakLogSideMaterial,
  OkaLogMaterial,
  LeavesMaterial,
}

export * from './combine';