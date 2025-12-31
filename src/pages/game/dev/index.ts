import * as THREE from "three";
// @ts-ignore
import Stats from "three/examples/jsm/libs/stats.module";

let triangleCount: HTMLElement | null = null;
let triangleCountInnerHtml = '';
let renderCalls:  HTMLElement | null = null;
let renderCallsInnerHtml = '';
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

let stats: Stats;
export function initStats() {
    stats = new (Stats as any)();
    const wrap = document.getElementById('canvas_wrap') as HTMLDivElement;
    wrap.appendChild(stats.dom);
}

export function updateStats() {
    if (stats) stats.update();
}