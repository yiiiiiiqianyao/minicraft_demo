import { BlockID } from "../Block";

export type WorldType = 'flat' | 'terrain' | 'normal';

// chunk 内固定方块的数据类型
export interface IInstanceData {
  blockId: BlockID;
  // 一个方块可能由多个 instance 组成 如 flower 就是由两个 instance plane 组成的
  instanceIds: number[]; // reference to mesh instanceId
  // 方块的信息
  blockData: Record<string, string | number | boolean>;
};