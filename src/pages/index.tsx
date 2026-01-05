import { useEffect } from "react";
import Game from "./game/Game";
import './index.scss';
import { ToolBar } from "./components/toolbar";
import { Loading } from "./components/loading";
import { Debug } from "./components/debug";

export default function HomePage() {
  useEffect(() => {
   new Game();
  }, []);
  return (
    <div id='canvas_wrap' className="_canvas_wrap">
      <Debug />
      <div id="ui">
        <svg id="cursor" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 12H21M12 3L12 21" stroke="white" strokeWidth="2"/>
        </svg>
        <ToolBar />
      </div>
      <div id="menu">
        <div id="main-menu">
          <img id="logo" src="https://lf3-static.bytednsdoc.com/obj/eden-cn/vhfuhpxpf/three/minicraft/imgs/logo.png" />
          <div>
            <div id="buttons">
              <div className="mc-button full" tabIndex={0} role="button">
                <div id="start-game" className="title">Create new world</div>
              </div>
              <div className="mc-button full" tabIndex={0} role="button">
                <div id="github" className="title">View GitHub repo</div>
              </div>
            </div>
          </div>
        </div>
        <Loading />
      </div>
    </div>
  );
}
