import * as THREE from "three";

export type IChunkKey = {x: number, z: number};
export type ISelectedCoords = THREE.Vector3 | null;
export type ICurrentChunk = IChunkKey | null;
export type INearFourChunks = IChunkKey[];
export type PlayerEventKey = "KeyW" | "KeyS" | "KeyA" | "KeyD" | "KeyR" | "Space";
