import { DevControl } from "../dev";
import { ToolBar } from "../gui";
import { Action } from "./action";
import { Player } from "./Player";

/**
 * @desc 处理玩家键盘输入事件
 */
export class KeyboardInput {
  /**@desc 用户是否按下空格键 */
  static spacePressed = false;
  /**@desc 用户是否按下 w 键  */
  static wKeyPressed = false;
  /**@desc 用户上次按下 w 键的时间  */
  static lastWPressed = 0;
  private player: Player;
  
  constructor(player: Player) {
      this.player = player;
      document.addEventListener("keydown", this.onKeyDown.bind(this));
      document.addEventListener("keyup", this.onKeyUp.bind(this));
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
        ToolBar.setToolBarGUI(Number(event.key) - 1);
        break;
      case "KeyZ":  // 左箭头
      case "KeyC":  // 右箭头
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
      case "KeyV":
        if (!DevControl.v) DevControl.v = 2;
        DevControl.v = DevControl.v === 1 ? 2 : 1;
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