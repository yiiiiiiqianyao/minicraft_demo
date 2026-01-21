import * as THREE from "three";
import { RenderGeometry } from "../../Block/base/Block";

// 方块的大小为 1x1x1
const geometry = new THREE.BoxGeometry()
const dropBoxSize = 0.25;
const geometry_drop = new THREE.BoxGeometry(dropBoxSize, dropBoxSize, dropBoxSize);
// TODO 修改草的实际大小
const crossGeometry = new THREE.PlaneGeometry();
const crossGeometry_drop = new THREE.PlaneGeometry(0.5, 0.5);

const flowerGeometry = new THREE.PlaneGeometry(0.3, 0.6);
const flowerGeometry_drop = new THREE.PlaneGeometry(0.15, 0.5);

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
        return crossGeometry_drop;
    } else if (blockGeometry === RenderGeometry.Flower) {
        return flowerGeometry_drop;
    }
};