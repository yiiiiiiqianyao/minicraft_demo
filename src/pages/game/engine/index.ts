import * as THREE from "three";
import { ScreenViewer } from "../gui/viewer";

// TODO 统一管理 scene renderer camera 等等
// TODO 支持 webGPU 的切换
export class Engine {
    static screenWrap: HTMLDivElement;
    static scene: THREE.Scene;
    static renderer: THREE.WebGLRenderer;
    static init() {
        Engine.scene = new THREE.Scene();
    
        Engine.renderer = new THREE.WebGLRenderer({
            // antialias: true,
            powerPreference: 'high-performance', // 优先高性能模式，开启更多GPU优化
            preserveDrawingBuffer: false, // 关闭不必要的缓冲区，减少开销
            alpha: false // 无需透明画布时关闭，提升合批效率
        });
        // 开启渲染器的合批优化（默认开启，确保不手动关闭）
        Engine.renderer.sortObjects = true; // 按材质/渲染状态排序，减少合批中断
        Engine.renderer.autoClear = true;

        Engine.renderer.shadowMap.enabled = true;
        Engine.renderer.shadowMap.type = THREE.PCFShadowMap;
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

export * from './layers';
