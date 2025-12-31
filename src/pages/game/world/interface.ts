import { BlockID } from "../Block";

// 创造场景时候的初始参数
export interface IWorldParams {
  seed: number;
  terrain: {
    scale: number;
    magnitude: number;
    offset: number;
  };
  surface: {
    offset: number;
    magnitude: number;
  };
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

export interface IInstanceData {
  block: BlockID;
  instanceIds: number[]; // reference to mesh instanceId
};

export interface IWorldSize {
  width: number;
  height: number;
};