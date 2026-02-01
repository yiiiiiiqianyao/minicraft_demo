import { BlockID } from "../Block";

export type WorldType = 'flat' | 'terrain';

// 创造场景时候的初始参数
/**
 * level: {
 *  offset: number; // 层级的基础高度
 *  magnitude: number; // simplex noise 生成当前层的厚度 simplex(x, z) * magnitude
 * }
 */

interface ITrees {
  frequency: number;
  trunkHeight: {
    min: number;
    max: number;
  };
  // 树的覆盖大小
  canopy: {
    size: {
      min: number;
      max: number;
    };
  };
}

interface ITerrain {
  scale: number;
  magnitude: number; // 控制地形高度的幅度
  offset: number;
}

interface ITallGrass {
  frequency: number;
  patchSize: number;
}

export interface IWorldParams {
  seed: number;
  terrain: ITerrain;
  surface: { // 表层方块的高度
    offset: number; 
    magnitude: number;
  };
  // 基岩
  bedrock: {
    offset: number;
    magnitude: number;
  };
  trees: ITrees | null;
  tallGrass: ITallGrass | null;
  flowers: {
    frequency: number;
  };
}

// chunk 内固定方块的数据类型
export interface IInstanceData {
  blockId: BlockID;
  // 一个方块可能由多个 instance 组成 如 flower 就是由两个 instance plane 组成的
  instanceIds: number[]; // reference to mesh instanceId
  // 方块的信息
  blockData: Record<string, string | number | boolean>;
};