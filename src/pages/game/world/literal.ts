import { DevControl } from "../dev";
import type { IChunkKey } from "../player/interface";

export class WorldParams {
  // TODO 需要根据玩家的视野位置 动态调整渲染距离
  /**@desc 世界 chunk 渲染距离 */
  static renderDistance = DevControl.renderDistance || 8;
  static halfRenderDistance = WorldParams.renderDistance / 2;
  /**@desc 世界 chunk 渲染范围 */
  static range = Array.from({ length: WorldParams.renderDistance * 2 + 1 },(_, i) => i - WorldParams.renderDistance).sort((a, b) => Math.abs(a) - Math.abs(b));
  /**@desc 世界当前渲染的 chunk 总数 */
  static totalChunks = (WorldParams.renderDistance * 2 + 1) ** 2;

  /**@desc 是否需要更新可见的 chunk 列表 */
  static updateVisibleChunks = true;
  /**@desc 世界当前可见的 chunk 列表 */
  static visibleChunks: IChunkKey[] = [];
}