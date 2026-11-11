# 任务成就（task）

## 页面定位

- 屏幕 ID：`task`｜品类：休闲模拟经营｜平台：手机横屏｜比例：16:9｜参考尺寸：1792×1024
- 日常 / 成长任务进度与奖励领取：任务进度 → 领取 → 奖励反馈。
- 主操作：领取奖励（麦穗金 btn-claim）。

## 视觉约束

- 与基准页 `farm` 一致：Q版卡通田园、暖橙/草地绿/晴空蓝/奶油面板/麦穗金、左上柔光、粗暖棕描边、大圆角。
- 文字策略：底板完全无文字，任务描述/进度区留白。

## 布局与组件

- 顶部：资源条 currency-bar。
- 中部：左侧日常/成长标签（nav-tab 竖排，icon-star）；右侧任务卡片列表 panel-card（每卡：任务图标 + 描述留白 + 进度条 progress-bar + 奖励图标 icon-coin/icon-gem/icon-gift + 领取按钮 btn-claim；可领卡金边高亮 + 红点 deco-badge，已领卡置灰）。
- 底部：五 tab 导航，task 高亮。
- 悬浮：顶部活动 banner 丝带（deco  ribbon 留白）。

## 状态

- default / loading / claimable（金边+红点）/ empty（无可领任务）/ claimed（置灰已领取）。

## 图像生成提示词

Chibi cartoon pastoral farm game TASKS / achievements screen, mobile landscape 16:9, cozy hand-drawn casual farming sim, SAME art style as a cute farm game benchmark (warm orange #FF8A3D, grass green #6FBF4A, sky blue #4FB6E8, cream panels #FFF6E3, wheat gold #FFC93C, thick warm-brown outlines, large rounded corners, soft top-left sunlight, candy-like rounded surfaces). Layout: top resource bar (gold coin / blue gem / green energy pills, blank number areas). Left: two vertical rounded category tabs (daily sun icon, growth star icon). Center-right: a vertical list of three rounded cream task cards, each with a cute task icon (carrot, watering can, coin), a blank description line, a small green progress bar with blank fraction, reward icons (gold coin, blue gem, gift box) and a wheat-gold claim button; the first card has a golden highlight border and a red notification dot (claimable), the last card is greyed-out (claimed). Bottom: five-tab navigation bar (sprout, shop cart, barn, friends, checklist) with the checklist tab highlighted sky-blue. A small decorative ribbon banner at the top with blank area. Background: soft cream notice-board feel with grass and sky hints. Clean information hierarchy, cute rounded icons, polished casual game UI. ABSOLUTELY NO text, NO letters, NO numbers, NO words, NO watermark — all description/progress areas are clean blank placeholders. Text-free game UI artboard, crisp, high resolution.

## 反向限制

- 乱码/任何文字/数字/商标/未授权角色；按钮变形、错误透视、元素粘连、主体遮挡。
- 信息层级混乱、过度复杂、低清晰度；与 farm 基准不一致的色调/光向/材质/圆角。

## 验收记录

- default-mode 质量自检：比例/安全区/主操作/契约一致/状态方案/无文字。
- 批准来源：default 自检通过 → `approved: true`，记入 quickstart.md。