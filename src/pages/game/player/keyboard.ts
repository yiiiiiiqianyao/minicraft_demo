import { ToolBar } from "../gui";
import { Action } from "./action";
import { Player } from "./Player";

/**
 * @desc 处理玩家键盘输入事件
 */
export class KeyboardInput {
    private player: Player;
    
    constructor(player: Player) {
        this.player = player;
        document.addEventListener("keydown", this.onKeyDown.bind(this));
        document.addEventListener("keyup", this.onKeyUp.bind(this));

        ToolBar.updateToolBarGUI();
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
        ToolBar.activeToolbarIndex = Number(event.key) - 1;
        ToolBar.updateToolBarActiveGUI();
        break;
      case "Comma":  // 左箭头
      case "Period":  // 右箭头
        ToolBar.scrollToolBarGUI(event.code);
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
      case "KeyA":
      case "KeyS":
      case "KeyD":
      case "Space":
        Action.handlePlayerEvent(this.player, event.code, false);
        break;
    }
  }
}