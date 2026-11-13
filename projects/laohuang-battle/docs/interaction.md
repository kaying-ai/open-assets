# UI Interaction Logic

## Document Status

- status: approved
- version: 0.2
- owner: feng
- last_updated: 2026-11-13

> 页面提示词必须引用本文件的主流程与状态名：`default` / `loading` / `error` / `victory` / `defeat` / `paused` / `dirty` / `picking` / `selected` / `skipped`。

## Global Interaction Principles

- Touch targets: 主按钮高 84px；次级按钮 56px；图标类入口最小触控区 56×56px；路线节点 84px（关底 104px）
- Feedback hierarchy: 按下态（压暗 14% + 顶缘内阴影，轮廓不变）→ 结果反馈（飘字 / 震屏）→ 错误提示（宣纸窄条，2.4 秒收起）
- Primary actions stronger than secondary; destructive actions require confirmation（开新局覆盖存档、恢复默认、撤退认输）
- Motion: 快 120ms / 常速 220ms；毛笔笔锋擦入为主，禁用弹跳与回弹；系统开启「减少动态效果」时全部降为淡入
- Copy: 短文本，按钮 2–4 字；组件资产无字，文案运行时叠加
- 叙事原则：所有情敌都得先「说一句」再动手；跳过永远允许，且不影响奖励

## Global Navigation

```text
首页（客栈）为根；上山路线图是推进中枢；战斗 / 对峙 / 结算为沉浸全屏（无底部导航）；设置为二级页（顶部返回）
底部导航仅在首页出现，四项：客栈 / 名录 / 酒壶 / 设置
推进链：home → map → battle(帮闲) → rival-intro → boss-battle → victory → map
```

| Entry | Target Page | Highlight Rule | Badge Rule |
|---|---|---|---|
| 客栈（底部第 1 项） | `home` | 当前页为墨色实心图标 + 朱砂下划线 | 无 |
| 名录（底部第 2 项） | 情敌名录（未交付） | 置灰，点击 toast「名录还在刻版」 | 有新情敌未读时朱砂小点 |
| 酒壶（底部第 3 项） | 酒壶升级（未交付） | 置灰，点击 toast「酒壶还在烧」 | 有可升级项时朱砂小点 |
| 设置（底部第 4 项） | `settings` | 当前页为墨色实心图标 + 朱砂下划线 | 无 |
| 首页右上齿轮 | `settings` | 与底部第 4 项同一目标，不重复高亮 | 无 |
| 战斗右上齿轮 | `settings`（以覆盖层形式，保留战斗状态） | 战斗内不显示底部导航 | 无 |
| 路线图右上「回客栈」 | `home` | — | 无 |

## Global States

| State | Trigger | UI Behavior | Recovery |
|---|---|---|---|
| loading | 冷启动 / 读档 | 宣纸底色 + 中央墨点晕开 + 「磨刀中」 | 就绪后淡入页面，≤1.2s |
| offline | 无网络 | 顶部 6px 墨条 + 窄条提示「断网了，不影响打」 | 3 秒自动收起；恢复网络时不再提示 |
| low-currency | 酒 < 2 且试图复活 | 复活按钮置灰 + 文案「酒不够，再走一趟」 | 提供「去签到」次按钮 |
| reduced-motion | 系统设置 | 所有位移/缩放改为 120ms 淡入 | 自动跟随系统 |

---

## Per-Page Interaction

### `home` (客栈首页)

- Purpose: 3 秒内确认「我打到第几位情敌、还剩多少酒、下一步点哪」
- Entry from: 冷启动、`map` 回客栈、`settings` 返回、底部导航「客栈」
- Exit to: `map`（主按钮）、`settings`（齿轮/底栏）、情敌名录（占位）

#### Main Flow

```text
进入 → 看到 LOGO / 皮衣立绘 / 进度木牌 / 资源条 → 点「接着打」→ 载入路线图 → 走到当前节点
                                            ↘ 点「开新局」→ 覆盖存档确认 → 第一关起点
```

