import { ChunkParams } from "./literal";

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
    chunk: { x: number; z: number };
    nearFourChunks: { x: number; z: number }[];
    block: { x: number; y: number; z: number };
  } {
    const { width } = ChunkParams;
    const [chunkX, chunkZ] = worldToChunkCoordsXZ(x, z);

    const blockX = x - chunkX * width;
    const blockZ = z - chunkZ * width;

    const toX = blockX < width / 2;
    const toZ = blockZ < width / 2;
    // Tip: chunk id for player coord
    const cx = chunkX + 1;
    const cz = chunkZ + 1;

    return {
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
  return [Math.ceil(x - 0.5), Math.ceil(y - 0.5), Math.ceil(z - 0.5)];
}