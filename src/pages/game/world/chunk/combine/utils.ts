import { BlockID } from "../../../Block";

export function isBlockSupportsCombine(blockId: BlockID) {
    // TODO 待优化 除了 Leaves 和 OakLog 之外方块也支持合并
    // 暂时只支持了BirchLog 和 OakLog
    return blockId === BlockID.BirchLog || blockId === BlockID.OakLog;
}