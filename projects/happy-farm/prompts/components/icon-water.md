# 水滴图标（icon-water）

## 来源与用途
- 源页面：farm（已批准）；跨页面复用基础组件。
- 类别：icon；用途：水滴：蓝色水滴+高光。

## 尺寸和状态
- 目标尺寸：96×96px。
- 切片：1:1 margins=[0, 0, 0, 0]。
- `default`（icon-water-default-v1.png）：常态，水滴：蓝色水滴+高光。

## 必须继承的契约字段
- style-contract：colors（primary #FF8A3D / pressed #DB7734 / secondary #6FBF4A / reward #FFC93C / warning #E85D4A / surface #FFF6E3）、geometry.radius、geometry.stroke、effects.highlight/shadow、tokens.interaction（pressed-dim 0.86 / pressed-offset-y 2）。
- 透明背景：是；无文字（保留排版留白）。

## 图像生成提示词
A single game UI component asset (icon), 水滴图标 — 水滴：蓝色水滴+高光。 Chibi cartoon pastoral style, matte candy paint, top-left soft light, warm brown outline (#5A3A22), rounded corners, high saturation, cozy farm mood. Target size 96x96px, centered, transparent background, no text, no letters, no numbers, complete clean outline, safe margin, high resolution, suitable for compositing and engine 9-slice. Do not render a full page or neighboring components.


## 反向限制
- 不生成完整页面、不粘连其他组件、不附带不透明矩形底（背景除外）。
- 无文字/编号/网格线/水印/说明箭头；阴影与发光不跨到相邻元素。
- 不复刻受保护角色；图标统一透视与光源。

## 验收记录
- 本 run 由 render/kit.js 确定性渲染（SVG→resvg PNG），尺寸精确、alpha 干净、两态轮廓对齐。
- 状态：default。
