import * as THREE from "three";
import { BlockID } from "..";

// 渲染的几何形状类型
export enum RenderGeometry {
  Cube,
  // TODO Cross => TallGrass
  Cross,
  Flower,
  Tree,
  GrassBlock,
  // 裂开的方块
  Break,
}

export type MaterialType = THREE.MeshLambertMaterial | THREE.MeshBasicMaterial;

export abstract class Block {
  abstract id: BlockID;
  abstract material: MaterialType | MaterialType[];
  abstract uiTexture: string;
  abstract geometry: RenderGeometry;
  abstract transparent: boolean;
  abstract canPassThrough: boolean;
  abstract canDrop: boolean;
  /**@desc 当前方块被破坏需要的次数 */
  abstract breakCount: number;
}
