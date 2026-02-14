import * as THREE from "three";
import { ChunkParams } from "../world/chunk/literal";
import { PlayerParams } from "../player/literal";
import { World } from "../world/World";
import type { IChunkKey } from "../player/interface";
import { DevControl, updateChunkCoordGUI } from "../dev";
import { WorldParams } from "../world/literal";

function initChunkHelper() {
    const chunkHelper = new THREE.Mesh(
    new THREE.BoxGeometry(ChunkParams.width, ChunkParams.height, ChunkParams.width), 
    new THREE.MeshBasicMaterial({
        color: new THREE.Color(1, 1, 1),
        opacity: 0.1,
        transparent: true,
    }))
    chunkHelper.userData.isActive = false;
    chunkHelper.position.x = ChunkParams.width / 2;
    chunkHelper.position.z = ChunkParams.width / 2;
    chunkHelper.position.y = ChunkParams.height / 2;
    return chunkHelper;
}

function activeChunkHelper(helper: THREE.Mesh) {
    helper.userData.isActive = true;
    (helper.material as THREE.MeshBasicMaterial).color.setRGB(1, 0, 0);
}

function inActiveChunkHelper(helper: THREE.Mesh) {
    helper.userData.isActive = false;
    (helper.material as THREE.MeshBasicMaterial).color.setRGB(1, 1, 1);
}

/**
 * 当前的 4 个最近 chunk
 * @param nearFourChunks 
 * @param world 
 */
let lastNearFourChunks: IChunkKey[] = [];
function updatePlayerNear(chunk: IChunkKey, nearFourChunks: IChunkKey[], world: World, isInChunkCenter: boolean) {
    updateChunkCoordGUI(chunk.x, chunk.z);
    // 玩家所处的 chunk 未发生变化 则不更新后续计算
    if (
        PlayerParams.currentChunk && 
        (PlayerParams.currentChunk.x === chunk.x && PlayerParams.currentChunk.z === chunk.z) &&
        PlayerParams.activeChunks.length !== 0
    ) return;
    PlayerParams.currentChunk = chunk;
    PlayerParams.nearFourChunks = nearFourChunks;
    PlayerParams.isInChunkCenter = isInChunkCenter;
    PlayerParams.activeChunks = isInChunkCenter ? [chunk] : nearFourChunks;
    WorldParams.updateVisibleChunks = true;

    const { chunkHelperVisible } = DevControl;
    chunkHelperVisible && PlayerParams.activeChunks.forEach((nearChunk) => {
        const chunk = world.getChunk(nearChunk.x, nearChunk.z);
        // console.log(chunk?.userData)
        const nearChunkHelper = chunk?.helper;
        nearChunkHelper && activeChunkHelper(nearChunkHelper);
    });
    chunkHelperVisible && lastNearFourChunks.forEach((lastNearChunk) => {
        // 过滤 当前的 4 个最近 chunk
        if(PlayerParams.activeChunks.filter(chunk => chunk.x === lastNearChunk.x && chunk.z === lastNearChunk.z).length > 0) return;
        const lastChunkHelper = world.getChunk(lastNearChunk.x, lastNearChunk.z)?.helper;
        lastChunkHelper && inActiveChunkHelper(lastChunkHelper);
    });
    // for dev test
    lastNearFourChunks = PlayerParams.activeChunks;
}

export {
    activeChunkHelper,
    inActiveChunkHelper,
    initChunkHelper,
    updatePlayerNear,
}