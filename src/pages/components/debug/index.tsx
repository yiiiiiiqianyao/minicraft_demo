import './index.scss';

export const Debug = () => {
    return  <div id="debug">
        <div className="stat" id="player-pos-x"></div>
        <div className="stat" id="player-pos-y"></div>
        <div className="stat" id="player-pos-z"></div>
        <div className="stat" id="triangle-count"></div>
        <div className="stat" id="render-calls"></div>
      </div>
}