#### Controls & Behavior

| Control | Action | Precondition | Success Result | Failure/Empty State |
|---|---|---|---|---|
| 接着打（主按钮） | tap | 存在存档 | 进入 `map`，当前节点高亮 | 读档失败 → 提示「存档坏了，只能重来」并提供「开新局」 |
| 入江湖（主按钮，无存档态） | tap | 无存档 | 进入第一关起点 `map` | — |
| 开新局（次按钮） | tap | 任意 | 弹覆盖确认；确认后从第一位情敌开始 | 取消则原样关闭，不改存档 |
| 情敌名录（次按钮） | tap | 任意 | toast「名录还在刻版」 | — |
| 资源栏·酒 | tap | 任意 | 展开酒获取路径小层 | — |
| 设置齿轮 | tap | 任意 | 跳 `settings` | — |
| 底部导航置灰项 | tap | 未交付页 | toast 说明 | 不跳空白页 |

#### State Machine

| State | Visible Content | Available Actions | Transition Condition |
|---|---|---|---|
| `default`（有存档） | LOGO / 立绘 / 木牌「断桥雪渡 · 九场之五」/ 资源条 / 接着打 | 接着打、开新局、名录、设置 | 点接着打 → `map` |
| `new-run`（无存档） | 主按钮文案变「入江湖」，木牌显示「未入江湖」 | 入江湖、名录、设置 | 点入江湖 → `map` |
| `confirm-overwrite` | 遮罩 + 宣纸确认层「旧局就此作废」 | 确认 / 取消 | 确认 → 新局；取消 → 回 `default` |
| `loading` | 墨点晕开 | 无 | 读完档 → `default` |
| `error` | 存档损坏窄条 + 主按钮降级 | 开新局、设置 | 开新局 → `map` |

#### Modal / Confirmation

| Scenario | Copy Points | Confirm | Cancel |
|---|---|---|---|
| 开新局覆盖存档 | 「旧局就此作废，悔不了。」 | 就是重来（主按钮） | 再想想（次按钮） |
| 酒不足 | 「酒不够，再走一趟。」 | 去签到（主按钮） | 知道了 |

#### Constraints vs. Visual Draft

- Info that must be visible on first screen: LOGO、皮衣立绘、第几位情敌、银两/酒、主按钮
- Regions that must not be covered: 立绘头部与右手比划（画面 15%–40% 高度）；右侧竖排 LOGO 与双列题跋（x > 58%）
- Primary action to emphasize: 「接着打」朱砂实底印章按钮，是全页唯一饱和色块

---

### `map` (上山路线图)

- Purpose: 看清「打到第几个、下一个是谁、能拿什么」，并决定继续上山或撤回客栈
- Entry from: `home` 主按钮、`victory` 的「接着往山上走」、`battle` 撤退后
- Exit to: `battle`（帮闲战）、`rival-intro`（关底）、`home`

#### Main Flow

```text
进入 → 四个节点自下而上（四 / 五 / 六 / 庄）→ 当前节点高亮 → 点其他节点看详情
→ 点「拔刀」→ 关底 = rival-intro；普通 = battle → 战毕回本页，节点状态推进一格
```

#### Controls & Behavior

| Control | Action | Precondition | Success Result | Failure/Empty State |
|---|---|---|---|---|
| 路线节点 | tap | 节点未锁定 | 节点朱砂外环，底部卡片 120ms 内换成该情敌 | 锁定节点 → 抖一下 + 飘字「路还没通」 |
| 拔刀（主按钮） | tap | 当前节点 | 关底进 `rival-intro`，其余进 `battle` | 该节点已过 → 按钮变「再打一遍」（不结算奖励） |
| 回客栈（次按钮） | tap | 任意 | 回 `home`，进度已保存 | — |
| 返回箭头（左上） | tap | 任意 | 回 `home` | — |
| 头目节点 | tap | 前三个节点已过 | 可查看并拔刀 | 未满足 → 名条显示「先过前三场」 |

