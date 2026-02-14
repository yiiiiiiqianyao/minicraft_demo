import * as THREE from "three";
import { BlockID } from "../../Block";
import { World } from "../World";
import type { IInstanceData } from "../interface";
import { ChunkParams } from "../chunk/literal";
import { getEmptyDirtBlockData } from "../../Block/blocks/DirtBlock";
import { getEmptyOkaBlockData } from "../../Block/blocks/OakLogBlock";
import { getEmptyLeaveBlockData } from "../../Block/blocks/LeavesBlock";
import { getEmptyBirchBlockData } from "../../Block/blocks/BirchBlock";
import { DevControl } from "../../dev";

const trees = {
  frequency: 0.04,
  trunkHeight: {
    min: 5,
    max: 7,
  },
  canopy: {
    size: {
      min: 1,
      max: 3,
    },
  },
}

/**
 * Generates trees
 */
export const generateTrees = (
  input: IInstanceData[][][],
  chunkPos: THREE.Vector3
): IInstanceData[][][] => {
  const { width, height } = ChunkParams;

  const { worldType } = DevControl;
  if (worldType === 'flat' || worldType === 'terrain') return input;
  

  // 树冠大小
  const canopySize = trees.canopy.size.max;
  // canopySize 暂时不在 chunk 的边界生成树
  for (let baseX = canopySize; baseX < width - canopySize; baseX++) {
    for (let baseZ = canopySize; baseZ < width - canopySize; baseZ++) {
      const worldX = chunkPos.x + baseX;
      const worldZ = chunkPos.z + baseZ;
      
      const baseNoise = World.simplex.noise(worldX, worldZ);
      const treeNoise = baseNoise * 0.5 + 0.5; // [0, 1]
      const hasTree = treeNoise >= 1 - trees.frequency;
      if (!hasTree) {
        continue;
      }
      // TODO 后续优化类型判断 目前只生成 OakLog 和 Birch 两种树
      const treeType = treeNoise < 0.99 ? BlockID.OakLog : BlockID.BirchLog;

      /**@desc 找到地表高度 Find the grass tile*/
      for (let y = height - 1; y >= 0; y--) {
        // TODO 判断条件后续需要优化
        if (input[baseX][y][baseZ].blockId !== BlockID.Grass) {
          continue;
        }
        
        // Found grass, move one time up
        const baseY = y + 1;
        // 普通的树木生长需要一定的空间，所以需要判断周围是否被其他方块占据
        if (input[baseX + 1][baseY][baseZ].blockId !== BlockID.Air || 
          input[baseX - 1][baseY][baseZ].blockId !== BlockID.Air || 
          input[baseX][baseY][baseZ + 1].blockId !== BlockID.Air || 
          input[baseX][baseY][baseZ - 1].blockId !== BlockID.Air
        ) {
          continue;
        }
        
        // 当前位置需要长树，所以把当前位置的方块设置为泥土块 Set the current block to dirt block
        input[baseX][y][baseZ] = getEmptyDirtBlockData();

        

        const minH = trees.trunkHeight.min;
        const maxH = trees.trunkHeight.max;
        const trunkHeight = Math.round(World.rng.random() * (maxH - minH)) + minH;
        const topY = baseY + trunkHeight;

        // Fill in blocks for the trunk
        for (let i = baseY; i < topY; i++) {
          input[baseX][i][baseZ] = treeType === BlockID.OakLog ? getEmptyOkaBlockData() : getEmptyBirchBlockData();
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