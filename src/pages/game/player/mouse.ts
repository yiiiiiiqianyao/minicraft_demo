import * as THREE from "three";
import { World } from "../world/World";
import { PlayerParams } from "./literal";
import { Player } from "./Player";
import { ToolBar } from "../gui";
import { PhysicsParams } from "../physics/literal";
import { Selector } from "./selector";
import { BlockID } from "../Block";
import { EventSystem } from "../../EventSystem";
import { GameEvent, GameState, PopupType, State } from "../constant";

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
        this.initListener();
    }

    /**@desc 鼠标事件/用户输入事件的监听 */
    initListener() {
        let hitTimeout: number | null = null;
        const continueHit = () => {
            hitTimeout = setTimeout(() => {
                this.onMouseDown(new MouseEvent("mousedown", { button: 0 }));
                PlayerParams.selectedCoords && continueHit();
            }, 240);
        }
        const cancelHit = () => {
            if (hitTimeout) {
                clearTimeout(hitTimeout);
                hitTimeout = null;
            }
        }
        document.addEventListener("mousedown", (e) => {
            this.onMouseDown(e);
            continueHit();
        })
        document.addEventListener("mouseup", cancelHit);
        document.addEventListener("mouseout", cancelHit);
        document.addEventListener("blur", cancelHit);
    }

    // 处理鼠标点击事件 目前是移除选中的方块和放置方块
    onMouseDown(event: MouseEvent) {
        if (!GameState.isStarted) return;
        if (!PhysicsParams.enabled) return;

        const { player, world } = this;
        if (!player || !world) return;
        if (GameState.state === 'paused') return;
        if (!player.controls.isLocked) return;
        if (event.button === 0) {
            this.handleLeftClick();
            if (!Selector.selectedMesh) return;
            // const selectedBlockId = Selector.selectedMesh.userData.blockId as BlockID;
            this.handleBreak();
        } else if (event.button === 2 && Selector.selectedMesh) {
            const selectedBlockId = Selector.selectedMesh.userData.blockId as BlockID;
            if (selectedBlockId === BlockID.CraftingTable) {
                console.log('Right Click CraftingTable');
                // 玩家控制器退出控制 Exits the pointer lock.
                GameState.state = State.Paused;
                player.controls.unlock();
                // 打开工作台弹窗
                EventSystem.broadcast(GameEvent.OpenPopup, PopupType.Craft);
            } else {
                this.handlePlacement(selectedBlockId);
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

    /**@desc 挖掘方块时的中断定时器 */
    private breakInterruptedTimer: number | null = null;
    /**@desc 破坏一个方块 */
    private handleBreak() {
        const pos = Selector.getBlockPositionInWorld();
        if (!pos) return;
        const [x, y, z] = pos;
        this.breakInterruptedTimer && clearTimeout(this.breakInterruptedTimer);
        const isBreak = this.world.hitBlock(x, y, z);
        if (!isBreak) {
            // TODO 暂时设置挖掘的中断时间为 500ms
            this.breakInterruptedTimer = setTimeout(() => {
                this.world.interruptHit(x, y, z);
            }, 500);
        }
    }

    /**@desc 放置一个方块 */
    private handlePlacement(selectedBlockId: BlockID) {
        // 工具栏当前选中的栏目中为空 则不执行放置操作
        if (!ToolBar.activeBlockId) return;
        const { world, player } = this;
        const playerPos = new THREE.Vector3(
        Math.floor(player.position.x),
        Math.floor(player.position.y) - PlayerParams.halfHeight,
        Math.floor(player.position.z)
        );
        const blockPos = new THREE.Vector3(
        Math.floor(Selector.blockPlacementCoords.x - 0.5),
        Math.floor(Selector.blockPlacementCoords.y - 0.5),
        Math.floor(Selector.blockPlacementCoords.z - 0.5)
        );

        // TODO 需要精细判断
        // 检查是否超出可以放置方块的距离（玩家本身所处的方块）
        if (playerPos.distanceTo(blockPos) <= 1) return;

        const placementBlockId = ToolBar.activeBlockId;
        // Right click 放置方块
        const isPlacementSuccess = world.addBlock(
            blockPos.x,
            blockPos.y,
            blockPos.z,
            placementBlockId,
        );
        if (isPlacementSuccess) {
            // 放置方块后需要从玩家物品栏中移除当前放置的方块
            ToolBar.removeBlockId();
            // 触发放置的动作
            PlayerParams.playerInstance?.placementHand();
            // TODO update under block
            // 若放置的 block 下方的方块是 grass 草方块，则草方块应该更新为泥土方块
            // console.log(selectedBlockId, 'placed');
            // console.log(Selector.blockPlacementNormal);
            world.updateByPlacementBlock(
                blockPos.x,
                blockPos.y,
                blockPos.z,
                selectedBlockId,
                placementBlockId,
            );
        }        
    }
}