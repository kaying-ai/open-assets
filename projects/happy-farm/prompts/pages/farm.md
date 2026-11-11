# 农田主页（farm）

## 页面定位

- 屏幕 ID：`farm`｜品类：休闲模拟经营｜平台：手机横屏｜比例：16:9｜参考尺寸：1792×1024
- 核心循环主界面与视觉基准页：播种 / 浇水 / 收获 / 领离线收益。
- 主操作：地块播种/收获（右下暖橙主按钮）；次操作：领取离线收益（麦穗金按钮）。

## 视觉约束

- 风格：Q版卡通田园，chibi cartoon，手绘哑光paint + 软糖质感，圆润可爱。
- 色板：主操作暖橙 #FF8A3D；草地绿 #6FBF4A；晴空蓝 #4FB6E8；奶油面板 #FFF6E3；麦穗金 #FFC93C；天空底 #CDEAF7；暖棕描边 #5A3A22。
- 光向：左上柔光；柔和右下投影；大圆角（卡片 20 / 弹窗 28）；粗描边 4–6px。
- 文字策略：底板**完全无文字**（无字母/数字/汉字），文案区留白，后期排版。

## 布局与组件

- 顶部：横贯资源条 currency-bar（左：金币 icon-coin + 数值留白区；中：钻石 icon-gem；右：体力 icon-energy + 加号），右上设置齿轮 icon-gear。
- 中部：3×2 农田地块网格 slot-item（翻耕土壤格 cell #C68A4B），部分地块有胡萝卜 icon-carrot / 小麦 icon-wheat 作物，一块空地、一块带锁 icon-lock；Q版农夫 char-farmer 站在田边；浇水壶 icon-water 与种子袋 icon-seed 道具点缀。
- 底部：五 tab 导航 nav-tab（farm/shop/barn/social/task 图标 icon-farm/icon-shop/icon-barn/icon-social/icon-task），farm 高亮选中（晴空蓝发光）。
- 悬浮：右下暖橙主按钮 btn-primary（收获/播种），左侧麦穗金领取按钮 btn-claim + 红点 deco-badge。
- 背景：bg-farm 田园场景（蓝天、白云、远山、草地、木栅栏、小红谷仓）。

## 状态

- default：地块部分成熟可收获。loading：资源条骨架。offline：顶部横幅。low-currency：按钮置灰。empty-plot：空地块。locked-plot：锁 + 扩建引导。

## 图像生成提示词

Chibi cartoon pastoral farm game UI screen, mobile landscape 16:9 aspect ratio, cozy hand-drawn casual farming sim. Full game interface layout: a top resource bar with three rounded currency pills (gold coin icon, blue gem icon, green energy lightning icon) each with a blank number placeholder area, and a small gear settings icon at top-right. Center: a 3-by-2 grid of rounded tilled-soil farm plots on green grass, some plots growing cute orange carrots and golden wheat, one empty plot, one plot with a small padlock; a cute chibi farmer character with a straw hat standing beside the field; a watering can and a seed bag prop nearby. Bottom: a navigation bar with five rounded tab buttons showing cute icons (sprout, shop cart, barn box, two friends, checklist), the first tab highlighted with a sky-blue glow. Floating bottom-right: a large warm-orange rounded primary action button; a wheat-gold claim button with a small red notification dot on the left. Background: bright blue sky with fluffy white clouds, rolling green hills, a wooden fence and a small red barn in the distance. High-saturation warm palette (warm orange #FF8A3D, grass green #6FBF4A, sky blue #4FB6E8, cream panels #FFF6E3, wheat gold #FFC93C), soft matte paint and candy-like rounded surfaces, thick warm-brown outlines, large rounded corners, soft top-left sunlight, gentle drop shadows, clean information hierarchy, cute rounded icons, polished casual game UI art. ABSOLUTELY NO text, NO letters, NO numbers, NO words, NO watermark anywhere — every label area is a clean blank placeholder. Text-free game UI artboard, crisp, high resolution.

## 反向限制

- 乱码、错误文字、任何字母/数字/汉字、商标、未经授权角色。
- 按钮变形、错误透视、元素粘连、主体遮挡、导航图标风格不一致。
- 信息层级混乱、过度复杂、低清晰度、灰暗脏色。
- 违反契约的色调（冷暗/赛博）、光向（右下硬光）、材质（金属/像素）、圆角（直角）。

## 验收记录

- default-mode 质量自检：比例 16:9 / 安全区 / 主操作清晰 / 契约视觉一致 / 关键状态有方案 / 无文字底板。
- 批准来源：default 自检通过 → `approved: true`，记入 quickstart.md。