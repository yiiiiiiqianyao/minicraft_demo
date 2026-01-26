import { useEffect, useState } from "react";
import Game from "./game/Game";
import './index.scss';
import { ToolBar } from "./components/toolbar";
import { Debug } from "./components/debug";
import { Menu } from "./components/menu";
import { Cursor } from "./components/cursor";
import { EventSystem } from "./EventSystem";

export default function HomePage() {
  const [isGameStarted, setIsGameStarted] = useState(false)
  useEffect(() => {
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
