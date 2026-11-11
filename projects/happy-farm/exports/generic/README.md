# generic 导出 · happy-farm

这是 **通用引擎** 交接包（handoff），供尚未特化导出器的目标使用。
`native_project_files: false` — 只提供确定性 JSON；任何引擎的原生工程文件都不在内置范围内。

> Agent 目标：读本目录 JSON，把已生成的 UI **映射并应用**到目标引擎/框架（自定义渲染、Flutter、Unity UI Toolkit、自研编辑器等）。

## 本目录

| 文件 | 用途 |
|---|---|
| `ui-main.json` | Atlas 纹理 + 完整 sprite 元数据透传 |
| `demo/main.js` | **参考 demo**：固定模板装配器（canvas 上验证 region / 9-slice / 两态 / 屏幕结构） |
| `demo/ui-data.js` | **参考 demo**：`ui-main.json` 的 JS 镜像（导出器生成，手改无效） |
| `demo/index.html` | **参考 demo**：载入 `main.js` 的最小宿主页 |
| `demo/README.md` | **参考 demo**：面向 Agent 的搭建-运行-验收指引 |
| `README.md` | 本说明（Agent 自动接入指南） |

## Agent 快速跑通（读我 → 跑起来看效果）

定位：Agent 读完本节，不追问、不改生成文件，即可把 demo 放进一个 通用目标 工程，跑出可点击的 {{SCREEN_COUNT}} 屏骨架。
真实业务逻辑不在此步（demo 所有事件只打 `[kui-demo]` 日志）；跑通后再按「自动接入步骤」接真实项目。

1. **起服务**：在交接包所在工程根执行 `python -m http.server 8000`（或 `npx serve`）；
   ES module 不能走 `file://` 直接打开。
2. **打开**：浏览器访问 `exports/generic/demo/index.html`。
3. **验收**：浏览器 Console 出现 `[kui-demo] event=boot screens={{SCREEN_COUNT}}`（图集缺失时为
   `atlas=missing` 并回退占位面板）；底部导航可切换 {{SCREEN_COUNT}} 屏，点击/切换各打一行
   `[kui-demo]` 日志（格式见 `demo/README.md`）。
4. **移植**：demo 证明数据自洽后，把 `uvRect` / `drawNineSlice` / 两态换图逻辑按「映射速查」移植到目标引擎。
5.
1. **之后**：以 `ui-main.json` 为唯一真源接真实项目，对照下文「映射速查」仿写 demo 的装配方式。

（`ui-main.json`）

| 字段 | 含义 |
|---|---|
| `schema_version` | 清单版本，当前 `1` |
| `engine` | `generic` |
| `atlas_id` / `atlas_size` | 图集 ID 与像素尺寸 `[w, h]` |
| `texture` | Atlas 图集路径 |
| `sprites` | Atlas 打包结果的**完整透传**（与 `assets/atlases/*.json` 同构） |

单个 sprite 常见字段：

| 字段 | 含义 |
|---|---|
| `region` | `[x, y, w, h]` 图集矩形 |
| `pivot` | `[px, py]` 0–1 轴心 |
| `slice.type` | `9-slice` \| `full` \| `1:1` \| `tile` |
| `slice.margins` | `[left, right, top, bottom]`（仅 9-slice） |
| `component_id` / `state` | 语义组件与状态 |
| `text_policy` | 文字策略（`no-text` 等） |

## 两态（normal / pressed）

可点击控件必须同时提供 `default` 与 `pressed` 两态（同 `component_id` 不同 `state` 条目）：
引擎侧绑定为控件的 normal / pressed 皮肤。图集缺 pressed 条目的可点击控件，先回组件拆解阶段
补齐再导出；demo 缺失时以常态压暗（≈14%）回退，两态仍可感知。

## 自动接入步骤（Agent）

1. **解析清单**  
   读 `ui-main.json`，以 `sprites` 为唯一真源；不要猜测 region。

2. **加载图集**  
   按 `texture` 路径加载位图；若目标引擎不支持 SVG，使用已栅格化的 PNG（`assets/atlases/*.png`）。

3. **为每个 sprite 建纹理/精灵描述**  
   - `region` → UV 或像素裁剪  
   - `pivot` → 锚点/轴心  
   - `slice.type = 9-slice` + `slice.margins` → 可拉伸九宫格  
   - `tile` → 可重复平铺  
   - `1:1` / `full` → 原尺寸或按容器缩放（保持比例）

4. **按组件与屏幕组合 UI**  
   - 用 `component_id` + `state` 对应控件皮肤（按钮默认/按下/禁用）。  
   - 屏幕结构见 `../../exports/taptap-maker/screens.json` 或 `contracts/screen-contract.yaml`。  
   - `text_policy = no-text`：纯图，文字用引擎 Label 叠放。  
   - 颜色 / 圆角 / 字号用 `../../exports/web/tokens.css` 或 `contracts/style-contract.yaml`。

5. **自检**  
   - 9-slice 拉伸后四角不变形。  
   - 所有 `region` 在图集范围内。  
   - 语义名唯一，状态切换映射正确。

## 映射速查

| kui | 通用目标 |
|---|---|
| `region` | 子图裁剪 / UV rect |
| `pivot` | 锚点 |
| `slice.margins` | 九宫格边距 |
| `tile` | 重复采样 |
| `component_id` | 控件皮肤 ID |
| `state` | 皮肤状态 |

## 参考 demo（demo/）

`demo/` 是导出器自带的**可运行参考实现**：固定模板装配器读 `ui-data.js`
（`ui-main.json` 的引擎语言镜像），把每个屏幕按 layout 分区装配成节点树，
事件与屏幕切换都打印一行 `[kui-demo]` 日志。用途：

- **冒烟验证**：交接包 JSON 是否自洽（region/边距/屏幕结构）跑一遍即知；
- **参考实现**：接入真实项目时对着 demo 的装配方式仿写，减少臆测。

细节与验收步骤见 `demo/README.md`。

## 边界

- 不生成任何引擎原生工程或导入器输出。
- 不假设目标框架的节点树 / 组件系统；由 Agent 按上表适配。
- 业务逻辑、输入、网络由游戏工程自行接线。

## 再生成

```bash
kui export specs/happy-farm --force
```

前置：`contracts/atlas-contract.yaml` 已 packed/approved，`export-contract.yaml` 含 `engine: generic`。
