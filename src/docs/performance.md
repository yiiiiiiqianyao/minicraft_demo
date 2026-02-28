## BatchRenderer 合批渲染器

## TODO
- three/addons/renderers/common/BatchRenderer.js
- 持续快速移动角色 持续创建 chunk 的时候会发生 js 卡顿（worker 同样存在）

## InstanceMesh
InstanceMesh.count = 0时，仍会产生 1 个空的 Draw Call，需从场景中移除

- 需要将 geometry 转化为非索引格式 .toNonIndexed() 否则每个顶点相互关联

## web worker & wasm

最优解是「WASM + Web Worker」：后台线程运行高性能的 WASM 代码

### web worker
-  web worker 并行计算使用浏览器多线程环境，是「线程层优化」
- 避免主线程阻塞，把耗时任务移出主线程，避免页面卡顿，执行的还是 js，不提升单线程计算速度
### wasm
- 利用 wasm 加速计算，避免 js 性能瓶颈，提升单线程内计算密集型任务的执行速度（比 JS 快 10~100 倍）
- 如果在主线程运行，依然会卡页面

## Chrome 的后台标签节流机制
Chrome 为了节省 CPU / 内存资源，对失去焦点的标签页会做以下限制：
- requestAnimationFrame (rAF)：后台标签中调用频率从 60fps 降到 1fps（约 1 秒 1 次），这是游戏帧率下降的核心原因（游戏通常用 rAF 驱动渲染）；
- setTimeout/setInterval：后台标签中最小延迟被限制为 1000ms（1 秒），无法高频执行；
- Web Worker：不受焦点影响，但无法操作 DOM/Canvas 渲染。

为了保证帧率的稳定，可以使用 worker 来计算游戏帧的更新
```js
// Worker 线程：独立运行，不受焦点限制
let fps = 60;
let interval = 1000 / fps;
let lastTime = Date.now();
let isRunning = false;

// 游戏逻辑更新函数
function update(deltaTime) {
  // 核心逻辑：物理计算、AI、状态更新等
  const gameState = {
    time: Date.now(),
    deltaTime,
    // 其他游戏状态：角色位置、分数等
  };
  // 向主线程发送更新后的状态
  self.postMessage(gameState);
}

// 循环函数
function loop() {
  if (!isRunning) return;
  const now = Date.now();
  const deltaTime = now - lastTime;
  if (deltaTime >= interval) {
    update(deltaTime / 1000);
    lastTime = now - (deltaTime % interval);
  }
  setTimeout(loop, interval); // Worker 中无 rAF，用 setTimeout
}

// 监听主线程指令
self.addEventListener('message', (e) => {
  switch (e.data.cmd) {
    case 'start':
      fps = e.data.fps || 60;
      interval = 1000 / fps;
      lastTime = Date.now();
      isRunning = true;
      loop();
      break;
    case 'stop':
      isRunning = false;
      break;
    case 'updateState':
      // 接收主线程的用户输入（比如按键、鼠标）
      console.log('收到用户输入：', e.data.state);
      break;
  }
});
```