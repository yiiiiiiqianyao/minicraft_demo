import { useEffect } from "react";
import Game from "./game/Game";
import './index.scss';

export default function HomePage() {
  useEffect(() => {
   new Game();
  }, []);
  return (
    <div id='canvas_wrap' className="_canvas_wrap">
      <div id="debug">
        <div className="stat" id="player-pos-x"></div>
        <div className="stat" id="player-pos-y"></div>
        <div className="stat" id="player-pos-z"></div>
        <div className="stat" id="triangle-count"></div>
        <div className="stat" id="render-calls"></div>
      </div>
      <div id="ui">
        <svg id="cursor" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 12H21M12 3L12 21" stroke="white" strokeWidth="2"/>
        </svg>
        <div id="toolbar">
          <img id="toolbar-bg" src="https://lf3-static.bytednsdoc.com/obj/eden-cn/vhfuhpxpf/three/minicraft/imgs/gui/toolbar.png" />
          <img id="toolbar-active-border" src="https://lf3-static.bytednsdoc.com/obj/eden-cn/vhfuhpxpf/three/minicraft/imgs/gui/toolbar_active.png" />
          <div className="toolbar-slot" id="toolbar-slot-1"></div>
          <div className="toolbar-slot" id="toolbar-slot-2"></div>
          <div className="toolbar-slot" id="toolbar-slot-3"></div>
          <div className="toolbar-slot" id="toolbar-slot-4"></div>
          <div className="toolbar-slot" id="toolbar-slot-5"></div>
          <div className="toolbar-slot" id="toolbar-slot-6"></div>
          <div className="toolbar-slot" id="toolbar-slot-7"></div>
          <div className="toolbar-slot" id="toolbar-slot-8"></div>
          <div className="toolbar-slot" id="toolbar-slot-9"></div>
        </div>
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
        <div id="loading">
          <p>Loading Level</p>
          <p>Generating terrain</p>
          <div id="loading-progress">
            <div id="loading-progress-bar"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
