import * as THREE from "three";

export function getFloorVec3(vec3: THREE.Vector3) {
    return new THREE.Vector3(
        Math.floor(vec3.x),
        Math.floor(vec3.y),
        Math.floor(vec3.z)
    )
}