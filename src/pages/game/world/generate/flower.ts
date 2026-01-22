import { BlockID } from "../../Block";
import { ChunkParams } from "../chunk/literal";
import type { IWorldParams } from "../interface";
import { World } from "../World";

/**
 * Generate random patches of flowers across the top surface
 */
export const generateFlowers = (
  input: BlockID[][][], params: IWorldParams): BlockID[][][] => {
  const { width, height } = ChunkParams;
  for (let x = 0; x < width; x++) {
    for (let z = 0; z < width; z++) {
      // starting from the top of the chunk, find the first grass block
      // if come in contact with leaves, stop since flowers doesn't grow under trees
      for (let y = height - 1; y >= 0; y--) {
        if (input[x][y][z] === BlockID.Leaves) {
          break;
        }

        if (input[x][y][z] === BlockID.Grass) {
          // found grass, move one time up
          const baseY = y + 1;

          if (input[x][baseY][z] !== BlockID.Air) {
            continue;
          }

          // Check if there's a tallgrass block within 3 blocks
          let isTallGrassNearby = false;
          for (let dx = -3; dx <= 3; dx++) {
            for (let dz = -3; dz <= 3; dz++) {
              const nx = x + dx;
              const nz = z + dz;
              if (
                nx >= 0 &&
                nx < width &&
                nz >= 0 &&
                nz < width &&
                input[nx][baseY][nz] === BlockID.TallGrass
              ) {
                isTallGrassNearby = true;
                break;
              }
            }
            if (isTallGrassNearby) {
              break;
            }
          }

          if (isTallGrassNearby) {
            continue;
          }

          const flowerId =
            World.rng.random() < 0.5 ? BlockID.FlowerDandelion : BlockID.FlowerRose;

          if (World.rng.random() < params.flowers.frequency) {
            input[x][baseY][z] = flowerId;
          }
        }
      }
    }
  }

  return input;
};