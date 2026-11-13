# 主按钮 btn-primary（朱砂印章底）

## Source and purpose

- 源自页面：`home`（接着打）/ `battle`（结束回合同族）/ 通用主行动
- 独立游戏 UI 组件资产，`category: control`，可点击，跨页复用
- 用途：全站唯一饱和动作，玩家 3 秒内能指认的「下一步」

## Size and states

| 状态 | 文件 | 目标尺寸 | 处理 |
|---|---|---|---|
| `default` | `btn-primary-default-v1.png` | 600×84 | 朱砂实底 `#B23A28` + 3px 墨内框 + 6px 纸白亮线 |
| `pressed` | `btn-primary-pressed-v1.png` | 600×84 | 底色压暗至 `#8E2A1C`，加顶缘 4px 内阴影（模拟下沉 2px），几何与轮廓完全不变 |

两态外轮廓、圆角（4px）、毛边位移一致，像素级对齐；差异仅在亮度与顶缘阴影。

## Contract fields to inherit

- `colors.primary` `#B23A28` / `colors.pressed` `#8E2A1C`
- `geometry.radius.small` 4 · `geometry.stroke.regular` 3 · `geometry.button_height.primary` 84
- `effects.pressed`：亮度 ×0.86，轮廓不变
- `tokens.interaction.pressed-dim` 0.86 · `pressed-offset-y` 2

## Image generation prompt

> 本项目该组件由设计系统确定性渲染（`render/components/btn-primary.html`），以保证两态轮廓像素级一致；若改用图像模型生成，按以下提示词执行，并按上表把 pressed 写成独立一张。

```text
A standalone game UI primary button asset, landscape 600x84, transparent background, no text.
A vermilion cinnabar seal block: solid #B23A28 fill, 4px corner radius, a 3px dark ink inner frame
(#0E0C0A at 32% alpha) and a thinner paper-white inner hairline 3px inside it, edges slightly irregular
like torn seal paper, subtle ink-grain texture across the fill, soft top-left light, no outer glow,
no drop shadow. Centered composition with 24px empty safe margin, complete outline, high resolution,
suitable for 9-slice scaling and runtime text overlay.
pressed state (separate file): exactly the same shape, outline, radius and grain, fill darkened to
#8E2A1C, plus a 4px inner shadow along the top edge to suggest a 2px press sink; no geometry change.
No text, no letters, no Chinese characters, no icon, no page background, no other components.
```

## Negative constraints

- 任何文字、图标、水印；整页截图或把多个控件拼在一张图
- 圆角过大（>6px）、胶囊形、发光描边、镜面高光、塑料/玻璃质感
- 两态形状不一致、按下态只是整体缩小导致 9-slice 位移
- 边缘被裁切、透明底出现白边或灰边残留

## Verification record

- 尺寸 600×84，PNG 带 alpha：是
- 两态几何一致（同模板渲染，仅底色与内阴影不同）：是
- 无文字：是（文案运行时叠加）
- 9-slice 边距 24/24/24/24：是
