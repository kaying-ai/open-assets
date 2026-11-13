# 页面提示词 — rival-intro（情敌登场 · 对峙）

## Source and purpose

- 屏幕 ID：`rival-intro`　分类：core　优先级：must-have
- 用途：两三句台词交代「这人是谁、为什么挡路、他的脾气」，并给出「拔刀 / 听完」两条路
- 剧情位置：每次关底战前；本案是第五位情敌「白衣镖头 · 霍九」

## Layout contract

| 区域 | 内容 | 尺寸 / 位置 |
|---|---|---|
| 顶部 | 返回 · 层签「关底 · 断桥雪渡 ｜ 情敌 5/9」· 右「跳过 ›」 | 层签 60px 高，24px 字 |
| 中左 | 老黄皮衣背影，全黑剪影 | 占左 20% |
| 中右 | 情敌正面，红灯笼顶光，折扇半开 | 占右 34% |
| 中部 | 空雪地，禁止 UI | 中央 45% |
| 底部 | 台词卡（编号印 + 姓名 + 性格 + 台词 + 回话）+ 双按钮 | 卡 296px 高；主 600×84 / 次 348×56 |

## Image generation prompt

```text
A vertical Chinese ink-wash confrontation plate, 2:3 portrait, for a roguelike boss-introduction screen.
The entrance of a mountain tavern in snow at night. On the LEFT edge, dark and rim-lit: the back view
shoulder of a lean middle-aged swordsman with silver-white hair in a black leather jacket, occupying only
the left 20% of the frame, rendered in heavy ink silhouette. On the RIGHT: a young elegant dandy in pale
brocade robes with a folding fan held lazily, standing under a red lantern at the tavern doorway, warmly
lit from above, confident and amused posture, occupying the right 34% of the frame. The centre and lower
centre are deliberately empty snow ground with drifting flakes, left blank for dialogue UI.
Traditional Chinese ink wash (shuimo), wet ink bleeding, dry-brush flying-white, rice paper fibre texture.
Palette: warm paper beige (#E9DFC6), ink black (#191512), one vermilion accent (#B23A28) only on the lantern.
Two figures pressed to the left and right edges, large central negative space, no border, no frame.
ABSOLUTELY NO TEXT, no letters, no Chinese characters, no signature, no seal, no watermark, no UI elements,
no dialogue boxes.
```

## Negative constraints

- 对话框、血条、选项按钮——任何 UI 都不许画进底图
- 两人正面并排站立（会变成合照，失去对峙张力）
- 情敌用冷色调（他必须是被灯笼暖光照着的那一方）

## Verification record

- 尺寸 1080×1920：是
- 中部 45% 无墨块遮挡，可放台词卡：是
- 左右剪影对比（黑 vs 暖光）成立：是
- 底图零文字：是
