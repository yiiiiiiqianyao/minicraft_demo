import * as THREE from "three";
import { getInstancedGeometry } from "../../engine/geometry";
import { ChunkParams } from "./literal";
import { DevControl } from "../../dev";
import { wireframeMaterial } from "../../engine/material";
import type { Block } from "../../Block/base/Block";
import { BlockFactory, type BlockID } from "../../Block";

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
    chunk: { x: number; z: number };
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
    chunk: { x: number; z: number };
    nearFourChunks: { x: number; z: number }[];
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
      chunk: { x: cx, z: cz },
      nearFourChunks: [
        { x: cx,                    z: cz },
        { x: toX ? cx - 1 : cx + 1, z: cz },
        { x: cx,                    z: toZ ? cz - 1 : cz + 1 },
        { x: toX ? cx - 1 : cx + 1, z: toZ ? cz - 1 : cz + 1 },
      ],
      block: { x: blockX, y, z: blockZ },
    };
}

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
      const material = chunkWireframeMode ? wireframeMaterial : blockEntity.material;
      return new THREE.InstancedMesh(getInstancedGeometry(blockGeometry),
        material,
        maxCount
      );
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