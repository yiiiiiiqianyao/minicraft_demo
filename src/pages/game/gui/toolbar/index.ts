import { BlockID } from "../../Block";
import { BlockFactory } from "../../Block/base/BlockFactory";
import { PlayerParams } from "../../player/literal";
import { setActive } from "./dom";
import type { IToolBarItem } from "./interface";
import { ToolBarItemMaxCount, ToolBarMaxCount } from "./literal";
import { ToolBarFill, ToolBarFillActive, ToolBatContainsAvailable } from "./utils";

/**@desc 玩家物品栏 */
export class ToolBar {
    // TODO 需要增加计数能力 一个物品栏中相同物品最多能放置 64 个，待升级为 IToolBarItem
    static toolbar: IToolBarItem[] = [
      // BlockID.Dirt,
      // BlockID.Stone,
      // BlockID.StoneBrick,
      // BlockID.RedstoneLamp,
      // BlockID.IronOre,
      // BlockID.OakLog,
      // BlockID.Leaves,
      // BlockID.FlowerRose
      {
        blockId: BlockID.Air,
        count: 1,
      },
      {
        blockId: BlockID.CraftingTable,
        count: 1,
      }
    ];
    static activeToolbarIndex = 0;
    static get activeBlockId(): BlockID | undefined {
      return ToolBar.toolbar[ToolBar.activeToolbarIndex]?.blockId;
    }
    static get isToolStackFull() {
      const count = ToolBar.toolbar.filter(item => item && item.blockId !== BlockID.Air).length;
      return count === ToolBarMaxCount;
    }

    /**@desc 往玩家物品栏中添加物品 */
    static pushBlockId(blockId: BlockID) {
      // 优先填充激活的栏目
      if (ToolBar.activeBlockId === undefined || ToolBar.activeBlockId === BlockID.Air) {
        ToolBarFillActive(blockId);
        ToolBar.updateToolBarGUI();
        PlayerParams.playerInstance?.updateHand();
        return;
      }
      if (ToolBar.activeBlockId === blockId && ToolBar.toolbar[ToolBar.activeToolbarIndex]!.count < ToolBarItemMaxCount) {
        // 激活的栏目已存在该物品 且数量未达上限 则增加物品
        ToolBar.toolbar[ToolBar.activeToolbarIndex]!.count++;
        ToolBar.updateToolBarGUI();
        return;
      }
      const { contains, toolBarItem } = ToolBatContainsAvailable(blockId);
      if (contains && toolBarItem!.count === ToolBarItemMaxCount) {
        // 物品栏中已存在该物品 且数量已达上限
        if(ToolBar.isToolStackFull) {
          // 物品栏已满 则不添加
          return;
        } else {
          // 物品栏未满 则增加物品
          ToolBarFill(blockId);
        }
      } else if (contains && toolBarItem!.count < ToolBarItemMaxCount) {
        // 物品栏中已存在该物品 且数量未达上限
        toolBarItem!.count++;
      } else if(ToolBar.isToolStackFull) {
        // 物品栏中已存在该物品 且物品栏已满 则不添加
        return;
      } else {
        // 物品栏中不存在该物品 且物品栏未满 则直接添加
        ToolBarFill(blockId);
      }
      ToolBar.updateToolBarGUI();
      PlayerParams.playerInstance?.updateHand();
    }

    /**@desc 从玩家物品栏中移除物品 - 当前激活的栏目中移除 */
    static removeBlockId() {
      if (ToolBar.activeBlockId === undefined || ToolBar.activeBlockId === BlockID.Air) return;
      const activeToolBarItem = ToolBar.toolbar[ToolBar.activeToolbarIndex];
      if(activeToolBarItem.count > 1) {
        activeToolBarItem.count--;
      } else {
        ToolBar.toolbar.splice(ToolBar.activeToolbarIndex, 1, {
          blockId: BlockID.Air,
          count: 0,
        });
      }
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
      for (let i = 1; i <= ToolBar.toolbar.length; i++) {
        // TODO 组件能力待优化 使用 EventSystem 优化更新设置
        const slot = document.getElementById(`toolbar-slot-${i}`);
        if (slot) {
          const toolItem = ToolBar.toolbar[i - 1];
          if (!toolItem || toolItem.blockId === BlockID.Air) {
            slot.style.backgroundImage = '';
            slot.innerHTML = '';
          }
          // 其他情况 则显示对应的 block 贴图
          slot.style.backgroundImage = `url('${BlockFactory.getBlockUIImg(toolItem.blockId)}')`;
          slot.innerHTML = toolItem.count > 1 ? `<div class="toolbar-count">${toolItem.count}</div>` : '';
        }
      }
    }
}
