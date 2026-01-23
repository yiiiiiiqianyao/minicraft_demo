import * as THREE from "three";

export function getFloorVec3(vec3: THREE.Vector3) {
    return new THREE.Vector3(
        Math.floor(vec3.x),
        Math.floor(vec3.y),
        Math.floor(vec3.z)
    )
}

export function getFloorXYZ(x: number, y: number, z: number) {
    return [
        Math.floor(x),
        Math.floor(y),
        Math.floor(z),
    ]
}


// TODO: make async
let textureLoader: THREE.TextureLoader | null = null;
export function loadTexture(path: string) {
    if(!textureLoader) {
        textureLoader = new THREE.TextureLoader();
    }
    const texture = textureLoader.load(path);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.NearestMipmapNearestFilter;
    texture.magFilter = THREE.NearestFilter;
    texture.generateMipmaps = true;
    return texture;
}

export function getCloneLerpColor(color1: THREE.Color, color2: THREE.Color, lerp: number) {
    return color1.clone().lerp(color2, lerp);
}