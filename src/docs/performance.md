## BatchRenderer 合批渲染器
TODO
three/addons/renderers/common/BatchRenderer.js

## InstanceMesh
InstanceMesh.count = 0时，仍会产生 1 个空的 Draw Call，需从场景中移除

## web worker & wasm

最优解是「WASM + Web Worker」：后台线程运行高性能的 WASM 代码

### web worker
-  web worker 并行计算使用浏览器多线程环境，是「线程层优化」
- 避免主线程阻塞，把耗时任务移出主线程，避免页面卡顿，执行的还是 js，不提升单线程计算速度
### wasm
- 利用 wasm 加速计算，避免 js 性能瓶颈，提升单线程内计算密集型任务的执行速度（比 JS 快 10~100 倍）
- 如果在主线程运行，依然会卡页面