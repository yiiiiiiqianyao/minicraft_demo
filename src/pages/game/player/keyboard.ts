import { BlockID } from "../Block";
import { updateToolBarActiveGUI, updateToolBarGUI } from "../gui";
import { Action } from "./action";
import { PlayerInitPosition, PlayerParams } from "./literal";
import { Player } from "./Player";

/**
 * @desc 处理玩家键盘输入事件
 */
export class KeyboardInput {
    private player: Player;
    private toolbar: BlockID[] = [
      BlockID.Grass,
      BlockID.Dirt,
      BlockID.Stone,
      BlockID.StoneBrick,
      BlockID.RedstoneLamp,
      BlockID.CoalOre,
      BlockID.IronOre,
      BlockID.OakLog,
      BlockID.Leaves,
    ];
    private activeToolbarIndex = 0;
    get activeBlockId() {
      return this.toolbar[this.activeToolbarIndex];
    }
    constructor(player: Player) {
        this.player = player;
        document.addEventListener("keydown", this.onKeyDown.bind(this));
        document.addEventListener("keyup", this.onKeyUp.bind(this));

        updateToolBarGUI(this.toolbar);
    }

  onKeyDown(event: KeyboardEvent) {
    const validKeys = ["KeyW", "KeyA", "KeyS", "KeyD", "KeyR"];
    // 玩家移动 or 重置的时候 控制器解锁
    if (validKeys.includes(event.code) && !this.player.controls.isLocked) {
      this.player.controls.lock();
    }

    switch (event.code) {
      case "Digit1":
      case "Digit2":
      case "Digit3":
      case "Digit4":
      case "Digit5":
      case "Digit6":
      case "Digit7":
      case "Digit8":
      case "Digit9":
        // TODO 工具栏切换功能优化
        this.activeToolbarIndex = Number(event.key) - 1;
        updateToolBarActiveGUI(this.activeToolbarIndex);
        break;
      case "KeyW":
      case "KeyA":
      case "KeyS":
      case "KeyD":
      case "KeyR":
      case "Space":
        Action.handlePlayerEvent(this.player, event.code);
        break;
    }
  }

  onKeyUp(event: KeyboardEvent) {
    switch (event.code) {
      case "KeyW":
        this.player.input.z = 0;
        this.player.wKeyPressed = false;
        this.player.isSprinting = false;
        break;
      case "KeyA":
        this.player.input.x = 0;
        break;
      case "KeyS":
        this.player.input.z = 0;
        break;
      case "KeyD":
        this.player.input.x = 0;
        break;
      case "Space":
        this.player.spacePressed = false;
        break;
    }
  }
}