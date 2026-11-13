# 页面提示词 — victory（战后三选一）

## Source and purpose

- 屏幕 ID：`victory`　分类：core　优先级：must-have
- 用途：让胜利的爽感落在「拿走他一样东西」上，三张牌面一眼可辨，选完就走
- 剧情位置：每次情敌战之后；本案是霍九倒地

## Layout contract

| 区域 | 内容 | 尺寸 / 位置 |
|---|---|---|
| 顶部 | 层签「战后 · 断桥雪渡」 | 22px，y108 |
| 顶部 | 朱砂大印「胜」+ 战果标题 + 情敌评语 + 右端战利品 | 印 128×128 |
| 中部 | 「三选一」区标题 + 三张刀诀大卡 | 卡 300×400，间距 34px |
| 中下 | 提示行 + 本局已得缩略牌 4 张 | 缩略 92×122 |
| 底部 | 取此诀（主）+ 换一壶酒（次）+ 老黄收尾台词 + 下一位预告 | 主按钮 flex，次 380×84 |

## Image generation prompt

> 本页不使用独立底图：复用 `map-art.png`，`brightness(1.1) saturate(.55) blur(1.5px) opacity(.5)` + 88% 纸雾覆盖，只留极淡的山影作为背景，保证三张牌面是唯一焦点。若需重出底图，按以下提示词：

```text
A very faint vertical Chinese ink-wash mountain backdrop, 2:3 portrait, for a calm post-battle reward screen.
Only distant snow-covered ridge silhouettes in the upper third, washed out to roughly 20% opacity, the lower
two thirds almost pure warm paper. Rice paper fibre texture, sparse faint snow dots, no figures, no buildings,
no lanterns. Palette: warm paper beige (#E9DFC6) and pale ink grey only, no vermilion at all.
Extremely low contrast, decorative only, must not compete with foreground cards.
ABSOLUTELY NO TEXT, no letters, no Chinese characters, no signature, no seal, no watermark.
```

## Negative constraints

- 高对比底图（会和三张卡抢焦点）
- 直接把「胜」字或标题画进底图
- 血腥、尸体、断肢（本作是喜剧调性，倒地即可）

## Verification record

- 尺寸 1080×1920：是
- 三张卡为全页最高对比区域：是
- 选中卡有朱砂外环 + 外挂「已选」标：是
- 无底图文字残留：是
