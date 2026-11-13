# 头目长血条 bar-boss（分段刻度）

## Source and purpose

- 源自页面：`boss-battle`
- `category: container`，不可点击
- 用途：比普通血条长 5 倍，靠四段刻度提示「阶段转换」，一眼看出还剩几成

## Size and states

| 状态 | 文件 | 目标尺寸 | 处理 |
|---|---|---|---|
| `default` | `bar-boss-default-v1.png` | 1000×22 | 墨槽 `#241F1B` + 2px 深墨内框 + 1px 纸白外描边 + 朱砂渐变填充 56% + 4 段刻度 |

单态容器，填充比例运行时裁切（9-slice 横向拉伸）。

## Contract fields to inherit

- `tokens.color.hp-track` `#4A423A`（头目版加深至 `#241F1B`）· `tokens.color.hp-fill` `#B23A28`
- `geometry.stroke.thin` 2 · 9-slice 边距 8/8/8/8

## Image generation prompt

```text
A standalone game UI boss health bar asset, landscape 1000x22, transparent outside the bar.
A long horizontal gauge: near-black track #241F1B with a 2px darker inner frame and a 1px paper-white outer
hairline; a vermilion fill from #C2452F to #99301F occupying the left 56% with a 1px lighter top edge;
four evenly spaced 2px dark tick marks cut through the bar to mark phases; matte, no gloss, no glow,
no numbers.
Centred, complete outline, high resolution, suitable for 9-slice horizontal stretching.
No text, no numbers, no icon, no page background.
```

## Negative constraints

- 数字、百分比、阶段文字
- 发光、玻璃质感、渐变蓝紫
- 刻度不对称或不等分（阶段提示会错位）

## Verification record

- 尺寸 1000×22，带 alpha：是
- 四段刻度等分：是
- 9-slice 边距 8/8/8/8（横向可拉伸，纵向不变）：是
