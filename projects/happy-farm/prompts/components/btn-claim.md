# 领取按钮（btn-claim）

## 来源与用途
- 源页面：farm（已批准）；跨页面复用基础组件。
- 类别：control；用途：金色奖励领取按钮，空白文字区，用于离线收益/任务奖励。

## 尺寸和状态
- 目标尺寸：300×104px。
- 切片：9-slice margins=[44, 44, 36, 36]。
- `default`（btn-claim-default-v1.png）：常态，金色奖励领取按钮，空白文字区，用于离线收益/任务奖励。
- `pressed`（btn-claim-pressed-v1.png）：按下态，主体亮度降低约14%（主色加深一档），内容下沉2px、高光减弱；外轮廓/尺寸/圆角/描边与 default 完全一致，只改明暗与微位移。

## 必须继承的契约字段
- style-contract：colors（primary #FF8A3D / pressed #DB7734 / secondary #6FBF4A / reward #FFC93C / warning #E85D4A / surface #FFF6E3）、geometry.radius、geometry.stroke、effects.highlight/shadow、tokens.interaction（pressed-dim 0.86 / pressed-offset-y 2）。
- 透明背景：是；无文字（保留排版留白）。

## 图像生成提示词
A single game UI component asset (control), 领取按钮 — 金色奖励领取按钮，空白文字区，用于离线收益/任务奖励。 Chibi cartoon pastoral style, matte candy paint, top-left soft light, warm brown outline (#5A3A22), rounded corners, high saturation, cozy farm mood. Target size 300x104px, centered, transparent background, no text, no letters, no numbers, complete clean outline, safe margin, high resolution, suitable for compositing and engine 9-slice. Do not render a full page or neighboring components.

按下态量化：主体压暗约14%（叠12%黑等价）+内容下沉2px+高光减弱；轮廓/圆角/描边/光向/材质与常态完全一致，不换形。

## 反向限制
- 不生成完整页面、不粘连其他组件、不附带不透明矩形底（背景除外）。
- 无文字/编号/网格线/水印/说明箭头；阴影与发光不跨到相邻元素。
- 不复刻受保护角色；图标统一透视与光源。

## 验收记录
- 本 run 由 render/kit.js 确定性渲染（SVG→resvg PNG），尺寸精确、alpha 干净、两态轮廓对齐。
- 状态：default / pressed 齐全，按下态压暗+下沉可感知。