#### State Machine

| State | Visible Content | Available Actions | Transition Condition |
|---|---|---|---|
| `default` | 路线 + 当前节点 + 目标卡 | 点节点、拔刀、回客栈 | 拔刀 → `battle` / `rival-intro` |
| `node-selected` | 目标卡换为所选情敌 | 拔刀、取消选中 | 点空白 → 回 `default` |
| `all-cleared` | 头目节点换「已破」印，主按钮切「下山」 | 下山、回客栈 | 下山 → 结局 |
| `offline` | 顶部细条 | 照常行走 | 网络恢复 → 自动结算奖励 |

#### Modal / Confirmation

| Scenario | Copy Points | Confirm | Cancel |
|---|---|---|---|
| 点已过节点重打 | 「再打一遍，不另给东西。」 | 打（主按钮） | 算了 |

#### Constraints vs. Visual Draft

- Info that must be visible on first screen: 四个节点状态、当前目标卡（谁 + 一句台词 + 奖励）、拔刀
- Regions that must not be covered: 山道中线（x 30%–60%）上四个节点周围 100px；标题区 y < 220px
- Primary action to emphasize: 当前节点的朱砂实底 + 底部拔刀主按钮，二者是全页唯二饱和色

---

### `battle` (常规战 · 帮闲)

- Purpose: 一屏内读懂敌我状态并做出一次出招决策；打的是情敌的帮闲
- Entry from: `map` 的普通节点
- Exit to: `victory`（清场）、`map`（撤退）

#### Main Flow

```text
进入（己方回合）→ 读敌方意图 → 点手牌（扣气）→ 结算伤害/飘字 → 气尽或点结束回合
→ 敌方回合（意图兑现）→ 回到己方回合 ⟳ → 敌人全灭 = victory / 老黄血空 = defeat
```

#### Controls & Behavior

| Control | Action | Precondition | Success Result | Failure/Empty State |
|---|---|---|---|---|
| 手牌卡（5 张） | tap | 气 ≥ 牌费 | 出招，扣气，牌飞向目标 | 气不足 → 置灰 + 抖一下 + 「气不足」飘字，不静默吞点击 |
| 结束回合 | tap | 己方回合 | 进入敌方回合 | 敌方回合中置灰 |
| 暂停（左上） | tap | 战斗进行中 | 弹确认层：继续 / 去设置 / 撤退 | — |
| 设置齿轮（右上） | tap | 战斗进行中 | 覆盖式打开设置，回来自动续战 | — |
| 敌人（点选目标） | tap | 多敌时 | 高亮目标 + 意图解析小字 | 单敌时自动锁定，不显示点选态 |
| 皮衣护盾行 | tap | 护盾 > 0 | 显示「还可挡 6 点」小层 | 护盾 0 → 显示「皮衣已破」，点击提示如何重铸 |
| 酒·复活 | tap | 阵亡且酒 ≥ 2 | 回半血续战（每局 1 次） | 酒不足 → 见 low-currency |

#### State Machine

| State | Visible Content | Available Actions | Transition Condition |
|---|---|---|---|
| `player-turn` | 敌方意图、手牌、气、结束回合 | 出牌、结束回合、暂停 | 气尽/点结束 → `enemy-turn` |
| `enemy-turn` | 手牌锁定（降饱和）、敌方高亮 | 暂停 | 意图结算完 → `player-turn` |
| `victory` | 转场到 `victory` 页 | 选牌、跳过换酒 | 选牌/跳过后 → `map` |
| `defeat` | 「刀断了」+ 本次战果 | 复活（酒）、重开、回客栈 | 重开 → `map` |
| `paused` | 半透明墨罩 + 三按钮 | 继续、去设置、撤退 | 继续 → 原回合 |
| `low-ap` | 手牌置灰，仅结束回合可点 | 结束回合 | 回合切换 → 恢复 |

