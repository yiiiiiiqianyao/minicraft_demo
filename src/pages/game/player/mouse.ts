import * as THREE from "three";
import { World } from "../world/World";
import { PlayerParams } from "./literal";
import { Player } from "./Player";
import { Action } from "./action";
import { ToolBar } from "../gui";
import { PhysicsParams } from "../physics/literal";
import Game from "../Game";
import { Selector } from "./selector";
import { BlockID } from "../Block";

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
        if (!Game.isStarted) return;
        if (!PhysicsParams.enabled) return;

        const { player, world } = this;
        if (!player || !world) return;
        if (!player.controls.isLocked) return;
        if (event.button === 0) {
            this.handleLeftClick();
            this.handleBreak();
        } else if (event.button === 2 && Action.blockPlacementCoords) {
            if (!Selector.selectedMesh) return;
            const selectedBlockId = Selector.selectedMesh.userData.blockId;
            if (selectedBlockId === BlockID.CraftingTable) {
                console.log('Right Click CraftingTable');
            } else {
                this.handlePlacement();
            }
            
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
        const pos = Selector.getBlockPositionInWorld();
        if (!pos) return;
        const [x, y, z] = pos;
        this.world.removeBlock(x, y, z);
    }

    /**@desc 放置一个方块 */
    private handlePlacement() {
        // 工具栏当前选中的栏目中为空 则不执行放置操作
        if (!ToolBar.activeBlockId) return;
        const { world, player } = this;
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
        const isPlacementSuccess = world.addBlock(
            blockPos.x,
            blockPos.y,
            blockPos.z,
            ToolBar.activeBlockId
        );
        if (isPlacementSuccess) {
            // 放置方块后需要从玩家物品栏中移除当前放置的方块
            ToolBar.removeBlockId();
            // 触发放置的动作
            PlayerParams.playerInstance?.placementHand();
            // TODO update under block
            // 若放置的 block 下方的方块是 grass 草方块，则草方块应该更新为泥土方块
        }        
    }
}