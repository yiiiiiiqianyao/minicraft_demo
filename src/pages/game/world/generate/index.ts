import * as THREE from "three";
import { BlockID } from "../../Block";
import { IWorldParams } from "../interface";
import { generateTerrain } from "./terrain";
import { generateResources } from "./resource";
import { generateTrees } from "./tree";
import { generateTallGrass } from "./tallGrass";
import { generateFlowers } from "./flower";
import { ChunkParams } from "../chunk/literal";

const initEmptyChunk = () => {
  const { width, height } = ChunkParams;
  const data = new Array(width);
  for (let x = 0; x < width; x++) {
    data[x] = new Array(height);
    for (let y = 0; y < height; y++) {
      data[x][y] = new Array(width);
      for (let z = 0; z < width; z++) {
        data[x][y][z] = BlockID.Air;
      }
    }
  }
  return data as BlockID[][][];
};

export const generateChunk = async (
  params: IWorldParams,
  x: number,
  z: number
) => {
    const chunkPos = new THREE.Vector3(x, 0, z);
    // full chunk block data fill with air
    let data = initEmptyChunk();
    // 生产各种资源方块
    data = generateResources(data, chunkPos);
    // 从上到下进行分层（在特定的层保留资源方块）
    data = generateTerrain( data, params, chunkPos);
    // TODO 下面的 生产树 高草 花朵等可以进行优化
    data = generateTrees( data, params, chunkPos);
    // Tip: 高草和花朵都是一格的大小 不会跨越 chunk 因此不需要考虑 chunk position
    data = generateTallGrass( data, params);
    data = generateFlowers( data, params);
    return data;
};
