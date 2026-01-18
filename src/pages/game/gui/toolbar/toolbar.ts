import { BlockID } from "../../Block";
import { BlockFactory } from "../../Block/BlockFactory";
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
    ];
    static activeToolbarIndex = 0;
    static get activeBlockId(): BlockID | undefined {
      return ToolBar.toolbar[ToolBar.activeToolbarIndex];
    }

    /**@desc 往玩家物品栏中添加物品 */
    static pushBlockId(blockId: BlockID) {
      if (ToolBar.toolbar.includes(blockId)) return;
      if (ToolBar.toolbar.length > ToolBarMaxCount) return;
      ToolBar.toolbar.push(blockId);
      ToolBar.updateToolBarGUI();
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
    }

    /**@desc 更新玩家物品栏中 block 对应的 ui */
    static updateToolBarGUI() {
      for (let i = 1; i <= ToolBarMaxCount; i++) {
        const slot = document.getElementById(`toolbar-slot-${i}`);
        if (slot) {
          const blockId = ToolBar.toolbar[i - 1];
          if (blockId !== undefined && blockId !== BlockID.Air) {
            slot.style.backgroundImage = `url('${BlockFactory.getBlock(blockId).uiTexture}')`;
          }
        }
      }
    }
}
