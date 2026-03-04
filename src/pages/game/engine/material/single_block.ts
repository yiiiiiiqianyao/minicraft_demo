import * as THREE from 'three';
import { textures } from '../../Block/textures';

const SingleBlockMaterial = new THREE.MeshLambertMaterial({
  map: textures.singleBlock,
  alphaTest: 0.1,
});
SingleBlockMaterial.onBeforeCompile = (shader) => {
  shader.vertexShader = `
  #define LAMBERT
  attribute vec2 aSingleBlockOffset;
  varying vec3 vViewPosition;
  #include <common>
  #include <batching_pars_vertex>
  #include <uv_pars_vertex>
  #include <displacementmap_pars_vertex>
  #include <envmap_pars_vertex>
  #include <color_pars_vertex>
  #include <fog_pars_vertex>
  #include <normal_pars_vertex>
  #include <morphtarget_pars_vertex>
  #include <skinning_pars_vertex>
  #include <shadowmap_pars_vertex>
  #include <logdepthbuf_pars_vertex>
  #include <clipping_planes_pars_vertex>
  void main() {
    #include <uv_vertex>
    vMapUv = ( mapTransform * vec3( MAP_UV.x * 0.1 + aSingleBlockOffset.x, (MAP_UV.y * 0.1 + aSingleBlockOffset.y), 1 ) ).xy;
    #include <color_vertex>
    #include <morphinstance_vertex>
    #include <morphcolor_vertex>
    #include <batching_vertex>
    #include <beginnormal_vertex>
    #include <morphnormal_vertex>
    #include <skinbase_vertex>
    #include <skinnormal_vertex>
    #include <defaultnormal_vertex>
    #include <normal_vertex>
    #include <begin_vertex>
    #include <morphtarget_vertex>
    #include <skinning_vertex>
    #include <displacementmap_vertex>
    #include <project_vertex>
    #include <logdepthbuf_vertex>
    #include <clipping_planes_vertex>
    vViewPosition = - mvPosition.xyz;
    #include <worldpos_vertex>
    #include <envmap_vertex>
    #include <shadowmap_vertex>
    #include <fog_vertex>
  }
  `;
  return shader;
};

export {
  SingleBlockMaterial,
}