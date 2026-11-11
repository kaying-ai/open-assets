# 组件雪碧图（ui-components-sheet）

## 来源与用途
- 中间产物：把 30 个组件的 37 个状态素材排成一张透明雪碧图，供 `kui split` 自动检测切分为单元素 PNG。
- 源页面：farm（已批准）；组件清单见 `contracts/component-contract.yaml`。

## 尺寸和状态
- 画布：2048×1978px，透明背景。
- 排布：shelf 行优先，元素间距 30px、边距 30px；每个组件为单一连通块，阴影/发光不跨相邻元素。
- 同一组件的不同状态保持固定顺序与一致轮廓（default → pressed → disabled/selected）。

## 必须继承的契约字段
- style-contract 全量令牌（colors / geometry / effects / tokens.interaction）。
- 无文字、无编号、无网格线、无水印、无说明箭头。

## 图像生成提示词
A single transparent sprite sheet of chibi cartoon pastoral farm game UI components: candy buttons
(default/pressed/disabled), close button, nav tabs (default/pressed/selected), currency bar, card panel,
modal panel, inventory slot, progress bar, resource icons (coin/gem/energy/carrot/water/seed/star/lock/gear/
heart/gift), nav icons (farm/shop/barn/social/task), a chibi farmer character, a reward badge, and a pastoral
background swatch. Warm brown outlines, rounded corners, top-left soft light, high saturation, generous
spacing, every element a single connected shape, no text, no grid lines, transparent background.

## 反向限制
- 不是最终切图；必须经 `kui split --mapping` 转语义名后才可批准。
- 元素互不接触；不拼版完整页面。

## 验收记录
- 本 run 由 render/kit.js 确定性渲染；`kui split --mode alpha` 检测得 37 个连通块，与 37 个状态素材一一对应。
- 切分产物：`assets/sprites/ui-components/items/` + `sprite-manifest.yaml` + `packages/ui-components-png.zip`。