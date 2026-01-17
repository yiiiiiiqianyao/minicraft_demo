export class PhysicsParams {
    static enabled = false;
    // Acceleration due to gravity
    static GRAVITY = -32;
    /**@desc Physics simulation rate 物理模拟的半径 */
    static simulationRate = 250;
    /**@desc 物理模拟的时间步长 */
    static stepSize = 1 / PhysicsParams.simulationRate;
    /**@desc Accumulator to keep track of leftover dt */
    static accumulator = 0;
}