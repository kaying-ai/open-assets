# Project Reproduction & Verification

## Project

- Project ID: `laohuang-battle`
- Game: 《老黄的战斗》— 竖屏 9:16 单机肉鸽卡牌构筑（水墨硬核 + 中年皮衣喜剧）
- Current deliverable version: `v2`（七页视觉 + 9 组件 15 资产 + 图集 + 引擎 JSON + Web 预览包）

## Execution Mode

- Current mode: `default`
- Selection time: 2026-11-13 15:52 (GMT+8)
- Selected by: startup gate（用户未指定审核模式 → 按默认 `default` 执行；只就「平台比例 / 视觉风格」两项阻塞信息征询过一次）
- Notes: 未切换到 `review`。用户确认了「竖屏 9:16 手机」+「中式水墨硬核」，其余取可调默认值；v2 的造型与剧情改动由用户在同一会话内直接指定（黄仁勋式造型 + 情敌对战）。

### Gate Log

- `default` mode 启动（15:52）：未指定模式，按 fallback 用 `default`，不打断流程。
- `default-mode auto-closed stage-1 product-design`：三文档交叉校验通过（core loop ⊆ prd 页面范围、P0 ⊆ interaction 分页、破坏性操作有确认路径），置 `status: approved`。
- `default-mode auto-closed stage-2 specify`：`spec.md` 无阻塞未决项；`research.md` 记录风格抽象与版权约束。
- `default-mode auto-closed stage-3 specification`：`style-contract.yaml` 全字段有显式值（含 `colors.pressed` 与 `tokens.interaction` 两态参数），置 `status: approved`。
- `default-mode auto-closed stage-4 extension`：v1 三屏 → v2 七屏；新增 `map` / `rival-intro` / `boss-battle` / `victory`，均补齐 purpose / 状态 / 边界 / 数据依赖。
- `default-mode auto-closed stage-5 page`：七页均通过质量自检（主行动唯一、比例与安全区正确、控件两态齐备、中文可读、无遮挡），置 `approved: true`。
- `default-mode auto-closed stage-6 component`：来源页 `home` 已通过，9 组件全部出图，6 个可点击控件均有 `default` + `pressed`。
- `stage-7 split` **显式跳过**：组件为「一文件一资产」直接渲染，不存在精灵表原图，故不执行 `kui split`；`sprite-contract.yaml` 的 `source.sheet_path` 留空、`status: draft`，仅用其 `items` 供 `kui atlas` 打包。
- `default-mode auto-closed stage-8 atlas+export`：9-slice 边距按用途给定（按钮 24/18、卡片 28/30、血条 6/8），图集 2048×1024，5 个引擎目录齐备（29 份清单）。
- `default-mode auto-closed stage-8b web`：`kui web` 生成 `index.html` / `result.html` / `exports/web/`，7 页 15 sprite。
- `stage-9 validate`：`kui validate specs/laohuang-battle` → `ok: true`，`exit_code: 0`，0 error / 0 warning。

## Inputs

- Design doc: `gdd.md`（九场桃花债、皮衣护盾、三位关底情敌、银两/酒/声望经济）
- Product requirements: `prd.md`（P0 十五条、七页范围、边界与异常）
- Interaction logic: `interaction.md`（七页主流程、控件表、状态机、推进链）
- Requirements file: `spec.md`
- Research notes: `research.md`
- Visual contract: `contracts/style-contract.yaml`
- Screen contract: `contracts/screen-contract.yaml`
- Component contract: `contracts/component-contract.yaml`
- Sprite/atlas/export contracts: `contracts/sprite-contract.yaml` / `atlas-contract.yaml` / `export-contract.yaml`
- 提示词：`prompts/pages/*.md`（7 份）、`prompts/components/*.md`（9 份）

## Reproduction Steps

```bash
# 0) 在仓库根目录（specs 的上一级）
cd <workspace>

# 1) 校验（应输出 ok: true, exit 0）
node "<kaying-for-ui>/scripts/main.mjs" validate specs/laohuang-battle

# 2) 重渲染页面（美术底图已存在，仅重排版）
#    底图：render/art/{home2,battle2,map,rival,boss,settings}-art.png
#    均为 ImageGen 产出，已用 render/prep-art.mjs 去掉模型自带的印章与右下角水印
./specs/laohuang-battle/render/shot.sh \
  "$PWD/specs/laohuang-battle/render/pages/home.html" \
  "$PWD/specs/laohuang-battle/assets/pages/home-v2.png"
# 同理 map / battle / rival-intro / boss-battle / victory / settings（1080×1920）

# 3) 重渲染组件（透明底，15 张）
./specs/laohuang-battle/render/shot.sh \
  "$PWD/specs/laohuang-battle/render/components/btn-primary.html" \
  "$PWD/specs/laohuang-battle/assets/components/btn-primary-default-v1.png" 600 84 transparent
# pressed 态在 URL 后加 ?pressed，参数同上

# 4) 图集 → 引擎 → Web（已存在输出时加 --force）
node "<kaying-for-ui>/scripts/main.mjs" atlas specs/laohuang-battle --force
node "<kaying-for-ui>/scripts/main.mjs" export specs/laohuang-battle --force
node "<kaying-for-ui>/scripts/main.mjs" web specs/laohuang-battle --force

# 5) 打包到分发规格（提交 open-assets 前；依赖 Pillow，幂等可重跑）
#    a. 页面图 256 色量化：24-bit 每张 3.4–4.0MB → ~1.2–1.7MB（≤3MB 预算）
#       实测 p99 通道误差 ≤11/255，水墨画面视觉无损；原件在 render/art 可重渲染回滚
#    b. 生成 assets/sprites/ui-components/（items + sprite-manifest.yaml，数据源自 ui-main.json）
#    c. 生成 packages/ui-components-png.zip（固定时间戳，同输入同字节）
python3 specs/laohuang-battle/render/pack.py
```

