# 血条 bar-hp

## Source and purpose

- 源自页面：`battle`（敌方与老黄血条）
- `category: container`，不可点击，跨页复用
- 用途：在复杂墨色背景上仍能读出剩余比例；轨道必须比填充更暗，避免与背景糊在一起

## Size and states

| 状态 | 文件 | 目标尺寸 | 处理 |
|---|---|---|---|
| `default` | `bar-hp-default-v1.png` | 420×16 | 墨褐轨道 `#4A423A` + 2px 深墨内框 + 朱砂填充 70%（含顶部 2px 亮线） |

单态容器，填充比例由运行时裁切（9-slice 横向拉伸）。

## Contract fields to inherit

- `tokens.color.hp-track` `#4A423A` · `tokens.color.hp-fill` `#B23A28`
- `geometry.radius.small` 4 · `geometry.stroke.thin` 2
- 轨道与填充对比：填充亮度高于轨道 1.8 倍以上，保证 10px 高度下可辨

## Image generation prompt

```text
A standalone game UI health bar asset, landscape 420x16, transparent background outside the bar.
A slim horizontal gauge: dark ink-brown track #4A423A with a 2px near-black inner frame, 2px corner
radius, and a vermilion #B23A28 fill occupying the left 70% with a 1px lighter top edge; edges slightly
irregular from dry brush; matte, no gloss, no glow, no numeric text.
Centred, complete outline, high resolution, suitable for 9-slice horizontal stretching.
No text, no numbers, no icon, no page background.
```

## Negative constraints

- 数字、百分比、文字、图标
- 高光渐变、玻璃质感、发光轨道
- 填充与轨道对比过低（在小尺寸下不可辨）
- 竖向拉伸后变形的装饰

## Verification record

- 尺寸 420×16，带 alpha：是
- 9-slice 边距 6/6/6/6（横向可拉伸，纵向不变）：是
