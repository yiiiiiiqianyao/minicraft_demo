import { BlockID } from "../../Block";
import { BlockFactory } from "../../Block/base/BlockFactory";
import { PlayerParams } from "../../player/literal";
import { setActive } from "./dom";
import { ToolBarMaxCount } from "./literal";

/**@desc 玩家物品栏 */
export class ToolBar {
    // TODO 需要增加计数能力 一个物品栏中相同物品最多能放置 64 个，待升级为 IToolBarItem
    static toolbar: BlockID[] = [
      // BlockID.Grass,
      // BlockID.Dirt,
      // BlockID.Stone,
      // BlockID.StoneBrick,
      // BlockID.RedstoneLamp,
      // BlockID.CoalOre,
      // BlockID.IronOre,
      // BlockID.OakLog,
      // BlockID.Leaves,
      BlockID.FlowerRose
    ];
    static activeToolbarIndex = 0;
    static get activeBlockId(): BlockID | undefined {
      return ToolBar.toolbar[ToolBar.activeToolbarIndex];
    }

    /**@desc 往玩家物品栏中添加物品 */
    static pushBlockId(blockId: BlockID) {
      // TODO 待优化 目前一个格子只能放一个 后续除了工具之外的物品资源方块应该能重复放置
      if (ToolBar.toolbar.length > ToolBarMaxCount) return;
      for(let i = 0; i < ToolBar.toolbar.length; i++) {
        if(ToolBar.toolbar[i] === BlockID.Air) {
          ToolBar.toolbar[i] = blockId;
          ToolBar.updateToolBarGUI();
          PlayerParams.playerInstance?.updateHand();
          return;
        }
      }
      // 如果物品栏中没有空位置 则直接添加到最后
      ToolBar.toolbar.push(blockId);
      ToolBar.updateToolBarGUI();
      PlayerParams.playerInstance?.updateHand();
    }

    /**@desc 从玩家物品栏中移除物品 */
    static removeBlockId() {
      ToolBar.toolbar.splice(ToolBar.activeToolbarIndex, 1, BlockID.Air);
      ToolBar.updateToolBarGUI();
      PlayerParams.playerInstance?.updateHand();
    }

    static setToolBarGUI(index: number) {
      ToolBar.activeToolbarIndex = index;
      setActive(index);
    }

    /**@desc 滚动玩家物品栏的选中框 */
    static scrollToolBarGUI(key: string) {
      // 0 - 8
      if(key === 'KeyZ') { // left
        const index = ToolBar.activeToolbarIndex - 1 >= 0 ? ToolBar.activeToolbarIndex - 1 : 8;
        ToolBar.setToolBarGUI(index);
      } else if(key === 'KeyC') { // right
        const index = ToolBar.activeToolbarIndex + 1 > 8 ? 0 : ToolBar.activeToolbarIndex + 1;
        ToolBar.setToolBarGUI(index);
      }
      // 同时更新玩家手持物品
      PlayerParams.playerInstance?.updateHand();
    }

    /**@desc 更新玩家物品栏中 block 对应的 ui */
    static updateToolBarGUI() {
      for (let i = 1; i <= ToolBarMaxCount; i++) {
        const slot = document.getElementById(`toolbar-slot-${i}`);
        if (slot) {
          const blockId = ToolBar.toolbar[i - 1];
          if (blockId !== undefined && blockId !== BlockID.Air) {
            slot.style.backgroundImage = `url('${BlockFactory.getBlock(blockId).uiTexture}')`;
          } else {
            slot.style.backgroundImage = '';
          }
        }
      }
    }
}
