import * as THREE from "three";

export type IChunkKey = {x: number, z: number};

export interface IPlayerParams {
    position: THREE.Vector3;
    height: number;
    radius: number;
    maxSpeed: number;
    maxSprintSpeed: number;
    jumpSpeed: number;
    selectedCoords: THREE.Vector3 | null;
    selectedBlockSize: THREE.Vector3 | null;
    isInChunkCenter: boolean;
    currentChunk: IChunkKey | null;
    nearFourChunks: IChunkKey[];
}

export type PlayerEventKey = "KeyW" | "KeyS" | "KeyA" | "KeyD" | "KeyR" | "Space";
