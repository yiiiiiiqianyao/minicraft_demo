/**@desc 方块ID 目前游戏中所有方块的类型 ID */
export enum BlockID {
  Air = 'Air',
  GrassBlock = 'GrassBlock',
  Dirt = 'Dirt',
  Stone = 'Stone',
  CoalOre = 'CoalOre',
  IronOre = 'IronOre',
  Bedrock = 'Bedrock',
  OakLog = 'OakLog',
  OakLogSapling = 'OakLogSapling', // 橡木树苗
  BirchLog = 'BirchLog', // 白桦木方块
  BirchLogSapling = 'BirchLogSapling', // 白桦木树苗
  OakLeaves = 'OakLeaves', // 橡木树叶方块
  Apple = 'Apple', // 苹果 树叶方块可能掉落
  TallGrass = 'TallGrass',
  ShortGrass = 'ShortGrass',
  FlowerRose = 'FlowerRose',
  FlowerDandelion = 'FlowerDandelion',
  RedstoneLamp = 'RedstoneLamp',
  StoneBrick = 'StoneBrick', // 石砖方块
  CraftingTable = 'CraftingTable', // 工作台方块
}

/**@desc 所有方块ID 数组 */
export const blockIDValues = Object.values(BlockID).filter(
  (value) => typeof value === "number"
) as BlockID[];