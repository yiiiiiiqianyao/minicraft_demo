import * as THREE from "three";
import { World } from "../World";
import { IWorldSize } from "../interface";
import { BlockID, oreConfig } from "../../Block";

/**
 * Generates the resources (coal, stone, etc.) for the world
 */
export const generateResources = (
  input: BlockID[][][],
  size: IWorldSize,
  chunkPos: THREE.Vector3
): BlockID[][][] => {
  for (const [_, config] of Object.entries(oreConfig)) {
    for (let x = 0; x < size.width; x++) {
      for (let y = 0; y < size.height; y++) {
        for (let z = 0; z < size.width; z++) {
          const value = World.simplex.noise3d(
            (chunkPos.x + x) / config.scale.x,
            (chunkPos.y + y) / config.scale.y,
            (chunkPos.z + z) / config.scale.z
          );

          if (value > config.scarcity) {
            input[x][y][z] = config.id;
          }
        }
      }
    }
  }

  return input;
};