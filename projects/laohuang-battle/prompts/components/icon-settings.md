# 设置图标 icon-settings

## Source and purpose

- 源自页面：`home` 右上齿轮、`battle` 右上齿轮、底部导航「设置」
- `category: icon`，`clickable: true`（作为入口按钮），跨页复用
- 用途：全局唯一的设置入口，必须在 46–56px 下仍能认出

## Size and states

| 状态 | 文件 | 目标尺寸 | 处理 |
|---|---|---|---|
| `default` | `icon-settings-default-v1.png` | 96×96 | 墨色线描齿轮：内圆 + 虚线齿环 + 四向刻度，描边 2.4px |
| `pressed` | `icon-settings-pressed-v1.png` | 96×96 | 描边加深至 `#0E0C0A` 并加粗至 3px，整体缩放到 0.94 |

## Contract fields to inherit

- `colors.ink` `#191512` · `geometry.icon_size.utility` 56 / `navigation` 48
- 图标透视：正视角、平涂墨块、单一左上光源、无立体
- 笔触统一 2.4–3.0px，圆头端点

## Image generation prompt

```text
A standalone game UI icon asset, square 96x96, transparent background, no text.
A minimal ink brush-style settings gear: a solid ink circle in the centre, a dashed ring of gear teeth
around it, four short radial ticks at the compass points; uniform 2.4px stroke, round caps, ink black
#191512, slight dry-brush irregularity on the stroke ends, flat 2D front view, no shading, no gradient.
Centred with 16px safe margin, complete outline, crisp at small sizes.
pressed state (separate file): identical outline, stroke darkened to #0E0C0A and slightly heavier
(3px), whole glyph scaled to 94% — same shape, no added decoration.
No text, no numbers, no background plate, no page background, no drop shadow.
```

## Negative constraints

- 文字、字母、水印
- 立体齿轮、金属高光、渐变、拟物厚度
- 与其他图标风格不一致（如填充实心混排）
- 描边过细导致小尺寸糊成一团

## Verification record

- 尺寸 96×96，带 alpha：是
- 两态差异可感知（粗细 + 94% 缩放）：是
- 48px 下可辨：是（齿环虚线间距 ≥3px）
