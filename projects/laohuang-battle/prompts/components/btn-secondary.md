# 次按钮 btn-secondary（宣纸描边）

## Source and purpose

- 源自页面：`home`（开新局 / 江湖名录）
- `category: control`，可点击，跨页复用
- 用途：并列的次要动作，必须明显弱于主按钮，不与主按钮抢注意力

## Size and states

| 状态 | 文件 | 目标尺寸 | 处理 |
|---|---|---|---|
| `default` | `btn-secondary-default-v1.png` | 288×56 | 纸底 `#F2EADA`（不透底）+ 3px 墨框 + 4.5px 纸白内亮线 |
| `pressed` | `btn-secondary-pressed-v1.png` | 288×56 | 底色降至 `#DED1B4`，加顶缘内阴影；轮廓不变 |

## Contract fields to inherit

- `colors.ink` `#191512` · `tokens.color.surface-panel` `#F2EADA`
- `geometry.radius.small` 4 · `geometry.stroke.regular` 3 · `geometry.button_height.small` 56
- `effects.pressed`：压暗 + 顶缘内阴影，轮廓不变

## Image generation prompt

```text
A standalone game UI secondary button asset, landscape 288x56, transparent background, no text.
A blank rice-paper plaque: warm paper fill #F2EADA, 4px corner radius, a 3px solid ink black border
(#191512) plus a thin paper-white inner highlight line, edges slightly torn by dry brush, very subtle
paper fibre texture, soft top-left lighting, no drop shadow, no glow. Centered, complete outline,
24px safe margin, high resolution, ready for 9-slice and runtime text overlay.
pressed state (separate file): identical shape and border, fill darkened to #DED1B4 with a 4px inner
shadow along the top edge; no geometry change.
No text, no letters, no icon, no page background, no other elements.
```

## Negative constraints

- 文字、图标、水印、整页截图
- 比主按钮更强的对比度或更重的边框
- 半透明填充（资产必须不透底）
- 发光、渐变蓝紫、立体投影、圆角过大

## Verification record

- 尺寸 288×56，PNG 带 alpha（外轮廓透明，内部不透底）：是
- 两态几何一致：是
- 视觉权重低于 `btn-primary`：是（无饱和色填充）
