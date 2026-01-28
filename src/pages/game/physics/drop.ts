import { PlayerParams } from "../player/literal";
import { DropGroup } from "../world/drop/drop";
import { World } from "../world/World";

/** @desc 掉落物品的物理模拟 */
export class DropPhysics {
    private world: World;
    constructor(world: World) {
        this.world = world;
    }

    /**@desc 掉落物品的物理模拟更新 */
    update() {
        const drops = this.getCandidatesDrops();
        drops.forEach(drop => drop.update());
    }

    /**@desc 获取掉落物品的候选列表 */
    private getCandidatesDrops() {
        const drops: DropGroup[] = [];
        PlayerParams.activeChunks.forEach(chunkKey => {
            const chunk = this.world.getChunk(chunkKey.x, chunkKey.z);
            if (!chunk?.dropGroup) return;
            drops.push(chunk.dropGroup);
        });
        return drops;
    }
}