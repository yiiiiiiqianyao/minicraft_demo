import { useEffect, useState } from "react"
import { Cursor } from "../cursor"
import { ToolBar } from "../toolbar"
import { CraftPopup } from "../popup/craftPopup"
import { EventSystem } from "../../EventSystem"
import { BackpackerPopup } from "../popup/backpackerPopup"

export const UI = () => {
    const [popupType, setPopupType] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const handlePopupClose = () => {
        console.log('close popup');
        setShowPopup(false);
    }
    useEffect(() => {
        EventSystem.subscribe('OpenPopup', (type: string) => {
            console.log('OpenPopup:', type);
            // Backpacker 背包弹窗
            setPopupType(type);
            setShowPopup(true);
        });
        EventSystem.subscribe('ClosePopup', (type: string) => {
            console.log('ClosePopup:', type);
            handlePopupClose();
        });
        return () => {
            EventSystem.unsubscribe('OpenPopup');
        }
    }, [])
    return (
         <div className="ui">
          <Cursor />
          <ToolBar />
          { popupType === 'Craft' && <CraftPopup show={showPopup} onClose={handlePopupClose} /> }
          { popupType === 'Backpacker' && <BackpackerPopup show={showPopup} onClose={handlePopupClose} /> }
        </div>
    )
}