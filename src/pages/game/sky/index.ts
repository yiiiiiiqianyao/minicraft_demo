import * as THREE from "three";

const vertexShader = `
  varying vec3 worldPosition;
  void main() {
      vec4 mPosition = modelMatrix * vec4( position, 1.0 );
      worldPosition = mPosition.xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }
`;

const fragmentShader = `
  uniform vec3 topColor;
  uniform vec3 bottomColor;
  uniform float offset;
  uniform float exponent;

  varying vec3 worldPosition;

  void main() {

    float h = normalize( worldPosition + offset ).y;
    gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( h, exponent ), 0.0 ) ), 1.0 );

  }
`;
export function initSky(scene: THREE.Scene) {
    const uniforms = {
        topColor: { type: "c", value: new THREE.Color(0xa0c0ff) },
        bottomColor: { type: "c", value: new THREE.Color(0xffffff) },
        offset: { type: "f", value: 99 },
        exponent: { type: "f", value: 0.3 },
    };
    const skyGeo = new THREE.SphereGeometry(4000, 32, 15);
    const skyMat = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: uniforms,
        side: THREE.BackSide,
    });
    const sky = new THREE.Mesh(skyGeo, skyMat);

    scene.fog = new THREE.Fog(0x80a0e0, 50, 100);
    scene.fog.color.copy(uniforms.bottomColor.value);

    return sky;
}