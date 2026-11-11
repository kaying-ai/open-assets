# 设置（settings）

## 页面定位

- 屏幕 ID：`settings`｜品类：休闲模拟经营｜平台：手机横屏｜比例：16:9｜参考尺寸：1792×1024
- 音效 / 通知开关，账号 / 帮助入口；破坏性操作（退出/重置）二次确认。
- 主操作：确认（暖橙 btn-primary）；次操作：关闭（红圆 btn-close）。

## 视觉约束

- 与基准页 `farm` 一致：Q版卡通田园、暖橙/草地绿/晴空蓝/奶油面板/麦穗金、左上柔光、粗暖棕描边、大圆角（弹窗 28）。
- 文字策略：底板完全无文字，开关标签留白。

## 布局与组件

- 背景：farm 场景虚化压暗（bg-farm + 半透明遮罩）。
- 中部：居中设置弹窗 panel-modal（奶油大圆角面板 + 木边 + 标题留白区 + 右上红圆关闭 btn-close）。
  - 开关行：音效（喇叭图标 + 绿开关）、通知（铃铛图标 + 绿开关）、语言（地球图标 + 留白）。
  - 入口行：账号（icon-lock）、帮助（icon-heart）、退出（暖橙 btn-primary / 红 btn-secondary）。
- 底部：无导航（模态覆盖）。

## 状态

- default / confirm-exit（二次确认弹窗）/ offline（账号入口提示）。

## 图像生成提示词

Chibi cartoon pastoral farm game SETTINGS modal screen, mobile landscape 16:9, cozy hand-drawn casual farming sim, SAME art style as a cute farm game benchmark (warm orange #FF8A3D, grass green #6FBF4A, sky blue #4FB6E8, cream panels #FFF6E3, wheat gold #FFC93C, thick warm-brown outlines, large rounded corners, soft top-left sunlight, candy-like rounded surfaces). Layout: a blurred, dimmed cute farm background (sky, hills, barn). Center: a large rounded cream settings modal panel with wooden border, a blank title area at top and a small red round close button at its top-right. Inside the modal: three toggle rows each with a cute icon (speaker, bell, globe) and a rounded green on/off switch; below, three entry rows with icons (padlock account, heart help) and blank label areas; at the bottom a warm-orange confirm button and a red logout button. Clean information hierarchy, cute rounded icons, cozy calm mood, polished casual game UI. ABSOLUTELY NO text, NO letters, NO numbers, NO words, NO watermark — all label/title areas are clean blank placeholders. Text-free game UI artboard, crisp, high resolution.

## 反向限制

- 乱码/任何文字/数字/商标/未授权角色；按钮变形、错误透视、元素粘连、主体遮挡。
- 信息层级混乱、过度复杂、低清晰度；与 farm 基准不一致的色调/光向/材质/圆角。

## 验收记录

- default-mode 质量自检：比例/安全区/主操作/契约一致/状态方案/无文字。
- 批准来源：default 自检通过 → `approved: true`，记入 quickstart.md。