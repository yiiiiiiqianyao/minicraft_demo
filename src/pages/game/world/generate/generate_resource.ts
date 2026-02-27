import { World } from "../World";
import { getEmptyAirBlockData } from "../../Block/blocks/AirBlock";
import type { IInstanceData } from "../interface";
import { OreConfig } from "./constant";
import { BlockFactory, BlockID } from "../../Block";
import { getEmptyStoneBlockData } from "../../Block/blocks/StoneBlock";
import { ChunkParams } from "../chunk/literal";

/**@desc 生成资源方块（洞穴空洞、矿物） */
export const generateResource = (
  input: IInstanceData[][][], 
  worldX: number,
  worldY: number,
  worldZ: number, 
  x: number, 
  y: number, 
  z: number) => {
  
  /**@desc 生成洞穴空洞 */
  const CaveScale = (ChunkParams.height - worldY) / ChunkParams.height;
  const CaveNoise = (World.simplex.noise3d(
      worldX / 12,
      worldY / 12,
      worldZ / 8
    ) - World.simplex.noise3d(
      (worldX + 10) / 12,
      (worldY + 8) / 10,
      (worldZ + 6) / 8
    ) + 1) / 2 * CaveScale;
  const CaveDistribution = World.simplex.noise(worldX / 100, worldZ / 100);
  if (CaveNoise > 0.5 && CaveDistribution > 0.1) {
      input[x][y][z] = getEmptyAirBlockData();
      input[x][y][z].blockData.isCave = true;
      return;
  }

  for (const [_, config] of Object.entries(OreConfig)) {
      const value = World.simplex.noise3d(
      (worldX) / config.scale.x,
      (worldY) / config.scale.y,
      (worldZ) / config.scale.z
    );

    if (value > config.scarcity) {
      input[x][y][z] = {
        blockId: config.id,
        instanceIds: [],
        blockData: {
          breakCount: BlockFactory.getBlock(config.id).breakCount
        },
      }
      return;
    } else if (input[x][y][z].blockId === BlockID.Air) {
      input[x][y][z] = getEmptyStoneBlockData();
    }
  }
}