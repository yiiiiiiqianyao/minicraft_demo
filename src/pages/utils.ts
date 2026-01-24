/**
 * 判断是否为移动端设备（手机/平板）
 * @returns {boolean} true=移动端，false=PC端
 */
export function isMobile() {
  // 第一步：检测UA中的移动端关键词（核心）
  const userAgent = navigator.userAgent.toLowerCase();
  const mobileKeywords = [
    'android', 'iphone', 'ipod', 'ipad', 'windows phone',
    'blackberry', 'symbian', 'webos', 'opera mini', 'mobile'
  ];
  let isMobileUA = mobileKeywords.some(keyword => userAgent.includes(keyword));

  // 第二步：处理iPadOS的UA伪装（iPadOS 13+ UA会伪装成Mac，需额外检测）
  if (userAgent.includes('macintosh') && navigator.maxTouchPoints > 1) {
    isMobileUA = true;
  }

//   // 第三步：辅助检测（触摸事件+屏幕尺寸，降低误判）
//   const hasTouchEvent = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
//   const isSmallScreen = window.innerWidth < 768; // 屏幕宽度小于768px（移动端常见阈值）

  return isMobileUA 
}