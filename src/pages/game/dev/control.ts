import { GlobalProps } from "./query";

export const DevControl = {
    chunkHelperVisible: GlobalProps.chunk_helper === '1' ? true : false,
    chunkWireframeMode: false,
    worldType: GlobalProps.world || 'terrain', // 'flat'
    physicsHelperVisible: GlobalProps.physics_helper === '1' ? true : false,
}