# 多图层设计

## player camera layer
- 玩家相机图层为 0 & 1，看到 0 & 1 层的物体

## player raycaster layer
- 玩家射线图层为 0，只能拾取 0 层的物体

## drop layer
- 掉落物图层为 1，能被玩家相机观察，但是不能被玩家射线拾取