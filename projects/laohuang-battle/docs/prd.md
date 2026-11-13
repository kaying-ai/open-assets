# Product Requirements Document (PRD)

## Document Status

- status: approved
- version: 0.2
- owner: feng
- last_updated: 2026-11-13

> 本迭代交付七个页面：`home`（客栈首页）、`map`（上山路线图）、`battle`（常规战）、`rival-intro`（情敌对峙）、`boss-battle`（关底情敌战）、`victory`（战后三选一）、`settings`（设置页）。

## Overview

- Project ID: `laohuang-battle`
- Product goal: 让玩家从「打开游戏」到「打出第一刀」的路径不超过两次点击，并让「穿皮衣的中年刀客为桃花债上山」这件事在一屏之内立住
- Success metrics (verifiable):
  1. 首页主按钮在首屏 3 秒内被识别为唯一强动作（灰阶测试下对比度最高区域即主按钮）
  2. 战斗页一屏内同时可见敌方意图、双方血量、气、手牌，且战场中心 40% 区域内无 UI 遮挡
  3. 路线图上四个节点状态一眼可辨，从看到节点到进入战斗不超过两次点击
  4. 关底情敌在进入战斗后 1 秒内可被指认为「这一关的大人」——靠名条、长血条、嘲讽三位一体
  5. 三选一的三张牌面在灰阶测试下仍能靠图标轮廓区分
  6. 设置页任一开关改动在 1 次点击内完成，返回路径永远只需 1 次点击，且不丢未保存改动
- Non-goals (explicitly out of scope):
  - 情敌名录 / 酒壶升级 / 商店 / 排行榜的完整页面（仅保留入口与占位）
  - 联机、内购、账号云存档的支付与校验流程
  - 教学关、新手引导序列
  - 战斗特效与动效实现（本迭代只出静态视觉与状态定义）
  - 阿岚立绘、结局动画、九位普通情敌的独立立绘（以路线图节点 + 文字承载）

## Users & Scenarios

| Role | Goal | Key Scenario |
|---|---|---|
| New player | 一进来就知道这是什么游戏、怎么开始 | 首次进入首页，看到「老黄的战斗」、皮衣立绘与唯一主按钮「入江湖」 |
| Returning player | 接着上次的进度打，不重新开始 | 首页显示「断桥雪渡 · 九场之五」与「接着打」主按钮 |
| Story-driven player | 想知道下一个挡路的是谁、他凭什么 | 路线图点节点读台词，进对崎页听完再拔刀 |
| Hardcore player | 读意图、算气、拼流派 | 战斗页读敌人意图、规划气量；关底战应对阶段转换 |
| Non-paying collector | 本作无内购 | 三选一挑牌面，而不是抽卡包 |

## Functional Requirements

### P0 (Must)

