# taptap-maker 导出 · happy-farm

这是 **TapTap Maker / UrhoX** 交接包（handoff），不是可直接运行的完整游戏工程。

> Agent 目标：读本目录文件，把已生成的 UI **自动应用**到 Maker/UrhoX 游戏脚本。

## 本目录

| 文件 | 用途 |
|---|---|
| `ui-main.json` | Atlas + theme + components + screens 总清单 |
| `theme.lua` | 可 `require` 的 UI.Theme 映射（改自 style-contract） |
| `component-map.json` | kui 组件 → `urhox-libs/UI` Widget 对照 |
| `screens.json` | 屏幕结构与 Lua 模块骨架 |
| `README.md` | 本说明 |

## UI 语言要点

- 脚本 **Lua 5.4**，UI 库 **`urhox-libs/UI`**
- 布局 **Yoga**（类 Flexbox，默认值与 CSS 不同）
- 渲染 **NanoVG**（矢量、可 9-patch / 渐变 / 发光）
- 标准三步：`UI.Init` → 构建控件树 → **`UI.SetRoot(root)`**
- 缩放：`scale = UI.Scale.DEFAULT`（1 基准像素 ≈ 1 CSS 像素）
- 安全区：可交互内容放进 `UI.SafeAreaView`，全屏背景放在其外
- 颜色为 `{R,G,B,A}` 数组；圆角/间距用 Theme token

## 接入步骤

1. 将页面/组件 PNG 拷入 Maker 工程 `assets/image` 或 `assets/sprites`（命名保持语义）。
2. 需要拉伸皮肤时，按 `component-map.json` 的 `slice.margins` 做 9-patch。
3. 拷贝字体到 `assets/Fonts/`，并在 `UI.Init` 的 `fonts` 注册。
4. 把 `theme.lua` 放到 `scripts/ui/theme.lua`，Init 时传入。
5. 按 `screens.json` 的 `lua_module` 路径创建屏幕模块，用 `component-map.json` 选 Widget。
6. 风格包若要用官方主题，优先参考 Maker 自带：
   - `DefaultTaptap` — 圆角扁平、青绿主色
   - `ui-astroon` — 宇宙卡通 / 渐变发光
   - `ui-brawlforge` — 科幻 HUD / 直角硬边
   - `ui-pixelforge` — 像素复古 / 直角硬阴影

## 规模

- 组件映射：30 条
- 屏幕：6 个
- Atlas 纹理：见 `ui-main.json` 的 `texture`

## 边界

- 不生成原生完整 Maker 工程 / 不代替 `maker_build_current_directory`
- 业务逻辑、网络、存档需在游戏脚本中自行接线
- 与 `exports/web/` 预览包并列，服务不同交付目标
