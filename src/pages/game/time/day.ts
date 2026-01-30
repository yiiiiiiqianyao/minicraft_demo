import { SunSettings } from "../sky/literal";

/**@desc 阴影更新的时间间隔 单位：毫秒 */
// export const ShadowUpdateDuration = SunSettings.cycleLength / 24 / 60 * 5;
export const ShadowUpdateDuration = 16 * 2;

// 0 - 24 小时制
export const hourDuration = SunSettings.cycleLength / 24;
export const dayStart = 0;
export const sunriseStart = hourDuration * 6; // Start sunrise at 90% of the cycle 日出 21.6
export const sunsetStart = hourDuration * 16; // Start sunset at 40% of the cycle 日落 9.6
export const nightStart = hourDuration * 20; // Start night at 50% of the cycle 12

