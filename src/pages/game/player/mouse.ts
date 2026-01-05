import * as THREE from "three";
import { World } from "../world/World";
import { PlayerParams } from "./literal";
import { Player } from "./Player";

export class MouseInput {
    private player: Player;
    private world: World;
    constructor(player: Player, world: World) {
        this.player = player;
        this.world = world;

        document.addEventListener("mousedown", this.onMouseDown.bind(this), false);
    }

    // 处理鼠标点击事件 目前是移除选中的方块和放置方块
    onMouseDown(event: MouseEvent) {
    if (this.player.controls.isLocked) {
        if (event.button === 0 && this.player.selectedCoords) {
        // Left click 移除选中的方块
        this.world.removeBlock(
            Math.ceil(this.player.selectedCoords.x - 0.5),
            Math.ceil(this.player.selectedCoords.y - 0.5),
            Math.ceil(this.player.selectedCoords.z - 0.5)
        );
        } else if (event.button === 2 && this.player.blockPlacementCoords) {
        // console.log("adding block", this.player.activeBlockId);
        if (this.player.activeBlockId != null) {
            const playerPos = new THREE.Vector3(
            Math.floor(this.player.position.x),
            Math.floor(this.player.position.y) - 1,
            Math.floor(this.player.position.z)
            );
            const blockPos = new THREE.Vector3(
            Math.floor(this.player.blockPlacementCoords.x - 0.5),
            Math.floor(this.player.blockPlacementCoords.y - 0.5),
            Math.floor(this.player.blockPlacementCoords.z - 0.5)
            );

            // 检查是否超出可以放置方块的距离
            if (playerPos.distanceTo(blockPos) <= PlayerParams.radius * 2) return;

            // Right click 放置方块
            this.world.addBlock(
            blockPos.x,
            blockPos.y,
            blockPos.z,
            this.player.activeBlockId
            );
        }
        }
    }
    }
}