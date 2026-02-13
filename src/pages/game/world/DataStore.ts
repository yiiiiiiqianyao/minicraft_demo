import type { IInstanceData } from "./interface";

/**@desc 全局的方块数据存储 */
export class DataStore {
  data: Record<string, IInstanceData>;
  _chunkData: Record<string, Record<string, IInstanceData>> = {};
  _chunkLoaded: Record<string, boolean> = {};

  constructor() {
    this.data = {};
  }

  /** @desc 是否需要更新指定 chunk */
  getChunkLoaded(chunkX: number, chunkZ: number) {
    return this._chunkLoaded[`${chunkX},${chunkZ}`] || false;
  }

  /** @desc 更新指定 chunk 是否需要更新 */
  setChunkLoaded(chunkX: number, chunkZ: number, needUpdate: boolean) {
    this._chunkLoaded[`${chunkX},${chunkZ}`] = needUpdate;
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
    // const key = this._getKey(chunkX, chunkZ, blockX, blockY, blockZ);
    // return this.data[key] !== undefined;
    const chunkKey = `${chunkX},${chunkZ}`;
    return this.getChunk(chunkKey, blockX, blockY, blockZ) !== undefined;
  }

  get(
    chunkX: number,
    chunkZ: number,
    blockX: number,
    blockY: number,
    blockZ: number
  ) {
    // const key = this._getKey(chunkX, chunkZ, blockX, blockY, blockZ);
    // const blockData = this.data[key];
    // // console.log(`getting value ${blockId} at key ${key}`);
    // return blockData;
    const chunkKey = `${chunkX},${chunkZ}`;
    return this.getChunk(chunkKey, blockX, blockY, blockZ);
  }

  private getChunk(chunkKey: string, blockX: number, blockY: number, blockZ: number) {
    const chunkData = this._chunkData[chunkKey] || {};
    // return this._chunkData[chunkKey] || {};
    return chunkData[`${blockX},${blockY},${blockZ}`] || {};
  }

  set(
    chunkX: number,
    chunkZ: number,
    blockX: number,
    blockY: number,
    blockZ: number,
    value: IInstanceData
  ) {
    // const key = this._getKey(chunkX, chunkZ, blockX, blockY, blockZ);
    // console.log(`setting value ${value} at key ${key}`);
    // this.data[key] = value;
    const chunkKey = `${chunkX},${chunkZ}`;
    this.setChunk(chunkKey, blockX, blockY, blockZ, value);
  }

  private setChunk(chunkKey: string, blockX: number, blockY: number, blockZ: number, value: IInstanceData) {
    if (!this._chunkData[chunkKey]) {
      this._chunkData[chunkKey] = {};
    }
    this._chunkData[chunkKey][`${blockX},${blockY},${blockZ}`] = value;
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
