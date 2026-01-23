import * as THREE from "three";
import { dayStart, GameTimeManager, hourDuration, nightStart, sunriseStart, sunsetStart } from "../time";
import { dayColor, nightColor, sunsetColor, SunSettings } from "./literal";
import { getCloneLerpColor } from "../engine/utils";

export function getTopColor() {
    let topColor: THREE.Color;
    let sunIntensity: number;
    const dayTime = GameTimeManager.currentDayTime;
     if (dayTime >= dayStart && dayTime < sunriseStart) {
        // Sunrise: night => sunrise
        // 凌晨 4 点前是晚上， 凌晨 4 点到 6 点是日出
        if(dayTime < hourDuration * 4) {
            topColor = nightColor.clone();
            sunIntensity = 0;
        } else {
            const timeRate = (dayTime - hourDuration * 4) / (sunriseStart - hourDuration * 4);
            topColor = getCloneLerpColor(nightColor, dayColor, timeRate);
            sunIntensity = timeRate;
        }
        // const timeRate = (dayTime - dayStart) / sunriseStart;
        // topColor = getCloneLerpColor(nightColor, dayColor, timeRate);
        // sunIntensity = timeRate;
    } else if (dayTime >= sunriseStart && dayTime < sunsetStart) {
        topColor = dayColor.clone();
        sunIntensity = 1;
    } else if (dayTime >= sunsetStart && dayTime < nightStart) {
        topColor = dayColor.clone();
        sunIntensity = 1;
    } else {
        // Night time: sunset => night
        const timeRate = (dayTime - nightStart) / (SunSettings.cycleLength - nightStart);
        topColor = getCloneLerpColor(dayColor, nightColor, timeRate);
        sunIntensity = 1 - timeRate;
    }
    return {
        topColor,
        sunIntensity,
    }
}

// TODO 效果待优化
export function getBottomColor() {
    // const cycleDuration = SunSettings.cycleLength;
    const dayTime = GameTimeManager.currentDayTime;
    let bottomColor: THREE.Color;
    if (dayTime >= dayStart && dayTime < sunriseStart) {
        // Sunrise: night => sunrise
        // const timeRate = (dayTime - dayStart) / sunriseStart;
        // bottomColor = getCloneLerpColor(nightColor, sunsetColor, timeRate);
        if(dayTime < hourDuration * 4) {
            bottomColor = nightColor.clone();
        } else {
            const timeRate = (dayTime - hourDuration * 4) / (sunriseStart - hourDuration * 4);
            bottomColor = getCloneLerpColor(nightColor, sunsetColor, timeRate);
        }
    } else if (dayTime >= sunriseStart && dayTime < sunsetStart) {
        // Day time: sunrise => day
        const timeRate = (dayTime - sunriseStart) / (sunsetStart - sunriseStart);
        bottomColor = getCloneLerpColor(sunsetColor, dayColor, timeRate);
        // bottomColor = dayColor.clone();
    } else if (dayTime >= sunsetStart && dayTime < nightStart) {
        // Sunset: day => sunset
        const timeRate = (dayTime - sunsetStart) / (nightStart - sunsetStart);
        bottomColor = getCloneLerpColor(dayColor, sunsetColor, timeRate);
    } else {
        // Night time: sunset => night
        const timeRate = (dayTime - nightStart) / (SunSettings.cycleLength - nightStart);
        bottomColor = getCloneLerpColor(sunsetColor, nightColor, timeRate);
    }
    return bottomColor;
}