- `<kaying-for-ui>` = 本技能的安装目录（含 `SKILL.md` 的那一层）。
- `render/shot.sh` 用本机 Chrome 无头截图（1:1，`--force-device-scale-factor=1`）；`transparent` 作第 5 参数时输出透明底。
- 页面与组件共用同一份 `render/ui.css`（= `style-contract.yaml` 的落地实现），所以两态与跨页风格天然一致。
- 底图重出后先跑 `node render/prep-art.mjs <原图> <目标>`：它会克隆补掉右下角平台水印，并回报纸色（`paper_top/bottom/left`），供页面 CSS 对齐纸底。

## Manual Verification

- [x] Design doc, PRD, and interaction logic approved and consistent with pages
- [x] Aspect ratio and safe area correct（1080×1920；顶部 56 / 底部 96 / 左右 40）
- [x] Primary action clear and information hierarchy stable（首页唯一朱砂实底按钮；地图上唯一朱砂实底节点）
- [x] Colors, materials, lighting, strokes, and corner radii consistent（同一 tokens 文件）
- [x] Text legible, no garbled characters or wrong trademarks（底图零文字，全部中文由排版层叠加）
- [x] Components free of sticking, dirty edges, and unintended cropping
- [x] Non-background components meet transparent-background requirements（15/15 带 alpha）
- [x] Atlas regions, 9-slice, and engine JSON consistent（`kui atlas` + `kui export` 同源生成）
- [ ] Sprite sheet slices（本迭代不适用：直接产出独立资产，未走精灵表）

## Known Limitations

1. **精灵表切片未执行**：组件是「一文件一资产」，`kui split` 不适用；`sprite-contract.yaml` 因此保持 `status: draft`，其 `items` 仅作为图集输入。若后续需要切片版交付，需先合成一张组件总图再走 `kui split`。
2. **只交付主状态页面**：`home` 的新局态 / 覆盖确认层、`map` 的节点选中态 / 全通态、`rival-intro` 的 line-1 / line-3、`battle` 与 `boss-battle` 的敌方回合 / 阵亡 / 暂停层、`victory` 的 skipped 态、`settings` 的脏态 / 恢复默认确认层，均在 `interaction.md` 与 `screen-contract.yaml` 里有完整定义，但**未单独出图**，需在引擎侧按状态机切换。
3. **字体依赖系统**：页面用 `Songti SC / STSong / Noto Serif SC` 渲染，交付包不含字体文件；换机渲染若无宋体族，字面会退化（引擎侧需自带字体）。手牌数值行已固定 19px + `nowrap`，换字体后仍可能因字宽差异溢出，需回看 `render/pages/*.html` 的 `.card .dmg`。
4. **组件资产的投影**：为保证透明 PNG 不出现硬裁切，资产内**不含外投影**；`route-node` 的 8px 纸白光晕已在资产内（否则圆牌会浮在水墨上），其余墨青投影需由运行时叠加（`effects.shadow` 已给出参数）。
5. **AI 底图的固有偏差**：底图由图像模型生成（1024×1536 上采样到 1080×1920）。三个敌人剪影、情敌立绘、头目的头部位置都是按实际出图目测对齐（意图条在头顶上方、名条在头顶上方 87px），不是美术给的确切锚点；换一张底图必须重新对位。若需像素级锚点应改为分层交付。
6. **`victory` 复用 `map` 底图**：没有独立美术，靠 `saturate(.55) + blur(1.5px) + opacity(.5)` + 88% 纸雾压成极淡山影。若后续给 `victory` 出专属底图，需同步调 `prompts/pages/victory.md`。
7. **`disabled` 态**：`btn-primary` 的禁用态由运行时降饱和 60% + 不透明度 45% 生成，不单独出图。
8. **主角造型是致敬式语汇**：皮衣 + 银白背头 + 细框眼镜 + 中年身形，**不是任何真实人物的肖像复刻**，也不应作为周边宣传形象使用。若发行方要求更强的相似度，需自行评估肖像权风险，本交付不承担。

## 交付目录速览

```text
specs/laohuang-battle/
├── index.html                 ← 物料与结构总览（先看这个）
├── result.html                ← 手机壳交互预览（七页可切换 / 缩放）
├── gdd.md / prd.md / interaction.md / spec.md / research.md / plan.md / tasks.md
├── contracts/                 ← style / screen / component / sprite / atlas / export / manifest
├── prompts/pages/             ← 7 份页面提示词（home / map / battle / rival-intro / boss-battle / victory / settings）
├── prompts/components/        ← 9 份组件提示词（含 pressed 段落）
├── assets/pages/              ← 7 张页面（1080×1920）
├── assets/components/         ← 15 张透明组件资产（含两态）
├── assets/atlases/ui-main.png + ui-main.json
├── exports/{godot,unity,cocos,generic,taptap-maker}/ui-main.json (+ README + demo)
├── exports/web/               ← manifest.json / tokens.css / README.md
└── render/                    ← 排版与组件渲染源（ui.css / pages / components / art / shot.sh / prep-art.mjs）
```
