import * as THREE from "three";
import { generateTerrain } from "./terrain";
import { generatePlants } from "./plants";
import type { DataStore } from "../DataStore";
import { getChunkFromDataStore, initEmptyChunk, setChunkToDataStore } from "./utils";

/** @desc 创建 chunk 的数据 */
export const generateChunkData = async (
  x: number,
  z: number,
  dataStore: DataStore,
) => {
    // 如果 chunk 已经生成过了 则直接从 data store 中获取
    if (dataStore.getChunkLoaded(x, z)) {
      return getChunkFromDataStore(x, z, dataStore);
    }
    // 否则 则需要生成 chunk 数据
    const chunkPos = new THREE.Vector3(x, 0, z);
    // full chunk block data fill with air
    let data = initEmptyChunk();
    // 从上到下进行分层（在特定的层保留资源方块）
    data = generateTerrain( data, chunkPos);
    // 下面的 生产树 高草 花朵等可以进行优化
    data = generatePlants( data, chunkPos);
    /**@desc 生成数据后 将 chunk 数据设置到 data store 中 */
    setChunkToDataStore(x, z, data, dataStore);
    return data;
};
