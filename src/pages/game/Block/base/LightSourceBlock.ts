import { Block } from "./Block";

/**@desc 光源方块基类 */
export abstract class LightSourceBlock extends Block {
  abstract color: number;
  abstract intensity: number;
  abstract distance: number;
  abstract decay: number;
}
