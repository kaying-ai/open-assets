# exports/web — Web 交付包

面向 Web/H5 的确定性 UI 交付清单（**不是**原生引擎工程）。

> Agent 目标：读本目录文件，把已生成的 UI **自动应用**到 Web/H5 页面或预览壳。

## 文件

| 文件 | 用途 |
|---|---|
| `manifest.json` | 页面清单、入口、主题名、页面图路径 |
| `tokens.css` | **游戏**设计令牌 `--game-*`（来自 `contracts/style-contract.yaml`） |
| `README.md` | 本说明（Agent 自动接入指南） |

> Web 交付壳 `index.html` / `result.html` 使用固定模板风格（`--shell-*`），**不跟随游戏配色**。  
> 游戏 token 仅作数据参考，不会把页面 chrome 染成游戏风格。

## 字段语义（`manifest.json`）

| 字段 | 含义 |
|---|---|
| `schema_version` | 清单版本，当前 `1` |
| `project_id` / `theme` / `engine` | 项目、主题名、`web` |
| `pages[]` | 页面列表：`id` / `title` / `image` |
| `entry` | 默认入口页 `id` |

`image` 为相对路径，指向 `assets/pages/*` 画板图。

## 自动接入步骤（Agent）

1. **读 `manifest.json`**，按 `pages[]` 建路由或分屏；`entry` 作首屏。  
2. **游戏侧视觉**用 `tokens.css` 的 `--game-*`（颜色、圆角、字号、阴影、参考画布 `--ref-width/height`）。交付壳 chrome 保持模板 `--shell-*`。  
3. **页面图**按原始分辨率等比缩放（不要拉伸变形）；需要切图时读 Atlas 的 `sprites[name].region`，或直接用 `assets/components/`。  
4. **9-slice** 见 sprite 的 `slice` 字段；边距需目视确认后用于 CSS `border-image` / nine-patch 绘制。  
5. **交互壳**用 `../../result.html`（等比缩放 / 1:1 像素查看）；物料与结构总览用 `../../index.html`。  
6. **自检**：入口可打开、页面可切换、token 与 style-contract 一致、不变形。

## 资源引用

- 页面：`../../assets/pages/*`
- 图集：`../../assets/atlases/*`
- 交互壳：`../../result.html`
- 物料总览：`../../index.html`

## 打开入口页

交付完成后打开 `index.html`（物料与结构总览）：

1. 环境有右侧面板 / 预览面板 → 用面板打开，不要另开浏览器。
2. 否则 → 任务总结给出可点击链接，并用系统浏览器打开（`open` / `xdg-open` / `start`）。

总结始终附 `index.html` 与 `result.html` 的绝对路径。

## 再生成

```bash
kui web specs/happy-farm --force
```

## 门禁

`style-contract.yaml` 未 approved 时，本包仅作预览/联调，不作为最终视觉冻结版。
