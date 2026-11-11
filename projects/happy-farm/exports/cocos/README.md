# cocos 导出 · happy-farm

这是 **Cocos Creator** 交接包（handoff），不是可直接运行的 Cocos 工程。
`native_project_files: false` — 只提供确定性 JSON 清单；`.prefab` / `.scene` / 图集自动导入器不在内置导出范围内。

> Agent 目标：读本目录 JSON，把已生成的 UI **自动应用**到目标 Cocos 项目。

## 本目录

| 文件 | 用途 |
|---|---|
| `ui-main.json` | Atlas 纹理 + SpriteFrame（rect / originalSize / capInsets） |
| `demo/ui-demo.ts` | **参考 demo**：固定模板装配器（数据驱动，事件只打 `[kui-demo]` 日志） |
| `demo/ui-data.ts` | **参考 demo**：`ui-main.json` 的 TypeScript 镜像（导出器生成，手改无效） |
| `demo/README.md` | **参考 demo**：面向 Agent 的搭建-运行-验收指引 |
| `README.md` | 本说明（Agent 自动接入指南） |

相对路径约定：`texture` 指向项目根下的 `assets/atlases/…`。

## Agent 快速跑通（读我 → 跑起来看效果）

定位：Agent 读完本节，不追问、不改生成文件，即可把 demo 放进一个 Cocos Creator 3.x 工程，跑出可点击的 {{SCREEN_COUNT}} 屏骨架。
真实业务逻辑不在此步（demo 所有事件只打 `[kui-demo]` 日志）；跑通后再按「自动接入步骤」接真实项目。

1. **拷文件**：`demo/` 下两个 `.ts` → `assets/kui-demo/`；
   图集 PNG → `assets/resources/ui-main.png`（缺失则 demo 回退占位面板并打日志）。
2. **建场景**：新建场景（含 Canvas，设计分辨率建议 1080×1920 竖屏）→ Canvas 下新建空节点
   → 添加组件 `KuiDemoBuilder` → 保存。
3. **运行**：编辑器顶部 **预览（浏览器）**。
4. **验收**：浏览器 Console 出现 `[kui-demo] event=boot screens={{SCREEN_COUNT}}`；底部导航可切换
   {{SCREEN_COUNT}} 屏，点击/切换各打一行 `[kui-demo]` 日志（格式见 `demo/README.md`）。
5.
1. **之后**：以 `ui-main.json` 为唯一真源接真实项目，对照下文「映射速查」仿写 demo 的装配方式。

（`ui-main.json`）

| 字段 | 含义 |
|---|---|
| `schema_version` | 清单版本，当前 `1` |
| `engine` | `cocos` |
| `atlas_id` / `atlas_size` | 图集 ID 与像素尺寸 `[w, h]` |
| `texture` | Atlas 图集路径 |
| `frames.<sprite>.rect` | `{x, y, width, height}`，图集像素矩形 |
| `frames.<sprite>.offset` | `{x, y}`，相对中心偏移（导出恒为 0） |
| `frames.<sprite>.originalSize` | `{width, height}`，原始尺寸 |
| `frames.<sprite>.capInsets` | `[left, right, top, bottom]`，九宫格 inset（px） |

`capInsets` 全 `0` 用普通 Sprite；非 0 用 **Sliced** 类型。

## 两态（normal / pressed）

可点击控件必须同时提供 `default` 与 `pressed` 两态（同 `component_id` 不同 `state` 条目）：
引擎侧绑定为控件的 normal / pressed 皮肤。图集缺 pressed 条目的可点击控件，先回组件拆解阶段
补齐再导出；demo 缺失时以常态压暗（≈14%）回退，两态仍可感知。

## 自动接入步骤（Agent）

1. **导入图集**  
   将 `texture` 拷入 Cocos 工程 `assets/`（建议 `assets/ui/atlases/`）。  
   若项目使用 Auto Atlas / Texture Packer，可改为按 name 生成 SpriteFrame；否则以本 JSON 为准手动建 Frame。

2. **逐条创建 SpriteFrame**（遍历 `frames`）  
   - `rect` ← 图集裁剪矩形  
   - `originalSize` ← 原始尺寸  
   - `offset` ← 偏移（0）  
   - `capInsets` 写入帧的 nine-patch / inset 字段（版本差异：`Insets` / `Sliced` border）  
   命名保持与 key 一致（含 `state` 后缀），便于按钮状态切换。

3. **UI 节点绑定**  
   - 背景 → `Sprite` + `UITransform` 铺满。  
   - 按钮 → `Button`，`SpriteFrame` 按 `state` 切换（normal/pressed/disabled）；可拉伸底图用 **Sliced** + `capInsets`。  
   - 图标 → `Sprite`，保持 `originalSize` 比例。  
   - 进度条 → `ProgressBar` 或双层 Sprite 遮罩。  
   - `text_policy = no-text`：图无字，用 `Label` 叠放。

4. **主题**（可选）  
   颜色 / 圆角 / 字号见 `contracts/style-contract.yaml` 或 `exports/web/tokens.css`，可做成 Prefab 主题组件或常量表。

5. **自检**  
   - Sliced Sprite 拉伸后四角不变形、中心可铺。  
   - `rect` 完全落在图集内，与 `originalSize` 对应。  
   - 不得声称已生成 `.prefab` / `.scene` / 图集自动导入结果。

## 映射速查

| kui 字段 | Cocos |
|---|---|
| `texture` | `Texture2D` / 图集 |
| `frames.*.rect` | `SpriteFrame.rect` |
| `frames.*.originalSize` | `SpriteFrame.originalSize` |
| `frames.*.capInsets` | Sliced border / `Insets` |
| `frames.*.offset` | `SpriteFrame.offset` |
| `component_id` / `state` | 节点命名 / Button 状态图 |

## 参考 demo（demo/）

`demo/` 是导出器自带的**可运行参考实现**：固定模板装配器读 `ui-data.ts`
（`ui-main.json` 的引擎语言镜像），把每个屏幕按 layout 分区装配成节点树，
事件与屏幕切换都打印一行 `[kui-demo]` 日志。用途：

- **冒烟验证**：交接包 JSON 是否自洽（region/边距/屏幕结构）跑一遍即知；
- **参考实现**：接入真实项目时对着 demo 的装配方式仿写，减少臆测。

细节与验收步骤见 `demo/README.md`。

## 边界

- 不生成 `.prefab` / `.scene` / `.meta` / 脚本组件。
- 不写入项目 `settings`、不绑定物理/网络。
- 业务逻辑、资源加载策略由游戏工程自行接线。

## 再生成

```bash
kui export specs/happy-farm --force
```

前置：`contracts/atlas-contract.yaml` 已 packed/approved，`export-contract.yaml` 含 `engine: cocos`。
