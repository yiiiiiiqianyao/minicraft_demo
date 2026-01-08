import * as THREE from "three";
import { World } from "../World";
import { IWorldParams } from "../interface";
import { BlockID } from "../../Block";
import { ChunkParams } from "../chunk/literal";

/**
 * Generates the terrain data
 */
export const generateTerrain = (
  input: BlockID[][][],
  params: IWorldParams,
  chunkPos: THREE.Vector3
): BlockID[][][] => {
  const { width, height } = ChunkParams;
  for (let x = 0; x < width; x++) {
    for (let z = 0; z < width; z++) {
      // block position of world
      const value = World.simplex.noise(
        (chunkPos.x + x) / params.terrain.scale,
        (chunkPos.z + z) / params.terrain.scale
      );

      const scaledNoise =
        params.terrain.offset + params.terrain.magnitude * value;

      let terrainHeight = Math.floor(height * scaledNoise);
      terrainHeight = Math.max(0, Math.min(terrainHeight, height - 1));

      // 地表表层方块
      const surfaceHeight =
        params.surface.offset +
        Math.abs(World.simplex.noise(x, z) * params.surface.magnitude);

      // 基岩
      const bedrockHeight =
        params.bedrock.offset +
        Math.abs(World.simplex.noise(x, z) * params.bedrock.magnitude);

      for (let y = 0; y < height; y++) {
        // TODO 生成地形的时候 后续生成洞穴 连续
        // World.simplex.noise3d(x, y, z)
        if (y < terrainHeight) {
          if(y >= terrainHeight - surfaceHeight) {
            // 地表层到地面是泥土
            input[x][y][z] = BlockID.Dirt;
          } else if(y >= bedrockHeight) {
            // 从基岩层到地表层
            if (input[x][y][z] === BlockID.Air) {
              input[x][y][z] = BlockID.Stone;
            } else {
              // 其他情况 保持原有方块（生产的各种资源方块）
            }
          } else {
            // 低于基岩层 都是基岩
            input[x][y][z] = BlockID.Bedrock;
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
          input[x][y][z] = BlockID.Grass;
        } else if (y > terrainHeight) {
          input[x][y][z] = BlockID.Air;
        }
      }
    }
  }

  return input;
};