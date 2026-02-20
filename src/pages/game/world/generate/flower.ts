import { BlockID } from "../../Block";
import { DevControl } from "../../dev";
import { ChunkParams } from "../chunk/literal";
import type { IInstanceData } from "../interface";
import { World } from "../World";
import { SeaSurfaceHeight } from "./constant";

const flowers =  {
  frequency: 0.0185,
};
const { width, height } = ChunkParams;
const { worldType } = DevControl;

/**
 * Generate random patches of flowers across the top surface
 */
export const generateFlowers = (
  input: IInstanceData[][][]): IInstanceData[][][] => {
  if (worldType === 'flat' || worldType === 'terrain') return input;

  for (let x = 0; x < width; x++) {
    for (let z = 0; z < width; z++) {
      // starting from the top of the chunk, find the first grass block
      // if come in contact with leaves, stop since flowers doesn't grow under trees
      for (let y = height - 1; y >= 0; y--) {
        // 只在海平面以上和以下 10 个高度内长花
        if (y < SeaSurfaceHeight || y > SeaSurfaceHeight + 10) {
          continue;
        }

        // 如果接触到树叶，停止生长，因为花朵不能在树底下生长
        if (input[x][y][z].blockId === BlockID.OakLeaves) {
          break;
        }

        // 在草方块上长花
        if (input[x][y][z].blockId === BlockID.GrassBlock) {
          // found grass, move one time up
          const baseY = y + 1;

          if (input[x][baseY][z].blockId !== BlockID.Air) {
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
                input[nx][baseY][nz].blockId === BlockID.TallGrass
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

          if (World.rng.random() < flowers.frequency) {
            input[x][baseY][z] = {
              blockId: flowerId,
              instanceIds: [],
              blockData: {},
            };
          }
        }
      }
    }
  }

  return input;
};