import { BlockID } from "../../Block";
import { ChunkParams } from "../chunk/literal";

/** @desc 资源方块的配置 */
export const OreConfig = {
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

// 高度范围限制：防止生成超出世界高度范围的方块 有树的生成 所以要预留一些空间
export const terrainSafeOffset = 10;
export const SeaSurfaceOffset = 0.5;
export const SeaSurfaceHeight = ChunkParams.height * SeaSurfaceOffset;

/**@desc 普通地形 */
export const NormalTerrain = {
  scale: 220,
  magnitude: 0.08,
  offset: SeaSurfaceOffset,
}

/**@desc 平坦世界的参数 */
export const FlatTerrain = {
  scale: 50,
  magnitude: 0.0,
  offset: SeaSurfaceOffset,
}

/**@desc 泥土层 */
export const DirtSurface = {
  offset: 0,
  // 泥土层偏移：加入一些偏移量 使泥土层不是完全平坦的
  magnitude: 4,
}
/**@desc 基岩层 */
export const BedrockSurface = {
  offset: 1,
  magnitude: 2,
}