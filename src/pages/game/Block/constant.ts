/**@desc 方块ID 目前游戏中所有方块的类型 ID */
export enum BlockID {
  Air = 0,
  Grass = 1,
  Dirt = 2,
  Stone = 3,
  CoalOre = 4,
  IronOre = 5,
  Bedrock = 6,
  OakLog = 7,
  Leaves = 8,
  TallGrass = 9,
  FlowerRose = 10,
  FlowerDandelion = 11,
  RedstoneLamp = 12,
  StoneBrick = 13, // 石砖方块
  CraftingTable = 14, // 工作台方块
}

/**@desc 所有方块ID 数组 */
export const blockIDValues = Object.values(BlockID).filter(
      (value) => typeof value === "number"
    ) as BlockID[];
