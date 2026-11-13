# 客栈首页（home）

## Page positioning

- Screen ID: `home` · 1080×1920（9:16 竖屏手机）
- 作用：冷启动后的落点。3 秒内传达「这是老黄的战斗」「我打到第几位情敌」「点这个接着打」
- 主行动：`接着打`（有存档）/ `入江湖`（无存档）——全页唯一朱砂实底按钮
- 情绪基调：冷、静、硬，但人物是喜剧的。一个穿皮衣、白头发、戴眼镜的中年刀客，正用手指跟你比划道理

## Visual constraints

| 契约字段 | 取值 |
|---|---|
| `colors.background` | `#E9DFC6` 宣纸米黄 |
| `colors.primary` | `#B23A28` 朱砂（仅主按钮、印章、题跋分隔线） |
| `colors.ink` | `#191512` 墨 |
| `colors.accent` | `#B98A3C` 金箔（仅流派标签细边） |
| `geometry.radius.small` | 4（纸片硬边，不用圆润胶囊） |
| `geometry.stroke.strong` | 5（卡片与按钮外墨框） |
| `geometry.button_height.primary` | 84 |
| `visual.lighting` | 左上柔光，阴影墨青 `rgba(44,58,56,0.22)` |
| 留白率 | ≥ 40%，右上疏、左下密 |

## Layout and components

- **顶部（56–112）**：资源条——银两 1286 / 酒 3 / 声望 47，1px 墨线通栏；右端设置齿轮（56×56，2px 墨框纸底方）
- **次顶（126）**：左上小字「上次 · 昨夜 亥时 · 打到半山腰」（22px，`text-secondary`）
- **右上竖排 LOGO（168 起）**：`老黄的战斗` 五字竖列，`老黄` 90px / `的` 52px / `战斗` 74px；下接 100×100 朱砂方印「黄」
- **右中题跋（846 起）**：双列竖排——主列「刀不快　人已旧　皮衣还在」21px，副列「九场桃花债」18px，左侧 1.5px 朱砂细线，线长与文字齐平（338px）
- **中段立绘（214–1330）**：老黄四分之三身，黑皮衣高竖领、银白背头、细框眼镜、一手按刀一手比划；墨色从宣纸里晕出来，右侧与下缘用双向遮罩渐隐；占位 x −140–640
- **进度木牌（1338）**：`断桥雪渡`，宣纸窄条 + 3px 墨框，左端朱砂小印「五」，右端「九场之五 · 余 4」
- **流派标签（1440）**：`回锋`（选中，金箔描边）/ `算力` / `皮衣`
- **主按钮（1520）**：`接着打`，600×84，朱砂实底 + 3px 墨内框 + 6px 纸白亮线
- **次按钮（1632）**：`开新局` 288×56 / `情敌名录` 288×56，宣纸描边
- **底部导航（1712–1824）**：客栈（选中，朱砂下划线）/ 名录 / 酒壶 / 设置

## Image generation prompt

```text
A vertical Chinese ink-wash character key art plate, 2:3 portrait, for a hardcore roguelike deckbuilder.
Subject: a lean East Asian man around 55, silver-white hair swept back, thin rectangular eyeglasses with a
faint glint, sharp cheekbones, a small knowing half-smile, wearing a black leather biker jacket with a high
collar over a plain dark shirt. The leather jacket is rendered in heavy wet ink black with dry-brush
flying-white highlights along the seams, shoulders and collar so it reads as worn leather inside an ink
painting; a single vermilion cinnabar seal mark on the collar. Three-quarter view, cropped at mid-thigh, one
hand resting on a notched broad dao sword held point-down at his side, the other hand raised slightly as if
explaining something. Snow on his shoulders and in his hair. Traditional Chinese ink wash (shuimo) on rice
paper, layered wet ink bleeding, dry-brush edges, rice paper fibre texture. Extremely limited palette: warm
paper beige (#E9DFC6) background, ink black (#191512), one vermilion accent (#B23A28). Soft top-left light,
no harsh specular highlights, no glow. The figure occupies the middle 55% of the frame height, large empty
ink-wash negative space above and below, falling snow dots, no border, no frame.
ABSOLUTELY NO TEXT, no letters, no Chinese characters, no signature, no seal characters, no watermark.
```

## Negative constraints

- 任何文字 / 水印 / 签名；整页截图
- 年轻化、肌肉英雄化（他要像个会说「这版很便宜」的中年人）
- 长袍斗篷（皮衣是他的身份，换掉就垮）
- 立绘压住 LOGO 与题跋（右侧 40% 必须留给竖排文字）

## Verification record

- 尺寸 1080×1920：是
- 立绘右侧与下缘渐隐，无硬边：是
- LOGO / 题跋 / 立绘三者互不重叠：是
- 主按钮为全页唯一饱和动作：是
- 底图零文字：是
