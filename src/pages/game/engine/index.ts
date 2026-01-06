import * as THREE from "three";
import { ScreenViewer } from "../gui/viewer";

// TODO 统一管理 scene renderer camera 等等


export class Engine {
    static screenWrap: HTMLDivElement;
    static scene: THREE.Scene;
    static renderer: THREE.WebGLRenderer;
    static init() {
        Engine.scene = new THREE.Scene();
    
        Engine.renderer = new THREE.WebGLRenderer();
        Engine.renderer.shadowMap.enabled = true;
        Engine.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        Engine.screenWrap = document.getElementById('canvas_wrap') as HTMLDivElement
        const { width, height } = Engine.screenWrap.getBoundingClientRect();
        ScreenViewer.width = width;
        ScreenViewer.height = height;

        Engine.renderer.setPixelRatio(window.devicePixelRatio);
        Engine.renderer.setSize(ScreenViewer.width, ScreenViewer.height);
        Engine.renderer.setClearColor(0x80abfe);
        Engine.screenWrap.appendChild(Engine.renderer.domElement);
    }
}

