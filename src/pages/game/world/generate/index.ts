import * as THREE from "three";
import { BlockID } from "../../Block";
import { generateTerrain } from "./terrain";
import { generateResources } from "./resource";
import { generateTrees } from "./tree";
import { generateTallGrass } from "./tallGrass";
import { generateFlowers } from "./flower";
import { ChunkParams } from "../chunk/literal";
import type { IInstanceData } from "../interface";
import type { DataStore } from "../DataStore";

// TODO BlockID[][][] => IInstanceData[][][]
const initEmptyChunk = () => {
  const { width, height } = ChunkParams;
  const data = new Array(width);
  for (let x = 0; x < width; x++) {
    data[x] = new Array(height);
    for (let y = 0; y < height; y++) {
      data[x][y] = new Array(width);
      for (let z = 0; z < width; z++) {
        // data[x][y][z] = BlockID.Air;
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

const getChunkFromDataStore = (chunkX: number, chunkZ: number, dataStore: DataStore) => {
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

const setChunkToDataStore = (chunkX: number, chunkZ: number, data: IInstanceData[][][], dataStore: DataStore) => {
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

export const generateChunk = async (
  x: number,
  z: number,
  dataStore: DataStore,
) => {
    if (dataStore.getChunkLoaded(x, z)) {
      return getChunkFromDataStore(x, z, dataStore);
    }
    const chunkPos = new THREE.Vector3(x, 0, z);
    // full chunk block data fill with air
    let data = initEmptyChunk();
    // 生产各种资源方块
    data = generateResources(data, chunkPos);
    // 从上到下进行分层（在特定的层保留资源方块）
    data = generateTerrain( data, chunkPos);
    // TODO 下面的 生产树 高草 花朵等可以进行优化
    data = generateTrees( data, chunkPos);
    // Tip: 高草和花朵都是一格的大小 不会跨越 chunk 因此不需要考虑 chunk position
    data = generateTallGrass( data);
    // TODO 在生成 flower 的时候需要考虑唯一性 在 chunk 重新创建的时候 保持不变
    data = generateFlowers( data);
    // safe set chunk data to data store
    setChunkToDataStore(x, z, data, dataStore);
    return data;
};
