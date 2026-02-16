import * as THREE from "three";
import { World } from "../World";
import { getEmptyAirBlockData } from "../../Block/blocks/AirBlock";
import type { IInstanceData } from "../interface";
import { oreConfig } from "./constant";
import { BlockFactory, BlockID } from "../../Block";
import { getEmptyStoneBlockData } from "../../Block/blocks/StoneBlock";

/**@desc 生成资源方块（洞穴空洞、矿物） */
export const generateResource = (
  input: IInstanceData[][][], 
  chunkPos: THREE.Vector3, 
  x: number, 
  y: number, 
  z: number) => {
  const worldX = chunkPos.x + x;
  const worldY = chunkPos.y + y;
  const worldZ = chunkPos.z + z;
  
  /**@desc 生成洞穴空洞 */
  const CafeNoise = World.simplex.noise3d(
      worldX / 12,
      worldY / 12,
      worldZ / 8
    ) - World.simplex.noise3d(
      (worldX + 16) / 8,
      (worldY + 8) / 12,
      (worldZ + 4) / 12
    );
  if (CafeNoise > 0.55) {
      input[x][y][z] = getEmptyAirBlockData();
      return;
  }

  for (const [_, config] of Object.entries(oreConfig)) {
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