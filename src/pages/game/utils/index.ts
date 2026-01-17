/**@desc 给一个数字添加随机抖动 */
export function jitterNumber(num: number, jitterRange: number) {
    return num + (Math.random() - 0.5) * jitterRange;
}