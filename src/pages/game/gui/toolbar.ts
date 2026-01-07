import { BlockID } from "../Block";
import { BlockFactory } from "../Block/BlockFactory";

export class ToolBar {
    static toolbar: BlockID[] = [
      BlockID.Grass,
      BlockID.Dirt,
      BlockID.Stone,
      BlockID.StoneBrick,
      BlockID.RedstoneLamp,
      BlockID.CoalOre,
      BlockID.IronOre,
      BlockID.OakLog,
      BlockID.Leaves,
    ];
    static activeToolbarIndex = 0;
    static get activeBlockId() {
      return ToolBar.toolbar[ToolBar.activeToolbarIndex];
    }

    static scrollToolBarGUI(key: string) {
      // TODO: 实现滚动切换工具条
    }

    static updateToolBarGUI() {
      for (let i = 1; i <= 9; i++) {
        const slot = document.getElementById(`toolbar-slot-${i}`);
        if (slot) {
          const blockId = ToolBar.toolbar[i - 1];
          if (blockId != null && blockId !== BlockID.Air) {
            slot.style.backgroundImage = `url('${
              BlockFactory.getBlock(blockId).uiTexture
            }')`;
          }
        }
      }
    }

    static updateToolBarActiveGUI() {
      document?.getElementById("toolbar-active-border")
        ?.setAttribute("style", `left: ${ToolBar.activeToolbarIndex * 11}%`);
    }
}
