import * as THREE from "three";
import { RenderGeometry } from "../../Block/base/Block";
import { initTreeGeometry } from "./tree";
import { initGrassBlockGeometry } from "./grassBlock";

const dropBoxSize = 0.25;
const CubeGeometry = new THREE.BoxGeometry(dropBoxSize, dropBoxSize, dropBoxSize);
const TreeDropGeometry = initTreeGeometry(dropBoxSize);
const GrassBlockDropGeometry = initGrassBlockGeometry(dropBoxSize);

// TODO 修改草的实际大小
const CrossGeometry = new THREE.PlaneGeometry(0.5, 0.5);
const FlowerGeometry = new THREE.PlaneGeometry(0.15, 0.5);
export const getDropInstancedGeometry = (blockGeometry: RenderGeometry) => {
    if (blockGeometry === RenderGeometry.Cube) {
        return CubeGeometry;
    } else if (blockGeometry === RenderGeometry.Tree) {
        // TODO 暂时每种树都单独使用一个几何体
        return TreeDropGeometry.clone();
    } else if (blockGeometry === RenderGeometry.Cross) {
        return CrossGeometry;
    } else if (blockGeometry === RenderGeometry.Flower) {
        return FlowerGeometry;
    } else if(blockGeometry === RenderGeometry.GrassBlock) {
        return GrassBlockDropGeometry;
    }
};