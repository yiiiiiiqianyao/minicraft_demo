export function updateToolBarActiveGUI(activeToolbarIndex: number) {
    document
          ?.getElementById("toolbar-active-border")
          ?.setAttribute("style", `left: ${activeToolbarIndex * 11}%`);
}