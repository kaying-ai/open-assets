# UI Task List

## Planning & Requirements (First Step)

- [x] [product] Complete and approve `gdd.md` (game design doc) — v0.2：九场桃花债主线 / 皮衣护盾 / 三位关底情敌
- [x] [product] Complete and approve `prd.md` (product requirements) — P0 十五条 + 七页范围
- [x] [product] Complete and approve `interaction.md` (UI interaction logic) — 七页状态机 + 推进链
- [x] [product] 人物设定：老黄造型改为「黑皮衣 + 银白背头 + 细框眼镜 + 中年身形」的致敬式语汇（非真人肖像）

## Spec

- [x] [spec] Complete project positioning and verification criteria
- [x] [spec] Analyze reference images and record visual abstraction — 无参考图，改为「水墨册页构图 + 硬核 HUD 惯例」抽象
- [x] [spec] Freeze the style contract — 宣纸 #E9DFC6 / 墨 #191512 / 朱砂 #B23A28 / 金 #B98A3C
- [x] [spec] 补两条可读性规则 — 「底亮则字墨、底暗则字白」「皮衣为全站唯一纯黑块面」

## UI Extension

- [x] [extension] Build the player journey — 客栈 → 上山路线 → 遭遇 → 三选一 → 继续上山 → 关底
- [x] [extension] Select screens and mark priorities — 七页全部 must-have
- [x] [extension] Complete states, edge cases, and dependencies — 新增 4 页共 17 个状态，含节点锁定、台词跳过、阶段转换、壶满

## Page Visuals

- [x] [page] Generate the first page plan — `home` 作为基准页
- [x] [page] Generate or register the first page visual draft — `assets/pages/home-v2.png`（皮衣立绘版）
- [x] [page] 第二批：`map` — `assets/pages/map-v1.png`
- [x] [page] 第三批：`battle` — `assets/pages/battle-v2.png`（亮雪底 + 墨字 HUD）
- [x] [page] 第四批：`rival-intro` — `assets/pages/rival-v1.png`
- [x] [page] 第五批：`boss-battle` — `assets/pages/boss-v1.png`
- [x] [page] 第六批：`victory` — `assets/pages/victory-v1.png`
- [x] [page] Complete page review — 七页逐页截图复核，修掉层签折行 / 手牌压字 / 缩略卡被裱边压住等 9 处问题

## Component Breakdown

- [x] [component] Build the component list — 9 个组件（6 个可点击，均含 pressed）
- [x] [component] Generate or register standalone assets — 15 张透明 PNG
- [x] [component] Check transparent backgrounds and clean edges — 15/15 带 alpha，无白边

## Sprite Sheet Slicing

- [~] [sprite] Register the component sprite sheet and slicing parameters — **跳过**：组件为一文件一资产，无精灵表原图
- [~] [sprite] Export single-element transparent PNGs — **不适用**（资产已独立产出）
- [~] [sprite] Check for mis-slices and generate the ZIP package — **不适用**

## Atlas & Engine Delivery

- [x] [atlas] Map auto-generated indices to semantic names — `control-primary-default` 等 15 个语义名
- [x] [atlas] Review 9-slice and generate the Atlas — 2048×1024，边距 24/18/28/6/30/8
- [x] [export] Generate target engine JSON handoff — godot / unity / cocos / generic / taptap-maker（29 份清单）

## Verification

- [x] [qa] Update the asset manifest — 22 条（7 页面 + 15 组件）
- [x] [qa] Complete quickstart — `quickstart.md` 含 8 条已知限制
- [x] [qa] Run `kui validate` — ok: true, exit 0, 0 error / 0 warning
