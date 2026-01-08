import * as THREE from "three";
import { BlockID } from "../../Block";
import { World } from "../World";
import { IWorldParams } from "../interface";
import { ChunkParams } from "../chunk/literal";

/**
 * Generates trees
 */
export const generateTrees = (
  input: BlockID[][][],
  params: IWorldParams,
  chunkPos: THREE.Vector3
): BlockID[][][] => {
  const { width, height } = ChunkParams;
  // 树冠大小
  const canopySize = params.trees.canopy.size.max;
  for (let baseX = canopySize; baseX < width - canopySize; baseX++) {
    for (let baseZ = canopySize; baseZ < width - canopySize; baseZ++) {
      const n =
        World.simplex.noise(chunkPos.x + baseX, chunkPos.z + baseZ) * 0.5 + 0.5;
      if (n < 1 - params.trees.frequency) {
        continue;
      }

      // Find the grass tile
      for (let y = height - 1; y >= 0; y--) {
        if (input[baseX][y][baseZ] !== BlockID.Grass) {
          continue;
        }

        // Found grass, move one time up
        const baseY = y + 1;

        const minH = params.trees.trunkHeight.min;
        const maxH = params.trees.trunkHeight.max;
        const trunkHeight = Math.round(World.rng.random() * (maxH - minH)) + minH;
        const topY = baseY + trunkHeight;

        // Fill in blocks for the trunk
        for (let i = baseY; i < topY; i++) {
          input[baseX][i][baseZ] = BlockID.OakLog;
        }

        // Generate the canopy 生产树冠
        // generate layer by layer, 4 layers in total
        for (let i = 0; i < 4; i++) {
          if (i === 0) {
            // first layer above the height of tree and has 5 leaves in a + shape
            input[baseX][topY][baseZ] = BlockID.Leaves;
            input[baseX + 1][topY][baseZ] = BlockID.Leaves;
            input[baseX - 1][topY][baseZ] = BlockID.Leaves;
            input[baseX][topY][baseZ + 1] = BlockID.Leaves;
            input[baseX][topY][baseZ - 1] = BlockID.Leaves;
          } else if (i === 1) {
            // base layer
            input[baseX][topY - i][baseZ] = BlockID.Leaves;
            input[baseX + 1][topY - i][baseZ] = BlockID.Leaves;
            input[baseX - 1][topY - i][baseZ] = BlockID.Leaves;
            input[baseX][topY - i][baseZ + 1] = BlockID.Leaves;
            input[baseX][topY - i][baseZ - 1] = BlockID.Leaves;

            // diagonal leaf blocks grow min of 1 and max of 3 blocks away from the trunk
            const minR = params.trees.canopy.size.min;
            const maxR = params.trees.canopy.size.max;
            const R = Math.round(World.rng.random() * (maxR - minR)) + minR;

            // grow leaves in a diagonal shape
            for (let x = -R; x <= R; x++) {
              for (let z = -R; z <= R; z++) {
                if (x * x + z * z > R * R) {
                  continue;
                }

                if (input[baseX + x][topY - i][baseZ + z] !== BlockID.Air) {
                  continue;
                }

                if (World.rng.random() > 0.5) {
                  input[baseX + x][topY - i][baseZ + z] = BlockID.Leaves;
                }
              }
            }
          } else if (i === 2 || i == 3) {
            for (let x = -2; x <= 2; x++) {
              for (let z = -2; z <= 2; z++) {
                if (input[baseX + x][topY - i][baseZ + z] !== BlockID.Air) {
                  continue;
                }

                input[baseX + x][topY - i][baseZ + z] = BlockID.Leaves;
              }
            }

            // remove 4 corners randomly
            for (const x of [-2, 2]) {
              for (const z of [-2, 2]) {
                if (World.rng.random() > 0.5) {
                  input[baseX + x][topY - i][baseZ + z] = BlockID.Air;
                }
              }
            }
          }
        }
      }
    }
  }

  return input;
};