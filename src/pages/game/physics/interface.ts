import * as THREE from "three";
import { BlockID } from "../Block";

export type Candidate = {
  block: BlockID;
  x: number;
  y: number;
  z: number;
};

export type Collision = {
  candidate: Candidate;
  contactPoint: number[];
  normal: THREE.Vector3;
  overlap: number;
};