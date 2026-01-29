import Popup from "."
import './backpackerPopup.scss'

interface IProps {
    show: boolean;
    onClose: () => void;
}
export const BackpackerPopup = ({ show, onClose }: IProps) => {
    return (
        <Popup className="backpacker-popup" position="center" show={show} onClose={onClose} maskInteraction={false}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </Popup>
    )
}