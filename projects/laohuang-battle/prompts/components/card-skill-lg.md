# 三选一大卡 card-skill-lg（刀诀牌面）

## Source and purpose

- 源自页面：`victory`（三选一）、`battle` / `boss-battle`（手牌同族，缩至 200×238）
- `category: container`，可点击，跨页复用
- 用途：三张并排时必须靠轮廓与留白区分，而不是靠颜色堆

## Size and states

| 状态 | 文件 | 目标尺寸 | 处理 |
|---|---|---|---|
| `default` | `card-skill-lg-default-v1.png` | 300×400 | 纸底 `#F2EADA` + 5px 墨框 + 内 7px 纸白亮线 + 8px 圆角 + 12px 内衬细线 |
| `pressed` | `card-skill-lg-pressed-v1.png` | 300×400 | 底色降至 `#ECE1CB`，加顶缘 6px 内阴影；轮廓不变 |

`selected` 态由运行时叠加朱砂外环（4px + 6px）与抬升 8px 表达，不另出图。

## Contract fields to inherit

- `tokens.color.surface-panel` `#F2EADA` · `colors.ink` `#191512` · `colors.primary` `#B23A28`
- `geometry.radius.card` 8 · `geometry.stroke.strong` 5 · 9-slice 边距 30/30/30/30

## Image generation prompt

```text
A standalone game UI card frame asset, portrait 300x400, transparent outside the card.
A blank mounted rice-paper card: warm paper fill #F2EADA, 8px corner radius, a 5px solid ink black outer
frame with a thin paper-white inner highlight line, then a faint 1px inner rule inset 12px; edges irregular
like hand-torn mounting paper, visible rice paper fibre, soft top-left light, no drop shadow, no glow,
no ornament, no text. Completely empty interior for runtime content, centred, high resolution, ready for
9-slice scaling.
pressed state (separate file): identical shape and frame, fill darkened to #ECE1CB with a 6px inner shadow
along the top edge.
No text, no numbers, no icon, no cost badge, no page background.
```

## Negative constraints

- 文字、数字、费用圆、稀有度标、图标（全部运行时叠加）
- 圆角大于 12px、双线欧式边框、木纹皮革材质
- 内部被花纹填满导致无法叠字

## Verification record

- 尺寸 300×400，内部纯净可叠字：是
- 9-slice 边距 30/30/30/30：是
- 无文字：是
