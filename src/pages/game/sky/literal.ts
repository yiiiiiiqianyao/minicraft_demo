import * as THREE from "three";

export const dayColor = new THREE.Color(0xc0d8ff);
export const nightColor = new THREE.Color(0x10121e);
export const sunsetColor = new THREE.Color(0xcc7a00);

export const uniforms = {
    topColor: { type: "c", value: new THREE.Color(0xa0c0ff) },
    bottomColor: { type: "c", value: new THREE.Color(0xffffff) },
    offset: { type: "f", value: 99 },
    exponent: { type: "f", value: 0.3 },
};

export const sunSettings = {
  distance: 400,
  cycleLength: 600,
}