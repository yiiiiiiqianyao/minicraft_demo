import { DevControl } from "../dev";

export class WorldParams {
  /**@desc 世界 chunk 渲染距离 */
  static renderDistance = DevControl.renderDistance || 8;
  /**@desc 世界 chunk 渲染范围 */
  static range = Array.from(
      { length: WorldParams.renderDistance * 2 + 1 },
      (_, i) => i - WorldParams.renderDistance
    ).sort((a, b) => Math.abs(a) - Math.abs(b));
  /**@desc 世界当前渲染的 chunk 总数 */
  static totalChunks = (WorldParams.renderDistance * 2 + 1) ** 2;
}