# 断桥雪渡 · 常规战（battle）

## Page positioning

- Screen ID: `battle` · 1080×1920（9:16 竖屏手机）
- 作用：一屏内读懂敌我状态并做出一次出招决策；打的是情敌的帮闲，不是情敌本人
- 主行动：点手牌出招（消耗气）→ 结束回合
- 关键约束：**画面 33%–60% 高度（640–1150px）禁止 UI**，留给刀光与飘字

## Visual constraints

| 契约字段 | 取值 |
|---|---|
| `colors.background` | 雪夜墨色 `#14110F` 底，但**地面是亮雪**——HUD 因此改用墨字，不是反白 |
| `colors.primary` | `#B23A28` 朱砂——敌方意图、伤害、当前进度 |
| `tokens.color.hp-fill` | `#B23A28`；`hp-track` `#4A423A` |
| `tokens.color.ap-fill` | `#B98A3C` 金箔 |
| `geometry.stroke` | 2 / 3 / 5 三档；手牌内框 3px 墨 + 2px 纸白 |
| `effects.damage_flash` | 受击闪白 1 帧 + 6 颗墨点溅开 |
| 可读性 | 顶部压深墨罩用反白字；底部为亮雪地，改墨字 + 纸白小牌承载 |

## Layout and components

- **顶部（56–122）**：左上暂停、右上设置齿轮（各 56×56，墨底亮线框）；中央层签「二 · 断桥雪渡 ｜ 帮闲 3 ｜ 回合 3」（宣纸窄条，26px，`nowrap`）
- **敌方（156–250）**：三列，每列 240px，居中于 171 / 528 / 874；意图图标 40px + 数值 40px、名条 22px、血条 240×14
- **战场（192–1920 底图）**：敌人在上三分之一作湿墨剪影；中部空雪 + 一盏残红灯笼（x 0.5, y 0.55）；老黄皮衣背影在下三分之一
- **手牌（1348–1598）**：5 张扇形，牌面 200×238，重叠 26px，中间一张抬升 18px 且描边转朱砂
- **玩家信息（1682）**：左——`老黄 84 / 120` + 392px 血条 + 「皮衣 6」护盾行；中——气牌（56px 高宣纸小牌，3 枚金点）；右——结束回合 340×84
- **底部 96px 安全区**：留白

## Image generation prompt

```text
A vertical Chinese ink-wash battle scene plate, 2:3 portrait, for a hardcore roguelike deckbuilder.
A snowy mountain trail at night with a ruined stone gate. Upper area: three hostile figures in ragged dark
cloaks stand as wet-ink silhouettes behind a broken stele — two blade-wielding raiders and one archer drawing
a bow, small in frame, around the top third. Lower area: the back view of a lean middle-aged swordsman with
silver-white hair, wearing a black leather jacket with the collar turned up, a long notched dao hanging at
his right side, snow on his shoulders, around the lower third. The middle of the frame is deliberately empty
snow ground with drifting flakes, dry-brush motion streaks and a dying red lantern glow, left blank for UI
overlays. Traditional Chinese ink wash (shuimo), heavy wet ink bleeding, dry-brush flying-white, rice paper
fibre texture, one vermilion accent (#B23A28) on the lantern. Palette: dark ink (#14110F) and warm paper tone,
very low saturation, one vermilion accent only. Soft top-left light, deep misty depth, silhouette readability
over detail. Strong vertical thirds, no border, no frame.
ABSOLUTELY NO TEXT, no letters, no Chinese characters, no signature, no seal, no watermark, no UI elements,
no buttons, no health bars, no numbers.
```

## Negative constraints

- 血条、意图图标、数字、按钮
- 中部不空（飘字与刀光必须有落点）
- 老黄画成整身（背影只到腰即可，头部不可被手牌压住）
- 地面画成深色（底部 HUD 将失去锚点）

## Verification record

- 尺寸 1080×1920：是
- 敌我血条、气、手牌、结束回合四块信息同屏不重叠：是
- 老黄头部完整可见于手牌上方：是
- 中部空场高度 ≥ 500px：是
- 底图零文字：是
