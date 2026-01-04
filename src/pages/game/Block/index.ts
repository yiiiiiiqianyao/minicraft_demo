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
  StoneBrick = 13,
}

export const blockIdToKey = {
  [BlockID.Air]: "air",
  [BlockID.Grass]: "grass", // 草方块（目前作为地面）
  [BlockID.TallGrass]: "tall_grass", // 高草方块（草丛）
  [BlockID.Dirt]: "dirt",
  [BlockID.Stone]: "stone",
  [BlockID.CoalOre]: "coal",
  [BlockID.IronOre]: "iron",
  [BlockID.Bedrock]: "bedrock", // 基岩 方块
  [BlockID.OakLog]: "oak_log",
  [BlockID.Leaves]: "leaves",
  [BlockID.FlowerRose]: "flower_rose",
  [BlockID.FlowerDandelion]: "flower_dandelion",
  [BlockID.RedstoneLamp]: "redstone_lamp",
  [BlockID.StoneBrick]: "stone_brick",
};
