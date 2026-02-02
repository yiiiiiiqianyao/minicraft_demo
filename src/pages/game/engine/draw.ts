import * as THREE from "three";
import { GameState, RenderView } from "../constant";
import { DevControl } from "../dev";
import type { Player } from "../player/Player";

export function getRenderCamera(player: Player, orbitCamera: THREE.PerspectiveCamera) {
    // TODO 第三人称视角 增加支持角色的控制移动
    // player.controls.isLocked === true 第一人称模式
    // player.controls.isLocked === false 观察者模式
    if(DevControl.view !== -1) {
      if(DevControl.view === 1) {
        return player.camera;
      } else {
        return orbitCamera;
      }
    }
    
    let renderMode = player.controls.isLocked ? RenderView.FirstPerson : RenderView.ThirdPerson;
    if (GameState.state === 'paused') {
      renderMode = RenderView.FirstPerson;
    }
    switch(renderMode) {
      case RenderView.FirstPerson:
        return player.camera;
      case RenderView.ThirdPerson:
        return orbitCamera;
      default:
        return player.camera;
    }
  }