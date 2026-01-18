let toolbarActiveBorder: HTMLElement | null = null;
/**@desc 更新玩家物品栏的选中框 ui */
export function setActive(activeIndex: number) {
    if(!toolbarActiveBorder) {
        toolbarActiveBorder = document.getElementById("toolbar-active-border")
        if(!toolbarActiveBorder) {
            console.error("toolbar-active-border not found");
            return;
        }
    }
    toolbarActiveBorder.setAttribute("style", `left: ${activeIndex * 11}%`);
}