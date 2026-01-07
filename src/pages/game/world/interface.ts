import { BlockID } from "../Block";

// 创造场景时候的初始参数
/**
 * level: {
 *  offset: number; // 层级的基础高度
 *  magnitude: number; // simplex noise 生成当前层的厚度 simplex(x, z) * magnitude
 * }
 */

export interface IWorldParams {
  seed: number;
  terrain: {
    scale: number;
    magnitude: number; // 控制地形高度的幅度
    offset: number;
  };
  surface: {
    offset: number; // 层级的基础高度
    magnitude: number;
  };
  // 基岩
  bedrock: {
    offset: number;
    magnitude: number;
  };
  trees: {
    frequency: number;
    trunkHeight: {
      min: number;
      max: number;
    };
    // 树冠覆盖大小
    canopy: {
      size: {
        min: number;
        max: number;
      };
    };
  };
  grass: {
    frequency: number;
    patchSize: number;
  };
  flowers: {
    frequency: number;
  };
}

// chunk 内固定方块的数据类型
export interface IInstanceData {
  block: BlockID;
  // 一个方块可能由多个 instance 组成 如 flower 就是由两个 instance plane 组成的
  instanceIds: number[]; // reference to mesh instanceId
};

export interface IWorldSize {
  width: number;
  height: number;
};