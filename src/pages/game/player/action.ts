import * as THREE from "three";
import { Player } from "./Player";
import type { PlayerEventKey } from "./interface";
import { PlayerInitPosition, PlayerParams } from "./literal";
import { World } from "../world/World";
import { KeyboardInput } from "./keyboard";
import { worldToChunkCoords } from "../world/chunk/utils";
import { BlockID } from "../Block";
import { ToolBar } from "../gui";
import { Selector } from "./selector";

/**
 * @desc 处理玩角色的动作 & 玩家的交互操作
 */
export class Action {

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
                if (PlayerParams.upperNeathBlock?.blockId !== BlockID.Air) return;

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
            if (!chunk?.dropGroup) return;
            chunk.dropGroup.attract(PlayerParams.position);
        });
    }

    /** @desc 玩家丢弃手上拿着的物品 */
    static dropHandle(player: Player) {
        if (ToolBar.activeBlockId === undefined || ToolBar.activeBlockId === BlockID.Air) return;
        // TODO 丢弃的位置待优化 判断条件待优化
        const v = new THREE.Vector3();
        player.controls.getDirection(v);
        v.multiplyScalar(1.5);
        // const dropPosition = player.position.clone().add(v);
        const dropX = player.position.x + v.x - 0.5;
        const dropY = player.position.y - 0.8;
        const dropZ = player.position.z + v.z - 0.5;
        const { chunk: { x: chunkX, z: chunkZ }, block } = worldToChunkCoords(dropX, dropY, dropZ);
        const chunk = player.world.getChunk(chunkX, chunkZ);
        if (!chunk) return;
        if (!chunk.dropGroup) chunk.initDropGroup();
        chunk.dropGroup!.drop(ToolBar.activeBlockId, block.x, dropY, block.z, true);
        // 丢弃物品后 从工具栏中移除
        ToolBar.removeBlockId();
    }

    /** @desc 玩家放置方块 */
    static placementBlock(world: World, player: Player, selectedBlockId: BlockID) {
        // 工具栏当前选中的栏目中为空 则不执行放置操作
        if (!ToolBar.activeBlockId) return;
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
        // Selector.blockPlacementNormal
        const placementBlockId = ToolBar.activeBlockId;
        // 检查是否可以放置方块
        if (!canIPlacementBlock(placementBlockId, selectedBlockId)) return;
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

function canIPlacementBlock(placementBlockId: BlockID, targetBlockId: BlockID) {
    if (placementBlockId === BlockID.FlowerRose ||
        placementBlockId === BlockID.FlowerDandelion
    ) {
        // TIP: 目前只能在草方块上放置玫瑰和蒲公英
        if (targetBlockId !== BlockID.GrassBlock) return false;
        // TIP: 目前只能在草方块的顶部放置玫瑰和蒲公英
        if (!Selector.isPlacementUpper) return false;
    }
    // 目前没有其他限制条件 都允许放置方块
    return true;
}