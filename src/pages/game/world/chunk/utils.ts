import * as THREE from "three";
import { getInstancedGeometry } from "../../engine/geometry";
import { ChunkParams } from "./literal";
import { DevControl } from "../../dev";
import { wireframeMaterial } from "../../engine/material";
import type { Block } from "../../Block/base/Block";
import { BlockFactory, BlockID } from "../../Block";
import { PlayerParams } from "../../player/literal";
import { WorldParams } from "../literal";
import type { IChunkKey } from "../../player/interface";

export function isBlockSupportsCombine(blockId: BlockID) {
    // TODO 待优化 除了 Leaves 和 OakLog 之外方块也支持合并
    // 暂时只支持了BirchLog 和 OakLog
    return blockId === BlockID.BirchLog || 
    blockId === BlockID.OakLog ||
    blockId === BlockID.FlowerDandelion ||
    blockId === BlockID.FlowerRose ||
    blockId === BlockID.TallGrass;
}

/**
 * 世界坐标转 chunk xz 坐标
 * @param x 
 * @param z 
 *  Returns the chunk and world coordinates of the block at (x, y, z)
 *  - `chunk` is the coordinates of the chunk containing the block
 *  - `block` is the world coordinates of the block
 */
export function worldToChunkCoords(
    x: number,
    y: number,
    z: number
  ): {
    chunk: IChunkKey;
    block: { x: number; y: number; z: number };
  } {
    const { width } = ChunkParams;
    const [chunkX, chunkZ] = worldToChunkCoordsXZ(x, z);

    const blockX = x - chunkX * width;
    const blockZ = z - chunkZ * width;

    return {
      chunk: { x: chunkX, z: chunkZ },
      block: { x: blockX, y, z: blockZ },
    };
}
export function playerToChunkCoords(
    x: number,
    y: number,
    z: number
  ): {
    isInChunkCenter: boolean;
    chunkKey: IChunkKey;
    nearFourChunks: IChunkKey[];
    block: { x: number; y: number; z: number };
  } {
    const { width, halfSize, centerRadius } = ChunkParams;
    const [chunkX, chunkZ] = worldToChunkCoordsXZ(x, z);

    const blockX = x - chunkX * width;
    const blockZ = z - chunkZ * width;
    const isInChunkCenter = Math.abs(blockX - halfSize) < centerRadius && Math.abs(blockZ - halfSize) < centerRadius;
    
    const toX = blockX < width / 2;
    const toZ = blockZ < width / 2;
    const cx = chunkX;
    const cz = chunkZ;

    return {
      isInChunkCenter,
      chunkKey: { x: cx, z: cz },
      nearFourChunks: [
        { x: cx,                    z: cz },
        { x: toX ? cx - 1 : cx + 1, z: cz },
        { x: cx,                    z: toZ ? cz - 1 : cz + 1 },
        { x: toX ? cx - 1 : cx + 1, z: toZ ? cz - 1 : cz + 1 },
      ],
      block: { x: blockX, y, z: blockZ },
    };
}

/**
 * @desc 世界坐标转 chunk xz 坐标
 * @param x 
 * @param z 
 * @returns 
*/
export function worldToChunkCoordsXZ(x: number, z: number) {
  const { width } = ChunkParams;
  const chunkX = Math.floor(x / width);
  const chunkZ = Math.floor(z / width);
  return [chunkX, chunkZ];
}

/**
 * 将世界坐标转换为向上取整的网格坐标
 * @param x 
 * @param y 
 * @param z 
 * @returns 
 */
export function worldToCeilBlockCoord(x: number, y: number, z: number) {
  // Tip: Important 传入的坐标为 block 的中心坐标 由于 js 计算可能存在误差 所以需要先将坐标四舍五入到最近的 0.5
  const safeX = roundToHalf(x);
  const safeY = roundToHalf(y);
  const safeZ = roundToHalf(z);
  return [Math.ceil(safeX - 0.5), Math.ceil(safeY - 0.5), Math.ceil(safeZ - 0.5)];
}

function roundToHalf(num: number) {
  return Math.round(num * 2) / 2;
}

/**@desc 初始化 chunk 中的 instance mesh */
export function initChunkMesh(blockEntity: Block, helperColor: THREE.Color) {
  const { maxCount } = ChunkParams;
  const { chunkHelperVisible, chunkWireframeMode } = DevControl;
  const blockGeometry = blockEntity.geometry;
  if(chunkHelperVisible) { // make dev chunk
    return new THREE.InstancedMesh(getInstancedGeometry(blockGeometry),
  new THREE.MeshBasicMaterial({ wireframe: false, color: helperColor }),
      maxCount
    )
  } else {
    // TODO 待优化 合并其他的 block
    if (isBlockSupportsCombine(blockEntity.id)) {
      const material = blockEntity.material;
      const geometry = getInstancedGeometry(blockEntity.geometry)?.clone() as THREE.BoxGeometry;
      return new THREE.InstancedMesh(geometry, material,maxCount);
    } else {
       const material = chunkWireframeMode ? wireframeMaterial : blockEntity.material;
      return new THREE.InstancedMesh(getInstancedGeometry(blockGeometry),
        material,
        maxCount
      );
    }
  }
}

export function getAroundBlocks(x: number, y: number, z: number) {
  return [
    [x - 1, y, z],
    [x + 1, y, z],
    [x, y - 1, z],
    [x, y + 1, z],
    [x, y, z - 1],
    [x, y, z + 1],
  ];
}

/**
 * @desc Checks if the given coordinates are within the world bounds 判断点的坐标是否在 chunk 内
*/
export function inBounds(x: number, y: number, z: number): boolean {
  const { width, height } = ChunkParams;
  return (
    x >= 0 &&
    x < width &&
    y >= 0 &&
    y < height &&
    z >= 0 &&
    z < width
  );
}

export const getBlockClass = (blockId: BlockID) => BlockFactory.getBlock(blockId);

/** 865
 * @desc 获取当前玩家可见的 chunk 列表
 * Returns an array containing the coordinates of the chunks
 * that are currently visible to the player, starting from the center
 */
export function getVisibleChunks() {
  if (!PlayerParams.currentChunk) return [];
  if (!WorldParams.updateVisibleChunks) return WorldParams.visibleChunks;
  
  const { x: chunkX, z: chunkZ } = PlayerParams.currentChunk;
  const visibleChunks: IChunkKey[] = [];  
  for (const dx of WorldParams.range) {
    for (const dz of WorldParams.range) {
      // Tip: 去除 chunk 的边角 让接近圆形渲染
      const dist = Math.sqrt(dx ** 2 + dz ** 2);
      if (dist <= WorldParams.renderDistance) {
        visibleChunks.push({ x: chunkX + dx, z: chunkZ + dz });
      }
    }
  }

  // 更新当前可见的 chunk 总数
  WorldParams.totalChunks = visibleChunks.length;

  // sort chunks by distance from player
  visibleChunks.sort((a, b) => {
    const distA = Math.sqrt(
      (a.x - chunkX) ** 2 + (a.z - chunkZ) ** 2
    );
    const distB = Math.sqrt(
      (b.x - chunkX) ** 2 + (b.z - chunkZ) ** 2
    );
    return distA - distB;
  });

  // 更新当前可见的 chunk 列表
  WorldParams.visibleChunks = visibleChunks;
  return visibleChunks;
}