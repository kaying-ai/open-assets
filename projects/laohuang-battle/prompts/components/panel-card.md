# 宣纸卡片 panel-card

## Source and purpose

- 源自页面：`home`（进度木牌同族）/ `settings`（四个分组卡片）/ `battle`（战利品条同族）
- `category: container`，不可点击，跨页复用
- 用途：把一组信息收进一张裱好的宣纸，靠留白而非投影分层

## Size and states

| 状态 | 文件 | 目标尺寸 | 处理 |
|---|---|---|---|
| `default` | `panel-card-default-v1.png` | 600×360 | 纸底 `#F2EADA` + 5px 墨框 + 内 7px 纸白亮线 + 8px 圆角，毛边位移 2.0 |

单态容器，无按下态（不可点击）。

## Contract fields to inherit

- `tokens.color.surface-panel` `#F2EADA` · `colors.ink` `#191512`
- `geometry.radius.card` 8 · `geometry.stroke.strong` 5 · `geometry.card_padding` 28
- `effects.shadow`：资产内不含外投影（引擎/运行时绘制墨青投影）

## Image generation prompt

```text
A standalone game UI paper panel asset, portrait 600x360, transparent background outside the panel.
A blank mounted rice-paper card: warm paper fill #F2EADA, 8px corner radius, a 5px solid ink black
outer frame with a thin paper-white inner highlight line, edges irregular like hand-torn mounting paper,
visible rice paper fibre, soft top-left light, no drop shadow, no glow, no ornament, no text.
Completely empty interior (whitespace reserved for runtime content), centred, high resolution,
suitable for 9-slice scaling to any card size.
No text, no letters, no icon, no title, no decorative pattern, no page background.
```

## Negative constraints

- 文字、标题、图标、装饰纹样
- 卡片内出现折角、胶带、图钉、阴影投在他处的效果
- 圆角大于 12px、双线欧式边框、木纹或皮革材质
- 内部被填满导致无法叠加内容

## Verification record

- 尺寸 600×360，内部纯净可叠字：是
- 9-slice 边距 28/28/28/28：是
- 无文字：是
