# 好友邻居（social）

## 页面定位

- 屏幕 ID：`social`｜品类：休闲模拟经营｜平台：手机横屏｜比例：16:9｜参考尺寸：1792×1024
- 好友列表与串门互助：进入好友农场 → 浇水 / 趣味偷菜，异步温暖互动。
- 主操作：串门/互助（绿 btn-secondary / 金 btn-claim）。

## 视觉约束

- 与基准页 `farm` 一致：Q版卡通田园、暖橙/草地绿/晴空蓝/奶油面板/麦穗金、左上柔光、粗暖棕描边、大圆角。
- 文字策略：底板完全无文字，好友名/状态区留白。

## 布局与组件

- 顶部：资源条 currency-bar（体力 icon-energy 突出）。
- 中部：左侧好友列表（3–4 张 panel-card 行卡：圆形头像 char-farmer 变体 + 名字留白 + 状态留白 + 红点 deco-badge）；右侧好友农场预览（小农田场景 + 浇水壶 icon-water + 爱心 icon-heart 互助气泡）。
- 底部：五 tab 导航，social 高亮。
- 悬浮：互助按钮 btn-claim（金，爱心/浇水图标）+ 绿 btn-secondary（邀请好友）。

## 状态

- default / loading / empty（无好友+邀请入口）/ visiting（好友农场）/ no-energy（互助置灰+倒计时）。

## 图像生成提示词

Chibi cartoon pastoral farm game FRIENDS / social screen, mobile landscape 16:9, cozy hand-drawn casual farming sim, SAME art style as a cute farm game benchmark (warm orange #FF8A3D, grass green #6FBF4A, sky blue #4FB6E8, cream panels #FFF6E3, wheat gold #FFC93C, thick warm-brown outlines, large rounded corners, soft top-left sunlight, candy-like rounded surfaces). Layout: top resource bar (gold coin / blue gem / green energy pills, blank number areas). Left: a vertical list of three or four rounded cream friend cards, each with a circular cute chibi farmer avatar, a blank name line, a blank status line and a small red notification dot on some. Right: a friend's farm preview panel showing a small cute crop field with a watering can and a floating heart help-bubble. Bottom: five-tab navigation bar (sprout, shop cart, barn, friends, checklist) with the friends tab highlighted sky-blue. Floating: a wheat-gold help button with a heart / watering icon and a green invite-friends button. Background: soft sky-blue and grass green community garden feel, blurred farms behind. Clean information hierarchy, cute rounded icons, warm friendly mood, polished casual game UI. ABSOLUTELY NO text, NO letters, NO numbers, NO words, NO watermark — all name/status areas are clean blank placeholders. Text-free game UI artboard, crisp, high resolution.

## 反向限制

- 乱码/任何文字/数字/商标/未授权角色；按钮变形、错误透视、元素粘连、主体遮挡。
- 信息层级混乱、过度复杂、低清晰度；与 farm 基准不一致的色调/光向/材质/圆角。

## 验收记录

- default-mode 质量自检：比例/安全区/主操作/契约一致/状态方案/无文字。
- 批准来源：default 自检通过 → `approved: true`，记入 quickstart.md。