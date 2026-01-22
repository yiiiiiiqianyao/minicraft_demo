import * as THREE from "three";
import { BlockID } from "..";

// 渲染的几何形状类型
// @ts-ignore
export enum RenderGeometry {
  Cube,
  // TODO Cross => TallGrass
  Cross,
  Flower,
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
}
