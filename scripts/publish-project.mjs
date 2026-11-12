#!/usr/bin/env node
// Publish a kui spec project into projects/<id>/ as a self-contained asset pack.
// Zero dependencies. Usage:
//   node scripts/publish-project.mjs <spec-dir> --id <id> [--force]
//        [--title-en T] [--title-zh T] [--tags a,b,c] [--style S] [--version V]
//        [--desc-en T] [--desc-zh T] [--publisher P]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildCatalog } from "./build-catalog.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function parseArgs(argv) {
  const a = { pos: [], opt: {}, flag: new Set() };
  for (let i = 0; i < argv.length; i++) {
    const t = argv[i];
    if (t.startsWith("--")) {
      const k = t.slice(2);
      if (i + 1 < argv.length && !argv[i + 1].startsWith("--")) a.opt[k] = argv[++i];
      else a.flag.add(k);
    } else a.pos.push(t);
  }
  return a;
}

const EXCLUDE_DIR = new Set(["node_modules", "_detect", "mappings", ".git"]);
const isExcluded = (name) =>
  EXCLUDE_DIR.has(name) || name.startsWith("_preview") || name === ".DS_Store";

function copyTree(src, dst, filter = () => true) {
  fs.mkdirSync(dst, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    if (isExcluded(e.name)) continue;
    const s = path.join(src, e.name);
    const d = path.join(dst, e.name);
    if (e.isDirectory()) copyTree(s, d, filter);
    else if (filter(s)) fs.copyFileSync(s, d);
  }
}

const readJson = (p) => (fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf8")) : null);
const readText = (p) => (fs.existsSync(p) ? fs.readFileSync(p, "utf8") : "");

function yamlScalar(text, key) {
  const m = text.match(new RegExp(`^\\s*${key}:\\s*(.+)$`, "m"));
  if (!m) return null;
  return m[1].trim().replace(/^["']|["']$/g, "");
}
function yamlIntList(text, key) {
  const m = text.match(new RegExp(`^\\s*${key}:\\s*\\[([^\\]]*)\\]`, "m"));
  if (!m) return null;
  return m[1].split(",").map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n));
}
const countFiles = (dir, re) =>
  fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => re.test(f)).length : 0;

function deriveMeta(src, id, args) {
  const style = readText(path.join(src, "contracts", "style-contract.yaml"));
  const screen = readText(path.join(src, "contracts", "screen-contract.yaml"));
  const atlasJson = readJson(path.join(src, "assets", "atlases", "ui-main.json"));
  const firstScreen = (screen.match(/screens:\s*\n\s*-\s*id:\s*([a-z0-9-]+)/) || [])[1];
  const previewFile = firstScreen && fs.existsSync(path.join(src, "assets", "pages", `${firstScreen}-v1.png`))
    ? `${firstScreen}-v1.png`
    : (fs.readdirSync(path.join(src, "assets", "pages")).filter((f) => f.endsWith(".png")).sort()[0] || "");
  const platform = `${yamlScalar(style, "target") || "mobile"}-${yamlScalar(style, "orientation") || "landscape"}`;
  const ratio = yamlScalar(style, "aspect_ratio") || "16:9";
  const resolution = yamlIntList(style, "reference_size") || [1792, 1024];
  const styleName = args.opt["style"] || yamlScalar(style, "theme") || "";
  const tags = (args.opt["tags"] ? args.opt["tags"].split(",") : [platform, ratio])
    .map((s) => s.trim()).filter(Boolean);
  const engines = fs.existsSync(path.join(src, "exports"))
    ? fs.readdirSync(path.join(src, "exports"), { withFileTypes: true })
        .filter((d) => d.isDirectory() && fs.existsSync(path.join(src, "exports", d.name, "ui-main.json")))
        .map((d) => d.name)
    : [];
  const pkg = fs.existsSync(path.join(src, "packages"))
    ? fs.readdirSync(path.join(src, "packages")).filter((f) => f.endsWith(".zip")).sort()[0] || ""
    : "";
  return {
    title: args.opt["title-en"] || yamlScalar(style, "name") || id,
    title_zh: args.opt["title-zh"] || id,
    platform, ratio, resolution, style: styleName, tags,
    counts: {
      pages: countFiles(path.join(src, "assets", "pages"), /\.png$/),
      components: countFiles(path.join(src, "assets", "components"), /-default-v1\.png$/),
      sprites: atlasJson ? Object.keys(atlasJson.sprites || {}).length : 0,
      engines: engines.length,
    },
    atlas: atlasJson ? { size: atlasJson.size, image: "assets/atlases/ui-main.png", data: "assets/atlases/ui-main.json" } : null,
    preview: previewFile ? `assets/pages/${previewFile}` : "",
    engines, pkg,
  };
}