#### Modal / Confirmation

| Scenario | Copy Points | Confirm | Cancel |
|---|---|---|---|
| 暂停/撤退 | 「走也可以，这趟就算白跑。」 | 撤退（danger） | 继续打（primary） |
| 阵亡复活 | 「还有一口气，喝一口？」（消耗 2 酒） | 喝（primary） | 认了（secondary） |

#### Constraints vs. Visual Draft

- Info that must be visible on first screen: 敌数与其意图、敌人血条、老黄血条 + 皮衣、气、手牌、结束回合
- Regions that must not be covered: 画面 33%–60% 高度（刀光与飘字区）；敌人血条正上方 16px；老黄头部
- Primary action to emphasize: 手牌区纸白最亮、结束回合朱砂实底；敌方意图用朱砂红最醒目
- 明暗约束：本页地面是亮雪，底部 HUD 用墨字 + 纸白小牌，禁止直接反白

---

### `rival-intro` (情敌对峙)

- Purpose: 两三句台词交代「这人是谁、为什么挡路、他的脾气」，并给出「拔刀 / 听完」两条路
- Entry from: `map` 的关底节点
- Exit to: `boss-battle`（拔刀）、`map`（返回）

#### Main Flow

```text
进入 → 情敌说一句（逐字机）→ 老黄回一句 → 第三句（可选）→ 拔刀 → boss-battle
                                                    ↘ 跳过（右上）→ 直接 boss-battle
```

#### Controls & Behavior

| Control | Action | Precondition | Success Result | Failure/Empty State |
|---|---|---|---|---|
| 画面任意处 | tap | 台词推进中 | 当前句立刻全显 | 已全显 → 进下一句 |
| 拔刀（主按钮） | tap | 任意时刻 | 进 `boss-battle`，跳过剩余台词 | — |
| 听他念完（次按钮） | tap | 未到末句 | 推进下一句，按钮文案变「没别的了」 | 到末句 → 置灰 |
| 跳过（右上） | tap | 任意 | 直接进 `boss-battle`，标记 `skipped` | — |
| 返回箭头（左上） | tap | 任意 | 回 `map`，不消耗进度 | — |

#### State Machine

| State | Visible Content | Available Actions | Transition Condition |
|---|---|---|---|
| `line-1` | 情敌首句 + 性格标签 | 点继续、拔刀、跳过 | 点继续 → `line-2` |
| `line-2` | 情敌二句 + 老黄回话 | 点继续、拔刀、跳过 | 点继续 → `line-3` |
| `line-3` | 情敌末句（可无） | 拔刀、跳过 | 拔刀 → `boss-battle` |
| `skipped` | 直接转场 | — | → `boss-battle` |

#### Modal / Confirmation

无。对峙页不设二次确认——「拔刀」本身就是确认。

#### Constraints vs. Visual Draft

- Info that must be visible on first screen: 情敌姓名与性格、当前句台词、拔刀入口
- Regions that must not be covered: 左侧老黄剪影（x < 22%）、右侧情敌立绘（x > 66%）、中部雪地（y 55%–62%）
- Primary action to emphasize: 台词卡是全页最亮面，拔刀是唯一朱砂实底
- 二次进入：已读过的情敌默认折叠为一行摘要，需点「听他念完」才展开（满足 PRD-20）

---

### `boss-battle` (关底情敌战)

- Purpose: 把「打情敌」和「打杂兵」在视觉与规则上一刀切开
- Entry from: `rival-intro` 拔刀；`battle` 第三回合后情敌入场（可选）
- Exit to: `victory`（胜）、`map`（败/撤退）

#### Main Flow

```text
进入 → 名条落下 + 长血条亮起 → 读「蓄力 28」→ 出招破甲 → 阶段二 → 击败 → victory
```

#### Controls & Behavior

