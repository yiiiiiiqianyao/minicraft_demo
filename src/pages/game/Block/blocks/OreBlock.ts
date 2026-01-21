import { Block } from "../base/Block";

/**@desc 矿物块基类 */
export abstract class OreBlock extends Block {
  abstract scale: { x: number; y: number; z: number };
  abstract scarcity: number;
}
