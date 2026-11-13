# 页面提示词 — boss-battle（关底情敌战）

## Source and purpose

- 屏幕 ID：`boss-battle`　分类：core　优先级：must-have
- 用途：把「打情敌」和「打杂兵」在视觉上一刀切开——一条长血条、一个名字、一句嘲讽
- 与 `battle` 共用战斗系统，差别只在 HUD 换装与单一目标

## Layout contract

| 区域 | 内容 | 尺寸 / 位置 |
|---|---|---|
| 顶部 | 暂停 56×56 · 头目名条（编号印 + 名 + 身份 + 关底标记） | 名条 116→1040，88px 高 |
| 顶部 | 四段刻度长血条 + 血量 / 甲 / 阶段 / 意图 | 血条 1000×22 @ y162；元信息 22px |
| 中部 | 情敌全身立绘，牌楼 + 铁灯列队 | 占画面 16%–50% |
| 中下 | 墨色空场，只放嘲讽台词 | 占 50%–78% |
| 底部 | 手牌 5 张 · 老黄血条 + 皮衣护盾 · 气牌 · 结束回合 | 牌 200×238；按钮 340×84 |

## Image generation prompt

```text
A vertical Chinese ink-wash boss arena plate, 2:3 portrait, for a hardcore roguelike deckbuilder.
A mountaintop stone terrace at night in heavy snow, a tall ceremonial archway and rows of cold iron
lanterns behind. Centre-upper: a towering young lord in layered ceremonial robes holding a long spear
planted in the ground, standing far back and rendered as a broad wet-ink figure with a small head, wide
presence, a faint vermilion sash; his silhouette must be crisp against the pale sky. Foreground lower
third: empty snow terrace with dry-brush wind streaks, deliberately blank for the player HUD. Upper 20%:
dark misty sky left blank for a boss health bar. Traditional Chinese ink wash (shuimo), heavy wet ink
bleeding, dry-brush flying-white edges, rice paper fibre texture. Palette: dark ink (#14110F) and warm
paper tone, very low saturation, one vermilion accent only. Symmetrical arena, strong vertical thirds,
no border, no frame. ABSOLUTELY NO TEXT, no letters, no Chinese characters, no signature, no seal,
no watermark, no UI elements, no buttons, no health bars, no numbers.
```

## Negative constraints

- 血条、名字、伤害数字、意图图标
- 情敌直视镜头的大头特写（要整身，才有「排面」）
- 多条敌人并排（关底是单挑，这是与 battle 的核心区别）

## Verification record

- 尺寸 1080×1920：是
- 情敌头部不被名条与血条遮挡：是
- 中部 28% 高度的墨色空场可用于嘲讽与飘字：是
- 底图零文字：是