与 `battle` 一致，差异项：

| Control | Action | Precondition | Success Result | Failure/Empty State |
|---|---|---|---|---|
| 头目名条 | tap | 任意 | 展开阶段与已知招式小层（已交手 1 回合后可用） | 首回合点击 → 「还没摸清他的路数」 |
| 阶段指示 | 自动 | 血量跨过 50% | 全屏墨闪 1 帧 + 名条朱砂闪，嘲讽换词 | — |
| 皮衣护盾行 | tap | 护盾 0 | 提示「皮衣破了，找张『皮衣』重铸」 | 无「皮衣」类牌 → 提示「这趟没带针线」 |

#### State Machine

| State | Visible Content | Available Actions | Transition Condition |
|---|---|---|---|
| `phase-1` | 名条 + 长血条 100%–50% | 出牌、结束回合、暂停 | 血量 < 50% → `phase-2` |
| `phase-2` | 长血条过半、甲 +20、意图变「蓄力」 | 同上 | 血量 0 → `victory` |
| `enraged` | 血条进入「残」态（填充转金箔）、嘲讽最强 | 同上 | 血量 0 → `victory` |
| `victory` | 转场 `victory` | 选牌 | — |
| `defeat` | 「刀断了」 | 复活、重开、回客栈 | 重开 → `map` |

#### Modal / Confirmation

| Scenario | Copy Points | Confirm | Cancel |
|---|---|---|---|
| 暂停/撤退 | 「他还在那儿站着。」 | 撤退（danger） | 继续打（primary） |

#### Constraints vs. Visual Draft

- Info that must be visible on first screen: 头目名与身份、长血条、甲/阶段/意图、老黄血与皮衣、手牌、结束回合
- Regions that must not be covered: 情敌头部（y 16%–20%）、墨色空场（y 50%–78%）
- Primary action to emphasize: 长血条 + 名条构成「他很大」的第一印象；玩家侧手牌用纸白提亮

---

### `victory` (战后三选一)

- Purpose: 让胜利的爽感落在「拿走他一样东西」上
- Entry from: `battle` 清场 / `boss-battle` 击败
- Exit to: `map`（接着上山）、`home`（回客栈）

#### Main Flow

```text
进入 → 看「胜」印与战果 → 三张刀诀 → 点一张（抬升 + 其余降饱和）→ 取此诀 → 回 map，节点推进
                                                    ↘ 换一壶酒（跳过）→ 回 map，酒 +1
```

#### Controls & Behavior

| Control | Action | Precondition | Success Result | Failure/Empty State |
|---|---|---|---|---|
| 刀诀卡 | tap | 未确认 | 该卡抬升 8px + 朱砂外环 + 「已选」标，其余降饱和 35% | 已确认 → 卡片不再响应 |
| 取此诀（主按钮） | tap | 已选一张 | 入牌组 + 飘字「入袋」，回 `map` | 未选 → 抖一下 + 「先挑一张」 |
| 换一壶酒（次按钮） | tap | 未确认 | 酒 +1 飘字，回 `map` | 酒已达上限 5 → 置灰 + 「壶满了」 |
| 本局已得缩略牌 | tap | 任意 | 展开牌组小层（只读） | — |
| 下一位预告条 | tap | 任意 | 回 `map` 并高亮下一个节点 | 已是头目 → 文案「过了他，就剩她」 |

#### State Machine

| State | Visible Content | Available Actions | Transition Condition |
|---|---|---|---|
| `picking` | 三张卡，无选中 | 选卡、跳过 | 点卡 → `selected` |
| `selected` | 选中卡外环 + 「已选」 | 取此诀、改选、跳过 | 取此诀 → `map` |
| `skipped` | 「+1 壶酒」飘字 | — | 动画完 → `map` |

#### Modal / Confirmation

| Scenario | Copy Points | Confirm | Cancel |
|---|---|---|---|
| 跳过三选一 | 「不要也行，换一壶酒。」 | 换酒（primary） | 还是看看（secondary） |

