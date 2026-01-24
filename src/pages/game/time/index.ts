import * as THREE from "three";
import { SunSettings } from "../sky/literal";
import { updateDayTimeGUI } from "../gui";
import { hourDuration } from "./day";
import { DevControl } from "../dev";

const GameClock = new THREE.Clock();
/**@desc 游戏的时间管理类 */
export class GameTimeManager {
    static startTime = 0;
    /**@desc Get the current time of the day in seconds. 获取当前时间 在每一天中的时间 单位：秒 */
    static get currentDayTime() {
        if(DevControl.hour !== undefined) {
            return DevControl.hour * hourDuration;
        }
        const elapsedTime = GameTimeManager.startTime + GameClock.getElapsedTime();
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

    static updateDayHourGUI() {
        const hour = Math.floor(GameTimeManager.currentDayTime / hourDuration);
        updateDayTimeGUI(hour);
    }
}

export * from './day';