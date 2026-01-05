import { BlockID } from "../Block";
import { BlockFactory } from "../Block/BlockFactory";

export function updateToolBarActiveGUI(activeToolbarIndex: number) {
    document
          ?.getElementById("toolbar-active-border")
          ?.setAttribute("style", `left: ${activeToolbarIndex * 11}%`);
}

export function updateToolBarGUI(toolbar: BlockID[]) {
  for (let i = 1; i <= 9; i++) {
    const slot = document.getElementById(`toolbar-slot-${i}`);
    if (slot) {
      const blockId = toolbar[i - 1];
      if (blockId != null && blockId !== BlockID.Air) {
        slot.style.backgroundImage = `url('${
          BlockFactory.getBlock(blockId).uiTexture
        }')`;
      }
    }
  }
}