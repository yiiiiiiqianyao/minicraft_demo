import * as THREE from 'three';
import { textures } from '../../../Block/textures';

const combineOkaSideMaterial = new THREE.MeshLambertMaterial({
    map: textures.combine
});
combineOkaSideMaterial.onBeforeCompile = (shader) => {
    shader.vertexShader = `
     #define STANDARD
        varying vec3 vViewPosition;
        attribute vec2 uvScale;  // 实例化缩放属性（保留，后续可启用）
        attribute vec2 uvOffset; // 实例化偏移属性（保留，后续可启用）
        attribute vec2 uvOffset2; // 实例化偏移属性（保留，后续可启用）
        #ifdef USE_TRANSMISSION
            varying vec3 vWorldPosition;
        #endif
        #include <common>
        #include <batching_pars_vertex>
        #include <uv_pars_vertex>
        #include <displacementmap_pars_vertex>
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
            // vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
            // vMapUv = vMapUv * vec2(0.1666666, 0.1666666) + vec2(0.0, 0.1666666 * 5.0);
            vMapUv = vMapUv * uvScale + uvOffset;
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
            #include <shadowmap_vertex>
            #include <fog_vertex>
            // vUv = vec3( uv * vec2(0.2, 0.2), 1 ).xy;
        #ifdef USE_TRANSMISSION
            vWorldPosition = worldPosition.xyz;
        #endif
        }`
}
const combineOkaTopMaterial = new THREE.MeshLambertMaterial({
    map: textures.combine
});
combineOkaTopMaterial.onBeforeCompile = (shader) => {
    shader.vertexShader = `
     #define STANDARD
        varying vec3 vViewPosition;
        attribute vec2 uvScale;  // 实例化缩放属性（保留，后续可启用）
        attribute vec2 uvOffset; // 实例化偏移属性（保留，后续可启用）
        attribute vec2 uvOffset2; // 实例化偏移属性（保留，后续可启用）
        #ifdef USE_TRANSMISSION
            varying vec3 vWorldPosition;
        #endif
        #include <common>
        #include <batching_pars_vertex>
        #include <uv_pars_vertex>
        #include <displacementmap_pars_vertex>
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
            // vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
            // vMapUv = vMapUv * vec2(0.1666666, 0.1666666) + vec2(0.0, 0.1666666 * 5.0);
            vMapUv = vMapUv * uvScale + uvOffset2;
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
            #include <shadowmap_vertex>
            #include <fog_vertex>
            // vUv = vec3( uv * vec2(0.2, 0.2), 1 ).xy;
        #ifdef USE_TRANSMISSION
            vWorldPosition = worldPosition.xyz;
        #endif
        }`
}
const combineOkaMaterial = [
    combineOkaSideMaterial, // right
    combineOkaSideMaterial, // left
    combineOkaTopMaterial, // top
    combineOkaTopMaterial, // bottom
    combineOkaSideMaterial, // front
    combineOkaSideMaterial, // back
]

const combineLeaveMaterial = new THREE.MeshLambertMaterial({
    map: textures.combine,
    transparent: true,
    side: THREE.DoubleSide,
});
combineLeaveMaterial.onBeforeCompile = (shader) => {
    shader.vertexShader = `
     #define STANDARD
        varying vec3 vViewPosition;
        attribute vec2 uvScale;  // 实例化缩放属性（保留，后续可启用）
        attribute vec2 uvOffset; // 实例化偏移属性（保留，后续可启用）
        attribute vec2 uvOffset2; // 实例化偏移属性（保留，后续可启用）
        #ifdef USE_TRANSMISSION
            varying vec3 vWorldPosition;
        #endif
        #include <common>
        #include <batching_pars_vertex>
        #include <uv_pars_vertex>
        #include <displacementmap_pars_vertex>
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
            // vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
            // vMapUv = vMapUv * vec2(0.1666666, 0.1666666) + vec2(0.0, 0.1666666 * 5.0);
            vMapUv = vMapUv * uvScale + uvOffset;
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
            #include <shadowmap_vertex>
            #include <fog_vertex>
            // vUv = vec3( uv * vec2(0.2, 0.2), 1 ).xy;
        #ifdef USE_TRANSMISSION
            vWorldPosition = worldPosition.xyz;
        #endif
        }`
}

export { combineOkaMaterial, combineLeaveMaterial };
