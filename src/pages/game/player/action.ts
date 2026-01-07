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
    static handlePlayerEvent(player: Player, eventKey: PlayerEventKey, isKeyDown = true) {
        switch (eventKey) {
            case "KeyW":
            case "KeyS":
            case "KeyA":
            case "KeyD":
                handlePlayerMove(player, eventKey, isKeyDown);
                break;
            case "Space": // jump
                if(isKeyDown) {
                    player.spacePressed = true;
                } else {
                    player.spacePressed = false;
                }
                break;
            case "KeyR": // reset player position & velocity
                player.position.copy(PlayerInitPosition);
                player.velocity.set(0, 0, 0);
                break;
        }
    }
}

function handlePlayerMove(player: Player, eventKey: PlayerEventKey, isKeyDown = true) {
    // TODO 在 key up 的时候 不应该直接把 input 设置为 0 需要保留一个速度 需要在 physics 中模拟一个减速过程
    switch (eventKey) {
        case "KeyW": // move forward
            if(isKeyDown) {
                // 处理前进移动和前进跑步
                if (!player.wKeyPressed && performance.now() - player.lastWPressed < 200) {
                    player.isSprinting = true;
                    player.input.z = PlayerParams.maxSprintSpeed;
                } else {
                    player.input.z = PlayerParams.maxSpeed;
                }
                player.wKeyPressed = true;
                player.lastWPressed = performance.now();
            } else {
                player.input.z = 0;
                player.wKeyPressed = false;
                player.isSprinting = false;
            }
            break;
        case "KeyA": // move left
            if(isKeyDown) {
                player.input.x = -PlayerParams.maxSpeed;
            } else {
                player.input.x = 0;
            }
            break;
        case "KeyS": // move backward
            if(isKeyDown) {
                player.input.z = -PlayerParams.maxSpeed;
            } else {
                player.input.z = 0;
            }
            break;
        case "KeyD": // move right
            if(isKeyDown) {
                player.input.x = PlayerParams.maxSpeed;
            } else {
                player.input.x = 0;
            }
            break;
    }
}