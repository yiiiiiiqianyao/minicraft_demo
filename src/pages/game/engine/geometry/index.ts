import * as THREE from "three";
import { RenderGeometry } from "../../Block/base/Block";
import { initTreeGeometry } from "./tree";

/**@desc 方块的大小为 1x1x1 */
const CubeGeometry = new THREE.BoxGeometry()

/**@desc 裂开的方块 */ 
const BreakGeometry = new THREE.BoxGeometry(1.02, 1.02, 1.02);

/**@desc 花朵的大小为 0.3x0.6 */
const FlowerGeometry = new THREE.PlaneGeometry(0.3, 0.6);
/**@desc 十字的大小为 0.5x0.5 */
const CrossGeometry = new THREE.PlaneGeometry();
/**@desc 树类型的 geometry 定制化设置 uv */
const TreeGeometry = initTreeGeometry();

export * from './drop';

export const getInstancedGeometry = (blockGeometry: RenderGeometry) => {
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
    }
};