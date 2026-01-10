import { GlobalProps } from "./query";

export const DevControl = {
    chunkHelperVisible: GlobalProps.chunk_help === '1' ? true : false,
    chunkWireframeMode: false,
    worldType: GlobalProps.world || 'terrain', // 'flat'
}