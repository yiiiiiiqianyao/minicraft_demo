import { useEffect, useState } from "react";
import { EventSystem } from "../../EventSystem";
import { AudioManager } from "../../game/audio/AudioManager";
import { MCButton } from "../button";
import { Loading } from "../loading"
import { Logo } from "../logo"
import './index.scss';

export const Menu = () => {
    const [isGameStarted, setIsGameStarted] = useState(false)
    useEffect(() => {
        EventSystem.subscribe('StartGame', () => {
            // 游戏开始后，隐藏主菜单
            setIsGameStarted(true);
        })
    }, [])
    return (
        <div id="menu">
            {
                !isGameStarted && <div id="main-menu">
                    <Logo />
                    <div id="buttons">
                    <MCButton title="Create new world" onClick={() => EventSystem.broadcast('StartGame')} />
                    <MCButton title="View GitHub repo" onClick={() => {
                        AudioManager.play("gui.button.press");
                        window.open("https://github.com/yiiiiiiqianyao/minicraft_demo");
                    }} />
                </div>
                </div>
            }
            {isGameStarted && <Loading />}
            
        </div>
        )
}