/**
 * 一元二次函数：x∈[0,1]，y从0→1→0（开口向下，顶点在(0.5,1)）
 * @param {number} x - 输入值（建议0≤x≤1）
 * @returns {number} 对应的y值（0≤y≤1）
 */
export function quadraticFunction(x: number) {
  // 边界处理：x超出0-1时返回0，避免y为负数
  if (x < 0 || x > 1) return 0;
  // 核心方程：y = -4x² + 4x（可简化为4x(1-x)）
  return 4 * x * (1 - x); 
}