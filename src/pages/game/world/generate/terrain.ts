import * as THREE from "three";
import { World } from "../World";
import { BlockID } from "../../Block";
import { ChunkParams } from "../chunk/literal";
import type { IInstanceData } from "../interface";
import { DevControl } from "../../dev";
import { getEmptyDirtBlockData } from "../../Block/blocks/DirtBlock";
import { getEmptyStoneBlockData } from "../../Block/blocks/StoneBlock";
import { getEmptyGrassBlockData } from "../../Block/blocks/GrassBlock";
import { getEmptyBedrockBlockData } from "../../Block/blocks/BedrockBlock";
import { getEmptyAirBlockData } from "../../Block/blocks/AirBlock";
import { smoothstep } from "./utils";
import { BedrockSurface, FlatTerrain, NormalTerrain, DirtSurface, terrainSafeOffset } from "./constant";
import { generateResource } from "./generate_resource";

const macroScale = 400; // 宏观分区尺度，控制草原和山地块状分布的大小
const threshold = 0.38; // 分区阈值（整体偏向山地）
const rangeWidth = 0.22;      // 平滑过渡宽度
const warpStrength = 3; // 领域扭曲强度，控制山脉走向变化的幅度
function getMountainHeight(worldX: number, worldZ: number) {
  // 宏观分区掩膜：m 越接近 0 越偏草原，越接近 1 越偏山地
  const r = World.simplex.noise(worldX / macroScale, worldZ / macroScale); // [-1, 1]
  const m = smoothstep(threshold - rangeWidth, threshold + rangeWidth, r);
  
  // 领域扭曲：在 (x, z) 基础上用低频噪声进行坐标偏移，增加山脉走向变化
  const warpNoiseX = World.simplex.noise(worldX / 90, worldZ / 90);
  const warpNoiseZ = World.simplex.noise(worldX / 190, worldZ / 190);
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

const { width: ChunkWidth, height: ChunkHeight } = ChunkParams;
const { worldType } = DevControl;
const MaxTerrainHeight = ChunkHeight - terrainSafeOffset;
/**
 * Generates the terrain data
 */
export const generateTerrain = (input: IInstanceData[][][], chunkPos: THREE.Vector3): IInstanceData[][][] => {
  // 平坦地形
  if (worldType === 'flat') return generateFlatTerrain(input);
  // 正常地形
  for (let x = 0; x < ChunkWidth; x++) {
    for (let z = 0; z < ChunkWidth; z++) {
      // block position of world
      const worldX = chunkPos.x + x;
      const worldZ = chunkPos.z + z;
      const terrainValue0 = World.simplex.noise(
        worldX / NormalTerrain.scale,
        worldZ / NormalTerrain.scale
      );
      // 草原 地形高度：低幅值、高频噪声
      const scaledNoise = NormalTerrain.offset + NormalTerrain.magnitude * terrainValue0;
      // 山地 地形高度：高幅值、低频噪声
      const mountainTerrain = getMountainHeight(worldX, worldZ);

      // 地表高度：加入山地偏移
      let terrainGroundHeight = Math.floor(ChunkHeight * scaledNoise + mountainTerrain);
      terrainGroundHeight = Math.max(0, Math.min(terrainGroundHeight, MaxTerrainHeight));

      // 地表表层方块高度：加入泥土层偏移
      const surfaceToGround = DirtSurface.offset +
        Math.abs(World.simplex.noise(worldX, worldZ) * DirtSurface.magnitude);

      // 靠近地表的泥土层高度
      const DirtHeight = terrainGroundHeight - surfaceToGround;

      // 最底下的基岩层高度
      const BedrockHeight = BedrockSurface.offset +
        Math.abs(World.simplex.noise(worldX, worldZ) * BedrockSurface.magnitude);

      for (let y = 0; y < ChunkHeight; y++) {
        if (y <= terrainGroundHeight) {
          // 低于地表层
          if(y > DirtHeight) {
            // 表层到地面是泥土
            input[x][y][z] = getEmptyDirtBlockData();
          } else if(y >= BedrockHeight) {
            // 从基岩层到地表层  生产各种资源方块
            generateResource(input, chunkPos, x, y, z);
          } else {
            // 低于基岩层 都是基岩
            input[x][y][z] = getEmptyBedrockBlockData();
          }
        } else if (y > terrainGroundHeight) {
          // 高于地表层 都是空气
          input[x][y][z] = getEmptyAirBlockData();
        }
        // 地表层 暂时都是草方块
        if (y === terrainGroundHeight && !input[x][y][z].blockData?.isCave) {
          input[x][y][z] = getEmptyGrassBlockData();
          if(DevControl.showBorder && (x === 0 || z === 0)) {
            input[x][y][z] = getEmptyBedrockBlockData();
          }
          // 地表层 标记为地面
          input[x][y][z].blockData.isGround = true;
        }
      }
    }
  }
  return input;
};

/**@desc 生成平坦地形 */
function generateFlatTerrain(input: IInstanceData[][][]) {
  const terrainConfig = FlatTerrain;
  for (let x = 0; x < ChunkWidth; x++) {
    for (let z = 0; z < ChunkWidth; z++) {
      const terrainHeight = Math.floor(ChunkHeight * terrainConfig.offset);
      // 地表表层方块
      const surfaceHeight = DirtSurface.offset;
      // 基岩
      const bedrockHeight = 2;
      for (let y = 0; y < ChunkHeight; y++) {
        if (y < terrainHeight) {
          if(y >= terrainHeight - surfaceHeight) {
            // 地表层到地面是泥土
            input[x][y][z] = getEmptyDirtBlockData();
          } else if(y >= bedrockHeight) {
            // 从基岩层到地表层
            if (input[x][y][z].blockId === BlockID.Air) {
              input[x][y][z] = getEmptyStoneBlockData();
            }
          } else {
            // 低于基岩层 都是基岩
            input[x][y][z] = getEmptyBedrockBlockData();
          }
        } else if (y === terrainHeight) {
          input[x][y][z] = getEmptyGrassBlockData();
          if(DevControl.showBorder && (x === 0 || z === 0)) {
            input[x][y][z] = getEmptyBedrockBlockData();
          }
        } else if (y > terrainHeight) {
          input[x][y][z] = getEmptyAirBlockData();
        }
      }
    }
  }
  return input;
}