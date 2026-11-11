# 项目复现与验收

## 项目

- 项目 ID：`happy-farm`
- 当前可交付版本：

## 执行模式

- 当前模式：`default`
- 选择时间：2026-11-11
- 选择方：启动门禁（default fallback；用户未要求 review）
- 备注：用户确认 平台=手机横屏 16:9（1792×1024），美术风格=Q版卡通田园；项目 ID=happy-farm，工作区=当前目录。

### 门禁日志

（`review` 记用户批准/跳过；`default` 记 auto-closed）

- 2026-11-11 default-mode auto-closed stage-1 product-design：三文档交叉检查通过（gdd 核心循环界面 ⊆ prd 页面范围；prd P0 页面 ⊆ interaction 分页面章节；付费/破坏性操作均有确认路径），gdd/prd/interaction `status=approved`。
- 2026-11-11 default-mode auto-closed stage-2 specify：spec.md 平台/比例/风格/范围/验收齐备，无阻断未决项；research.md 记录视觉抽象与无文字生图策略。
- 2026-11-11 default-mode auto-closed stage-3 specification：style-contract 全字段填充（无空值/待定），横屏 16:9 [1792,1024]，Q版卡通田园令牌；可点击控件两态规则写入 colors.pressed=#DB7734 与 tokens.interaction（pressed-dim 0.86 / pressed-scale 0.97 / offset-y 2）；`status=approved`。
- 2026-11-11 default-mode auto-closed stage-4 extension：screen-contract 6 个 must-have 屏幕（farm/shop/barn/social/task/settings）契约齐备，核心循环闭合（种植→收获→出售→扩建→社交互助），每页含主操作/状态/边界/数据需求；plan.md 屏幕路线与生成批次按依赖排序；范围源自已批准 prd.md，无新增孤岛页面。
- 2026-11-11 default-mode auto-closed stage-5 page farm：farm-v1.png 实测 1792×1024（16:9），无文字基底+留白标签区，Q版卡通田园风格一致，中央 3×2 地块网格/顶部资源条/底部五 tab/右下主操作布局正确；asset-manifest farm-page `approved:true`，screen-contract farm `status:approved`。
- 2026-11-11 default-mode auto-closed stage-5 page shop：shop-v1.png 实测 1792×1024，无文字，左分类/中商品卡片网格/右购买确认弹窗布局正确，风格一致；shop-page `approved:true`，screen shop `approved`。
- 2026-11-11 default-mode auto-closed stage-5 page barn：barn-v1.png 实测 1792×1024，无文字，顶部容量进度条/中物品格子矩阵/底出售区布局正确，风格一致；barn-page `approved:true`，screen barn `approved`。
- 2026-11-11 default-mode auto-closed stage-5 page social：social-v1.png 实测 1792×1024，无文字，左好友列表卡片/右农场预览与互助操作布局正确，风格一致；social-page `approved:true`，screen social `approved`。
- 2026-11-11 default-mode auto-closed stage-5 page task：task-v1.png 实测 1792×1024，无文字，左日常/成长标签/中任务卡片列表（进度条+奖励图标+领取按钮）布局正确，风格一致；task-page `approved:true`，screen task `approved`。
- 2026-11-11 default-mode auto-closed stage-5 page settings：settings-v1.png 实测 1792×1024，无文字，居中设置面板（开关行+账号/帮助/退出按钮+右上关闭）布局正确，风格一致；settings-page `approved:true`，screen settings `approved`。
- 2026-11-11 default-mode auto-closed stage-6 component：源页面 farm `approved:true`；component-contract 30 组件（5 control 两态/三态、5 container、17 icon、1 character、1 decoration、1 background），可点击控件均含 default+pressed；render/kit.js 确定性渲染 37 个状态 PNG（尺寸精确、alpha 干净、两态轮廓对齐压暗+下沉）、30 份组件提示词、2048×1978 透明雪碧图（37 连通块、间距30px、无文字）；`kui split --mode alpha` 检测 37 块与素材一一对应（最大偏移13.5px）。
- 2026-11-11 default-mode auto-closed stage-7 split：`kui split --mode alpha --mapping` 导出 37 个语义命名单元素 PNG（assets/sprites/ui-components/items/）+ sprite-manifest.yaml + packages/ui-components-png.zip（38 条目含 manifest）；自动边缘检查通过（无文字残留、裁切合理、两态轮廓对齐）；sprite-contract `status:approved`、review.complete/text_free=true；asset-manifest 登记 45 条（6 页+37 组件+雪碧图+ZIP）；`kui validate` exit 0 / 0 警告。
- 2026-11-11 default-mode auto-closed stage-8 atlas+export：`kui atlas` 将 37 精灵打入 2048×2048 power-of-two atlas（padding 2、无旋转），atlas-contract `status:approved`、review.complete=true；9-slice 边距逐一对照 region 尺寸校验，均留可拉伸中心（left+right<width、top+bottom<height）；5 个可点击控件 pressed 精灵均已入图（state coverage 完整）。`kui export` 生成 5 引擎 JSON 交付（godot/unity/cocos/generic/taptap-maker，各 ui-main.json+README.md；taptap-maker 另含 theme.lua/component-map.json/screens.json），engine 字段与契约逐一匹配，native_project_files=false；export-contract `status:approved`、review.complete=true。
- 2026-11-11 default-mode auto-closed stage-8b web：`kui web` 生成 exports/web/{manifest.json,tokens.css,README.md} + result.html + index.html（6 页、37 精灵、style_status=approved）；index.html 物料目录与 result.html 交互壳均落盘。
- 2026-11-11 default-mode auto-closed stage-9 validate：`kui validate specs/happy-farm --strict --json` → ok:true、exit_code:0、error_count:0、warning_count:0；全部契约/资产/状态覆盖/9-slice/引擎一致性通过；按 §7 交付 index.html。

## 输入

- 策划方案：`gdd.md`
- 产品需求：`prd.md`
- 交互逻辑：`interaction.md`
- 需求文件：`spec.md`
- 研究记录：`research.md`
- 视觉契约：`contracts/style-contract.yaml`
- 页面契约：`contracts/screen-contract.yaml`
- 组件契约：`contracts/component-contract.yaml`

## 复现步骤

1. 安装仓库中的技能。
2. 打开本项目目录并让 Agent 读取 `gdd.md`、`prd.md`、`interaction.md`、`spec.md` 与 `contracts/`。
3. 确认策划三文档为 `approved`（或已记录跳过）后再生图。
4. 按 `plan.md` 选择一个页面 ID。
5. 使用页面技能生成视觉稿，保存到 `assets/pages/`。
6. 页面批准后使用组件技能，保存到 `assets/components/`。
7. 组件输出为雪碧图时，使用拆分技能导出单元素 PNG 和 ZIP。
8. 需要开发交付时，审核 9-slice 并生成 Atlas 与引擎 JSON。
9. 更新 sprite、atlas、export contracts 与 `asset-manifest.yaml`。

## 校验

```bash
kui validate specs/happy-farm
```

## 人工验收

- [ ] 策划方案、PRD、交互逻辑已批准且与页面一致
- [ ] 画面比例与安全区正确
- [ ] 主操作清晰且信息层级稳定
- [ ] 色彩、材质、光源、描边和圆角一致
- [ ] 中文清晰，无乱码和错误商标
- [ ] 组件无粘连、无脏边、无意外裁切
- [ ] 非背景组件满足透明背景要求
- [ ] 雪碧图切片无裁断、粘连或背景残留
- [ ] PNG 压缩包可以解压且包含 manifest
- [ ] Atlas regions、9-slice 和引擎 JSON 一致

## 已知限制

- 
