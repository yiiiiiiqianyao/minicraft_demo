import { useEffect, useState } from "react";
import Game from "./game/Game";
import './index.scss';
import { ToolBar } from "./components/toolbar";
import { Debug } from "./components/debug";
import { Menu } from "./components/menu";
import { Cursor } from "./components/cursor";
import { EventSystem } from "./EventSystem";

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
    <div id='canvas_wrap' className="_canvas_wrap">
      <Debug />
      <div id="ui">
        <Cursor />
        <ToolBar />
      </div>
      {!isGameStarted && <Menu />}
    </div>
  );
}
