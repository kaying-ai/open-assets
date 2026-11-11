# UI 实施计划

## 项目概览

- 项目 ID：`happy-farm`
- 目标：交付「开心农场」横屏 16:9（1792×1024）Q版卡通田园全套 UI——6 个 must-have 屏幕视觉稿 + 可复用组件库 + 雪碧图切分 + Atlas + 五引擎 JSON（含 taptap-maker）+ web catalog，`kui validate --strict` 通过。
- 当前阶段：延展 → 页面 → 组件 → 切分 → Atlas/导出 → web → 验收（default 模式自动推进）

## 阶段

1. 策划（生成第一步）：批准 `gdd.md` / `prd.md` / `interaction.md` ✅
2. 规范：完成 `style-contract.yaml` ✅
3. 延展：完成屏幕地图和 `screen-contract.yaml` ✅
4. 页面：逐页生成、审核并登记视觉稿（ImageGen 1792×1024 无文字底板）
5. 拆解：从已批准页面派生可复用组件库（确定性 SVG 渲染，透明通道，控件两态）
6. 雪碧图：组件合图 → `kui split` 切单元素 PNG + manifest + ZIP
7. 资产交付：语义命名 + 9-slice → `kui atlas` → `kui export`（godot/unity/cocos/generic/taptap-maker）
8. web 交付：`kui web` → exports/web + result.html + index.html
9. 验收：`kui validate --strict` exit 0，打开 index.html

## 屏幕路线

| 顺序 | 页面 ID | 页面 | 模块 | 优先级 | 依赖 | 状态 |
|---:|---|---|---|---|---|---|
| 1 | `farm` | 农田主页 | core | must-have | wallet, inventory | planned |
| 2 | `shop` | 商店 | economy | must-have | wallet | planned |
| 3 | `barn` | 仓库 | growth | must-have | inventory | planned |
| 4 | `social` | 好友邻居 | social | must-have | — | planned |
| 5 | `task` | 任务成就 | retention | must-have | — | planned |
| 6 | `settings` | 设置 | support | must-have | — | planned |

## 页面生成批次

- 批次 1（基准页）：`farm` —— 确立资源条 / 地块 / 导航 / 主按钮的视觉基准。
- 批次 2（高复用系统页）：`shop`、`barn`、`task` —— 复用卡片 / 格子 / 进度条 / 领取按钮。
- 批次 3（社交与支撑页）：`social`、`settings` —— 复用列表卡片 / 开关 / 弹窗。

## 组件拆解范围

- 首个批准页面：`farm`（default 模式本 run 质量通过后 auto-close）。
- 复用组件（跨页面）：btn-primary / btn-secondary / btn-claim / btn-close / nav-tab / panel-card / panel-modal / currency-bar / progress-bar / slot-item / 货币与功能图标 / char-farmer / deco-badge / bg-farm。
- 页面专属组件：无（全部抽象为可复用基础组件，页面差异由布局与文案承载）。
- 可点击控件两态：所有 `category: control` 组件产出 default + pressed（pressed = 主色加深 14% + 2px 下沉，轮廓一致）。

## 质量门禁

- [x] `gdd.md` / `prd.md` / `interaction.md` 已批准
- [x] `spec.md` 无阻断性未决事项
- [x] 样式契约字段完整（approved）
- [ ] 页面 ID 与屏幕契约一致
- [ ] 页面批准后才允许拆解
- [ ] 资源均登记到 manifest
- [ ] `kui validate --strict` exit 0