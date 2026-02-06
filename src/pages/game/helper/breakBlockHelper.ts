import * as THREE from "three";
import { RenderGeometry } from "../Block/base/Block";
import { getInstancedGeometry } from "../engine/geometry";
import { BreakMaterial } from "../engine/material";
import { PlayerParams } from "../player/literal";

export class BreakBlockHelper {
    static _breakBlock: THREE.Mesh | null = null;
    static _material: THREE.ShaderMaterial | null = null;
    static init(scene: THREE.Scene) {
        this._material = BreakMaterial;
        // this._material.opacity = 0;
        this._breakBlock = new THREE.Mesh(
  getInstancedGeometry(RenderGeometry.Break),
  BreakMaterial,
        );
        // this._breakBlock.visible = false;
        scene.add(this._breakBlock);
    }

    // TODO 后续优化 挖掘进度效果 应该是一个渐变的过程 裂纹逐渐变多 最好是通过 uv 切换纹理
    static setProgress(progress: number) { // 0 - 1
        if (!this._breakBlock || !this._material) return;
        if (!PlayerParams.selectedCoords) return;
        const material = this._material;
        const textureOffset = Math.floor(progress * 10) * 0.1;
        material.uniforms.uProgress.value = textureOffset;
        this._breakBlock.position.copy(PlayerParams.selectedCoords);
        if (progress > 0) {
            this._breakBlock.visible = true;
        } else {
            this._breakBlock.visible = false;
        }
        this._material.needsUpdate = true;
    }
}