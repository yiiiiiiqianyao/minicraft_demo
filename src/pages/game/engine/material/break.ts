import * as THREE from 'three';

export const initBreakMaterial = (texture: THREE.Texture) => {
    const uniforms = {
        uProgress: { value: 0.0 },
        uAtlas: { value: texture },
    }
    const vertexShader = /* glsl */`
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `;

   const fragmentShader = /* glsl */`
        precision highp float;
        uniform sampler2D uAtlas;
        uniform float uProgress; // 0.0 0.1 0.2 0.3 0.4 0.5 0.6 0.7 0.8 0.9
        varying vec2 vUv;
        void main() {
            // float offset = min(uProgress, 0.9);
            float simpleX = (vUv.x / 10.0) + uProgress;
            float simpleY = vUv.y;
            vec2 simpleUV = vec2(simpleX, simpleY);
            vec4 texture = texture2D(uAtlas, simpleUV);
            if (texture.r > 0.25) {
                discard;
            }
            gl_FragColor = vec4(texture.rgb, 0.7);
        }
    `;

    const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: true,
        side: THREE.FrontSide
    });
    return material;
}