function projectReadme(meta, id) {
  const c = meta.counts;
  const engineLinks = meta.engines.map((e) => "[" + e + "](exports/" + e + "/ui-main.json)").join(" · ");
  const atlasSize = meta.atlas ? meta.atlas.size.join("×") : "—";
  return `# ${id} — ${meta.title} / ${meta.title_zh}

[English](#english) | [中文](#中文)

## English

A self-contained game UI asset pack (${meta.platform}, ${meta.ratio}, ${meta.resolution.join("×")}, style: ${meta.style}).
Contents: ${c.pages} page visuals, ${c.components} components (${c.sprites} state sprites), a packed atlas (${atlasSize}), ${c.engines} engine handoff manifests, web tokens and a sprite ZIP.

- Browse: [index.html](index.html) · interactive shell [result.html](result.html)
- Sprites: [assets/components/](assets/components/) · split elements [assets/sprites/](assets/sprites/) · package [packages/${meta.pkg}](packages/${meta.pkg})
- Atlas: [assets/atlases/ui-main.png](assets/atlases/ui-main.png) + [ui-main.json](assets/atlases/ui-main.json)
- Engines: ${engineLinks}
- Web tokens: [exports/web/tokens.css](exports/web/tokens.css) · manifest [exports/web/manifest.json](exports/web/manifest.json)
- Provenance: [contracts/](contracts/) · [prompts/](prompts/) · [docs/](docs/) · render source [render/](render/)

Controls ship default + pressed sprites; 9-slice margins are in the atlas JSON.
Artwork CC-BY-4.0 (credit "open-assets by kaying-ai"); code MIT. See repo [LICENSE-ASSETS](../../LICENSE-ASSETS).

## 中文

自包含游戏 UI 资产包（${meta.platform}、${meta.ratio}、${meta.resolution.join("×")}、风格：${meta.style}）。
含 ${c.pages} 张页面视觉、${c.components} 个组件（${c.sprites} 个状态精灵）、打包图集（${atlasSize}）、${c.engines} 份引擎交付清单、web 令牌与精灵 ZIP。

- 浏览：[index.html](index.html) · 交互壳 [result.html](result.html)
- 精灵：[assets/components/](assets/components/) · 切分元素 [assets/sprites/](assets/sprites/) · 包 [packages/${meta.pkg}](packages/${meta.pkg})
- 图集：[assets/atlases/ui-main.png](assets/atlases/ui-main.png) + [ui-main.json](assets/atlases/ui-main.json)
- 引擎：${engineLinks}
- Web 令牌：[exports/web/tokens.css](exports/web/tokens.css) · 清单 [exports/web/manifest.json](exports/web/manifest.json)
- 溯源：[contracts/](contracts/) · [prompts/](prompts/) · [docs/](docs/) · 渲染源码 [render/](render/)

控件含 default + pressed 两态；9-slice 边距见图集 JSON。美术 CC-BY-4.0（署名 open-assets by kaying-ai），代码 MIT。
`;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const srcArg = args.pos[0];
  if (!srcArg) {
    console.error("usage: publish-project.mjs <spec-dir> --id <id> [--force] [--title-en T] [--title-zh T] [--tags a,b] [--style S] [--version V] [--desc-en T] [--desc-zh T] [--publisher P]");
    process.exit(2);
  }
  const src = path.resolve(srcArg);
  const id = args.opt["id"] || path.basename(src);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) {
    console.error(`invalid id (kebab-case required): ${id}`);
    process.exit(2);
  }
  if (!fs.existsSync(path.join(src, "assets"))) {
    console.error(`not a kui spec project (missing assets/): ${src}`);
    process.exit(2);
  }
  const dst = path.join(ROOT, "projects", id);
  if (fs.existsSync(dst) && !args.flag.has("force")) {
    console.error(`already published: projects/${id}; use --force to overwrite`);
    process.exit(1);
  }
  if (fs.existsSync(dst)) fs.rmSync(dst, { recursive: true, force: true });

  const meta = deriveMeta(src, id, args);
  for (const dir of ["assets", "exports", "contracts", "prompts", "packages"]) {
    const s = path.join(src, dir);
    if (fs.existsSync(s)) copyTree(s, path.join(dst, dir));
  }
  for (const f of ["index.html", "result.html"]) {
    const s = path.join(src, f);
    if (fs.existsSync(s)) fs.copyFileSync(s, path.join(dst, f));
  }
  const renderSrc = path.join(src, "render");
  if (fs.existsSync(renderSrc)) {
    copyTree(renderSrc, path.join(dst, "render"), (p) => !/node_modules|_detect|_preview/.test(p));
  }
  const docsDir = path.join(dst, "docs");
  fs.mkdirSync(docsDir, { recursive: true });
  for (const f of ["gdd.md", "prd.md", "interaction.md", "spec.md", "research.md", "plan.md", "quickstart.md", "tasks.md"]) {
    const s = path.join(src, f);
    if (fs.existsSync(s)) fs.copyFileSync(s, path.join(docsDir, f));
  }

  const project = {
    schema_version: 1,
    id,
    title: meta.title,
    title_zh: meta.title_zh,
    publisher: args.opt["publisher"] || "kaying-ai",
    description:
      args.opt["desc-en"] ||
      `${meta.title}: ${meta.counts.pages} page visuals, ${meta.counts.components} components, ${meta.counts.sprites} state sprites.`,
    description_zh:
      args.opt["desc-zh"] ||
      `${meta.title_zh}：${meta.counts.pages} 张页面视觉、${meta.counts.components} 个组件、${meta.counts.sprites} 个状态精灵。`,
    platform: meta.platform,
    ratio: meta.ratio,
    resolution: meta.resolution,
    style: meta.style,
    tags: meta.tags,
    counts: meta.counts,
    atlas: meta.atlas,
    version: args.opt["version"] || "1.0.0",
    status: "active",
    license: { assets: "CC-BY-4.0", code: "MIT" },
    preview: meta.preview,
    entry: "index.html",
    readme: "README.md",
    resources: {
      catalog: "index.html",
      shell: "result.html",
      manifest: "exports/web/manifest.json",
      tokens: "exports/web/tokens.css",
      atlas_png: "assets/atlases/ui-main.png",
      atlas_json: "assets/atlases/ui-main.json",
      package: meta.pkg ? `packages/${meta.pkg}` : "",
      engines: Object.fromEntries(meta.engines.map((e) => [e, `exports/${e}/ui-main.json`])),
    },
    source: { pipeline: "kaying-for-ui", spec: path.basename(src) },
  };
  fs.writeFileSync(path.join(dst, "project.json"), JSON.stringify(project, null, 2) + "\n");
  fs.writeFileSync(path.join(dst, "README.md"), projectReadme(meta, id));

  const catalog = buildCatalog(ROOT);
  console.log(`published projects/${id} (${meta.counts.pages} pages, ${meta.counts.components} components, ${meta.counts.sprites} sprites, ${meta.counts.engines} engines)`);
  console.log(`catalog rebuilt: ${catalog.projects.length} project(s)`);
}

main();