import { useEffect, useState } from "react";
import Game from "./game/Game";
import './index.scss';
import { Debug } from "./components/debug";
import { Menu } from "./components/menu";
import { EventSystem } from "./EventSystem";
import { UI } from "./components/UI";

// current game version
const version = 'mc_202601290137';
export default function HomePage() {
  const [isGameStarted, setIsGameStarted] = useState(false)
  useEffect(() => {
    console.info('version:', version);
    EventSystem.subscribe('GameLoaded', () => {
      setIsGameStarted(true);
    });
    new Game();
  }, []);
  return (
    <div className="container">
      <div id='canvas_wrap' className="_canvas_wrap">
        <Debug />
        <UI />
      </div>
      {!isGameStarted && <Menu />}
    </div>
  );
}
