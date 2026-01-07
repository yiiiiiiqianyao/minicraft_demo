import * as THREE from "three";
import { World } from "../world/World";
import { PlayerParams } from "./literal";
import { Player } from "./Player";
import { Action } from "./action";
import { ToolBar } from "../gui";

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
        const { player, world } = this;
        if (!player || !world) return;
        if (!player.controls.isLocked) return;
        if (event.button === 0 && PlayerParams.selectedCoords) {
            const { x, y, z } = PlayerParams.selectedCoords;
            // Left click 移除选中的方块
            // TODO 需要考虑是否能够破坏和移除方块
            // TODO 破坏 & 移除方块的时候 需要出现破坏效果 & 播放破坏音效 & 出现掉落物品
            world.removeBlock(Math.ceil(x - 0.5), Math.ceil(y - 0.5), Math.ceil(z - 0.5));
        } else if (event.button === 2 && Action.blockPlacementCoords) {
            // console.log("adding block", this.player.activeBlockId);
            if (ToolBar.activeBlockId != null) {
                const playerPos = new THREE.Vector3(
                Math.floor(player.position.x),
                Math.floor(player.position.y) - 1,
                Math.floor(player.position.z)
                );
                const blockPos = new THREE.Vector3(
                Math.floor(Action.blockPlacementCoords.x - 0.5),
                Math.floor(Action.blockPlacementCoords.y - 0.5),
                Math.floor(Action.blockPlacementCoords.z - 0.5)
                );

                // 检查是否超出可以放置方块的距离
                if (playerPos.distanceTo(blockPos) <= PlayerParams.radius * 2) return;

                // Right click 放置方块
                world.addBlock(
                    blockPos.x,
                    blockPos.y,
                    blockPos.z,
                    ToolBar.activeBlockId
                    );
            }
        }
    }
}