| ID | Requirement | Page/System | Verification Criteria |
|---|---|---|---|
| PRD-01 | 首页展示游戏标识（竖排 LOGO + 朱砂印章）、皮衣立绘与双列题跋，构成第一眼识别 | `home` | LOGO / 题跋 / 立绘三者互不重叠；立绘边缘渐隐无硬边 |
| PRD-02 | 首页按存档状态显示主按钮：有存档=「接着打」，无存档=「入江湖」 | `home` | 两种状态文案与图标不同；有存档时附带「九场之五」进度 |
| PRD-03 | 首页顶部资源栏常驻银两 / 酒 / 声望，右上角为设置入口 | `home` | 三个资源数值与图标同排，设置入口触控区 ≥56px |
| PRD-04 | 战斗页展示敌方群体：每个敌人有血条与意图图标 | `battle` | 敌人数 1–3 时布局不塌；意图图标在同一水平线 |
| PRD-05 | 战斗页展示老黄血量、皮衣护盾、气、手牌 5 张、结束回合按钮 | `battle` / `boss-battle` | 五个信息块互不遮挡；结束回合为右下角唯一强动作 |
| PRD-06 | 战斗页战场中心区不被 UI 覆盖 | `battle` | 画面 33%–60% 高度区间仅出现飘字与刀光层 |
| PRD-07 | 战斗页支持暂停与直接进设置 | `battle` / `boss-battle` | 左上暂停、右上设置（boss 页为左上暂停），均为 56px 触控区 |
| PRD-08 | 路线图以四个节点呈现本关推进，节点状态区分已过 / 当前 / 未到 / 关底 | `map` | 当前节点为全页唯一朱砂实底；节点与名条不重叠 |
| PRD-09 | 路线图底部为当前目标卡：关名 + 情敌名 + 一句台词 + 奖励预览 + 拔刀 | `map` | 卡内四行信息不折行溢出；拔刀按钮 ≥300×76 |
| PRD-10 | 关底战前有对峙页，2–3 句台词，可跳过 | `rival-intro` | 台词区不遮挡人物；跳过入口常驻右上 |
| PRD-11 | 关底战使用独立 HUD：名条 + 四段刻度长血条 + 甲 / 阶段 / 意图 | `boss-battle` | 名条不压人物头部；血条与元信息同宽对齐 |
| PRD-12 | 关底战为单一目标，且护盾归零时显示「皮衣已破」 | `boss-battle` | 护盾行为朱砂并附 0 值；不与血量行混淆 |
| PRD-13 | 战后进入三选一：三张刀诀，可选中、可取、可跳过换酒 | `victory` | 三张卡面差异（图标 + 名称 + 费用）灰阶可辨；跳过只需一次点击 |
| PRD-14 | 设置页按「音画 / 操作 / 账号 / 其他」四组排列，每组一张宣纸卡片 | `settings` | 分组标题与细朱砂分隔线可见；行高 ≥88px |
| PRD-15 | 设置页顶部返回、底部版本号与恢复默认 | `settings` | 返回命中区 ≥56px；恢复默认需二次确认 |

### P1 (Important)

| ID | Requirement | Page/System | Verification Criteria |
|---|---|---|---|
| PRD-16 | 首页显示上一局流派标签（回锋 / 算力 / 皮衣） | `home` | 标签为印章样式，最多显示 3 个，当前流派带金箔描边 |
| PRD-17 | 战斗页层签显示「关 · 地点 ｜ 帮闲数 ｜ 回合」三段 | `battle` | 单行不折行；分隔线高度 26px |
| PRD-18 | 敌对单位意图数值用朱砂，防御用盾形图标 | `battle` | 三种意图（攻 / 防 / 蓄力）图标轮廓可区分 |
| PRD-19 | 路线图节点可点选并同步底部卡片 | `map` | 选中节点出现朱砂外环；卡片内容 120ms 内切换 |
| PRD-20 | 对峙页台词逐字机，点任意处加速 | `rival-intro` | 逐字 28ms/字；点击一次即刻全显 |
| PRD-21 | 三选一显示「本局已得」缩略牌与进度 | `victory` | 缩略牌 92×122，最多显示 4 张 + 计数文案 |
| PRD-22 | 三选一底部预告下一位情敌 | `victory` | 预告条含编号 + 称号 + 距离文案 |
| PRD-23 | 低气量时手牌置灰并提示「气不足」 | `battle` / `boss-battle` | 置灰牌仍可点击并弹出原因，不可静默失败 |
| PRD-24 | 首页 / 设置页断网态提示但不阻塞单机游玩 | `home` / `settings` | 顶部细条提示，3 秒自动收起 |
| PRD-25 | 设置页支持字号档位（标准 / 大）影响全局正文 | `settings` | 切换后另有预览行实时变化 |

### P2 (Optional)

| ID | Requirement | Page/System | Verification Criteria |
|---|---|---|---|
| PRD-31 | 情敌名录入口（占位 toast） | `home` | 点击后不跳空白页 |
| PRD-32 | 每日签到领酒 | `home` | 弹小层，不遮主按钮 |
| PRD-33 | 设置页「关于」展开制作者名单 | `settings` | 折叠展开不抖动布局 |
| PRD-34 | 路线图已过节点可回看该情敌的台词 | `map` | 回看不影响当前进度 |

## Information Architecture

