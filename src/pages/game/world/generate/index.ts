import * as THREE from "three";
import { BlockID } from "../../Block";
import { IWorldParams, IWorldSize } from "../interface";
import { generateTerrain } from "./terrain";
import { generateResources } from "./resource";
import { generateTrees } from "./tree";
import { generateTallGrass } from "./tallGrass";
import { generateFlowers } from "./flower";

const initEmptyChunk = (chunkSize: IWorldSize) => {
  const data = new Array(chunkSize.width);
  for (let x = 0; x < chunkSize.width; x++) {
    data[x] = new Array(chunkSize.height);
    for (let y = 0; y < chunkSize.height; y++) {
      data[x][y] = new Array(chunkSize.width);
      for (let z = 0; z < chunkSize.width; z++) {
        data[x][y][z] = BlockID.Air;
      }
    }
  }
  return data as BlockID[][][];
};

export const generateChunk = async (
  chunkSize: IWorldSize,
  params: IWorldParams,
  x: number,
  z: number
) => {
  const chunkPos = new THREE.Vector3(x, 0, z);
  // full chunk block data fill with air
  let data = initEmptyChunk(chunkSize);
  data = generateResources(data, chunkSize, chunkPos);
  data = generateTerrain( data, chunkSize, params, chunkPos);
  data = generateTrees( data, chunkSize, params, chunkPos);
  data = generateTallGrass( data, chunkSize, params);
  data = generateFlowers( data, chunkSize, params);
  return data;
};
