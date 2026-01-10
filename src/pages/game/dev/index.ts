import * as THREE from "three";
// @ts-expect-error import umi
import Stats from "three/examples/jsm/libs/stats.module";

export * from './control';

let triangleCount: HTMLElement | null = null;
let triangleCountInnerHtml = '';
let renderCalls:  HTMLElement | null = null;
let renderCallsInnerHtml = '';
function numberWithCommas(x: number): string {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function updateRenderInfoGUI(renderer: THREE.WebGLRenderer) {
    // get element
    if(!triangleCount) {
        triangleCount = document.getElementById("triangle-count");
    }
    if(!renderCalls) {
        renderCalls = document.getElementById("render-calls");
    }
    // update text
    if (triangleCount) {
      const inner = `triangles: ${numberWithCommas(
        renderer.info.render.triangles
      )}`;
      if(inner !== triangleCountInnerHtml) {
        triangleCountInnerHtml = inner;
        triangleCount.innerHTML = inner;
      }
    }
    if (renderCalls) {
      const inner = `draw calls: ${numberWithCommas(
        renderer.info.render.calls
      )}`;
      if(inner !== renderCallsInnerHtml) {
        renderCallsInnerHtml = inner;
        renderCalls.innerHTML = inner;
      }
    }
}

export function updateChunkCoordGUI(chunkX: number, chunkZ: number) {
    const chunkCoord = document.getElementById("chunk-coord");
    if (chunkCoord) {
      const inner = `chunk: ${chunkX}, ${chunkZ}`;
      if(chunkCoord.innerHTML !== inner) {
        chunkCoord.innerHTML = inner;
      }
    }
}

export function updateBlockCoordGUI(blockX: number, blockY: number, blockZ: number) {
    const blockCoord = document.getElementById("chunk-block-coord");
    if (blockCoord) {
      const inner = `chunk block: ${blockX}, ${blockY}, ${blockZ}`;
      if(blockCoord.innerHTML !== inner) {
        blockCoord.innerHTML = inner;
      }
    }
}

export function updateWorldBlockCoordGUI(blockX: number, blockY: number, blockZ: number) {
    const blockCoord = document.getElementById("world-block-coord");
    if (blockCoord) {
      const inner = `world block: ${blockX}, ${blockY}, ${blockZ}`;
      if(blockCoord.innerHTML !== inner) {
        blockCoord.innerHTML = inner;
      }
    }
}

let stats: Stats;
export function initStats() {
  stats = new Stats();
  document.body.appendChild(stats.dom);
  stats.dom.style = 'position: fixed; bottom: 20px; left: 20px; cursor: pointer; opacity: 0.9; z-index: 10000;'
}

export function updateStats() {
    if (stats) stats.update();
}