import { BlockID } from "../../../Block";

export function isBlockSupportsCombine(blockId: BlockID) {
    // TODO 待优化 除了 Leaves 和 OakLog 之外方块也支持合并
    // 暂时只支持了叶子和原木
    return blockId === BlockID.Leaves || blockId === BlockID.OakLog;
}