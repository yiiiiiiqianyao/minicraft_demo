import * as THREE from "three";
import { BlockID } from "../../Block";
import { World } from "../World";
import type { IInstanceData } from "../interface";
import { ChunkParams } from "../chunk/literal";
import { getEmptyDirtBlockData } from "../../Block/blocks/DirtBlock";
import { getEmptyOkaBlockData } from "../../Block/blocks/OakLogBlock";
import { getEmptyOakLeaveBlockData } from "../../Block/blocks/LeavesBlock";
import { getEmptyBirchBlockData } from "../../Block/blocks/BirchBlock";
import { DevControl } from "../../dev";
import { getEmptyAirBlockData } from "../../Block/blocks/AirBlock";
import { SeaSurfaceHeight, terrainSafeOffset } from "./constant";
import { getEmptyShortGrassBlockData } from "../../Block/blocks/ShortGrassBlock";
import { getEmptyTallGrassBlockData } from "../../Block/blocks/TallGrassBlock";

const trees = {
  frequency: 0.08,
  trunkHeight: {
    min: 4,
    max: 6,
  },
  canopy: {
    size: {
      min: 1,
      max: 3,
    },
  },
}
// 树冠大小
const canopySize = trees.canopy.size.max;
// canopySize => 暂时不在 chunk 的边界生成树

const tallGrass = {
  frequency: 0.08,
  patchSize: 5,
}

const flowers =  {
  frequency: 0.019,
};

const { width, height } = ChunkParams;
const { worldType } = DevControl;

function isAroundEmpty(input: IInstanceData[][][], baseX: number, baseY: number, baseZ: number) {
  if (input[baseX + 1][baseY][baseZ].blockId !== BlockID.Air || 
    input[baseX - 1][baseY][baseZ].blockId !== BlockID.Air || 
    input[baseX][baseY][baseZ + 1].blockId !== BlockID.Air || 
    input[baseX][baseY][baseZ - 1].blockId !== BlockID.Air
  ) {
    return false;
  }
  return true;
}

/**
 * @desc 生成植物
 */
