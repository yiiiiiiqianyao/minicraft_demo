import type { IInstanceData } from "./interface";

/**@desc 全局的方块数据存储 */
export class DataStore {
  data: Record<string, IInstanceData>;

  constructor() {
    this.data = {};
  }

  clear() {
    this.data = {};
  }

  contains(
    chunkX: number,
    chunkZ: number,
    blockX: number,
    blockY: number,
    blockZ: number
  ) {
    const key = this._getKey(chunkX, chunkZ, blockX, blockY, blockZ);
    return this.data[key] !== undefined;
  }

  get(
    chunkX: number,
    chunkZ: number,
    blockX: number,
    blockY: number,
    blockZ: number
  ) {
    const key = this._getKey(chunkX, chunkZ, blockX, blockY, blockZ);
    const blockData = this.data[key];
    // console.log(`getting value ${blockId} at key ${key}`);
    return blockData;
  }

  set(
    chunkX: number,
    chunkZ: number,
    blockX: number,
    blockY: number,
    blockZ: number,
    value: IInstanceData
  ) {
    const key = this._getKey(chunkX, chunkZ, blockX, blockY, blockZ);
    // console.log(`setting value ${value} at key ${key}`);
    this.data[key] = value;
  }

  private _getKey(
    chunkX: number,
    chunkZ: number,
    blockX: number,
    blockY: number,
    blockZ: number
  ) {
    return `${chunkX},${chunkZ},${blockX},${blockY},${blockZ}`;
  }
}
