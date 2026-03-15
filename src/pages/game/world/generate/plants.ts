import * as THREE from "three";
import { BlockID } from "../../Block";
import { World } from "../World";
import type { IInstanceData } from "../interface";
import { ChunkParams } from "../chunk/literal";
import { getEmptyDirtBlockData } from "../../Block/blocks/DirtBlock";
import { getEmptyOkaBlockData } from "../../Block/blocks/OakLogBlock";
import { getEmptyBirchLogLeaveBlockData, getEmptyOakLeaveBlockData } from "../../Block/blocks/LeavesBlock";
import { getEmptyBirchBlockData } from "../../Block/blocks/BirchBlock";
import { DevControl } from "../../dev";
import { getEmptyAirBlockData } from "../../Block/blocks/AirBlock";
import { SeaSurfaceHeight } from "./constant";
import { getEmptyShortGrassBlockData } from "../../Block/blocks/ShortGrassBlock";
import { getEmptyTallGrassBlockData } from "../../Block/blocks/TallGrassBlock";
import type { ISurfaceData } from "./interface";

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
  frequency: 0.2,
  patchSize: 5,
}

const flowers =  {
  frequency: 0.019,
};

const { width } = ChunkParams;
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
  chunkPos: THREE.Vector3,
  surfaceData: ISurfaceData,
): IInstanceData[][][] => {
  if (worldType === 'flat' || worldType === 'terrain') return input;

  const treeLimitSize = width - canopySize;
  for (let x = 0; x < width; x++) {
    for (let z = 0; z < width; z++) {
      const baseX = x;
      const baseZ = z;
      const surfaceHeight = surfaceData[`${baseX},${baseZ}`];
      if (!surfaceHeight) continue;
      // 暂时根据地表进行计算
      if (input[baseX][surfaceHeight][baseZ].blockId !== BlockID.GrassBlock) continue;

      let hasTree = false;
      let hasGrass = false;
      // 在允许生成树木的范围内 generate trees
      if (baseX > canopySize && baseX < treeLimitSize && baseZ > canopySize && baseZ < treeLimitSize) {
        const worldX = chunkPos.x + baseX;
        const worldZ = chunkPos.z + baseZ;
        
        /**
         * @desc 森林噪声 简单控制森林的分布
         * f1 大片树林的分布
         * f2 单个树林的分布
        */
        const f1 = World.simplex.noise(worldX / 20, worldZ / 20);
        const f2 = World.simplex.noise(worldX / 80, worldZ / 80);
        const forestNoise = f1 * 0.2 + f2 * 0.8;
        if (forestNoise < 0.4) continue;

        const baseNoise = World.simplex.noise(worldX, worldZ);
        const treeNoise = baseNoise * 0.5 + 0.5; // [0, 1]
      
        hasTree = treeNoise >= 1 - trees.frequency;
        if (hasTree) {
          // TODO 后续优化类型判断 目前只生成 OakLog 和 Birch 两种树
          let treeType = treeNoise < 0.965 ? BlockID.OakLog : BlockID.BirchLog;
          // treeType = BlockID.OakLog;
          const getTreeBlockFunc = treeType === BlockID.OakLog ? getEmptyOkaBlockData: getEmptyBirchBlockData;
          // TODO 后续支持白桦树叶后 需要替换白桦树叶
          const getTreeLeavesFunc = treeType === BlockID.OakLog ? getEmptyOakLeaveBlockData : getEmptyBirchLogLeaveBlockData;
         
          // Found grass, move one time up
          const baseY = surfaceHeight + 1;
          // 普通的树木生长需要一定的空间，所以需要判断周围是否被其他方块占据
          if (!isAroundEmpty(input, baseX, baseY, baseZ)) {
            hasTree = false;
            continue;
          }
          
          // 当前位置需要长树，所以把当前位置的方块设置为泥土块 Set the current block to dirt block
          input[baseX][surfaceHeight][baseZ] = getEmptyDirtBlockData();

          const minH = trees.trunkHeight.min;
          const maxH = trees.trunkHeight.max;
          const tree_height_rng = World.rng.random();
          const tree_height = Math.round(tree_height_rng * (maxH - minH)) + minH;
          const topY = baseY + tree_height;

          /**@desc 生成树干 Fill in blocks for the trunk*/
          for (let i = baseY; i < topY; i++) {
            input[baseX][i][baseZ] = getTreeBlockFunc();
          }

          /**@desc 生产树冠 树叶 Generate the canopy */
          // generate layer by layer, 4 layers in total
          for (let i = 0; i < 4; i++) {
            const leaveY = topY - i;
            if (i === 0) {
              // 最顶层
              // first layer above the height of tree and has 5 leaves in a + shape
              input[baseX][leaveY][baseZ] = getTreeLeavesFunc();
              input[baseX + 1][leaveY][baseZ] = getTreeLeavesFunc();
              input[baseX - 1][leaveY][baseZ] = getTreeLeavesFunc();
              input[baseX][leaveY][baseZ + 1] = getTreeLeavesFunc();
              input[baseX][leaveY][baseZ - 1] = getTreeLeavesFunc();
            } else if (i === 1) {
              // 次顶层
              input[baseX][leaveY][baseZ] = getTreeLeavesFunc();
              input[baseX + 1][leaveY][baseZ] = getTreeLeavesFunc();
              input[baseX - 1][leaveY][baseZ] = getTreeLeavesFunc();
              input[baseX][leaveY][baseZ + 1] = getTreeLeavesFunc();
              input[baseX][leaveY][baseZ - 1] = getTreeLeavesFunc();

              // diagonal leaf blocks grow min of 1 and max of 3 blocks away from the trunk
              // const minR = trees.canopy.size.min;
              // const maxR = trees.canopy.size.max;
              // const R = Math.round(World.rng.random() * (maxR - minR)) + minR;;

              // grow leaves in a diagonal shape
              for (let x = -2; x <= 2; x++) {
                for (let z = -2; z <= 2; z++) {
                  // if (x * x + z * z > 2 * 2) {
                  //   continue;
                  // }
                  // if (input[baseX + x][leaveY][baseZ + z].blockId !== BlockID.Air) {
                  //   continue;
                  // }
                  if (World.rng.random() > 0.4) {
                    input[baseX + x][leaveY][baseZ + z] = getTreeLeavesFunc();
                  }
                }
              }
            } else if (i === 2) {
              for (let x = -2; x <= 2; x++) {
                for (let z = -2; z <= 2; z++) {
                  /**@desc 如果当前 block 不是 Air 则跳过 */
                  if (input[baseX + x][leaveY][baseZ + z].blockId !== BlockID.Air) continue;
                  input[baseX + x][leaveY][baseZ + z] = getTreeLeavesFunc();
                }
              }

              /**@desc 随机去除一些叶子 remove 4 corners randomly*/
              for (const x of [-2, 2]) {
                for (const z of [-2, 2]) {
                  // 避免影响到别的 block
                  if (
                    (input[baseX + x][leaveY][baseZ + z].blockId === BlockID.OakLeaves ||
                      input[baseX + x][leaveY][baseZ + z].blockId === BlockID.BirchLeaves) 
                      && World.rng.random() > 0.4) {
                    input[baseX + x][leaveY][baseZ + z] = getEmptyAirBlockData();
                    input[baseX + x][leaveY+1][baseZ + z] = getEmptyAirBlockData();
                  }
                }
              }
            } else if (tree_height > 4 && i === 3){
              for (let x = -2; x <= 2; x++) {
                for (let z = -2; z <= 2; z++) {
                  /**@desc 如果当前 block 不是 Air 则跳过 */
                  if (input[baseX + x][leaveY][baseZ + z].blockId !== BlockID.Air) continue;
                  input[baseX + x][leaveY][baseZ + z] = getTreeLeavesFunc();
                }
              }

              /**@desc 随机去除一些叶子 remove 4 corners randomly*/
              for (const x of [-2, 2]) {
                for (const z of [-2, 2]) {
                  // 避免影响到别的 block
                  if (
                    (input[baseX + x][leaveY][baseZ + z].blockId === BlockID.OakLeaves ||
                      input[baseX + x][leaveY][baseZ + z].blockId === BlockID.BirchLeaves) 
                      && World.rng.random() > 0.3) {
                    input[baseX + x][leaveY][baseZ + z] = getEmptyAirBlockData();
                    input[baseX + x][leaveY][baseZ + z] = getEmptyAirBlockData();
                  }
                }
              }
            }
          }
        }
      }

      if (hasTree) continue;

      // generate grass & flower 草和花在草方块上生长
      const upperY = surfaceHeight + 1;
      if (input[x][upperY][z].blockId !== BlockID.Air) continue;
      const grass_rng = World.rng.random();
      if (grass_rng < tallGrass.frequency) {
        hasGrass = true;
        input[x][upperY][z] = grass_rng < 0.06 ? getEmptyShortGrassBlockData() : getEmptyTallGrassBlockData();

        // Define the maximum distance from the center
        const maxDistance = tallGrass.patchSize;

        // Random walk algorithm
        let currentX = x;
        let currentZ = z;
        for (let i = 0; i < maxDistance; i++) {
          // const grass_rng2 = World.rng.random();
          const direction = grass_rng * 2 * Math.PI; // Random direction
          currentX += Math.round(Math.cos(direction));
          currentZ += Math.round(Math.sin(direction));

          // Check if the new position is within the chunk boundaries and is air
          if (
            currentX >= 0 &&
            currentX < width &&
            currentZ >= 0 &&
            currentZ < width &&
            input[currentX][upperY][currentZ].blockId === BlockID.Air &&
            input[currentX][surfaceHeight][currentZ].blockId === BlockID.GrassBlock
          ) {
            // input[currentX][upperY][currentZ] = getEmptyShortGrassBlockData();
            input[currentX][upperY][currentZ] = grass_rng < 0.06 ? getEmptyShortGrassBlockData() : getEmptyTallGrassBlockData();
            continue;
          }
        }
      }

      if (hasGrass) continue;

      // 在草方块上长花
      if (input[x][upperY][z].blockId !== BlockID.Air) continue;
      // 只在海平面以上和以下 10 个高度内长花
      if (surfaceHeight < SeaSurfaceHeight || surfaceHeight > SeaSurfaceHeight + 10) continue;

      if (World.rng.random() < flowers.frequency) {
        const flowerId =
          World.rng.random() < 0.5 ? BlockID.FlowerDandelion : BlockID.FlowerRose;
        input[x][upperY][z] = {
          blockId: flowerId,
          instanceIds: [],
          blockData: {},
        };
        continue;
      }
    }
  }
  return input;
};