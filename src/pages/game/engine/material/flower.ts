import * as THREE from 'three';
import { textures } from '../../Block/textures';

// TODO 暂时使用 MeshBasicMaterial ，后续再考虑是否使用 MeshLambertMaterial
const CrossPlantMaterial = new THREE.MeshBasicMaterial({
  map: textures.crossPlants,
  transparent: true,
  depthWrite: false,
  // alphaTest: 0.1,
})
CrossPlantMaterial.side = THREE.DoubleSide;
CrossPlantMaterial.onBeforeCompile = (shader) => {
  shader.vertexShader = `
  attribute vec2 aCrossOffset;
  #include <common>
  #include <batching_pars_vertex>
  #include <uv_pars_vertex>
  #include <envmap_pars_vertex>
  #include <color_pars_vertex>
  #include <fog_pars_vertex>
  #include <morphtarget_pars_vertex>
  #include <skinning_pars_vertex>
  #include <logdepthbuf_pars_vertex>
  #include <clipping_planes_pars_vertex>
  void main() {
    #include <uv_vertex>
    vMapUv = ( mapTransform * vec3( MAP_UV.x * 0.2 + aCrossOffset.x, (MAP_UV.y * 0.2 + aCrossOffset.y), 1 ) ).xy;
    #include <color_vertex>
    #include <morphinstance_vertex>
    #include <morphcolor_vertex>
    #include <batching_vertex>
    #if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
      #include <beginnormal_vertex>
      #include <morphnormal_vertex>
      #include <skinbase_vertex>
      #include <skinnormal_vertex>
      #include <defaultnormal_vertex>
    #endif
    #include <begin_vertex>
    #include <morphtarget_vertex>
    #include <skinning_vertex>
    #include <project_vertex>
    #include <logdepthbuf_vertex>
    #include <clipping_planes_vertex>
    #include <worldpos_vertex>
    #include <envmap_vertex>
    #include <fog_vertex>
  }
  `;
  return shader;
}

export {
  CrossPlantMaterial,
}