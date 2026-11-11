# unity 导出 · happy-farm

这是 **Unity** 交接包（handoff），不是可直接运行的 Unity 工程。
`native_project_files: false` — 只提供确定性 JSON 清单；`.meta` / SpriteAtlas / Prefab 不在内置导出范围内。

> Agent 目标：读本目录 JSON，把已生成的 UI **自动应用**到目标 Unity 项目。

## 本目录

| 文件 | 用途 |
|---|---|
| `ui-main.json` | Atlas 纹理 + Multiple Sprite（rect / pivot / border） |
| `demo/KuiDemoBuilder.cs` | **参考 demo**：固定模板装配器（数据驱动，事件只打 `[kui-demo]` 日志） |
| `demo/KuiUIData.cs` | **参考 demo**：`ui-main.json` 的 C# 镜像（导出器生成，手改无效） |
| `demo/README.md` | **参考 demo**：面向 Agent 的搭建-运行-验收指引 |
| `README.md` | 本说明（Agent 自动接入指南） |

相对路径约定：`texture` 指向项目根下的 `assets/atlases/…`。

## Agent 快速跑通（读我 → 跑起来看效果）

定位：Agent 读完本节，不追问、不改生成文件，即可把 demo 放进一个 Unity 工程，跑出可点击的 {{SCREEN_COUNT}} 屏骨架。
真实业务逻辑不在此步（demo 所有事件只打 `[kui-demo]` 日志）；跑通后再按「自动接入步骤」接真实项目。

1. **拷文件**：`demo/` 下两个 `.cs` → `Assets/KuiDemo/`（目录名随意）；
   图集 PNG → `Assets/Resources/UI/Atlases/ui-main.png`（缺失则 demo 回退占位面板并打日志）。
2. **运行**：直接按 **Play** —— `RuntimeInitializeOnLoadMethod` 自动建 Canvas + EventSystem，零场景设置。
3. **验收**：Console 出现 `[kui-demo] event=boot screens={{SCREEN_COUNT}}`；底部导航可切换
   {{SCREEN_COUNT}} 屏，点击/切换各打一行 `[kui-demo]` 日志（格式见 `demo/README.md`）。
4.
1. **之后**：以 `ui-main.json` 为唯一真源接真实项目，对照下文「映射速查」仿写 demo 的装配方式。

（`ui-main.json`）

| 字段 | 含义 |
|---|---|
| `schema_version` | 清单版本，当前 `1` |
| `engine` | `unity` |
| `atlas_id` / `atlas_size` | 图集 ID 与像素尺寸 `[w, h]` |
| `texture` | Atlas 图集路径 |
| `spriteMode` | 固定 `"Multiple"` |
| `sprites[].name` | Sprite 名（语义名，含状态后缀） |
| `sprites[].rect` | `[x, y, w, h]`，纹理像素矩形 |
| `sprites[].pivot` | `[px, py]`，0–1 归一化轴心（默认 `[0.5, 0.5]`） |
| `sprites[].border` | `[left, right, top, bottom]`，Sliced 9-patch 边框（px） |
| `sprites[].pixelsPerUnit` | 固定 `100` |

`border` 全 `0` 用 Simple/Full；非 0 用 **Sliced**。

## 两态（normal / pressed）

可点击控件必须同时提供 `default` 与 `pressed` 两态（同 `component_id` 不同 `state` 条目）：
引擎侧绑定为控件的 normal / pressed 皮肤。图集缺 pressed 条目的可点击控件，先回组件拆解阶段
补齐再导出；demo 缺失时以常态压暗（≈14%）回退，两态仍可感知。

## 自动接入步骤（Agent）

1. **导入图集**  
   将 `texture` 拷入 Unity 工程（建议 `Assets/UI/Atlases/`）。  
   TextureImporter：`Texture Type = Sprite (2D and UI)`，`Sprite Mode = Multiple`，`Pixels Per Unit = 100`，Filter/Compression 按项目规范（UI 常用 Point/Bilinear + None）。

2. **写入 Sprite 子资源**（遍历 `sprites[]`）  
   对每个条目创建 SpriteMetaData（或等价 Sprite 资产）：  
   - `name` ← `name`  
   - `rect` ← `Rect(x, y, w, h)`  
   - `pivot` ← `Vector2(px, py)`  
   - `border` ← kui JSON 顺序为 `[left, right, top, bottom]`；注意 Unity API 的
     `Vector4` border 顺序是 **(left, bottom, right, top)**，写入前需换序  
   - `alignment` 用 Center（或与 pivot 一致）  
   保存并重导入，使 Project 里出现同名 Sprite。

3. **UGUI 绑定**  
   - 背景 → `Image`（Simple），铺满安全区或全屏。  
   - 可拉伸面板/按钮底 → `Image` + **`Image.Type = Sliced`**，Sprite 选 `border` 非 0 的条目。  
   - 图标 → `Image`（Simple），保持原始宽高比。  
   - 进度条 → `Image` Filled 或 Slider 背景/填充分层。  
   - 同 `component_id` 不同 `state` 的 Sprite：用 `SpriteState`（Button）或脚本换图。  
   - `text_policy = no-text`：图无字，用 `Text`/`TextMeshProUGUI` 叠放。

4. **主题**（可选）  
   颜色 / 圆角 / 字号见 `contracts/style-contract.yaml` 或 `exports/web/tokens.css`，可写成 ScriptableObject / UGUI 主题预设。

5. **自检**  
   - Sliced Image 拉伸后四角不变形。  
   - Sprite `rect` 不越界、不与其它 sprite 重叠误用。  
   - 不得声称已生成 SpriteAtlas、Prefab 或 `.meta` 资产数据库条目。

## 映射速查

| kui 字段 | Unity |
|---|---|
| `texture` | `Texture2D` + Sprite (Multiple) |
| `rect` | `SpriteMetaData.rect` |
| `pivot` | `SpriteMetaData.pivot` |
| `border` | `SpriteMetaData.border` → UI `Image.type = Sliced` |
| `pixelsPerUnit` | `TextureImporter.spritePixelsPerUnit` |
| `component_id` / `state` | Prefab 命名 / `SpriteState` |

## 参考 demo（demo/）

`demo/` 是导出器自带的**可运行参考实现**：固定模板装配器读 `KuiUIData.cs`
（`ui-main.json` 的引擎语言镜像），把每个屏幕按 layout 分区装配成节点树，
事件与屏幕切换都打印一行 `[kui-demo]` 日志。用途：

- **冒烟验证**：交接包 JSON 是否自洽（region/边距/屏幕结构）跑一遍即知；
- **参考实现**：接入真实项目时对着 demo 的装配方式仿写，减少臆测。

细节与验收步骤见 `demo/README.md`。

## 边界

- 不生成 `.unity` 场景、Prefab、SpriteAtlas、Asmdef。
- 不写入 `ProjectSettings`、不创建 Addressables 条目。
- 业务逻辑、网络、存档由游戏工程自行接线。

## 再生成

```bash
kui export specs/happy-farm --force
```

前置：`contracts/atlas-contract.yaml` 已 packed/approved，`export-contract.yaml` 含 `engine: unity`。
