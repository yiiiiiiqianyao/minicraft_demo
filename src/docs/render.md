# 渲染

现在使用 webgl 渲染，后续优先使用 webgpu 渲染

## performance
- 尽量减少 objects 数量 优化性能（除了 draw call 的数量，实例数量也会很大程度上影响渲染性能）
- 通过动态创建 减少渲染的 objects 数量
- 尽量保证 120 fps 渲染