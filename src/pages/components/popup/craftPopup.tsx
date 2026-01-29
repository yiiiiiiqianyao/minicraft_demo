import Popup from "."
import './craftPopup.scss'

interface IProps {
    show: boolean;
    onClose: () => void;
}
export const CraftPopup = ({ show, onClose }: IProps) => {
    return (
        <Popup className="craft-popup" position="center" show={show} onClose={onClose} maskInteraction={false}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </Popup>
    )
}