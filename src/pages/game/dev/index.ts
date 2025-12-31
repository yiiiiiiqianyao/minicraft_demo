import * as THREE from "three";
// @ts-ignore
import Stats from "three/examples/jsm/libs/stats.module";

let triangleCount: HTMLElement | null = null;
let renderCalls:  HTMLElement | null = null;
function numberWithCommas(x: number): string {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function updateRenderInfo(renderer: THREE.WebGLRenderer) {
    // get element
    if(!triangleCount) {
        triangleCount = document.getElementById("triangle-count");
    }
    if(!renderCalls) {
        renderCalls = document.getElementById("render-calls");
    }
    // update text
    if (triangleCount) {
      triangleCount.innerHTML = `triangles: ${numberWithCommas(
        renderer.info.render.triangles
      )}`;
    }
    if (renderCalls) {
      renderCalls.innerHTML = `draw calls: ${numberWithCommas(
        renderer.info.render.calls
      )}`;
    }
}

let stats: Stats;
export function initStats() {
    stats = new (Stats as any)();
    document.body.appendChild(stats.dom);
}

export function updateStats() {
    if (stats) stats.update();
}