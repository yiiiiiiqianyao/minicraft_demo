import * as THREE from 'three';
import { textures } from '../../Block/textures';

// 蒲公英花
// TODO 使用 combine material 合并材质
// TODO 暂时使用 MeshBasicMaterial ，后续再考虑是否使用 MeshLambertMaterial
// 颜色看起来不对
const FlowerDandelionMaterial = new THREE.MeshBasicMaterial({
  map: textures.flowerDandelion,
  alphaTest: 0.1,
});
// 修改花纹理的scale和offset，使花的贴图和实际大小保持一致
textures.flowerDandelion.repeat.set(0.45, 0.6 );
textures.flowerDandelion.offset.set(0.275, 0);

FlowerDandelionMaterial.side = THREE.DoubleSide;

// 玫瑰花
const FlowerRoseMaterial = new THREE.MeshBasicMaterial({
  map: textures.flowerRose,
  alphaTest: 0.1,
});
textures.flowerRose.repeat.set(0.45, 0.6 );
textures.flowerRose.offset.set(0.275, 0);

FlowerRoseMaterial.side = THREE.DoubleSide;

export {
    FlowerDandelionMaterial,
    FlowerRoseMaterial,
}