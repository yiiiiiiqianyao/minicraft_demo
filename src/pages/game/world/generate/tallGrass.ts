/**
 * Generate random patches of tall grass across the top surface
 */

import { BlockID } from "../../Block";
import { DevControl } from "../../dev";
import { ChunkParams } from "../chunk/literal";
import type { IInstanceData } from "../interface";
import { World } from "../World";

const tallGrass = {
  frequency: 0.02,
  patchSize: 5,
}

export const generateTallGrass = (
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
        if (input[x][y][z].blockId === BlockID.Leaves) {
          break;
        }

        if (input[x][y][z].blockId === BlockID.Grass) {
          // found grass, move one time up
          const baseY = y + 1;

          if (input[x][baseY][z].blockId !== BlockID.Air) {
            continue;
          }

          if (World.rng.random() < tallGrass.frequency) {
            input[x][baseY][z] = {
              blockId: BlockID.TallGrass,
              instanceIds: [],
              blockData: {},
            };

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
                input[currentX][y][currentZ].blockId === BlockID.Grass
              ) {
                input[currentX][baseY][currentZ] = {
                  blockId: BlockID.TallGrass,
                  instanceIds: [],
                  blockData: {},
                };
              }
            }
          }
        }
      }
    }
  }

  return input;
};