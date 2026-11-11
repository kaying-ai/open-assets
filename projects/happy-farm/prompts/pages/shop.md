# 商店（shop）

## 页面定位

- 屏幕 ID：`shop`｜品类：休闲模拟经营｜平台：手机横屏｜比例：16:9｜参考尺寸：1792×1024
- 购买种子 / 道具 / 装饰：选品 → 确认 → 货币扣减反馈；钻石付费二次确认。
- 主操作：购买（暖橙 btn-primary）；次操作：取消/返回（草地绿 btn-secondary）。

## 视觉约束

- 与已批准基准页 `farm` 完全一致：Q版卡通田园、暖橙 #FF8A3D / 草地绿 #6FBF4A / 晴空蓝 #4FB6E8 / 奶油面板 #FFF6E3 / 麦穗金 #FFC93C、左上柔光、粗暖棕描边、大圆角。
- 文字策略：底板完全无文字，价格/名称区留白后期排版。

## 布局与组件

- 顶部：资源条 currency-bar（金币/钻石/体力 + 留白数值区），右上齿轮。
- 中部：左侧竖排分类标签（种子/道具/装饰，nav-tab 竖排），右侧 2×3 商品卡片 panel-card 网格，每卡含作物/道具图标（icon-seed/icon-water/icon-carrot/icon-wheat）+ 价格留白区 + 小购买按钮；一个售罄卡置灰带 icon-lock。
- 底部：五 tab 导航，shop 高亮。
- 悬浮：右侧购买确认弹窗 panel-modal（商品图标 + 价格留白 + 暖橙确认 btn-primary + 绿取消 btn-secondary + 右上红圆关闭 btn-close）。

## 状态

- default / loading / low-currency（购买置灰+不足提示）/ confirm-purchase（弹窗）/ empty-stock。

## 图像生成提示词

Chibi cartoon pastoral farm game SHOP screen, mobile landscape 16:9, cozy hand-drawn casual farming sim, SAME art style as a cute farm game benchmark (warm orange #FF8A3D, grass green #6FBF4A, sky blue #4FB6E8, cream panels #FFF6E3, wheat gold #FFC93C, thick warm-brown outlines, large rounded corners, soft top-left sunlight, candy-like rounded surfaces). Layout: top resource bar with gold coin / blue gem / green energy pills and blank number areas, gear icon top-right. Left side: a vertical column of three rounded category tab buttons (seed bag icon, watering can icon, decoration flower icon). Center-right: a 2-by-3 grid of cream rounded product cards, each card showing a cute icon (seed bag, watering can, carrot, wheat, flower pot, golden ticket) above a blank price tag area and a small warm-orange buy button; one card greyed-out with a padlock (sold out). Bottom: five-tab navigation bar (sprout, shop cart, barn, friends, checklist) with the shop tab highlighted sky-blue. Floating right: a rounded purchase-confirmation modal popup with a product icon, blank price line, a warm-orange confirm button, a green cancel button and a small red round close button at its top-right. Background: soft cream-and-wood shop interior with a striped awning hint, blurred farm behind. Clean information hierarchy, cute rounded icons, polished casual game UI. ABSOLUTELY NO text, NO letters, NO numbers, NO words, NO watermark — all label/price areas are clean blank placeholders. Text-free game UI artboard, crisp, high resolution.

## 反向限制

- 乱码/任何文字/数字/商标/未授权角色；按钮变形、错误透视、元素粘连、主体遮挡。
- 信息层级混乱、过度复杂、低清晰度；与 farm 基准不一致的色调/光向/材质/圆角。

## 验收记录

- default-mode 质量自检：比例/安全区/主操作/契约一致/状态方案/无文字。
- 批准来源：default 自检通过 → `approved: true`，记入 quickstart.md。