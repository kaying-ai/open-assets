# 路线节点 route-node（山道上的圆印）

## Source and purpose

- 源自页面：`map`（四 / 五 / 六 / 庄 四个节点）
- `category: control`，可点击，跨页复用
- 用途：在山道长卷上标出「走到哪、下一步去哪」，必须压得住水墨而不像 UI 元件

## Size and states

| 状态 | 文件 | 目标尺寸 | 处理 |
|---|---|---|---|
| `default` | `route-node-default-v1.png` | 110×110（实体 84×84 + 12px 光晕留边） | 宣纸圆牌 `rgba(242,234,218,0.94)` + 3px 墨圈 + 8px 纸白外环 |
| `pressed` | `route-node-pressed-v1.png` | 110×110 | 底色降至 `#DED1B4`，加顶缘 5px 内阴影；几何与轮廓不变 |

`done` / `current` 两态由运行时改描边色（降饱和墨 / 朱砂实底 + 9px 红环）生成，不另出图。

## Contract fields to inherit

- `tokens.color.surface-panel` `#F2EADA` · `colors.ink` `#191512` · `colors.primary` `#B23A28`
- `geometry.stroke.regular` 3 · `effects.pressed`

## Image generation prompt

```text
A standalone game UI map node asset, square 110x110, transparent background, no text, no number.
A round rice-paper token: warm paper fill #F2EADA at 94% opacity, diameter 84px, a 3px solid ink black ring
around it, then an 8px soft paper halo outside the ring, soft top-left light, faint paper fibre texture,
very slight dry-brush irregularity on the ring, small drop shadow in ink-teal.
Centred with 12px safe margin, complete outline, high resolution.
pressed state (separate file): identical geometry and ring, fill darkened to #DED1B4 with a 5px inner shadow
along the top edge; no size change.
No text, no digits, no icon, no map pin, no page background.
```

## Negative constraints

- 数字、字符、图钉、图标、方向箭头
- 3D 立体按钮、金属边、发光描边
- 两态尺寸不一致（会导致地图上节点跳动）

## Verification record

- 尺寸 110×110，透明底：是
- 两态几何一致、亮度差可感知：是
- 无文字（编号由运行时叠加）：是
