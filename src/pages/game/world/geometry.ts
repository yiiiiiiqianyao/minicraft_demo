import * as THREE from "three";
import { RenderGeometry } from "../Block/Block";

// 方块的大小为 1x1x1
const geometry = new THREE.BoxGeometry()
const dropBoxSize = 0.3;
const geometry_drop = new THREE.BoxGeometry(dropBoxSize, dropBoxSize, dropBoxSize);
// TODO 修改草的实际大小
const crossGeometry = new THREE.PlaneGeometry();
const flowerGeometry = new THREE.PlaneGeometry(0.3, 0.6);

export const getInstancedGeometry = (blockGeometry: RenderGeometry) => {
    if (blockGeometry === RenderGeometry.Cube) {
        return geometry;
    } else if (blockGeometry === RenderGeometry.Cross) {
        return crossGeometry;
    } else if (blockGeometry === RenderGeometry.Flower) {
        return flowerGeometry;
    }
};

export const getDropInstancedGeometry = (blockGeometry: RenderGeometry) => {
    if (blockGeometry === RenderGeometry.Cube) {
        return geometry_drop;
    } else if (blockGeometry === RenderGeometry.Cross) {
        return geometry_drop;
    } else if (blockGeometry === RenderGeometry.Flower) {
        return geometry_drop;
    }
};