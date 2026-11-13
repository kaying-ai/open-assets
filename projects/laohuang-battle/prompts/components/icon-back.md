# 返回图标 icon-back

## Source and purpose

- 源自页面：`settings` 左上返回
- `category: icon`，`clickable: true`（作为入口按钮），跨页复用
- 用途：设置页唯一出口，必须比标题更显眼但不抢戏

## Size and states

| 状态 | 文件 | 目标尺寸 | 处理 |
|---|---|---|---|
| `default` | `icon-back-default-v1.png` | 96×96 | 毛笔回锋左箭头：主笔 2.6px，尾笔回勾半透明 |
| `pressed` | `icon-back-pressed-v1.png` | 96×96 | 描边加深加粗至 3px，整体缩放到 0.94 |

## Contract fields to inherit

- `colors.ink` `#191512` · `geometry.icon_size.utility` 56
- 笔触：起笔重、收笔带飞白，圆头端点，正视角

## Image generation prompt

```text
A standalone game UI icon asset, square 96x96, transparent background, no text.
A single brush-stroke left arrow: a bold calligraphic horizontal shaft with a sharp left arrowhead,
drawn in ink black #191512 with 2.6px uniform weight, round caps, and a faint second tail stroke at
35% opacity suggesting a dry-brush return; flat 2D front view, no shading, no gradient.
Centred with 20px safe margin, complete outline, crisp at small sizes.
pressed state (separate file): identical outline, stroke darkened to #0E0C0A and heavier at 3px,
glyph scaled to 94%.
No text, no numbers, no background plate, no page background, no drop shadow.
```

## Negative constraints

- 文字、字母、水印
- 细线欧式箭头、iOS 细箭头、等比圆角三角
- 立体、发光、渐变、金属质感
- 与设置图标描边重量不一致

## Verification record

- 尺寸 96×96，带 alpha：是
- 两态差异可感知：是
- 与 `icon-settings` 同笔触族：是
