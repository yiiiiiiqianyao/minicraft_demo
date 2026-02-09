import * as THREE from "three";
import { RenderGeometry } from "../../Block/base/Block";
import { initTreeGeometry } from "./tree";
import { initGrassBlockGeometry } from "./grassBlock";
import { FlowerGeometry } from "./flower";

/**@desc 方块的大小为 1x1x1 */
const CubeGeometry = new THREE.BoxGeometry()

/**@desc 裂开的方块 */ 
const break_size = 1.01;
const BreakGeometry = new THREE.BoxGeometry(break_size, break_size, break_size);

/**@desc 十字的大小为 0.5x0.5 */
const CrossGeometry = new THREE.PlaneGeometry();
/**@desc 树类型的定制 geometry */
const TreeGeometry = initTreeGeometry();
/**@desc 草方块的定制 geometry */
const GrassBlockGeometry = initGrassBlockGeometry();

export * from './drop';

export function getInstancedGeometry (blockGeometry: RenderGeometry): THREE.BufferGeometry {
    if (blockGeometry === RenderGeometry.Cube) {
        return CubeGeometry;
    } else if (blockGeometry === RenderGeometry.Cross) {
        return CrossGeometry;
    } else if (blockGeometry === RenderGeometry.Flower) {
        return FlowerGeometry;
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