import * as THREE from 'three';
import { textures } from '../../Block/textures';

// TODO 暂时使用 MeshBasicMaterial ，后续再考虑是否使用 MeshLambertMaterial
const CrossPlantMaterial = new THREE.MeshPhongMaterial({
  map: textures.crossPlants,
  // transparent: true,
  // depthWrite: false,
  // blendSrc: THREE.OneMinusSrcAlphaFactor,
  alphaTest: 0.9,
  lightMapIntensity: 10,
})
CrossPlantMaterial.side = THREE.DoubleSide;
// let i = 0;
CrossPlantMaterial.onBeforeCompile = (shader) => {
  // if (i === 0) {
  //   console.log(shader.vertexShader);
  //   console.log(shader.fragmentShader)
  //   i = 1;
  // }
  shader.vertexShader = `
    #define PHONG
    varying vec3 vViewPosition;
    attribute vec2 aCrossOffset;
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
      vMapUv = ( mapTransform * vec3( MAP_UV.x * 0.2 + aCrossOffset.x, (MAP_UV.y * 0.2 + aCrossOffset.y), 1 ) ).xy;
      #include <color_vertex>
      #include <morphcolor_vertex>
      #include <batching_vertex>
      #include <beginnormal_vertex>
      #include <morphinstance_vertex>
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

  shader.fragmentShader = `
  #define PHONG
    uniform vec3 diffuse;
    uniform vec3 emissive;
    uniform vec3 specular;
    uniform float shininess;
    uniform float opacity;
    #include <common>
    #include <dithering_pars_fragment>
    #include <color_pars_fragment>
    #include <uv_pars_fragment>
    #include <map_pars_fragment>
    #include <alphamap_pars_fragment>
    #include <alphatest_pars_fragment>
    #include <alphahash_pars_fragment>
    #include <aomap_pars_fragment>
    #include <lightmap_pars_fragment>
    #include <emissivemap_pars_fragment>
    #include <envmap_common_pars_fragment>
    #include <envmap_pars_fragment>
    #include <fog_pars_fragment>
    #include <bsdfs>
    #include <lights_pars_begin>
    #include <normal_pars_fragment>
    #include <lights_phong_pars_fragment>
    #include <shadowmap_pars_fragment>
    #include <bumpmap_pars_fragment>
    #include <normalmap_pars_fragment>
    #include <specularmap_pars_fragment>
    #include <logdepthbuf_pars_fragment>
    #include <clipping_planes_pars_fragment>
    void main() {
      vec4 diffuseColor = vec4( diffuse, opacity );
      #include <clipping_planes_fragment>
      ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
      vec3 totalEmissiveRadiance = emissive;
      #include <logdepthbuf_fragment>
      #include <map_fragment>
      #include <color_fragment>
      #include <alphamap_fragment>
      #include <alphatest_fragment>
      #include <alphahash_fragment>
      #include <specularmap_fragment>
      #include <normal_fragment_begin>
      #include <normal_fragment_maps>
      #include <emissivemap_fragment>
      #include <lights_phong_fragment>
      #include <lights_fragment_begin>
      #include <lights_fragment_maps>
      #include <lights_fragment_end>
      #include <aomap_fragment>
      vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
      #include <envmap_fragment>
      #include <opaque_fragment>
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
      // 增加 cross 材质的饱和度
      gl_FragColor.rgb *= vec3(1.9);
      #include <fog_fragment>
      #include <premultiplied_alpha_fragment>
      #include <dithering_fragment>
    }
  `;
  // shader.vertexShader = `
  // attribute vec2 aCrossOffset;
  // #include <common>
  // #include <batching_pars_vertex>
  // #include <uv_pars_vertex>
  // #include <envmap_pars_vertex>
  // #include <color_pars_vertex>
  // #include <fog_pars_vertex>
  // #include <morphtarget_pars_vertex>
  // #include <skinning_pars_vertex>
  // #include <logdepthbuf_pars_vertex>
  // #include <clipping_planes_pars_vertex>
  // void main() {
  //   #include <uv_vertex>
  //   vMapUv = ( mapTransform * vec3( MAP_UV.x * 0.2 + aCrossOffset.x, (MAP_UV.y * 0.2 + aCrossOffset.y), 1 ) ).xy;
  //   #include <color_vertex>
  //   #include <morphinstance_vertex>
  //   #include <morphcolor_vertex>
  //   #include <batching_vertex>
  //   #if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
  //     #include <beginnormal_vertex>
  //     #include <morphnormal_vertex>
  //     #include <skinbase_vertex>
  //     #include <skinnormal_vertex>
  //     #include <defaultnormal_vertex>
  //   #endif
  //   #include <begin_vertex>
  //   #include <morphtarget_vertex>
  //   #include <skinning_vertex>
  //   #include <project_vertex>
  //   #include <logdepthbuf_vertex>
  //   #include <clipping_planes_vertex>
  //   #include <worldpos_vertex>
  //   #include <envmap_vertex>
  //   #include <fog_vertex>
  // }
  // `;
  return shader;
}

export {
  CrossPlantMaterial,
}