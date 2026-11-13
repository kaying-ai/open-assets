# exports/web — Web Delivery Package

Deterministic UI delivery manifest for Web/H5 (**not** a native engine project).

> Agent goal: read the files in this directory and **automatically apply** the generated UI to a Web/H5 page or preview shell.

## Files

| File | Purpose |
|---|---|
| `manifest.json` | Page list, entry, theme name, page image paths |
| `tokens.css` | **Game** design tokens `--game-*` (from `contracts/style-contract.yaml`) |
| `README.md` | This guide (Agent auto-integration guide) |

> The Web delivery shells `index.html` / `result.html` use a fixed template style (`--shell-*`), **not the game's palette**.  
> Game tokens are data reference only; they do not tint the page chrome with the game style.

## Field Semantics (`manifest.json`)

| Field | Meaning |
|---|---|
| `schema_version` | Manifest version, currently `1` |
| `project_id` / `theme` / `engine` | Project, theme name, `web` |
| `pages[]` | Page list: `id` / `title` / `image` |
| `entry` | Default entry page `id` |

`image` is a relative path pointing to an `assets/pages/*` artboard image.

## Automatic Integration Steps (Agent)

1. **Read `manifest.json`**, build routes/screens from `pages[]`; use `entry` as the first screen.  
2. **Game-side visuals** use the `--game-*` tokens from `tokens.css` (colors, corner radius, font sizes, shadows, reference canvas `--ref-width/height`). Keep the delivery shell chrome on the template `--shell-*`.  
3. **Page images** scale proportionally at original resolution (no stretching/distortion); for slicing, read the Atlas `sprites[name].region`, or use `assets/components/` directly.  
4. **9-slice** is in the sprite's `slice` field; visually confirm margins before using them for CSS `border-image` / nine-patch drawing.  
5. **Interactive shell** uses `../../result.html` (proportional scaling / 1:1 pixel view); asset and structure overview uses `../../index.html`.  
6. **Self-check**: entry opens, pages switch, tokens match style-contract, no distortion.

## Asset References

- Pages: `../../assets/pages/*`
- Atlas: `../../assets/atlases/*`
- Interactive shell: `../../result.html`
- Asset overview: `../../index.html`

## Open the Entry Page

After delivery, open `index.html` (asset and structure overview):

1. If the environment has a right-side / preview panel → open in the panel, do not launch a separate browser.
2. Otherwise → give a clickable link in the task summary and open it with the system browser (`open` / `xdg-open` / `start`).

Always include the absolute paths of `index.html` and `result.html` in the summary.

## Regenerate

```bash
kui web specs/laohuang-battle --force
```

## Gate

When `style-contract.yaml` is not approved, this package is for preview/integration only and is not the final frozen visual version.
