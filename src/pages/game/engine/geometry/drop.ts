import * as THREE from "three";
import { RenderGeometry } from "../../Block/base/Block";
import { initTreeGeometry } from "./tree";

const dropBoxSize = 0.25;
const geometry_drop = new THREE.BoxGeometry(dropBoxSize, dropBoxSize, dropBoxSize);
const TreeDropGeometry = initTreeGeometry(dropBoxSize);

// TODO 修改草的实际大小
const crossGeometry_drop = new THREE.PlaneGeometry(0.5, 0.5);
const flowerGeometry_drop = new THREE.PlaneGeometry(0.15, 0.5);
export const getDropInstancedGeometry = (blockGeometry: RenderGeometry) => {
    if (blockGeometry === RenderGeometry.Cube) {
        return geometry_drop;
    } else if (blockGeometry === RenderGeometry.Tree) {
        return TreeDropGeometry;
    } else if (blockGeometry === RenderGeometry.Cross) {
        return crossGeometry_drop;
    } else if (blockGeometry === RenderGeometry.Flower) {
        return flowerGeometry_drop;
    }
};