import * as THREE from "three";
import { RenderGeometry } from "../../Block/base/Block";
// import { initTreeGeometry } from "./tree";
import { initTopSideGeometry } from "./top_side";
import { initCrossPlantGeometry } from "./cross_plants";

/**@desc 方块的大小为 1x1x1 */
const CubeGeometry = new THREE.BoxGeometry()

/**@desc 裂开的方块 */ 
const break_size = 1.01;
const BreakGeometry = new THREE.BoxGeometry(break_size, break_size, break_size);

/**@desc cross plane 的 geometry */
const CrossPlantGeometry = initCrossPlantGeometry();
/**@desc 树类型的定制 geometry */
// const TreeGeometry = initTreeGeometry();
/**@desc 顶部和侧面的定制 geometry */
const TopSideBlockGeometry = initTopSideGeometry();

export * from './drop';

/**@desc 根据方块的 geometry 类型返回对应的 geometry */
export function getInstancedGeometry (blockGeometry: RenderGeometry): THREE.BufferGeometry {
    if (blockGeometry === RenderGeometry.Cube) {
        return CubeGeometry;
    } else if (blockGeometry === RenderGeometry.Cross) {
        return CrossPlantGeometry;
    } else if (blockGeometry === RenderGeometry.Break) {
        return BreakGeometry;
    } else if (blockGeometry === RenderGeometry.TopSide) {
        return TopSideBlockGeometry;
    } else {
        return CubeGeometry;
    }
}