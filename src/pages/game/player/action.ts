import * as THREE from "three";
import { Player } from "./Player";
import { PlayerEventKey } from "./interface";
import { PlayerInitPosition, PlayerParams } from "./literal";

/**
 * @desc 处理玩角色的动作 & 玩家的交互操作
 */
export class Action {
    
    /** @desc 玩家点击鼠标右键 放置方块的坐标*/
    static blockPlacementCoords: THREE.Vector3;

    /** @desc 处理角色的动作 */
    static handlePlayerEvent(player: Player, eventKey: PlayerEventKey) {
        switch (eventKey) {
            case "KeyW":
            case "KeyS":
            case "KeyA":
            case "KeyD":
                handlePlayerMove(player, eventKey);
                break;
            case "Space": // jump
                player.spacePressed = true;
                break;
            case "KeyR": // reset player position & velocity
                player.position.copy(PlayerInitPosition);
                player.velocity.set(0, 0, 0);
                break;
        }
    }
}

function handlePlayerMove(player: Player, eventKey: PlayerEventKey) {
    switch (eventKey) {
        case "KeyW": // move forward
            // 处理前进移动和前进跑步
            if (!player.wKeyPressed && performance.now() - player.lastWPressed < 200) {
                player.isSprinting = true;
                player.input.z = PlayerParams.maxSprintSpeed;
            } else {
                player.input.z = PlayerParams.maxSpeed;
            }
            player.wKeyPressed = true;
            player.lastWPressed = performance.now();
            break;
        case "KeyA": // move left
            player.input.x = -PlayerParams.maxSpeed;
            break;
        case "KeyS": // move backward
            player.input.z = -PlayerParams.maxSpeed;
            break;
        case "KeyD": // move right
            player.input.x = PlayerParams.maxSpeed;
            break;
    }
}