import Popup from "."
import { Cell } from "./cell";
import './craftPopup.scss'

interface IProps {
    show: boolean;
    onClose: () => void;
}

/**@desc 合成弹窗 */
export const CraftPopup = ({ show, onClose }: IProps) => {
    return (
        <Popup className="craft-popup" position="center" show={show} onClose={onClose} maskInteraction={false}>
            {/* 合成格子 */}
             <div className="craft-popup-table">
                {
                    Array.from({ length: 9 }).map((_, index) => <Cell key={`table-${index}`} />)
                }
            </div>
            {/* 合成结果格子 */}
            <div className="craft-popup-output" />            
           {/* 背包格子 */}
            <div className="craft-popup-content">
                {
                    Array.from({ length: 9*3 }).map((_, index) => <Cell key={`content-${index}`} />)
                }
            </div>
            {/* 物品栏格子 */}
            <div className="craft-popup-bottom">
                {
                    Array.from({ length: 9 }).map((_, index) => <Cell key={`bottom-${index}`} />)
                }
            </div>
        </Popup>
    )
}