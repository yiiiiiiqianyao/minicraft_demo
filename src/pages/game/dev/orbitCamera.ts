import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Player } from "../player/Player";
import { PlayerInitPosition } from "../player/literal";
import { ScreenViewer } from "../gui/viewer";

export function setOrbitCameraPosition(orbitCamera: THREE.PerspectiveCamera, x: number, y: number, z: number) {
    // orbitCamera.position.set(x - 64, y - 20, z - 64);
    // orbitCamera.position.set(x , y - 20, z );
    // middle high
    // orbitCamera.position.set(x , y - 20, z + 10 );
    // top high
    orbitCamera.position.set(x , y - 5, z );
}

// 第三视角观察使用
export function initOrbitCamera(renderer: THREE.WebGLRenderer) {
  const orbitCamera = new THREE.PerspectiveCamera(
    75,
    ScreenViewer.width / ScreenViewer.height
    );
    // 32, 72, 32
    const { x, y, z } = PlayerInitPosition
    setOrbitCameraPosition(orbitCamera, x, y, z);

    const controls = new OrbitControls(
        orbitCamera,
        renderer.domElement
    );
    orbitCamera.layers.enableAll();
    controls.target.set(0, 0, 0);
    controls.update();
    
    return {
        orbitCamera,
        controls
    }
}

/**
 * 在玩家第一人称模式下 玩家发生位移的时候 更新观察相机位置和目标位置
 * @param camera 
 * @param controls 
 * @param player 
 */
export function updateOrbitControls(camera: THREE.PerspectiveCamera, controls: OrbitControls, player: Player) {
    if(!camera || !controls || !player) return;
    // player.controls.isLocked === true 第一人称模式
    // player.controls.isLocked === false 观察者模式
    if(!controls.target.equals(player.position) && player.controls.isLocked) {
        const {x, y, z} = player.position;
        // camera.position.set(x - 64, PlayerInitPosition.y - 20, z - 64);
        // camera.position.set(x , PlayerInitPosition.y - 20, z );
        setOrbitCameraPosition(camera, x, PlayerInitPosition.y, z);
        controls.target.set(x, y, z);
    };

    //   this.controls.autoRotate = false;
    //   this.controls.autoRotateSpeed = 2.0;
    controls.update();
}