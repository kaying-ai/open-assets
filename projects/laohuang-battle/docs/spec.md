# UI Project Specification

## Project Positioning

- Project ID: `laohuang-battle`
- Game title: 老黄的战斗
- Game genre: 单机肉鸽卡牌构筑（Roguelike Deckbuilder）
- Core gameplay: 三关九场的情敌推进；回合制对阵，用「气」打出刀诀招式，读敌方意图，战后三选一构筑
- Target platform: 手机（竖屏，单手拇指区可及）
- Aspect ratio: 9:16
- Target audience: 25–40 岁中文玩家，构筑肉鸽老玩家为主
- Copy language: 简体中文（zh-CN），半文半白；喜剧感来自中年人与少年人的反差，不堆网络梗

## Input Materials

- Reference images: 无提供的参考图。风格来源为「明清水墨人物册页 + 现代硬核游戏 HUD」的抽象化，不复制任何具体画面
- Existing pages: 无（本项目从零开始）
- Brand or copyright restrictions: 老黄、阿岚、三少爷、少庄、断桥雪渡均为原创；主角造型取「黑皮衣 + 银白背头 + 细框眼镜 + 中年身形」的组合语汇，**不做任何真实公众人物的肖像复刻**，也不使用任何真实门派、影视或游戏形象；字体使用系统宋体族（Noto Serif SC / 思源宋体），不内嵌商业字体

## User Stories

### US-01

As a 刚被 boss 打回山脚的玩家, I want 一打开就看到「我在第几场」和「接着打」, so that 我不用在菜单里翻找进度。

Verification scenarios:

1. Given 存在存档「九场之五」 When 进入 `home` Then 主按钮文案为「接着打」，进度木牌显示「断桥雪渡」而非「未入江湖」
2. Given 无存档 When 进入 `home` Then 主按钮文案为「入江湖」，进度印章整块隐藏
3. Given 存档损坏 When 进入 `home` Then 出现窄条提示，主按钮降级但可点「开新局」

### US-02

As a 硬核构筑玩家, I want 一眼看清敌人下回合要做什么、我还有几点气, so that 我能做出「挨这一下还是防这一下」的决策。

Verification scenarios:

1. Given 己方回合 When 看 `battle` 首屏 Then 三个敌人的意图图标与数值在同一水平线，且不与血条重叠
2. Given 气 = 0 When 点任意非 0 费手牌 Then 牌抖动并飘出「气不足」，不消耗点击
3. Given 敌方回合 Then 手牌整体降饱和，仅暂停可点

### US-03

As a 讨厌被设置页困住的玩家, I want 改完就走, so that 我不会因为找不到返回而退出游戏。

Verification scenarios:

1. Given 在 `settings` When 点左上返回 Then 立即回来源页，改动已保存
2. Given 改动过设置 When 退出再进 Then 值保持
3. Given 无任何改动 When 看「恢复默认」Then 该按钮为置灰态

### US-04

As a 想知道剧情的玩家, I want 在上山路上看见下一个挡路的是谁、他什么脾气, so that 我不是在打无名小怪而是打「那个人」。

Verification scenarios:

1. Given 走到第二个节点 When 看 `map` Then 四个节点状态（已过 / 当前 / 未到 / 关底）一眼可辨，当前节点为唯一朱砂实底
2. Given 点开当前节点 When 看底部卡片 Then 同时可见关名、情敌名、一句台词与奖励预览
3. Given 关底节点 When 点「拔刀」Then 先进 `rival-intro` 而不是直接开战

### US-05

As a 二周目玩家, I want 关底情敌有专属的登场与血条, so that 这一个人明显比前面几个帮闲重。

Verification scenarios:

1. Given 进入 `boss-battle` When 看首屏 Then 名条、1000×22 四段刻度长血条、甲 / 阶段 / 意图四者同时可见
2. Given 血量降到 50% When 进入阶段二 Then 名条闪一次朱砂，意图切成「蓄力」
3. Given 皮衣护盾归零 When 看不设血条区 Then 显示「皮衣已破 0」，与血量行视觉上明确区分

