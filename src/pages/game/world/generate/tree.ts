import * as THREE from "three";
import { BlockID } from "../../Block";
import { World } from "../World";
import type { IInstanceData, IWorldParams } from "../interface";
import { ChunkParams } from "../chunk/literal";
import { getEmptyDirtBlockData } from "../../Block/blocks/DirtBlock";
import { getEmptyOkaBlockData } from "../../Block/blocks/OakLogBlock";
import { getEmptyLeaveBlockData } from "../../Block/blocks/LeavesBlock";

/**
 * Generates trees
 */
export const generateTrees = (
  input: IInstanceData[][][],
  params: IWorldParams,
  chunkPos: THREE.Vector3
): IInstanceData[][][] => {
  const { width, height } = ChunkParams;
  const { trees } = params;
  if (!trees) return input;
  // 树冠大小
  const canopySize = trees.canopy.size.max;
  for (let baseX = canopySize; baseX < width - canopySize; baseX++) {
    for (let baseZ = canopySize; baseZ < width - canopySize; baseZ++) {
      const n = World.simplex.noise(chunkPos.x + baseX, chunkPos.z + baseZ) * 0.5 + 0.5;
      if (n < 1 - trees.frequency) {
        continue;
      }

      /**@desc 找到地表高度 Find the grass tile*/
      for (let y = height - 1; y >= 0; y--) {
        // TODO 判断条件后续需要优化
        if (input[baseX][y][baseZ].blockId !== BlockID.Grass) {
          continue;
        }
        // 当前位置需要长树，所以把当前位置的方块设置为泥土块 Set the current block to dirt block
        input[baseX][y][baseZ] = getEmptyDirtBlockData();

        // Found grass, move one time up
        const baseY = y + 1;

        const minH = trees.trunkHeight.min;
        const maxH = trees.trunkHeight.max;
        const trunkHeight = Math.round(World.rng.random() * (maxH - minH)) + minH;
        const topY = baseY + trunkHeight;

        // Fill in blocks for the trunk
        for (let i = baseY; i < topY; i++) {
          input[baseX][i][baseZ] = getEmptyOkaBlockData();
        }

        // Generate the canopy 生产树冠
        // generate layer by layer, 4 layers in total
        for (let i = 0; i < 4; i++) {
          if (i === 0) {
            // first layer above the height of tree and has 5 leaves in a + shape
            input[baseX][topY][baseZ] = getEmptyLeaveBlockData();
            input[baseX + 1][topY][baseZ] = getEmptyLeaveBlockData();
            input[baseX - 1][topY][baseZ] = getEmptyLeaveBlockData();
            input[baseX][topY][baseZ + 1] = getEmptyLeaveBlockData();
            input[baseX][topY][baseZ - 1] = getEmptyLeaveBlockData();
          } else if (i === 1) {
            // base layer
            input[baseX][topY - i][baseZ] = getEmptyLeaveBlockData();
            input[baseX + 1][topY - i][baseZ] = getEmptyLeaveBlockData();
            input[baseX - 1][topY - i][baseZ] = getEmptyLeaveBlockData();
            input[baseX][topY - i][baseZ + 1] = getEmptyLeaveBlockData();
            input[baseX][topY - i][baseZ - 1] = getEmptyLeaveBlockData();

            // diagonal leaf blocks grow min of 1 and max of 3 blocks away from the trunk
            const minR = trees.canopy.size.min;
            const maxR = trees.canopy.size.max;
            const R = Math.round(World.rng.random() * (maxR - minR)) + minR;

            // grow leaves in a diagonal shape
            for (let x = -R; x <= R; x++) {
              for (let z = -R; z <= R; z++) {
                if (x * x + z * z > R * R) {
                  continue;
                }

                if (input[baseX + x][topY - i][baseZ + z].blockId !== BlockID.Air) {
                  continue;
                }

                if (World.rng.random() > 0.5) {
                  input[baseX + x][topY - i][baseZ + z] = getEmptyLeaveBlockData();
                }
              }
            }
          } else if (i === 2 || i == 3) {
            for (let x = -2; x <= 2; x++) {
              for (let z = -2; z <= 2; z++) {
                if (input[baseX + x][topY - i][baseZ + z].blockId !== BlockID.Air) {
                  continue;
                }

                input[baseX + x][topY - i][baseZ + z] = {
                  blockId: BlockID.Leaves,
                  instanceIds: [],
                  blockData: {},
                };
              }
            }

            // remove 4 corners randomly
            for (const x of [-2, 2]) {
              for (const z of [-2, 2]) {
                if (World.rng.random() > 0.5) {
                  input[baseX + x][topY - i][baseZ + z] = {
                    blockId: BlockID.Air,
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
  }

  return input;
};