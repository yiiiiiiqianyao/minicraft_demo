import * as THREE from "three";
import { ChunkParams } from "../world/chunk/literal";
import { PlayerParams } from "../player/literal";
import { World } from "../world/World";
import { IChunkKey } from "../player/interface";
import { DevControl } from "../dev";

function initChunkHelper() {
    const chunkHelper = new THREE.Mesh(
    new THREE.BoxGeometry(ChunkParams.width, ChunkParams.height, ChunkParams.width), 
    new THREE.MeshBasicMaterial({
        color: new THREE.Color(1, 1, 1),
        opacity: 0.3,
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
function updatePlayerNearHelpers(chunk: IChunkKey, nearFourChunks: IChunkKey[], world: World, isInChunkCenter: boolean) {
    PlayerParams.nearFourChunks = nearFourChunks;
    PlayerParams.isInChunkCenter = isInChunkCenter;

    const { chunkHelperVisible } = DevControl;
    const activeChunks = isInChunkCenter ? [chunk] : nearFourChunks;
    chunkHelperVisible && activeChunks.forEach((nearChunk) => {
        const chunk = world.getChunk(nearChunk.x, nearChunk.z);
        // console.log(chunk?.userData)
        const nearChunkHelper = chunk?.helper;
        nearChunkHelper && activeChunkHelper(nearChunkHelper);
    });
    chunkHelperVisible && lastNearFourChunks.forEach((lastNearChunk) => {
        // 过滤 当前的 4 个最近 chunk
        if(activeChunks.filter(chunk => chunk.x === lastNearChunk.x && chunk.z === lastNearChunk.z).length > 0) return;
        const lastChunkHelper = world.getChunk(lastNearChunk.x, lastNearChunk.z)?.helper;
        lastChunkHelper && inActiveChunkHelper(lastChunkHelper);
    });
    // for dev test
    lastNearFourChunks = activeChunks;
}

export {
    activeChunkHelper,
    inActiveChunkHelper,
    initChunkHelper,
    updatePlayerNearHelpers,
}