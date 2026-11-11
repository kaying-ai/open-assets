# open-assets

[English](README.md) | **中文**

开放的游戏 UI 资产包，包含页面视觉、组件精灵、纹理图集、设计令牌和引擎交付清单。每个资产包均以自包含项目形式发布，并附带设计契约和生成提示词。

- **统一浏览入口：** <https://kaying-ai.github.io/open-assets/>（画廊）· 或克隆后本地打开 [`index.html`](index.html)。
- **机器可读总索引：** [`catalog.json`](catalog.json) · 单项目 [`projects/<id>/project.json`](projects/)。
- **许可证：** 美术与设计数据 [CC-BY-4.0](LICENSE-ASSETS) · 代码与脚本 [MIT](LICENSE)。

## 快速查找

| 想做什么 | 入口 |
|---|---|
| 浏览和搜索资产包 | [在线画廊](https://kaying-ai.github.io/open-assets/)：按项目 ID、名称或标签搜索 |
| 预览开心农场 | [资产目录](https://kaying-ai.github.io/open-assets/projects/happy-farm/) · [交互演示](https://kaying-ai.github.io/open-assets/projects/happy-farm/result.html) |
| 下载独立精灵 | [开心农场 PNG 素材包](projects/happy-farm/packages/ui-components-png.zip) |
| 接入游戏引擎 | [引擎导出说明](projects/happy-farm/exports/) · [Web 清单](projects/happy-farm/exports/web/manifest.json) |
| 通过程序检索 | [catalog.json](catalog.json) · [Agent 使用指南](AGENTS.md) |

目前收录 **开心农场（Happy Farm）**，适用于横屏移动游戏的温馨卡通农场 UI。目录记录了 6 张页面、30 个组件、37 个精灵和 5 种引擎交付格式。PNG、图集和清单是可集成的素材，并非完整可玩的游戏。

## 资源总表

全部项目及其内容，由 `scripts/build-catalog.mjs` 自动再生成。

<!-- catalog:start -->
| 预览 | 项目 | 平台 · 比例 | 内容 | 入口 |
|---|---|---|---|---|
| <img src="projects/happy-farm/assets/pages/farm-v1.png" width="220" alt="happy-farm"> | [**happy-farm**](projects/happy-farm/) 开心农场 | mobile-landscape · 16:9 | 6 页 · 30 组件 · 37 精灵 · 5 引擎 · 图集 2048×2048 | [目录](projects/happy-farm/index.html) · [README](projects/happy-farm/README.md) · [manifest](projects/happy-farm/exports/web/manifest.json) |
<!-- catalog:end -->

## 使用介绍 —— 面向人

从[画廊](https://kaying-ai.github.io/open-assets/)（或克隆后的 `index.html`）进入，按项目 ID、名称或标签搜索，或按标签筛选，打开某个项目即可看到页面视觉与全部透明底组件精灵。每个项目自带可浏览的资产目录（`projects/<id>/index.html`）、交互壳（`result.html`）、可直接解压的精灵包（`packages/*.zip`）、带 9-slice 元数据的打包图集（`assets/atlases/`）、各引擎交付清单（`exports/godot|unity|cocos|generic|taptap-maker/`）以及 web 令牌（`exports/web/tokens.css`）。把 PNG 与图集 JSON 导入引擎，或在 web 构建中引用 `tokens.css`；单项目 README 说明布局、状态与安全区。美术可在 CC-BY-4.0 下商用与改编；请按照 [LICENSE-ASSETS](LICENSE-ASSETS) 保留署名与许可信息并注明改动。

## 使用介绍 —— 面向 Agent

先取 [`catalog.json`](catalog.json) 枚举项目，按 `tags` / `platform` / `ratio` 选定一个，再读 `projects/<id>/project.json` 获取计数与入口、读 `projects/<id>/exports/web/manifest.json` 获取权威页面列表与图集精灵表（每个精灵含 `region [x,y,w,h]`、`pivot`、`slice {type,margins}`、`state`）。引擎集成消费 `projects/<id>/exports/<engine>/ui-main.json`（godot / unity / cocos / generic / taptap-maker），设计令牌用 `exports/web/tokens.css`；原始文件可按 `https://raw.githubusercontent.com/kaying-ai/open-assets/main/<path>` 直取。可点击控件恒含 `default` + `pressed` 两态精灵，请同时接线。再分发美术时遵守 `LICENSE-ASSETS` 的 CC-BY-4.0 署名要求。完整消费契约见 [`AGENTS.md`](AGENTS.md)。

## 仓库结构

```text
open-assets/
├─ index.html              # 统一浏览画廊（GitHub Pages 入口）
├─ catalog.json            # 全部项目的机器可读索引
├─ README.md / README.zh-CN.md
├─ LICENSE / LICENSE-ASSETS
├─ AGENTS.md               # agent 消费契约
├─ projects/<kebab-id>/    # 每项目一个自包含资产包
│  ├─ project.json         # 元数据：id、标题、平台、比例、标签、计数、版本
│  ├─ index.html           # 可浏览资产目录
│  ├─ result.html          # 交互壳
│  ├─ assets/              # pages / components / sprites / atlases
│  ├─ exports/             # godot / unity / cocos / generic / taptap-maker / web
│  ├─ contracts/ prompts/  # 溯源 + 可复现生成提示词
│  ├─ packages/            # 精灵 PNG zip
│  ├─ render/              # 确定性渲染源码（不含 node_modules）
│  └─ docs/                # gdd / prd / interaction / spec / research / plan
├─ scripts/                # publish-project.mjs · build-catalog.mjs
└─ docs/MAINTAINING.md     # 新增 / 更新 / 弃用 流程
```

## 发布与维护

一条命令新增资产包，然后 commit + push（Pages 自动重建）：

```bash
node scripts/publish-project.mjs /path/to/specs/<project-id> --id <project-id>
node scripts/build-catalog.mjs
git add -A && git commit -m "publish <project-id>" && git push
```

完整流程、体积预算与排除规则见 [`docs/MAINTAINING.md`](docs/MAINTAINING.md)。

## 许可证

- 美术与设计数据：[CC-BY-4.0](LICENSE-ASSETS) —— 署名即可分享/改编。
- 代码与脚本：[MIT](LICENSE)。