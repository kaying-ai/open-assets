# 仓库（barn）

## 页面定位

- 屏幕 ID：`barn`｜品类：休闲模拟经营｜平台：手机横屏｜比例：16:9｜参考尺寸：1792×1024
- 作物 / 道具存储与出售：入库 → 选择 → 出售 → 金币增加；含图鉴收集进度。
- 主操作：出售（暖橙 btn-primary）；次操作：取消选择（绿 btn-secondary）。

## 视觉约束

- 与基准页 `farm` 一致：Q版卡通田园、暖橙/草地绿/晴空蓝/奶油面板/麦穗金、左上柔光、粗暖棕描边、大圆角。
- 文字策略：底板完全无文字，数量/合计区留白。

## 布局与组件

- 顶部：资源条 currency-bar + 容量进度条 progress-bar（奶油槽 + 草地绿填充 + 留白 x/y 区）。
- 中部：4×3 物品格子 slot-item 矩阵（奶油格 + 木边），格内胡萝卜 icon-carrot / 小麦 icon-wheat / 种子 icon-seed 图标 + 数量留白角标；部分空格；一个未解锁格 icon-lock。
- 底部：五 tab 导航，barn 高亮；底部出售操作区（合计金币留白 + 暖橙出售 btn-primary + 绿取消 btn-secondary）。
- 背景：温暖谷仓内景（木墙、麻袋、木箱、干草），柔和光。

## 状态

- default / loading / empty（空仓库+去种植引导）/ selling（选中格高亮+合计）。

## 图像生成提示词

Chibi cartoon pastoral farm game BARN / inventory screen, mobile landscape 16:9, cozy hand-drawn casual farming sim, SAME art style as a cute farm game benchmark (warm orange #FF8A3D, grass green #6FBF4A, sky blue #4FB6E8, cream panels #FFF6E3, wheat gold #FFC93C, thick warm-brown outlines, large rounded corners, soft top-left sunlight, candy-like rounded surfaces). Layout: top resource bar (gold coin / blue gem / green energy pills, blank number areas) plus a rounded capacity progress bar with green fill and a blank fraction area. Center: a 4-by-3 matrix of rounded cream inventory slots with wooden borders, some slots holding cute carrot / wheat / seed-bag icons with a small blank count badge, a few empty slots, one slot with a padlock. Bottom: five-tab navigation bar (sprout, shop cart, barn, friends, checklist) with the barn tab highlighted sky-blue; a sell action row with a blank total-coin area, a warm-orange sell button and a green cancel button. Background: cozy warm barn interior with wooden walls, sacks, crates and hay, soft light. Clean information hierarchy, cute rounded icons, polished casual game UI. ABSOLUTELY NO text, NO letters, NO numbers, NO words, NO watermark — all count/total areas are clean blank placeholders. Text-free game UI artboard, crisp, high resolution.

## 反向限制

- 乱码/任何文字/数字/商标/未授权角色；按钮变形、错误透视、元素粘连、主体遮挡。
- 信息层级混乱、过度复杂、低清晰度；与 farm 基准不一致的色调/光向/材质/圆角。

## 验收记录

- default-mode 质量自检：比例/安全区/主操作/契约一致/状态方案/无文字。
- 批准来源：default 自检通过 → `approved: true`，记入 quickstart.md。