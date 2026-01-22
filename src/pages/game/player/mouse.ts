import * as THREE from "three";
import { World } from "../world/World";
import { PlayerParams } from "./literal";
import { Player } from "./Player";
import { Action } from "./action";
import { ToolBar } from "../gui";
import { worldToCeilBlockCoord } from "../world/chunk/utils";

/**@desc 处理玩家鼠标输入事件 */
export class MouseInput {
    onLeftClick?(): void;
    onRightClick?(): void;
    private isClickEvent = false;
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
        if (event.button === 0) {
            this.handleLeftClick();
            this.handleBreak();
        } else if (event.button === 2 && Action.blockPlacementCoords) {
            this.handlePlacement();
        }
    }

    private handleLeftClick() {
        if (this.onLeftClick && !this.isClickEvent) {
            this.isClickEvent = true;
            setTimeout(() => this.isClickEvent = false, 64);
            this.onLeftClick();
        }
    }

    /**@desc 破坏一个方块 */
    private handleBreak() {
        if(!PlayerParams.selectedCoords) return;
        const { x, y, z } = PlayerParams.selectedCoords;
        // Left click 移除选中的方块
        // TODO 需要考虑是否能够破坏和移除方块
        // TODO 破坏 & 移除方块的时候 需要出现破坏效果 & 播放破坏音效 & 出现掉落物品
        const [blockX, blockY, blockZ] = worldToCeilBlockCoord(x, y, z);
        this.world.removeBlock(blockX, blockY, blockZ);
    }

    /**@desc 放置一个方块 */
    private handlePlacement() {
        const { world, player } = this;
        // 当前玩家手上没有方块
        if (!ToolBar.activeBlockId) return;
        const playerPos = new THREE.Vector3(
        Math.floor(player.position.x),
        Math.floor(player.position.y) - PlayerParams.halfHeight,
        Math.floor(player.position.z)
        );
        const blockPos = new THREE.Vector3(
        Math.floor(Action.blockPlacementCoords.x - 0.5),
        Math.floor(Action.blockPlacementCoords.y - 0.5),
        Math.floor(Action.blockPlacementCoords.z - 0.5)
        );

        // TODO 需要精细判断
        // 检查是否超出可以放置方块的距离（玩家本身所处的方块）
        if (playerPos.distanceTo(blockPos) <= 1) return;

        // Right click 放置方块
        world.addBlock(
            blockPos.x,
            blockPos.y,
            blockPos.z,
            ToolBar.activeBlockId
        );
        // 放置方块后需要从玩家物品栏中移除当前放置的方块
        ToolBar.removeBlockId();
        // 触发放置的动作
        PlayerParams.playerInstance?.placementHand();
    }
}