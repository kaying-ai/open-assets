# UI Implementation Plan

## Project Overview

- Project ID: `laohuang-battle`
- Goal: 交付《老黄的战斗》七张 1080×1920 页面视觉 + 一套可复用组件资产 + 图集与引擎交接 JSON
- Current phase: 阶段 8 完成（7 页 / 9 组件 15 张资产 / 图集 / 引擎包全部落地，`kui validate` 0 error 0 warning）

## Phases

1. Planning (first step): approve `gdd.md` / `prd.md` / `interaction.md` — **已完成（default 模式自动通过）**
2. Spec: complete `style-contract.yaml` — **已完成**
3. Extension: complete the screen map and `screen-contract.yaml` — **已完成（7 页）**
4. Pages: 生成、质检、登记七张页面视觉稿 — **已完成**
5. Breakdown: 从已通过的页面产出独立组件资产（含按下态）— **已完成（9 个组件 / 15 张资产）**
6. Sprite sheet: 本迭代组件为独立文件产出，跳过精灵表切片（记录于 `quickstart.md`）— **已跳过并记录**
7. Asset delivery: 语义命名 + 9-slice → Atlas → 引擎 JSON — **已完成（2048×1024 图集 + 5 个引擎目录）**
8. Verification: `kui validate` + 复现说明 — **已完成（0 error / 0 warning）**

## Revision Round 2（v0.2 · 桃花债）

第二轮把「三页」扩成「七页」，并换掉人物与主线。改动落在四处：

| 改动 | 前 | 后 | 影响文件 |
|---|---|---|---|
| 主角造型 | 旧斗篷、雁翎刀、风雪刀客 | 黑皮衣、银白背头、细框眼镜、算力刀；致敬式造型语汇，非真人肖像 | `home` / `battle` 底图与立绘排布、`style-contract` 材质条 |
| 主线 | 雪夜连挑九场（无动机） | 九场桃花债：山脚茶棚的阿岚被少庄主抬上山，老黄从山脚打到山顶 | `gdd` / `prd` / `interaction` 全量改写 |
| 新增系统 | 无 | 皮衣护盾（破甲显示「皮衣已破」）、关底情敌阶段转换、情敌对峙台词 | `gdd` 系统表 + 四张新页契约 |
| 页面数 | 3 | 7（新增 `map` / `rival-intro` / `boss-battle` / `victory`） | `screen-contract` / `asset-manifest` / `sprite-contract` / `component-contract` |

## Screen Roadmap

| # | Page ID | Page | Module | Priority | Dependencies | Status |
|---:|---|---|---|---|---|---|
| 1 | `home` | 客栈首页 | core | must-have | - | approved (v2) |
| 2 | `map` | 上山路线图 | core | must-have | `home`（视觉基准） | approved |
| 3 | `battle` | 常规战（帮闲） | core | must-have | `home` | approved (v2) |
| 4 | `rival-intro` | 情敌对峙 | core | must-have | `battle`（HUD 语汇） | approved |
| 5 | `boss-battle` | 关底情敌战 | core | must-have | `battle`（同系统换装） | approved |
| 6 | `victory` | 战后三选一 | core | must-have | `boss-battle`（战果承接） | approved |
| 7 | `settings` | 设置页 | support | must-have | `home`（组件复用） | approved |

## Page Generation Batches

- Batch 1（基准页）：`home` — 先立竖排 LOGO、皮衣立绘、双列题跋、朱砂主按钮四件事，作为后续页面的对照基准
- Batch 2（推进页）：`map` — 验证长卷底图上的节点可读性与「当前节点唯一朱砂」规则
- Batch 3（战斗页）：`battle` → `boss-battle` — 同一战斗系统的两种 HUD 密度；本批确立了「亮雪底用墨字」的可读性规则
- Batch 4（叙事页）：`rival-intro` — 左右压边、中部留白的对峙构图
- Batch 5（结算页）：`victory` — 继承 `map` 底图做重度纸雾化，验证「三张同类卡不靠放大也能选中」
- Batch 6（表单页）：`settings` — 沿用 v1，仅随新设定微调文案

## Component Breakdown Scope

- First approved page: `home`
- Reusable components（跨七页）：
  - `btn-primary`（control，可点击，default + pressed）
  - `btn-secondary`（control，可点击，default + pressed）
  - `panel-card`（container，宣纸卡片，9-slice 24/24/24/24）
  - `bar-hp`（container，血条，9-slice 12/12/12/12）
  - `bar-boss`（container，头目长血条 1000×22，四段刻度）
  - `card-skill-lg`（container，三选一大卡 300×400，default + pressed）
  - `route-node`（control，路线节点 110×110，default + pressed）
  - `icon-settings`（icon，可点击入口，default + pressed）
  - `icon-back`（icon，可点击入口，default + pressed）
- Page-specific components（不单独出图，运行时绘制）：`hero-portrait`、`logo-seal`、`card-skill`（手牌）、`enemy-intent`、`ap-pips`、`ap-chip`、`shield-row`、`dialog-script`、`route-sheet`、`row-setting`、`slider`、`segmented`、`toggle-switch`、`nav-bar`

## Quality Gates

- [x] `gdd.md` / `prd.md` / `interaction.md` approved（default 模式自检通过后自动置 approved）
- [x] `spec.md` has no blocking open items
- [x] Style contract fields complete（含「底亮则字墨」与「皮衣为唯一纯黑块面」两条新规则）
- [x] Page IDs consistent with the screen contract（7/7）
- [x] Breakdown allowed only after page approval
- [x] All assets registered in the manifest（22 条：7 页面 + 15 组件资产）
- [x] Validation script passes（`kui validate` → ok: true, exit 0, 0 warning）
