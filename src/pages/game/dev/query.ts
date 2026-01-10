export const GlobalProps = parseQueryParams();
/**
 * 解析URL的query参数为对象
 * @param {string} url - 待解析的URL（可选，默认取当前页面URL）
 * @returns {Object} 解析后的参数对象
 */
function parseQueryParams(url = window.location.href) {
  // 1. 提取query部分（?后面，#前面）
  const queryStr = url.split('?')[1]?.split('#')[0] || '';
  const params: Record<string, string> = {};
  
  // 2. 无参数直接返回空对象
  if (!queryStr) return params;
  
  // 3. 分割键值对并解析
  queryStr.split('&').forEach(item => {
    // 分割键和值（处理没有值的情况，如?name）
    const [key, value = ''] = item.split('=');
    // 解码URL编码的字符（如%20→空格，%E4%B8%AD→中）
    const decodeKey = decodeURIComponent(key.trim());
    const decodeValue = decodeURIComponent(value.trim());
    
    // 存入对象（重复key会覆盖，如?a=1&a=2最终a=2）
    if (decodeKey) { // 过滤空key（如?&=123）
      params[decodeKey] = decodeValue;
    }
  });
  
  return params;
}