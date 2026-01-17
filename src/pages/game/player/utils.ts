import { PlayerParams } from "./literal";
import { World } from "../world/World";
import { Player } from "./Player";
import { getFloorXYZ } from "../engine/utils";
import { WorldChunk } from "../world/WorldChunk";

/**
 * @desc 获取玩家脚下的方块
 * @param player 
 * @param world 
 * @returns 
 */
export function getBlockUnderneath(player: Player, world: World) {
  const { x, y, z} = player.position;
  const [fx, fy, fz] = getFloorXYZ(x, y - PlayerParams.height / 2 - 1, z)
  return world.getBlock(fx, fy, fz);
}

/**@desc 获取玩家相邻的最小 1 or 4 个 chunk */ 
export function getNearChunks(world: World) {
    const chunks: WorldChunk[] = [];
    PlayerParams.activeChunks.forEach((chunkKey) => {
      const chunk = world.getChunk(chunkKey.x, chunkKey.z);
      chunk && chunks.push(chunk);
    });
    return chunks;
}