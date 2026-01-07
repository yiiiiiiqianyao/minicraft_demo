import * as THREE from "three";

export interface IPlayerParams {
    height: number;
    radius: number;
    maxSpeed: number;
    maxSprintSpeed: number;
    jumpSpeed: number;
    selectedCoords: THREE.Vector3 | null;
    selectedBlockSize: THREE.Vector3 | null;
    chunkID: null | number[];
    nearFourChunks: null | number[][];
}

export type PlayerEventKey = "KeyW" | "KeyS" | "KeyA" | "KeyD" | "KeyR" | "Space";
