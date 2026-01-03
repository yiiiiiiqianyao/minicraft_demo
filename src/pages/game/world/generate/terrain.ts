import * as THREE from "three";
import { World } from "../World";
import { IWorldParams, IWorldSize } from "../interface";
import { BlockID } from "../../Block";

/**
 * Generates the terrain data
 */
export const generateTerrain = (
  input: BlockID[][][],
  size: IWorldSize,
  params: IWorldParams,
  chunkPos: THREE.Vector3
): BlockID[][][] => {
  for (let x = 0; x < size.width; x++) {
    for (let z = 0; z < size.width; z++) {
      const value = World.simplex.noise(
        (chunkPos.x + x) / params.terrain.scale,
        (chunkPos.z + z) / params.terrain.scale
      );

      const scaledNoise =
        params.terrain.offset + params.terrain.magnitude * value;

      let height = Math.floor(size.height * scaledNoise);
      height = Math.max(0, Math.min(height, size.height - 1));

      const numSurfaceBlocks =
        params.surface.offset +
        Math.abs(World.simplex.noise(x, z) * params.surface.magnitude);

      const numBedrockBlocks =
        params.bedrock.offset +
        Math.abs(World.simplex.noise(x, z) * params.bedrock.magnitude);

      for (let y = 0; y < size.height; y++) {
        if (y < height) {
          if (y < numBedrockBlocks) {
            input[x][y][z] = BlockID.Bedrock;
          } else if (y < height - numSurfaceBlocks) {
            if (input[x][y][z] === BlockID.Air) {
              input[x][y][z] = BlockID.Stone;
            }
          } else {
            input[x][y][z] = BlockID.Dirt;
          }
        } else if (y === height) {
          input[x][y][z] = BlockID.Grass;
        } else if (y > height) {
          input[x][y][z] = BlockID.Air;
        }
      }
    }
  }

  return input;
};