# 设置页（settings）

## Page positioning

- Screen ID: `settings` · 1080×1920（9:16 竖屏手机）
- 作用：调完就走。不迷路、不丢改动、返回永远一步
- 主行动：无强主行动（刻意弱化）——强调分组层次与朱砂细线
- 入口：首页齿轮 / 首页底栏「设置」/ 战斗内齿轮（覆盖层）

## Visual constraints

| 契约字段 | 取值 |
|---|---|
| `colors.surface-panel` | `#F2EADA` 卡片底（比页面底 `#E9DFC6` 亮一档） |
| `colors.primary` | `#B23A28` 仅用于标题细线、选中分段、危险文字按钮 |
| `geometry.radius.card` | 8 |
| `geometry.card_padding` | 28 |
| 卡片裱边 | 外 5px 墨框 + 内 2px 纸白亮线（与首页按钮同族） |
| 行高 | 96px，行间 0（靠 1px `paper-edge` 细线分隔） |
| 留白 | 组间距 28px，页面左右 40px |

## Layout and components

- **顶部（68–150）**：左上返回毛笔箭头（56×56）；标题「设置」44px 居中；其下 120 宽 2px 朱砂细线
- **音画卡片（196–604）**：组标题「音画」+ 3 行——音乐（滑块 70%）/ 音效（滑块 85%）/ 画质（分段 高·中·低，选中「中」）
- **操作卡片（632–944）**：组标题「操作」+ 2 行——震动（开关·开）/ 字号（分段 标准·大，选中「标准」）
- **账号卡片（972–1284）**：组标题「账号」+ 2 行——江湖名（未入江湖，右侧主按钮样式「绑定」）/ 客服
- **其他卡片（1312–1624）**：组标题「其他」+ 2 行——语言（简体中文，右侧 ›）/ 关于（v0.1.0，右侧 ›）
- **底部（1680–1770）**：「恢复默认」文字按钮（22px，朱砂，无改动时置灰）；版本号「v0.1.0 · 雪夜版」22px 居中低对比

## States

- `default`：如上，`恢复默认` 置灰
- `dirty`：返回箭头右上出现朱砂小点（6px）
- `confirm-reset`：墨罩 + 宣纸确认面板「全部回到出厂，包括音量。」/ 恢复（danger）/ 算了
- `error`：底部窄条「没存住，再点一次」，2.4 秒收起

## Image generation prompt

```text
A minimal vertical Chinese ink-wash decorative plate, 2:3 portrait, for a game settings screen.
Content: a faint distant ink-wash mountain range and two sparse bamboo branches entering from the top
right corner, fading into empty rice paper; a small dry-brush circular enso brush mark in the lower
left. Very light ink wash, 15% opacity feel, huge empty space, rice paper fibre texture visible.
Palette: warm paper beige (#E9DFC6), pale ink gray, one small vermilion cinnabar dash near the bamboo.
Style: traditional Chinese ink wash, minimalist, quiet, no figures, no architecture detail.
Composition: decoration confined to the top 25% and bottom 10% of the frame; the middle 60% must stay
almost blank so that UI cards can be placed on it.
ABSOLUTELY NO TEXT, no letters, no Chinese characters, no signature, no watermark, no UI elements.
```

## Negative constraints

- 任何文字、汉字、书法、印章字、水印
- 装饰侵入画面中段 60%（会与设置卡片抢视觉）
- 深色底、霓虹、3D、塑料质感
- 人物、建筑细节、密集纹样、边框花纹
- 高对比墨块（压过卡片层级）

## Verification record

- 底图零文字：是（所有标签由排版层叠加）
- 实际生成尺寸：1024×1536，作为整页极低透明度底纹使用（不裁切，等比铺满后压暗）
- 状态：见 `contracts/asset-manifest.yaml`
