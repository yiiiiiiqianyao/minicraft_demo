import * as THREE from "three";
import { RenderGeometry } from "../../Block/base/Block";
import { initTreeGeometry } from "./tree";
import { initGrassBlockGeometry } from "./grassBlock";
import { initDropCrossGeometry } from "./flower";

const dropBoxSize = 0.25;
const CubeGeometry = new THREE.BoxGeometry(dropBoxSize, dropBoxSize, dropBoxSize);
const TreeDropGeometry = initTreeGeometry(dropBoxSize);
const GrassBlockDropGeometry = initGrassBlockGeometry(dropBoxSize);
const DropCrossGeometry = initDropCrossGeometry(0.5, 0.5);
export const getDropInstancedGeometry = (blockGeometry: RenderGeometry) => {
    if (blockGeometry === RenderGeometry.Cube) {
        return CubeGeometry;
    } else if (blockGeometry === RenderGeometry.Tree) {
        // TODO 暂时每种树都单独使用一个几何体
        return TreeDropGeometry.clone();
    } else if (blockGeometry === RenderGeometry.Cross || blockGeometry === RenderGeometry.Flower) {
        return DropCrossGeometry.clone();
    } else if(blockGeometry === RenderGeometry.GrassBlock) {
        return GrassBlockDropGeometry;
    }
};