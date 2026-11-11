# AGENTS.md — consuming open-assets

This repository publishes self-contained game UI asset packs. Follow this
contract to locate and integrate assets programmatically.

## Discovery

1. `GET catalog.json` (repo root). Shape:
   `{ schema_version, generated_at, projects: [ { id, title, title_zh, tags,
   platform, ratio, resolution, style, counts, atlas, version, license,
   preview, entry, readme, path } ] }`.
2. Filter `projects[]` by `tags`, `platform`, `ratio` to pick a pack.
3. Read `projects/<id>/project.json` for the same metadata plus `source`
   (pipeline + version) and `resources` (relative paths of every deliverable).

## Authoritative asset data

- `projects/<id>/exports/web/manifest.json` — the source of truth for a pack:
  - `pages[]`: `{ id, title, image }` (image relative to `exports/web/`).
  - `atlas`: `{ image, data, size:[w,h], sprites: { <semantic-name>: {
    component_id, state, region:[x,y,w,h], pivot:[u,v], slice:{type,margins} } } }`.
  - `colors`, `theme`, `tokens_css` for design tokens.
- `projects/<id>/assets/atlases/ui-main.json` — same sprite map, paths relative
  to the project root; pair with `assets/atlases/ui-main.png`.
- Slice semantics: `type: "9-slice"` → `margins [left,top,right,bottom]` are
  fixed borders, center stretches; `type: "1:1"` / `"full"` → do not stretch.
- States: every clickable control has `default` AND `pressed` sprites
  (`<component>-pressed`). Wire both; pressed is a darker, slightly sunk variant
  with an identical outline.

## Engine integration

- `projects/<id>/exports/<engine>/ui-main.json` for
  `godot | unity | cocos | generic | taptap-maker`. Each carries an `engine`
  field matching its folder and the atlas sprite map in engine-friendly form.
- `taptap-maker` additionally ships `theme.lua`, `component-map.json`,
  `screens.json`.
- Web: link `projects/<id>/exports/web/tokens.css`; read `manifest.json` for
  page images and atlas regions.
- Each engine folder has a `README.md` with platform-specific apply steps.

## Raw access

`https://raw.githubusercontent.com/kaying-ai/open-assets/main/<path>`
(e.g. `.../main/projects/happy-farm/assets/atlases/ui-main.png`).
The browsable gallery is `https://kaying-ai.github.io/open-assets/`.

## Provenance & regeneration

- `projects/<id>/contracts/` — style / screen / component / sprite / atlas /
  export / asset-manifest contracts (single visual source of truth).
- `projects/<id>/prompts/` — reproducible generation prompts per page/component.
- `projects/<id>/render/` — deterministic SVG→PNG kit (`kit.js`, `reconcile.js`,
  `package.json`); run `npm i` inside it only if regenerating pixels.
- `projects/<id>/docs/` — gdd / prd / interaction / spec / research / plan.

## License obligations

Artwork & design data are CC-BY-4.0 (`LICENSE-ASSETS`); code is MIT (`LICENSE`).
When redistributing artwork, retain attribution:
"UI assets from open-assets by kaying-ai (https://github.com/kaying-ai/open-assets),
licensed CC-BY-4.0." and indicate changes.