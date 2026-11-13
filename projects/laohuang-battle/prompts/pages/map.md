# 页面提示词 — map（上山路线图）

## Source and purpose

- 屏幕 ID：`map`　分类：core　优先级：must-have
- 用途：一屏看清「打到第几个、下一步打谁、能拿什么」，并决定继续上山或撤回客栈
- 剧情位置：老黄从山脚往山顶走，一条雪中山道上依次排着九位情敌

## Layout contract

| 区域 | 内容 | 尺寸 / 位置 |
|---|---|---|
| 顶部 | 返回箭头 · 标题「上山」· 副标「九场 · 已过三场」· 右「回客栈」 | 标题 54px，副标 22px，次按钮 196×56 |
| 中部 | 四个路线节点沿山道自下而上（四 / 五 / 六 / 庄） | 节点 84px 圆牌（头目 104px），名条 46px |
| 底部 | 当前目标卡：关名 + 情敌 + 台词 + 奖励 + 拔刀 | 卡 32px 边距 × 356px 高，主按钮 300×76 |
| 底边 | 96px 安全区 | 留白 |

## Image generation prompt

> 底图由图像模型生成，页面由排版层合成；底图必须零文字。

```text
A vertical Chinese ink-wash journey map plate, 2:3 portrait, for a roguelike route-selection screen.
A winding mountain path descending through deep snow, seen from a high vantage, snaking from the top edge
down to the bottom; along the path sit four tiny lit landmarks in wet ink — a roadside tavern with one red
lantern near the top, a ruined temple gate in the upper middle, a frozen ferry crossing with a small boat
in the lower middle, and a stone mountain-pass gate at the bottom. Distant ink mountain ridges fade into
empty rice paper on both sides, heavy mist, sparse falling snow. Traditional Chinese ink wash (shuimo),
layered wet ink, dry-brush flying-white, rice paper fibre texture, low contrast and high empty space so UI
nodes can sit on top. Palette: warm paper beige (#E9DFC6), ink black (#191512), a single vermilion (#B23A28)
lantern accent. The path occupies the central 40% band, left and right thirds stay nearly blank.
ABSOLUTELY NO TEXT, no letters, no Chinese characters, no numbers, no signature, no seal, no watermark,
no map pins, no UI elements.
```

## Negative constraints

- 地图钉、图标、图例、坐标、指北针、虚线路径（路径必须画在水墨里，不是叠加的 UI 线）
- 高饱和青绿山水、工笔重彩、卡通描边
- 中间横向空出一条「等宽走廊」——会像 UI 而不是山水

## Verification record

- 尺寸 1080×1920：是
- 四个节点落在山道上且互不重叠：是
- 当前节点（五）为全页唯一朱砂实底：是
- 底图零文字：是
