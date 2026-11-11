# godot 导出 · happy-farm

这是 **Godot** 交接包（handoff），不是可直接运行的 Godot 工程。
`native_project_files: false` — 只提供确定性 JSON 清单；原生 `.tscn` / `.tres` / `.import` 不在内置导出范围内。

> Agent 目标：读本目录 JSON，把已生成的 UI **自动应用**到目标 Godot 项目。

## 本目录

| 文件 | 用途 |
|---|---|
| `ui-main.json` | Atlas 纹理 + 每个 sprite 的 region / patch_margins |
| `demo/main.gd` | **参考 demo**：固定模板装配器（数据驱动，事件只打 `[kui-demo]` 日志） |
| `demo/ui_data.gd` | **参考 demo**：`ui-main.json` 的 GDScript 镜像（导出器生成，手改无效） |
| `demo/README.md` | **参考 demo**：面向 Agent 的搭建-运行-验收指引 |
| `README.md` | 本说明（Agent 自动接入指南） |

相对路径约定：`texture` 指向项目根下的 `assets/atlases/…`。

## Agent 快速跑通（读我 → 跑起来看效果）

定位：Agent 读完本节，不追问、不改生成文件，即可把 demo 放进一个 Godot 4 工程，跑出可点击的 {{SCREEN_COUNT}} 屏骨架。
真实业务逻辑不在此步（demo 所有事件只打 `[kui-demo]` 日志）；跑通后再按「自动接入步骤」接真实项目。

1. **工程**：任意 Godot 4.x 工程（新建空工程即可）。
2. **拷文件**：整个 `demo/` 目录 → `res://demo/`；图集 PNG → `res://assets/atlases/ui-main.png`（缺失则 demo 回退占位面板并打日志）。
3. **建场景**：新建场景，根节点 = **Control**，挂 `res://demo/main.gd`，按 F6 运行当前场景。
4. **验收**：输出面板出现 `[kui-demo] event=boot screens={{SCREEN_COUNT}}`；底部导航可切换 {{SCREEN_COUNT}} 屏，点击/切换各打一行 `[kui-demo]` 日志（格式见 `demo/README.md`）。
5. **之后**：以 `ui-main.json` 为唯一真源接真实项目，对照下文「映射速查」仿写 demo 的装配方式。

## 字段语义（`ui-main.json`）

| 字段 | 含义 |
|---|---|
| `schema_version` | 清单版本，当前 `1` |
| `engine` | `godot` |
| `atlas_id` / `atlas_size` | 图集 ID 与像素尺寸 `[w, h]` |
| `texture` | Atlas 图集路径（PNG/SVG 源） |
| `resources.<sprite>.texture` | 同上（冗余，便于单条引用） |
| `resources.<sprite>.region` | `[x, y, w, h]`，图集像素矩形（原点左上） |
| `resources.<sprite>.patch_margins` | `[left, right, top, bottom]`，9-patch 边距（px） |
| `resources.<sprite>.component_id` | 语义组件 ID |
| `resources.<sprite>.state` | 状态（`default` / `pressed` / …） |

`patch_margins` 全 `0` 表示整图拉伸或不切边；非 0 用 NinePatch。

## 两态（normal / pressed）

可点击控件必须同时提供 `default` 与 `pressed` 两态（同 `component_id` 不同 `state` 条目）：
Godot 侧绑定为 Button / TextureButton 的 normal / pressed 皮肤（demo 用 StyleBoxTexture 演示）。
图集缺 pressed 条目的可点击控件，先回组件拆解阶段补齐再导出；demo 缺失时以常态皮肤压暗回退。

## 自动接入步骤（Agent）

1. **拷贝图集**  
   将 `texture` 指向的图片拷入 Godot 工程，建议 `res://assets/atlases/`，保持文件名。

2. **逐条建 Sprite 资源**（遍历 `resources`）  
   - 固定尺寸（图标、装饰）：`AtlasTexture`，`atlas = texture`，`region = Rect2(x, y, w, h)`。  
   - 可拉伸皮肤（`patch_margins` 非全 0）：`NinePatchRect` 或 `StyleBoxTexture`：  
     - `texture` = 上述 AtlasTexture  
     - `patch_margin_left/right/top/bottom` ← `patch_margins` 对应项  
   - 进度条：`TextureProgressBar` + nine-patch 背景/填充。

3. **按组件语义落节点**  
   - 背景 → `TextureRect` / `NinePatchRect`，全屏锚点。  
   - 按钮 → `Button` 或 `TextureButton`，normal/pressed/disabled 用同 `component_id` 下不同 `state` 的 region。  
   - 图标 → `TextureRect` + AtlasTexture。  
   - 若 `text_policy = no-text`：图上无字，用 `Label` 叠放；不要在引擎里再往贴图上写字。

4. **主题色**（可选）  
   颜色 / 圆角 / 字号以 `contracts/style-contract.yaml` 或 `exports/web/tokens.css` 为准，可做成 Godot `Theme` 并 `theme_override_*` 绑定。

5. **自检**  
   - 9-slice 拉伸后四角不变形、中心可平铺。  
   - `region` 与源 PNG 像素一致、无裁切。  
   - 不得声称已生成 `.tscn` / `.tres` / SpriteAtlas 导入器。

## 映射速查

| kui 字段 | Godot |
|---|---|
| `region` | `AtlasTexture.region` / `Sprite2D.region_rect` |
| `patch_margins` | `NinePatchRect.patch_margin_*` / `StyleBoxTexture.region_rect` |
| `9-slice` | `NinePatchRect` 或 `StyleBoxTexture` |
| `component_id` | 节点命名 / 场景组件脚本 |
| `state` | `BaseButton` 状态贴图 |

## 参考 demo（demo/）

`demo/` 是导出器自带的**可运行参考实现**：`main.gd`（固定模板）读 `ui_data.gd`
（`ui-main.json` 的 GDScript 镜像），把每个屏幕按 layout 分区装配成节点树，
Button 事件与屏幕切换都打印一行 `[kui-demo]` 日志。用途：

- **冒烟验证**：交接包 JSON 是否自洽（region/边距/屏幕结构）跑一遍即知；
- **参考实现**：接入真实项目时对着 demo 的装配方式仿写，减少臆测。

细节与验收步骤见 `demo/README.md`。

## 边界

- 不生成 `.tscn` / `.tres` / `.import` / Autoload。
- 不修改 Project Settings、输入映射或渲染管线。
- 业务逻辑、信号、存档由游戏工程自行接线。

## 再生成

```bash
kui export specs/happy-farm --force
```

前置：`contracts/atlas-contract.yaml` 已 packed/approved，`export-contract.yaml` 含 `engine: godot`。
