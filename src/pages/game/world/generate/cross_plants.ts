/**
 * Generate random patches of tall grass across the top surface
 */

import { BlockID } from "../../Block";
import { getEmptyShortGrassBlockData } from "../../Block/blocks/ShortGrassBlock";
import { getEmptyTallGrassBlockData } from "../../Block/blocks/TallGrassBlock";
import { DevControl } from "../../dev";
import { ChunkParams } from "../chunk/literal";
import type { IInstanceData } from "../interface";
import { World } from "../World";

const tallGrass = {
  frequency: 0.02,
  patchSize: 5,
}

export const generateCrossPlants = (
  input: IInstanceData[][][],
): IInstanceData[][][] => {
  const { width, height } = ChunkParams;
  const { worldType } = DevControl;
  if (worldType === 'flat' || worldType === 'terrain') return input;

  for (let x = 0; x < width; x++) {
    for (let z = 0; z < width; z++) {
      // starting from the top of the chunk, find the first grass block
      // if come in contact with leaves, stop since grass doesn't grow under trees
      for (let y = height - 1; y >= 0; y--) {
        /**
         * @desc 生成交叉植物
         * 1. 遇到树叶就停止 因为草不生长在树底下 (当前 xz 坐标都跳过)
         * 2. 树叶的下方可能张蘑菇
        */ 
      //  TODO 后续加上蘑菇
        if (input[x][y][z].blockId === BlockID.Leaves) break;

        // 草会长在草方块上
        if (input[x][y][z].blockId === BlockID.GrassBlock) {
          // found grass, move one time up
          const baseY = y + 1;

          if (input[x][baseY][z].blockId !== BlockID.Air) {
            continue;
          }

          if (World.rng.random() < tallGrass.frequency) {
            input[x][baseY][z] = getEmptyTallGrassBlockData();

            // Define the maximum distance from the center
            const maxDistance = tallGrass.patchSize;

            // Random walk algorithm
            let currentX = x;
            let currentZ = z;
            for (let i = 0; i < maxDistance; i++) {
              const direction = World.rng.random() * 2 * Math.PI; // Random direction
              currentX += Math.round(Math.cos(direction));
              currentZ += Math.round(Math.sin(direction));

              // Check if the new position is within the chunk boundaries and is air
              if (
                currentX >= 0 &&
                currentX < width &&
                currentZ >= 0 &&
                currentZ < width &&
                input[currentX][baseY][currentZ].blockId === BlockID.Air &&
                input[currentX][y][currentZ].blockId === BlockID.GrassBlock
              ) {
                // input[currentX][baseY][currentZ] = getEmptyTallGrassBlockData();
                input[currentX][baseY][currentZ] = getEmptyShortGrassBlockData();
              }
            }
          }
        }
      }
    }
  }

  return input;
};