- Primary navigation: 首页底部 `客栈 / 名录 / 酒壶 / 设置` 四项（本迭代仅客栈与设置可用，其余为置灰态）
- Progression path: `home` → `map` →（`battle` 帮闲战）→ `rival-intro` → `boss-battle` → `victory` → `map`
- Secondary entries: 首页右上齿轮（设置）、首页副按钮「开新局」「情敌名录」；路线图右上「回客栈」
- Overlays/Full-screen modals: 暂停确认层（battle / boss-battle）、开新局覆盖存档确认（home）、恢复默认确认（settings）、撤退确认（map）

## Page Delivery Scope (This Iteration)

| Page ID | Name | PRD Coverage | Image Generation Priority |
|---|---|---|---|
| `home` | 客栈首页 | PRD-01, 02, 03, 16, 24, 31, 32 | 1（基准页） |
| `map` | 上山路线图 | PRD-08, 09, 19, 34 | 2 |
| `battle` | 常规战（帮闲） | PRD-04, 05, 06, 07, 17, 18, 23 | 3 |
| `rival-intro` | 情敌对峙 | PRD-10, 20 | 4 |
| `boss-battle` | 关底情敌战 | PRD-05, 07, 11, 12, 23 | 5 |
| `victory` | 战后三选一 | PRD-13, 21, 22 | 6 |
| `settings` | 设置页 | PRD-14, 15, 24, 25, 33 | 7 |

## Copy & Localization

- Default language: 简体中文（zh-CN）
- Copy principles: 短句、半文半白、不堆感叹号；按钮 2–4 字；数值与单位之间留空格；喜剧感来自反差而非网络梗堆砌
- 台词字数上限：对峙页单句 ≤ 20 字（超出自动分页），卡片效果 ≤ 8 字，层签单段 ≤ 8 字
- Image generation strategy: 页面底图**不含任何文字**，全部中文文案由排版层叠加（水墨字体 AI 易糊），组件资产默认无字并保留排字留白

## Data Dependencies (Client-Visible)

| Data | Page | Empty/Error State |
|---|---|---|
| wallet（银两 / 酒 / 声望） | home, victory | 数值为 0 时显示 0，不隐藏；读取失败显示「—」 |
| run-progress（第几场 / 地点） | home, map, battle | 无存档时整块隐藏，主按钮切「入江湖」 |
| route.nodes[]（状态） | map | 节点数据缺失时整条路线置灰并提示「路还没通」 |
| rival.lines[] | rival-intro | 台词缺失时退化为一行摘要，不出现空台词框 |
| deck / hand | battle, boss-battle | 手牌为空时显示「无招可用」提示，仍可结束回合 |
| enemy-intent | battle, boss-battle | 意图未知（首回合）时显示问号墨点，不显示 0 伤害 |
| reward.picks[3] | victory | 不足三张时按实际数量居中排布，不补假卡 |
| audio-video settings | settings | 读取失败回落默认值并提示「已恢复默认」 |
| account | settings | 未登录显示「未入江湖」，绑定按钮为主按钮样式 |

## Boundaries & Exceptions

- Network failure: 单机核心流程不受影响；仅在首页/设置顶部细条提示，不做全屏遮挡
- Insufficient resources: 酒不足复活时提示「酒不够，再走一趟」，提供去签到路径
- Cooldown/Attempts exhausted: 无冷却墙；三选一可跳过换 1 酒，每局最多跳过 2 次
- Tutorial interruption: 无强制教学；首次入战以半透明墨字提示一次「点牌出招」，可点击穿透
- 跳过对峙：跳过不改变奖励与难度，仅少一段台词；名录里可回补阅读

## Verification Checklist

- [x] Every P0 requirement has a page or an explicit deferral note
- [x] Every must-have page has a primary action and an empty state
- [x] Monetization-related actions have a confirmation or feedback path（本作无付费，覆盖存档为破坏性动作，已定义确认层）
- [x] Consistent with the `gdd.md` core loop
- [x] No conflicts with the `interaction.md` state machine

## Revision History

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-11-13 | Initial draft：三页范围、P0 十条、水墨硬核风格取向 |
| 0.2 | 2026-11-13 | 扩到七页；加入路线图 / 情敌对峙 / 关底战 / 战后三选一；主角造型定为皮衣银发刀客；主线改为「九场桃花债」；新增皮衣护盾与「皮衣已破」规则 |
