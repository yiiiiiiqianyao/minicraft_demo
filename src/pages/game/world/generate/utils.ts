import { BlockID } from "../../Block";
import { ChunkParams } from "../chunk/literal";
import type { DataStore } from "../DataStore";
import type { IInstanceData } from "../interface";

export function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
  return t * t * (3 - 2 * t);
}

/**@desc 初始化空 chunk 数据 */
export const initEmptyChunk = () => {
  const { width, height } = ChunkParams;
  const data = new Array(width);
  for (let x = 0; x < width; x++) {
    data[x] = new Array(height);
    for (let y = 0; y < height; y++) {
      data[x][y] = new Array(width);
      for (let z = 0; z < width; z++) {
        // TODO 后续直接使用 null 表示空气
        data[x][y][z] = {
          blockId: BlockID.Air,
          instanceIds: [],
          blockData: {},
        }
      }
    }
  }
  return data as IInstanceData[][][];
};

/**@desc 生成数据后 将 chunk 数据设置到 data store 中 */
export const setChunkToDataStore = (chunkX: number, chunkZ: number, data: IInstanceData[][][], dataStore: DataStore) => {
  const { width, height } = ChunkParams;
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      for (let z = 0; z < width; z++) {
         dataStore.set(chunkX, chunkZ, x, y, z, data[x][y][z]);
      }
    }
  }
  return data as IInstanceData[][][];
}

export const getChunkFromDataStore = (chunkX: number, chunkZ: number, dataStore: DataStore) => {
  const { width, height } = ChunkParams;
  const data = new Array(width);
  for (let x = 0; x < width; x++) {
    data[x] = new Array(height);
    for (let y = 0; y < height; y++) {
      data[x][y] = new Array(width);
      for (let z = 0; z < width; z++) {
        data[x][y][z] = dataStore.get(chunkX, chunkZ, x, y, z);
      }
    }
  }
  return data as IInstanceData[][][];
}