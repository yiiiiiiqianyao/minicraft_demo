import * as THREE from "three";
import { RenderGeometry } from "../../Block/base/Block";
import { initTreeGeometry } from "./tree";
import { initGrassBlockGeometry } from "./grassBlock";
import { initCrossPlantGeometry } from "./flower";

/**@desc 方块的大小为 1x1x1 */
const CubeGeometry = new THREE.BoxGeometry()

/**@desc 裂开的方块 */ 
const break_size = 1.01;
const BreakGeometry = new THREE.BoxGeometry(break_size, break_size, break_size);

/**@desc cross plane 的 geometry */
const CrossPlantGeometry = initCrossPlantGeometry();
/**@desc 树类型的定制 geometry */
const TreeGeometry = initTreeGeometry();
/**@desc 草方块的定制 geometry */
const GrassBlockGeometry = initGrassBlockGeometry();

export * from './drop';

export function getInstancedGeometry (blockGeometry: RenderGeometry): THREE.BufferGeometry {
    if (blockGeometry === RenderGeometry.Cube) {
        return CubeGeometry;
    } else if (blockGeometry === RenderGeometry.Cross || blockGeometry === RenderGeometry.Flower) {
        return CrossPlantGeometry;
    } else if (blockGeometry === RenderGeometry.Tree) {
        return TreeGeometry;
    } else if (blockGeometry === RenderGeometry.Break) {
        return BreakGeometry;
    } else if (blockGeometry === RenderGeometry.GrassBlock) {
        return GrassBlockGeometry;
    } else {
        return CubeGeometry;
    }
}