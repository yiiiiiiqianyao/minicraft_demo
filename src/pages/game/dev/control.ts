import * as THREE from "three";
import { GlobalProps } from "./query";
import { updateRenderInfoGUI, updateStats } from ".";

/**
 *@desc 开发控制类
 */

let DevUpdateCount = 0;
export class DevControl {
    static chunkHelperVisible = GlobalProps.chunk_helper === '1' ? true : false;
    static chunkWireframeMode = false;
    static showBorder = GlobalProps.border === '1' ? true : false;
    static worldType = GlobalProps.world || 'terrain'; // 'flat'
    static physicsHelperVisible = GlobalProps.physics_helper === '1' ? true : false;
    static hour = GlobalProps.hour ? Number(GlobalProps.hour) : undefined;
    // TODO 待完善合并 instance 的渲染
    static instanceMerge = GlobalProps.instance_merge === '1' ? true : false;
    static v = -1;

    static update(renderer: THREE.WebGLRenderer) {
        if (DevUpdateCount < 3) {
            DevUpdateCount++;
        } else {
            DevUpdateCount = 0;
            updateRenderInfoGUI(renderer);
        }
        updateStats();
    }
}