#### Constraints vs. Visual Draft

- Info that must be visible on first screen: 胜印 + 战果、三张牌面、取此诀
- Regions that must not be covered: 三张卡面（y 27%–54%）；按钮行（y 67%–75%）
- Primary action to emphasize: 三张卡是全页最高对比；选中卡用朱砂外环，不靠放大尺寸

---

### `settings` (设置页)

- Purpose: 在不迷路的前提下调完就走
- Entry from: 首页齿轮 / 底部导航「设置」/ 战斗内齿轮（覆盖层）
- Exit to: 来源页（返回）

#### Main Flow

```text
进入 → 四组卡片（音画 / 操作 / 账号 / 其他）→ 改动即时生效 → 点返回离开
```

#### Controls & Behavior

| Control | Action | Precondition | Success Result | Failure/Empty State |
|---|---|---|---|---|
| 返回（左上毛笔箭头） | tap | 任意 | 回来源页，改动已保存 | 保存失败 → 窄条「没存住，再点一次」 |
| 音乐 / 音效滑块 | drag | 任意 | 实时生效 + 右侧数值 | — |
| 画质（高/中/低） | tap 分段 | 任意 | 生效并在下一场应用 | 低端机默认「中」 |
| 震动开关 | tap | 任意 | 即时切换 | 设备无马达 → 置灰 + 「此机无感」 |
| 字号（标准/大） | tap | 任意 | 全局正文 + 预览行同步放大 | — |
| 恢复默认 | tap | 有任何改动 | 二次确认后重置 | 无改动时置灰 |
| 账号·绑定 | tap | 未登录 | 走登录流程（本迭代占位） | — |

#### State Machine

| State | Visible Content | Available Actions | Transition Condition |
|---|---|---|---|
| `default` | 四组卡片 + 版本号 | 返回、改设置 | 改动 → `dirty` |
| `dirty` | 同上 + 返回处小朱砂点 | 返回（自动保存） | 保存完 → `default` |
| `confirm-reset` | 宣纸确认层 | 确认重置 / 取消 | 确认 → `default` |
| `error` | 底部窄条 | 重试 | 重试成功 → `default` |

#### Modal / Confirmation

| Scenario | Copy Points | Confirm | Cancel |
|---|---|---|---|
| 恢复默认 | 「全部回到出厂，包括音量。」 | 恢复（danger） | 算了（secondary） |

#### Constraints vs. Visual Draft

- Info that must be visible on first screen: 标题「设置」、返回、四组标题、版本号
- Regions that must not be covered: 顶部标题条（0–12% 高度）；底部版本号条
- Primary action to emphasize: 无强主动作；强调分组层次与朱砂细线，弱化按钮存在感

---

## Cross-Page Flows

1. `home` →(接着打)→ `map` →(点节点 + 拔刀)→ `battle` →(清场)→ `victory` →(取诀)→ `map`（节点推进）
2. `map` →(关底节点)→ `rival-intro` →(拔刀)→ `boss-battle` →(击败)→ `victory` → `map`（进下一关）
3. `map` →(回客栈)→ `home` →(齿轮)→ `settings` →(返回)→ `home`
4. `battle` / `boss-battle` →(右上齿轮)→ `settings` 覆盖层 →(返回)→ 原回合（状态保留）
5. `boss-battle` →(defeat)→ `map`（该关底节点回到「未到」，已过节点保留）
6. `home` →(开新局)→ 确认层 → `map`（第一关起点，九场归零）

## Verification

- [x] Every must-have page has a main flow and at least one failure/empty state
- [x] Navigation highlight and badge rules are actionable
- [x] Destructive and payment-related actions have a confirmation path
- [x] Page generation prompts can reference the primary actions and state names in this file
- [x] 叙事链闭环：map → rival-intro → boss-battle → victory 四页共用同一 `rival` 数据对象
