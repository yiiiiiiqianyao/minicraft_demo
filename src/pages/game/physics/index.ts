import * as THREE from "three";
import { Player } from "../player/Player";
import { PhysicsHelper } from "../helper";
import { PhysicsParams } from "./literal";
import { DevControl } from "../dev";
import { PlayerPhysics } from "./player";
import { DropPhysics } from "./drop";
import { World } from "../world/World";

export class Physics {
  /**@desc 玩家物理模拟 */
  playerPhysics: PlayerPhysics;
  /**@desc 掉落物品物理模拟 */
  dropPhysics: DropPhysics;
  /**@desc 物理碰撞辅助可视化 */
  helpers: PhysicsHelper | null = null;
  constructor(scene: THREE.Scene, player: Player, world: World) {
    if (DevControl.physicsHelperVisible) {
      this.helpers = new PhysicsHelper();
      this.helpers.visible = true;
      scene.add(this.helpers);
    }
    this.playerPhysics = new PlayerPhysics(player, this.helpers);
    this.dropPhysics = new DropPhysics(world);
  }

  /**@desc physics 更新 player 物理计算 */
  update(dt: number) {
    PhysicsParams.accumulator += dt;
    while (PhysicsParams.accumulator >= PhysicsParams.stepSize) {
      // TODO 待优化
      PhysicsParams.accumulator -= PhysicsParams.stepSize;
      // 清除之前的碰撞辅助可视化
      this.helpers?.clear();
      // 玩家物理模拟
      this.playerPhysics.update();
      // 掉落物品物理模拟
      this.dropPhysics.update();
    }
  }
}