### US-06

As a 想快点下班的玩家, I want 战后三选一能一次点击跳过换成酒, so that 我不想选的时候不用被拦在那。

Verification scenarios:

1. Given 结算页三张卡 When 点任意一张 Then 该卡抬升并出现「已选」，其余两张降饱和
2. Given 未选任何卡 When 点「换一壶酒」Then 酒 +1 并直接回 `map`
3. Given 酒已 5 壶 When 看跳过按钮 Then 置灰并注明「壶满了」

## Scope

### Included

- 七个页面视觉稿：`home` / `map` / `battle` / `rival-intro` / `boss-battle` / `victory` / `settings`（1080×1920，9:16）
- 一套共享视觉契约：水墨硬核、宣纸肌理、朱砂主色
- 可复用组件资产 9 个 / 15 张：主按钮、次按钮、宣纸卡片、血条、设置齿轮、返回箭头、路线节点、三选一大卡、头目长血条（可点击件均含按下态）
- 图集（atlas）+ 引擎交接 JSON（godot / unity / cocos / generic / taptap-maker）
- Web 预览包：`index.html` 物料总览 + `result.html` 手机壳预览

### Excluded

- 情敌名录、酒壶升级、商店、排行榜的完整页面（仅入口占位）
- 阿岚立绘、结局动画、六位普通情敌的独立立绘
- 支付、联机、云存档
- 动效实现、音效资源、字体文件
- 真实战斗数值平衡表

## Visual Goals

- Mood: 冷、静、硬 + 一点荒诞。一夜大雪里，一个穿皮衣的五十岁男人在为自己的桃花债爬山
- Style keywords: 水墨晕染、宣纸纤维、朱砂印章、枯笔飞白、金箔点缀、克制的血墨溅点
- Recognition goal: 关掉文字、只看轮廓与色块，也能认出是「中式水墨」而非通用暗色 UI
- Legibility goal: 在宣纸浅底上，正文对比度 ≥ 7:1；朱砂主按钮上的白字对比度 ≥ 4.5:1

## Page Scope

- First page to generate: `home`（基准页，确立视觉语言）
- Systems that must be extended: `battle`（HUD 密集 + 亮雪底，验证契约在不遮战场前提下的可读性）、`boss-battle`（单目标重型 HUD）、`map`（长卷底图上的节点可读性）、`victory`（三张同类卡的可辨性）、`settings`（表单密度）
- Optional systems: 情敌名录、酒壶（本迭代仅入口）

## Deliverables

- [x] Game design doc (`gdd.md`)
- [x] Product requirements document (`prd.md`)
- [x] UI interaction logic (`interaction.md`)
- [x] UI spec and visual contract
- [x] Screen map and page contract
- [x] Single-page plan, prompt, and visual draft
- [x] Component list, prompts, and standalone assets
- [ ] Sprite sheet slicing, single-element PNGs, and ZIP package（本次组件为独立文件产出，不走精灵表切片；已在 `quickstart.md` 记录）
- [x] 9-slice, Atlas, and engine JSON delivery
- [x] Asset manifest and reproduction notes

## Verification Criteria

- [x] Primary action recognizable within three seconds（首页唯一朱砂实底按钮；地图上唯一朱砂实底节点）
- [x] Pages and components follow the same visual contract（同一份 tokens 渲染产出）
- [x] Key states, error states, and edge cases are complete（见 `interaction.md` 状态机）
- [x] All output assets registered with valid paths
- [x] No garbled text, protected trademarks, or unauthorized character replicas（底图不含文字；主角为原创造型语汇，非任何真人肖像）

## Open Items

- 无阻塞项。待定（不阻塞本迭代）：字体文件是否随包分发（当前用系统宋体族）
