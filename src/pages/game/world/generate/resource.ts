import * as THREE from "three";
import { World } from "../World";
import { BlockFactory, BlockID } from "../../Block";
import { ChunkParams } from "../chunk/literal";
import type { IInstanceData } from "../interface";

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

/**
 * Generates the resources (coal, stone, etc.) for the world
 */
export const generateResources = (
  input: IInstanceData[][][],
  chunkPos: THREE.Vector3
): IInstanceData[][][] => {
  const { width, height } = ChunkParams;
  for (const [_, config] of Object.entries(oreConfig)) {
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        for (let z = 0; z < width; z++) {
          const value = World.simplex.noise3d(
            (chunkPos.x + x) / config.scale.x,
            (chunkPos.y + y) / config.scale.y,
            (chunkPos.z + z) / config.scale.z
          );

          if (value > config.scarcity) {
            input[x][y][z] = {
              blockId: config.id,
              instanceIds: [],
              blockData: {
                breakCount: BlockFactory.getBlock(config.id).breakCount
              },
            }
          }
        }
      }
    }
  }

  return input;
};