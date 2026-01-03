/**
 * Generate random patches of tall grass across the top surface
 */

import { BlockID } from "../../Block";
import { IWorldParams, IWorldSize } from "../interface";
import { World } from "../World";

export const generateTallGrass = (
  input: BlockID[][][],
  size: IWorldSize,
  params: IWorldParams
): BlockID[][][] => {
  for (let x = 0; x < size.width; x++) {
    for (let z = 0; z < size.width; z++) {
      // starting from the top of the chunk, find the first grass block
      // if come in contact with leaves, stop since grass doesn't grow under trees
      for (let y = size.height - 1; y >= 0; y--) {
        if (input[x][y][z] === BlockID.Leaves) {
          break;
        }

        if (input[x][y][z] === BlockID.Grass) {
          // found grass, move one time up
          const baseY = y + 1;

          if (input[x][baseY][z] !== BlockID.Air) {
            continue;
          }

          if (World.rng.random() < params.grass.frequency) {
            input[x][baseY][z] = BlockID.TallGrass;

            // Define the maximum distance from the center
            const maxDistance = params.grass.patchSize;

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
                currentX < size.width &&
                currentZ >= 0 &&
                currentZ < size.width &&
                input[currentX][baseY][currentZ] === BlockID.Air &&
                input[currentX][y][currentZ] === BlockID.Grass
              ) {
                input[currentX][baseY][currentZ] = BlockID.TallGrass;
              }
            }
          }
        }
      }
    }
  }

  return input;
};