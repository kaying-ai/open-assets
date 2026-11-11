# Maintaining open-assets

Workflow for adding, updating and retiring asset packs. Commands assume you are
at the repository root with Node ≥ 18 and an authenticated `gh` / git remote.

## 1. Add a new project

```bash
node scripts/publish-project.mjs /path/to/specs/<project-id> --id <project-id>
node scripts/build-catalog.mjs
git add -A && git commit -m "publish <project-id>" && git push
```

`publish-project.mjs` copies a curated, self-contained subset into
`projects/<id>/` and writes `project.json` + a bilingual project README:

- copied: `assets/`, `exports/`, `contracts/`, `prompts/`, `packages/`,
  `index.html`, `result.html`, root planning docs → `docs/`, and `render/`
  source (`kit.js`, `reconcile.js`, `package.json`, `package-lock.json`,
  `layout.json`, `*.yaml`).
- excluded: `node_modules/`, `render/_detect/`, `*_preview*.png`, `.DS_Store`,
  empty `mappings/`. These are build scratch, never deliverables.

Counts (pages / components / sprites / engines), resolution, ratio and atlas
size are derived from the source contracts automatically; override with
`--title-en`, `--title-zh`, `--tags`, `--style`, `--version` as needed.

## 2. Update an existing project

Re-run publish with `--force` to overwrite, bump `--version` (semver), rebuild
the catalog, commit and push. Optionally tag the release:

```bash
node scripts/publish-project.mjs /path/to/specs/<id> --id <id> --force --version 1.1.0
node scripts/build-catalog.mjs
git add -A && git commit -m "update <id> to 1.1.0" && git push
git tag <id>-v1.1.0 && git push --tags
```

## 3. Deprecate / remove

- Soft: set `"status": "deprecated"` in `projects/<id>/project.json`, rebuild
  catalog (gallery shows a badge), commit.
- Hard: delete `projects/<id>/`, rebuild catalog, commit. History retains assets.

## 4. Regenerate the browsing surface

`build-catalog.mjs` rewrites, from `projects/*/project.json`:

- `index.html` — the unified gallery (GitHub Pages entry),
- `catalog.json` — machine-readable index,
- the `<!-- catalog:start -->…<!-- catalog:end -->` blocks in `README.md` and
  `README.zh-CN.md`.

Never hand-edit inside those markers; edit the scripts or `project.json` instead.

## 5. Size budget & large files

- Typical pack ≈ 16 MB, dominated by page hero PNGs (keep each ≤ ~3 MB).
- Assets are committed directly (no LFS): GitHub Pages and raw URLs must serve
  real image bytes. **Do not introduce Git LFS** — Pages does not resolve LFS
  pointers and the gallery would break.
- If a pack exceeds ~50 MB, downscale web previews and/or move full-resolution
  heroes to GitHub Releases, keeping thumbnails + sprites + atlas in-repo.

## 6. GitHub Pages

Pages serves the repo root of `main`. Every push to `main` rebuilds it; the
gallery is live at `https://kaying-ai.github.io/open-assets/`. Pages on the free
plan requires a **public** repository.

## 7. License hygiene

New artwork must be CC-BY-4.0-compatible; keep `LICENSE-ASSETS` attribution with
redistributed subsets. Code changes stay MIT (`LICENSE`).

---

## 中文摘要

- 新增：`publish-project.mjs <spec目录> --id <id>` → `build-catalog.mjs` → commit/push。
- 更新：同命令加 `--force --version x.y.z`；可打 `<id>-vX.Y.Z` tag。
- 弃用：project.json 设 `status: deprecated`（软）或删除目录（硬），再重建目录。
- 目录表面（index.html / catalog.json / README 标记块）一律由脚本再生成，勿手改标记内内容。
- 体积：单包约 16MB、主视觉单张 ≤3MB；直接 commit、**禁用 LFS**（Pages 不解析 LFS）；超 50MB 考虑缩略图+Releases。
- Pages：main 根目录，push 自动重建；免费档需公开仓库。
- 许可：美术 CC-BY-4.0（保留署名），代码 MIT。