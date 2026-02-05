import Popup from "."
import './backpackerPopup.scss'
import { Cell } from "./cell";

interface IProps {
    show: boolean;
    onClose: () => void;
}

/**@desc 背包弹窗 */
export const BackpackerPopup = ({ show, onClose }: IProps) => {
    return (
        <Popup className="backpacker-popup" position="center" show={show} onClose={onClose} maskInteraction={false}>
            {/* 背包格子 */}
            <div className="backpacker-popup-content">
                {
                    Array.from({ length: 9*3 }).map((_, index) => <Cell key={index} />)
                }
            </div>
            {/* 物品栏格子 */}
            <div className="backpacker-popup-bottom">
                {
                    Array.from({ length: 9 }).map((_, index) => <Cell key={index} />)
                }
            </div>
        </Popup>
    )
}