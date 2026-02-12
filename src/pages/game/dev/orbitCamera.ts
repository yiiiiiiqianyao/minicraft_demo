import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Player } from "../player/Player";
import { PlayerInitPosition } from "../player/literal";
import { ScreenViewer } from "../gui/viewer";
import { RenderView } from "../constant";

// 第三视角观察使用
export function initOrbitCamera(renderer: THREE.WebGLRenderer) {
  const orbitCamera = new THREE.PerspectiveCamera(
    75,
    ScreenViewer.width / ScreenViewer.height
    );
    orbitCamera.userData.type = RenderView.ThirdPerson;
    // 32, 72, 32
    const { x, y, z } = PlayerInitPosition
    orbitCamera.position.set(x, y, z);
    // 轨道控制器 
    const controls = new OrbitControls(orbitCamera, renderer.domElement);
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
    if(!(controls.target.distanceTo(player.position) < 0.01)) {
        const {x, y, z} = player.position;
        camera.position.set(x , y + 5, z + 6);
        controls.target.set(x, y, z);
    };
    controls.update();
    if (!player.boundsHelper.visible) {
        player.boundsHelper.visible = true;
    }
}