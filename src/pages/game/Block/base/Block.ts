import * as THREE from "three";
import { BlockID } from "..";
import type { IUVRange } from "../../player/interface";

// 渲染的几何形状类型
export enum RenderGeometry {
  Cube,
  Cross,
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
  abstract dropBlockId?: BlockID;
  abstract dropLimit?: number;
  /**@desc 当前方块是否可交互 */
  abstract interactive: boolean;
  /**@desc 当前方块被破坏需要的次数 */
  abstract breakCount: number;
  /**@desc 当前方块的uv范围 */
  abstract uvRange?: IUVRange;
}
