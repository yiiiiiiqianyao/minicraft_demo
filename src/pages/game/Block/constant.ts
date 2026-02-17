/**@desc 方块ID 目前游戏中所有方块的类型 ID */
export enum BlockID {
  Air = 0,
  GrassBlock = 1,
  Dirt = 2,
  Stone = 3,
  CoalOre = 4,
  IronOre = 5,
  Bedrock = 6,
  OakLog = 7,
  BirchLog = 8, // 白桦木方块
  Leaves = 9,
  TallGrass = 10,
  ShortGrass = 11,
  FlowerRose = 12,
  FlowerDandelion = 13,
  RedstoneLamp = 14,
  StoneBrick = 15, // 石砖方块
  CraftingTable = 16, // 工作台方块
}

/**@desc 所有方块ID 数组 */
export const blockIDValues = Object.values(BlockID).filter(
  (value) => typeof value === "number"
) as BlockID[];