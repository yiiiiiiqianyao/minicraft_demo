import { useEffect, useState } from "react"
import { Cursor } from "../cursor"
import { ToolBar } from "../toolbar"
import { CraftPopup } from "../popup/craftPopup"
import { EventSystem } from "../../EventSystem"

export const UI = () => {
    const [showPopup, setShowPopup] = useState(false);
    const handlePopupClose = () => {
        console.log('close popup');
        setShowPopup(false);
    }
    useEffect(() => {
        EventSystem.subscribe('OpenPopup', (type: string) => {
            console.log('OpenPopup:', type);
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
          <CraftPopup show={showPopup} onClose={handlePopupClose} />
        </div>
    )
}