export const generatePlants = (
  input: IInstanceData[][][],
  chunkPos: THREE.Vector3
): IInstanceData[][][] => {
  if (worldType === 'flat' || worldType === 'terrain') return input;

  const treeLimitSize = width - canopySize;
  for (let x = 0; x < width; x++) {
    for (let z = 0; z < width; z++) {
      const baseX = x;
      const baseZ = z;
      // generate trees
      if (baseX > canopySize && baseX < treeLimitSize && baseZ > canopySize && baseZ < treeLimitSize) {
        const worldX = chunkPos.x + baseX;
        const worldZ = chunkPos.z + baseZ;
        
        // Tip: 森林噪声 简单控制森林的分布
        const f1 = World.simplex.noise(worldX / 20, worldZ / 20);
        const f2 = World.simplex.noise(worldX / 80, worldZ / 80);
        const forestNoise = f1 * 0.2 + f2 * 0.8;
        if (forestNoise < 0.4) continue;

        const baseNoise = World.simplex.noise(worldX, worldZ);
        const treeNoise = baseNoise * 0.5 + 0.5; // [0, 1]
      
        const hasTree = treeNoise >= 1 - trees.frequency;
        if (!hasTree) continue;

        // TODO 后续优化类型判断 目前只生成 OakLog 和 Birch 两种树
        const treeType = treeNoise < 0.965 ? BlockID.OakLog : BlockID.BirchLog;
        const getTreeBlockFunc = treeType === BlockID.OakLog ? getEmptyOkaBlockData: getEmptyBirchBlockData;
        // TODO 后续支持白桦树叶后 需要替换白桦树叶
        const getTreeLeavesFunc = getEmptyOakLeaveBlockData;
        /**
         * @desc 找到地表高度 Find the grass tile
         * 从上到下开始查找
        */
        for (let y = height - terrainSafeOffset; y >= 0; y--) {
          // TODO 判断条件后续需要优化
          if (input[baseX][y][baseZ].blockId !== BlockID.GrassBlock) continue;
          
          // Found grass, move one time up
          const baseY = y + 1;
          // 普通的树木生长需要一定的空间，所以需要判断周围是否被其他方块占据
          if (!isAroundEmpty(input, baseX, baseY, baseZ)) continue;
          
          // 当前位置需要长树，所以把当前位置的方块设置为泥土块 Set the current block to dirt block
          input[baseX][y][baseZ] = getEmptyDirtBlockData();

          const minH = trees.trunkHeight.min;
          const maxH = trees.trunkHeight.max;
          const trunkHeight = Math.round(World.rng.random() * (maxH - minH)) + minH;
          const topY = baseY + trunkHeight;

          
          /**@desc 生成树干 Fill in blocks for the trunk*/
          for (let i = baseY; i < topY; i++) {
            input[baseX][i][baseZ] = getTreeBlockFunc();
          }

          /**@desc 生产树冠 树叶 Generate the canopy */
          // generate layer by layer, 4 layers in total
          for (let i = 0; i < 4; i++) {
            if (i === 0) {
              // first layer above the height of tree and has 5 leaves in a + shape
              input[baseX][topY][baseZ] = getTreeLeavesFunc();
              input[baseX + 1][topY][baseZ] = getTreeLeavesFunc();
              input[baseX - 1][topY][baseZ] = getTreeLeavesFunc();
              input[baseX][topY][baseZ + 1] = getTreeLeavesFunc();
              input[baseX][topY][baseZ - 1] = getTreeLeavesFunc();
            } else if (i === 1) {
              // base layer
              input[baseX][topY - i][baseZ] = getTreeLeavesFunc();
              input[baseX + 1][topY - i][baseZ] = getTreeLeavesFunc();
              input[baseX - 1][topY - i][baseZ] = getTreeLeavesFunc();
              input[baseX][topY - i][baseZ + 1] = getTreeLeavesFunc();
              input[baseX][topY - i][baseZ - 1] = getTreeLeavesFunc();

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
                    input[baseX + x][topY - i][baseZ + z] = getTreeLeavesFunc();
                  }
                }
              }
            } else if (i === 2 || i == 3) {
              for (let x = -2; x <= 2; x++) {
                for (let z = -2; z <= 2; z++) {
                  /**@desc 如果当前 block 不是 Air 则跳过 */
                  if (input[baseX + x][topY - i][baseZ + z].blockId !== BlockID.Air) continue;
                  input[baseX + x][topY - i][baseZ + z] = getTreeLeavesFunc();
                }
              }

              /**@desc 随机去除一些叶子 remove 4 corners randomly*/
              for (const x of [-2, 2]) {
                for (const z of [-2, 2]) {
                  // 避免影响到别的 block
                  if (input[baseX + x][topY - i][baseZ + z].blockId === BlockID.OakLeaves && World.rng.random() > 0.5) {
                    input[baseX + x][topY - i][baseZ + z] = getEmptyAirBlockData();
                  }
                }
              }
            }
          }
        }
      }
      // generate grass & flower
      for (let y = height - terrainSafeOffset; y >= 0; y--) {
        const baseY = y + 1;
        // 如果接触到树叶，停止生长，因为花朵和草不能在树底下生长
        if (input[x][y][z].blockId === BlockID.OakLeaves) break;
        // 草和花在草方块上生长
        if (input[x][y][z].blockId === BlockID.GrassBlock) {
          // found grass, move one time up
          if (input[x][baseY][z].blockId !== BlockID.Air) continue;
          // 草会长在草方块上
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
                input[currentX][baseY][currentZ] = getEmptyShortGrassBlockData();
                break;
              }
            }
          }

          // 在草方块上长花
          if (input[x][baseY][z].blockId !== BlockID.Air) continue;
          // 只在海平面以上和以下 10 个高度内长花
          if (y < SeaSurfaceHeight || y > SeaSurfaceHeight + 10) continue;

          const flowerId =
            World.rng.random() < 0.5 ? BlockID.FlowerDandelion : BlockID.FlowerRose;

          if (World.rng.random() < flowers.frequency) {
            input[x][baseY][z] = {
              blockId: flowerId,
              instanceIds: [],
              blockData: {},
            };
            break;
          }

        }
      }
    }
  }
  return input;
};