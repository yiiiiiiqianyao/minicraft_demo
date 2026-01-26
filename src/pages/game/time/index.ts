import * as THREE from "three";
import { SunSettings } from "../sky/literal";
import { updateDayTimeGUI } from "../gui";
import { hourDuration } from "./day";
import { DevControl } from "../dev";

const GameClock = new THREE.Clock();
/**@desc 游戏的时间管理类 */
export class GameTimeManager {
    /**@desc 上一帧的时间 */
    private static previousTime = 0;
    /**@desc 游戏开始的时间 24 小时制 */
    static startDayTime = 0;
    /**@desc Get the current time of the day in seconds. 获取当前时间 在每一天中的时间 单位：秒 */
    static get currentDayTime() {
        if(DevControl.hour !== undefined) {
            return DevControl.hour * hourDuration;
        }
        const elapsedTime = GameTimeManager.startDayTime + GameClock.getElapsedTime();
        const cycleDuration = SunSettings.cycleLength; // Duration of a day in seconds
        const cycleTime = elapsedTime % cycleDuration;
        return cycleTime;
    }

    static get halfDayDuration() {
        return SunSettings.cycleLength / 2;
    }

    /**@desc Check if it is day time. 是否是白天时间 */
    static get isDayTime() {
        const cycleDuration = SunSettings.cycleLength;
        return GameTimeManager.currentDayTime < cycleDuration / 2
    }
    /**@desc 启动游戏时间管理 */
    static start() {
        GameTimeManager.previousTime = performance.now();
    }

    /**@desc 更新游戏时间 单位：秒 */
    static update() {
        const currentTime = performance.now();
        const deltaTime = (currentTime - GameTimeManager.previousTime) / 1000;
        GameTimeManager.previousTime = currentTime;
        return deltaTime;
    }

    static updateDayHourGUI() {
        const hour = Math.floor(GameTimeManager.currentDayTime / hourDuration);
        updateDayTimeGUI(hour);
    }
}

export * from './day';