import { PlayerParams } from "../player/literal";
import { World } from "../world/World";

/** @desc 掉落物品的物理模拟 */
export class DropPhysics {
    private world: World;
    constructor(world: World) {
        this.world = world;
    }

    update() {
        // TODO 掉落物品的物理模拟
    }

    /**@desc 获取掉落物品的候选列表 */
    private getCandidatesDrops() {
        PlayerParams.activeChunks.forEach(chunkKey => {
            const chunk = this.world.getChunk(chunkKey.x, chunkKey.z);
            if (!chunk) return;
            // this.world.getChunk()
            // chunk.drops.forEach(drop => {
            //     if (drop.isActive) {
            //         // 掉落物品的物理模拟
            //     }
            // })
        })
    }
}