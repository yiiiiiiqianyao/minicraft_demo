import { World } from "../world/World";
import { PlayerParams } from "./literal";
import { Player } from "./Player";
import { PhysicsParams } from "../physics/literal";
import { Selector } from "./selector";
import { BlockID } from "../Block";
import { EventSystem } from "../../EventSystem";
import { GameEvent, GameState, PopupType, State } from "../constant";
import { Action } from "./action";

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
            if (!Selector.selectedMesh) return
            this.handleBreak();
        } else if (event.button === 2 && Selector.selectedBlock) {
            const selectedBlockId = Selector.selectedBlock;
            if (selectedBlockId === BlockID.CraftingTable) {
                console.log('Right Click CraftingTable');
                // 玩家控制器退出控制 Exits the pointer lock.
                GameState.state = State.Paused;
                player.controls.unlock();
                // 打开工作台弹窗
                EventSystem.broadcast(GameEvent.OpenPopup, PopupType.Craft);
            } else {
                Action.placementBlock(world, player, selectedBlockId);
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
}