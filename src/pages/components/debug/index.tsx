import { useEffect, useState } from 'react';
import './index.scss';
import { EventSystem } from '../../EventSystem';

/** @desc 开发调试信息 */
export const Debug = () => {
  const [x, setX] = useState('0');
  const [y, setY] = useState('0');
  const [z, setZ] = useState('0');
  const [triangleCount, setTriangleCount] = useState(0);
  const [renderCalls, setRenderCalls] = useState(0);
  const [hour, setHour] = useState(0)
  useEffect(() => {
    EventSystem.subscribe('UpdatePlayerPosition', ([x, y, z]: number[]) => {
      setX(x.toFixed(3));
      setY(y.toFixed(3));
      setZ(z.toFixed(3));
    });
    EventSystem.subscribe('UpdateRender', ({ triangles, calls }: { triangles: number, calls: number }) => {
      setTriangleCount(triangles);
      setRenderCalls(calls);
    });
    EventSystem.subscribe('UpdateHour', (hour: number) => {
      setHour(hour);
    })
  }, [])
  return (
    <div id="debug">
      <div className="stat" id="day-time">{`Day Time Hour: ${hour}`}</div>
      <div className="stat" id="player-pos-x">x: {x}</div>
      <div className="stat" id="player-pos-y">y: {y}</div>
      <div className="stat" id="player-pos-z">z: {z}</div>
      <div className="stat" id="triangle-count">triangles: {triangleCount}</div>
      <div className="stat" id="render-calls">draw calls: {renderCalls}</div>
      <div className="stat" id="chunk-coord"></div>
      <div className="stat" id="chunk-block-coord"></div>
      <div className="stat" id="world-block-coord"></div>
    </div>
  )
}