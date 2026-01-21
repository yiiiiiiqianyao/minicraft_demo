import * as THREE from "three";
import { RenderGeometry } from "../../Block/base/Block";

// 方块的大小为 1x1x1
const CubeGeometry = new THREE.BoxGeometry()
const FlowerGeometry = new THREE.PlaneGeometry(0.3, 0.6);
const CrossGeometry = new THREE.PlaneGeometry();
export const getInstancedGeometry = (blockGeometry: RenderGeometry) => {
    if (blockGeometry === RenderGeometry.Cube) {
        return CubeGeometry;
    } else if (blockGeometry === RenderGeometry.Cross) {
        return CrossGeometry;
    } else if (blockGeometry === RenderGeometry.Flower) {
        return FlowerGeometry;
    }
};

export * from './drop';

export {
    CubeGeometry,
    FlowerGeometry,
}