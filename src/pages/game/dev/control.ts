import { GlobalProps } from "./query";

/**
 * 开发控制参数
 */
export class DevControl {
    static chunkHelperVisible = GlobalProps.chunk_helper === '1' ? true : false;
    static chunkWireframeMode = false;
    static worldType = GlobalProps.world || 'terrain'; // 'flat'
    static physicsHelperVisible = GlobalProps.physics_helper === '1' ? true : false;
    static hour = GlobalProps.hour ? Number(GlobalProps.hour) : undefined;
}