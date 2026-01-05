import { updateToolBarActiveGUI } from "../gui";
import { PlayerInitPosition, PlayerParams } from "./literal";
import { Player } from "./Player";

export class MoveInput {
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
        this.player.activeToolbarIndex = Number(event.key) - 1;
        updateToolBarActiveGUI(this.player.activeToolbarIndex);
        break;
      case "KeyW":
        if (!this.player.wKeyPressed && performance.now() - this.player.lastWPressed < 200) {
          this.player.isSprinting = true;
          this.player.input.z = PlayerParams.maxSprintSpeed;
        } else {
          this.player.input.z = PlayerParams.maxSpeed;
        }
        this.player.wKeyPressed = true;
        this.player.lastWPressed = performance.now();
        break;
      case "KeyA":
        this.player.input.x = -PlayerParams.maxSpeed;
        break;
      case "KeyS":
        this.player.input.z = -PlayerParams.maxSpeed;
        break;
      case "KeyD":
        this.player.input.x = PlayerParams.maxSpeed;
        break;
      case "KeyR":
        this.player.position.set(
          PlayerInitPosition.x,
          PlayerInitPosition.y,
          PlayerInitPosition.z
        );
        this.player.velocity.set(0, 0, 0);
        break;
      case "Space":
        this.player.spacePressed = true;
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