import { Block } from "../base/Block";

export abstract class LightSourceBlock extends Block {
  abstract color: number;
  abstract intensity: number;
  abstract distance: number;
  abstract decay: number;
}
