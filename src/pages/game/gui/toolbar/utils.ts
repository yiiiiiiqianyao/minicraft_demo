import { ToolBar } from ".";
import { BlockID } from "../../Block";
import type { IToolBarContains, IToolBarItem } from "./interface";
import { ToolBarItemMaxCount, ToolBarMaxCount } from "./literal";

/**@desc 检查工具栏是否包含指定的块ID */
export function ToolBatContainsAvailable(blockId: BlockID): IToolBarContains {
    let contains = false;
    let activeIndex = -1;
    let toolBarItem: IToolBarItem | null = null;
    ToolBar.toolbar.forEach((item, index) => {
        if (item.blockId === blockId && item.count < ToolBarItemMaxCount) {
            contains = true;
            toolBarItem = item;
            activeIndex = index;
        }
    });
    return {
        contains,
        activeIndex,
        toolBarItem,
    };
}

export function ToolBarFill(blockId: BlockID) {
    for(let i = 0; i < ToolBar.toolbar.length; i++) {
        if(ToolBar.toolbar[i].blockId === BlockID.Air) {
            ToolBar.toolbar[i] = {
                blockId,
                count: 1,
            };
            return;
        }
    }
    if(ToolBar.toolbar.length < ToolBarMaxCount) {
        ToolBar.toolbar.push({
            blockId,
            count: 1,
        });
    }
}

function tryFillToolBar() {
    if(ToolBar.toolbar.length < ToolBarMaxCount) {
        const lessCount = ToolBarMaxCount - ToolBar.toolbar.length;
        for(let i = 0; i < lessCount; i++) {
            ToolBar.toolbar.push({
                blockId: BlockID.Air,
                count: 0,
            });
        }
    }
}

export function ToolBarFillActive(blockId: BlockID) {
   tryFillToolBar();
    const activeIndex = ToolBar.activeToolbarIndex;
    const toolBarItem = ToolBar.toolbar[activeIndex];
    if(blockId === ToolBar.activeBlockId) {
        toolBarItem.count++;
    } else {
        ToolBar.toolbar[activeIndex] = {
            blockId,
            count: 1,
        };
    }
}