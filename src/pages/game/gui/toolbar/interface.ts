import { BlockID } from "../../Block";

export interface IToolBarItem {
    blockId: BlockID;
    count: number;
}

export interface IToolBarContains {
    contains: boolean;
    activeIndex: number;
    toolBarItem: IToolBarItem | null;
}