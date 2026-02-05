import type { BlockID } from '../../../game/Block'
import './index.scss'

export interface ICell {
    blockId: BlockID;
    img: string;
}

/**@desc 弹窗单元格 */
export const Cell = () => {
    return (<div className="cell"></div>)
}