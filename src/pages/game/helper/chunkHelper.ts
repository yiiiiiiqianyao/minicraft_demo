import * as THREE from "three";
import { ChunkParams } from "../world/chunk/literal";
import { PlayerParams } from "../player/literal";
import { World } from "../world/World";
import { IChunkKey } from "../player/interface";

function initChunkHelper() {
    const chunkHelper = new THREE.Mesh(
    new THREE.BoxGeometry(ChunkParams.width, ChunkParams.height, ChunkParams.width), 
    new THREE.MeshBasicMaterial({
        // color: new THREE.Color(1, 1, 1),
        // opacity: 0.3,
        // transparent: true,
        wireframe: true,
    }))
    chunkHelper.userData.isActive = false;
    chunkHelper.position.x = -ChunkParams.width / 2;
    chunkHelper.position.z = -ChunkParams.width / 2;
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
function updatePlayerNearFourHelper(nearFourChunks: IChunkKey[], world: World, wireframe = false) {
    wireframe && nearFourChunks.forEach((nearChunk) => {
        const nearChunkHelper = world.getChunk(nearChunk.x, nearChunk.z)?.helper;
        nearChunkHelper && activeChunkHelper(nearChunkHelper);
    });
    PlayerParams.nearFourChunks = nearFourChunks;
    wireframe && PlayerParams.lastNearFourChunks.forEach((lastNearChunk) => {
        // 过滤 当前的 4 个最近 chunk
        if(nearFourChunks.filter(chunk => chunk.x === lastNearChunk.x && chunk.z === lastNearChunk.z).length > 0) return;
        const lastChunkHelper = world.getChunk(lastNearChunk.x, lastNearChunk.z)?.helper;
        lastChunkHelper && inActiveChunkHelper(lastChunkHelper);
    });
    // for dev test
    PlayerParams.lastNearFourChunks = nearFourChunks;
}

export {
    activeChunkHelper,
    inActiveChunkHelper,
    initChunkHelper,
    updatePlayerNearFourHelper,
}