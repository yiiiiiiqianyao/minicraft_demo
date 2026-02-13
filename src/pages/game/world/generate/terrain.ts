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
  scale: 220,
  magnitude: 0.08,
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

const macroScale = 400; // 宏观分区尺度，控制草原和山地块状分布的大小
const threshold = 0.38; // 分区阈值（整体偏向山地）
const rangeWidth = 0.22;      // 平滑过渡宽度
const warpStrength = 3; // 领域扭曲强度，控制山脉走向变化的幅度
function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
  return t * t * (3 - 2 * t);
}

function getMountainHeight(worldX: number, worldZ: number) {
  // 宏观分区掩膜：m 越接近 0 越偏草原，越接近 1 越偏山地
  const r = World.simplex.noise(worldX / macroScale, worldZ / macroScale); // [-1, 1]
  const m = smoothstep(threshold - rangeWidth, threshold + rangeWidth, r);
  
  // 领域扭曲：在 (x, z) 基础上用低频噪声进行坐标偏移，增加山脉走向变化
  const warpNoiseX = World.simplex.noise(worldX / 90, worldZ / 90);
  const warpNoiseZ = World.simplex.noise(worldX / 90 + 100, worldZ / 90 + 100);
  const warpX = worldX + warpStrength * warpNoiseX;
  const warpZ = worldZ + warpStrength * warpNoiseZ;

  // 山地区域高度：在扭曲后的坐标上合成两频脊线噪声（更低频、更粗犷）
  const e1_step = 130;
  const e2_step = 45;
  const e3_step = 15;

  const e1 = World.simplex.noise(warpX / e1_step, warpZ / e1_step);
  const e2 = World.simplex.noise(warpX / e2_step, warpZ / e2_step);
  const e3 = World.simplex.noise(warpX / e3_step, warpZ / e3_step);
  const ridge = Math.abs(e1) * 0.7 + Math.abs(e2) * 0.2 + Math.abs(e3) * 0.1;
  const ridgePow = Math.pow(ridge, 1.02);
  const yMountain = ridgePow * 22;

 // 最终高度：草原与山地按分区权重混合
  return m * yMountain;
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
      const worldX = chunkPos.x + x;
      const worldZ = chunkPos.z + z;
      // TODO 计算性能待优化

      const terrainValue0 = World.simplex.noise(
        worldX / terrainConfig.scale,
        worldZ / terrainConfig.scale
      );
      // 草原 地形高度：低幅值、高频噪声
      const scaledNoise = terrainConfig.offset + terrainConfig.magnitude * terrainValue0;
  
      const yMountain = worldType === 'flat' ? 0 : getMountainHeight(worldX, worldZ);

      let terrainHeight = Math.floor(height * scaledNoise + yMountain);
      // 高度范围限制：防止生成超出世界高度范围的方块 有树的生成 所以要预留一些空间
      const safeOffset = 10;
      terrainHeight = Math.max(0, Math.min(terrainHeight, height - safeOffset));

      // 地表表层方块
      const surfaceHeight = surface.offset +
        Math.abs(World.simplex.noise(worldX, worldZ) * surface.magnitude);

      // 基岩
      const bedrockHeight = bedrock.offset +
        Math.abs(World.simplex.noise(worldX, worldZ) * bedrock.magnitude);

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