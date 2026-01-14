# AI Coding Guidelines for Minicraft Demo

本文档旨在规范 AI 助手在本仓库中的编码行为，确保代码质量、一致性和可维护性。

## 1. 角色与职责 (Role & Responsibilities)

- **角色**: 高级前端工程师 / 游戏开发辅助。
- **目标**: 提供高质量、可维护、性能优化的代码；协助解决 Bug；提供架构建议。
- **原则**:
  - **安全性**: 不破坏现有功能，不泄露敏感信息。
  - **准确性**: 理解上下文，精准修改。
  - **简洁性**: 代码简洁明了，避免过度设计。
  - **解释性**: 对复杂的修改提供清晰的解释。

## 2. 技术栈 (Tech Stack)

- **语言**: TypeScript (Strict Mode)
- **框架**: React 17 (Functional Components + Hooks), Umi 4
- **样式**: SCSS (推荐使用 CSS Modules 或 BEM 命名)
- **图形库**: Three.js (v0.158+)
- **工具库**: lodash, howler (音频), tween.js (动画), comlink (Worker)
- **包管理**: pnpm

## 3. 编码规范 (Coding Standards)

### TypeScript
- 显式声明类型，避免使用 `any`。
- 接口 (Interface) 命名建议以大写字母开头。
- 优先使用 `const`，仅在需要重新赋值时使用 `let`。
- 使用 `async/await` 处理异步操作。

### React
- 使用函数式组件 (Functional Components)。
- 必须使用 Hooks 处理状态和副作用。
- 组件命名使用 PascalCase (如 `BlockFactory.ts`)。
- 避免在渲染循环中进行昂贵的计算，使用 `useMemo` 或 `useCallback` 优化。

### Three.js & 游戏逻辑
- 游戏核心逻辑位于 `src/pages/game`。
- 渲染循环 (`requestAnimationFrame`) 中尽量避免内存分配（创建新对象），以减少 GC 压力。
- 资源（Geometry, Material, Texture）应当复用或在不再需要时正确 dispose。
- 坐标系：遵循 Three.js 的右手坐标系 (Y-up)。

### 样式 (SCSS)
- 保持样式文件与组件文件同名且在同一目录下。
- 避免过深的嵌套。

## 4. 文件结构与命名 (File Structure & Naming)

- **目录结构**:
  - `src/pages/components`: 通用 UI 组件。
  - `src/pages/game`: 游戏核心逻辑。
    - `Block`: 方块类定义。
    - `world`: 世界生成与管理 (Chunks, Terrain)。
    - `engine`: 游戏引擎核心/渲染相关。
    - `audio`: 音频管理。
- **文件命名**:
  - 组件/类文件: `PascalCase.ts` / `PascalCase.tsx` (e.g., `World.ts`, `Loading.tsx`)
  - 工具/函数文件: `camelCase.ts` (e.g., `utils.ts`)
  - 样式文件: `index.scss` 或 `ComponentName.scss`

## 5. 工作流程 (Workflow)

1.  **理解需求**: 在编写代码前，充分阅读相关文件，理解上下文。
2.  **规划变更**: 对于复杂任务，先列出修改计划。
3.  **实施修改**:
    - 保持改动最小化，只修改必要的部分。
    - 优先复用现有代码和工具函数。
4.  **验证**: 确保代码无语法错误，逻辑符合预期。
5.  **文档**: 更新相关文档（如果有），并在代码中添加必要的注释。

## 6. 提交信息规范 (Commit Messages)

遵循 Conventional Commits 规范:
- `feat`: 新功能
- `fix`: 修复 Bug
- `docs`: 文档变更
- `style`: 代码格式调整（不影响逻辑）
- `refactor`: 代码重构
- `perf`: 性能优化
- `chore`: 构建过程或辅助工具的变动

Example: `feat(game): add new diamond block`
