import * as THREE from "three";
import { World } from "../World";
import { BlockID } from "../../Block";
import { ChunkParams } from "../chunk/literal";
import type { IInstanceData } from "../interface";
import { DevControl } from "../../dev";
import { getEmptyDirtBlockData } from "../../Block/blocks/DirtBlock";
import { getEmptyStoneBlockData } from "../../Block/blocks/StoneBlock";
import { getEmptyGrassBlockData } from "../../Block/blocks/GrassBlock";

const normalTerrain = {
  scale: 50,
  magnitude: 0.1,
  offset: 0.5,
}

// 平坦世界的参数
const flatTerrain = {
  scale: 50,
  magnitude: 0.0,
  offset: 0.5,
}
const surface = {
  offset: 4,
  magnitude: 4,
}
const bedrock = {
  offset: 1,
  magnitude: 2,
}

/**
 * Generates the terrain data
 */
export const generateTerrain = (input: IInstanceData[][][], chunkPos: THREE.Vector3): IInstanceData[][][] => {
  const { width, height } = ChunkParams;
  const { worldType } = DevControl;
  const terrainConfig = worldType === 'flat' ? flatTerrain : normalTerrain;
  
  for (let x = 0; x < width; x++) {
    for (let z = 0; z < width; z++) {
      // block position of world
      const value = World.simplex.noise(
        (chunkPos.x + x) / terrainConfig.scale,
        (chunkPos.z + z) / terrainConfig.scale
      );
      const scaledNoise = terrainConfig.offset + terrainConfig.magnitude * value;

      let terrainHeight = Math.floor(height * scaledNoise);
      terrainHeight = Math.max(0, Math.min(terrainHeight, height - 1));

      // 地表表层方块
      const surfaceHeight = surface.offset +
        Math.abs(World.simplex.noise(x, z) * surface.magnitude);

      // 基岩
      const bedrockHeight = bedrock.offset +
        Math.abs(World.simplex.noise(x, z) * bedrock.magnitude);

      for (let y = 0; y < height; y++) {
        // TODO 生成地形的时候 后续生成洞穴 连续
        // World.simplex.noise3d(x, y, z)
        if (y < terrainHeight) {
          if(y >= terrainHeight - surfaceHeight) {
            // 地表层到地面是泥土
            input[x][y][z] = getEmptyDirtBlockData();
          } else if(y >= bedrockHeight) {
            // 从基岩层到地表层
            if (input[x][y][z].blockId === BlockID.Air) {
              input[x][y][z] = getEmptyStoneBlockData();
            } else {
              // 其他情况 保持原有方块（生产的各种资源方块）
            }
          } else {
            // 低于基岩层 都是基岩
            input[x][y][z] = {
              blockId: BlockID.Bedrock,
              instanceIds: [],
              blockData: {},
            }
          }
          // if (y < bedrockHeight) {
          //   input[x][y][z] = BlockID.Bedrock;
          // } else if (y < terrainHeight - surfaceHeight) {
          //   if (input[x][y][z] === BlockID.Air) {
          //     input[x][y][z] = BlockID.Stone;
          //   }
          // } else {
          //   input[x][y][z] = BlockID.Dirt;
          // }
        } else if (y === terrainHeight) {
          // TODO 暂时作为地表的方块
          input[x][y][z] = getEmptyGrassBlockData();
          if(DevControl.showBorder && (x === 0 || z === 0)) {
            input[x][y][z] = {
              blockId: BlockID.Bedrock,
              instanceIds: [],
              blockData: {},
            }
          }
        } else if (y > terrainHeight) {
          input[x][y][z] = {
            blockId: BlockID.Air,
            instanceIds: [],
            blockData: {},
          }
        }
      }
    }
  }

  return input;
};