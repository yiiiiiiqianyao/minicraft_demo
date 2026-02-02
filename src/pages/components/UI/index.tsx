import { useEffect, useState } from "react"
import { Cursor } from "../cursor"
import { ToolBar } from "../toolbar"
import { CraftPopup } from "../popup/craftPopup"
import { EventSystem } from "../../EventSystem"
import { BackpackerPopup } from "../popup/backpackerPopup"
import { GameEvent, PopupType } from "../../game/constant"

export const UI = () => {
    const [popupType, setPopupType] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const handlePopupClose = () => {
        console.log('close popup');
        setShowPopup(false);
    }
    useEffect(() => {
        EventSystem.subscribe(GameEvent.OpenPopup, (type: string) => {
            console.log('OpenPopup:', type);
            // Backpacker 背包弹窗
            setPopupType(type);
            setShowPopup(true);
        });
        EventSystem.subscribe(GameEvent.ClosePopup, (type: string) => {
            console.log('ClosePopup:', type);
            handlePopupClose();
        });
        return () => {
            EventSystem.unsubscribe(GameEvent.OpenPopup);
        }
    }, [])
    return (
         <div className="ui">
          <Cursor />
          <ToolBar />
          { popupType === PopupType.Craft && <CraftPopup show={showPopup} onClose={handlePopupClose} /> }
          { popupType === PopupType.Backpacker && <BackpackerPopup show={showPopup} onClose={handlePopupClose} /> }
        </div>
    )
}