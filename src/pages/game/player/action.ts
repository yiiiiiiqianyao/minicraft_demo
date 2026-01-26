import * as THREE from "three";
import { Player } from "./Player";
import type { PlayerEventKey } from "./interface";
import { PlayerInitPosition, PlayerParams } from "./literal";
import { World } from "../world/World";
import { KeyboardInput } from "./keyboard";
import { worldToChunkCoords } from "../world/chunk/utils";
import { BlockID } from "../Block";
import { ToolBar } from "../gui";

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
                // 只有在玩家头顶上的方块是空气时 才可以跳跃
                if (PlayerParams.upperNeathBlock?.block !== BlockID.Air) return;

                if (isKeyDown) {
                    KeyboardInput.spacePressed = true;
                } else {
                    KeyboardInput.spacePressed = false;
                }
                break;
            case "KeyR": // reset player position & velocity
                player.position.copy(PlayerInitPosition);
                player.velocity.set(0, 0, 0);
                break;
        }
    }

    /** @desc 玩家吸收掉落的物品 */
    static absorbDrops(world: World) {
        // 玩家吸收掉落的物品 只需要在玩家当前活动的 chunk 检测即可
        PlayerParams.activeChunks.forEach(chunkKey => {
            const chunk = world.getChunk(chunkKey.x, chunkKey.z);
            if (!chunk) return;
            chunk.dropGroup.attract(PlayerParams.position);
        });
    }

    /** @desc 玩家丢弃手上拿着的物品 */
    static dropHandle(player: Player) {
        if (ToolBar.activeBlockId === undefined || ToolBar.activeBlockId === BlockID.Air) return;
        // TODO 丢弃的位置待优化
        const v = new THREE.Vector3();
        player.controls.getDirection(v);
        v.multiplyScalar(1.5);
        // const dropPosition = player.position.clone().add(v);
        const dropX = player.position.x + v.x - 0.5;
        const dropY = player.position.y - 1.2;
        const dropZ = player.position.z + v.z - 0.5;
        const { chunk: { x: chunkX, z: chunkZ }, block } = worldToChunkCoords(dropX, dropY, dropZ);
        const chunk = player.world.getChunk(chunkX, chunkZ);
        chunk?.dropGroup.drop(ToolBar.activeBlockId, block.x, dropY, block.z, true);
        // 丢弃物品后 从工具栏中移除
        ToolBar.removeBlockId();
    }
}

function handlePlayerMove(player: Player, eventKey: PlayerEventKey, isKeyDown = true) {
    // TODO 在 key up 的时候 不应该直接把 input 设置为 0 需要保留一个速度 需要在 physics 中模拟一个减速过程
    switch (eventKey) {
        case "KeyW": // move forward
            if(isKeyDown) {
                // 处理前进移动和前进跑步
                if (!KeyboardInput.wKeyPressed && performance.now() - KeyboardInput.lastWPressed < 200) {
                    player.isSprinting = true;
                    player.input.z = PlayerParams.maxSprintSpeed;
                } else {
                    player.input.z = PlayerParams.maxSpeed;
                }
                KeyboardInput.wKeyPressed = true;
                KeyboardInput.lastWPressed = performance.now();
            } else {
                player.input.z = 0;
                KeyboardInput.wKeyPressed = false;
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