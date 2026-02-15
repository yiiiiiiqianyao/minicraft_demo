import { BlockID } from "../../Block";
import { ChunkParams } from "../chunk/literal";

/** @desc 资源方块的配置 */
export const oreConfig = {
  coal: {
    id: BlockID.CoalOre,
    scale: { x: 8, y: 8, z: 8 },
    scarcity: 0.75,
  },
  iron: {
    id: BlockID.IronOre,
    scale: { x: 5, y: 5, z: 5 },
    scarcity: 0.8,
  },
};

export const SeaSurfaceOffset = 0.5;
export const SeaSurfaceHeight = ChunkParams.height * SeaSurfaceOffset;

export const NormalTerrain = {
  scale: 220,
  magnitude: 0.08,
  offset: SeaSurfaceOffset,
}

// 平坦世界的参数
export const FlatTerrain = {
  scale: 50,
  magnitude: 0.0,
  offset: SeaSurfaceOffset,
}
export const DirtSurface = {
  offset: 0,
  magnitude: 4,
}
export const BedrockSurface = {
  offset: 1,
  magnitude: 2,
}