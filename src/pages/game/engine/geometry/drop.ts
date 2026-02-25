import * as THREE from "three";
import { RenderGeometry } from "../../Block/base/Block";
// import { initTreeGeometry } from "./tree";
import { initTopSideGeometry } from "./top_side";
import { initDropCrossGeometry } from "./cross_plants";

const dropBoxSize = 0.25;
const CubeGeometry = new THREE.BoxGeometry(dropBoxSize, dropBoxSize, dropBoxSize);
// const TreeDropGeometry = initTreeGeometry(dropBoxSize);
const TopSideDropGeometry = initTopSideGeometry(dropBoxSize);
const DropCrossGeometry = initDropCrossGeometry(0.5, 0.5);
export const getDropInstancedGeometry = (blockGeometry: RenderGeometry) => {
    if (blockGeometry === RenderGeometry.Cube) {
        return CubeGeometry;
    } else if (blockGeometry === RenderGeometry.Cross) {
        return DropCrossGeometry.clone();
        // GrassBlock Tree 后续替换成 TopSide 顶部/侧面/底面 定制 geometry
    } else if(blockGeometry === RenderGeometry.TopSide) {
        return TopSideDropGeometry.clone();
    }
};