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
    static showBorder = GlobalProps.show_border === '1' ? true : false;
    static worldType = GlobalProps.world || 'normal'; // flat terrain normal
    static physicsHelperVisible = GlobalProps.physics_helper === '1' ? true : false;
    static hour = GlobalProps.hour ? Number(GlobalProps.hour) : undefined;
    /** @desc 世界 chunk 渲染距离 */
    static renderDistance = GlobalProps.render_distance ? Number(GlobalProps.render_distance) : undefined;
    /** @desc 渲染的相机类型 */
    static view = -1;

    /** @desc 更新露出展示的开发信息 */
    static update(renderer: THREE.WebGLRenderer) {
        if (DevUpdateCount < 5) {
            DevUpdateCount++;
        } else {
            DevUpdateCount = 0;
            updateRenderInfoGUI(renderer);
        }
        updateStats();
    }
}