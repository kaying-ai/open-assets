<!-- Thanks for contributing to open-assets! Keep the title short: "add <id> UI pack". -->

## What this PR adds

- Project id: `<kebab-id>`
- Publisher (GitHub handle): `<your-handle>`
- One-line intro (EN / 中文):
- Platform · ratio · resolution:
- Style / tags:

## Checklist

- [ ] Artwork is mine / CC-BY-4.0-compatible; attribution retained.
- [ ] `projects/<id>/project.json` present; intro, publisher, counts, ratio, resolution, tags correct.
- [ ] `catalog.json`, root `index.html` and both README catalog blocks regenerated (`node scripts/build-catalog.mjs`).
- [ ] No `node_modules/`, `_detect/`, `_preview*` or other scratch committed (`git status --short`).
- [ ] Size budget respected (pack ≲ 50 MB; each page hero ≲ 3 MB); no Git LFS.
- [ ] Clickable controls ship `default` + `pressed`; atlas 9-slice margins leave a stretchable center.
- [ ] Gallery shows the new card and its images load on GitHub Pages.

## How it was generated

<!-- e.g. kui spec project at /path/to/specs/<id>, published with:
     node scripts/publish-project.mjs /path/to/specs/<id> --id <id> --publisher <your-handle> --desc-en "…" --desc-zh "…" -->

## Notes for maintainers

<!-- Anything reviewers should know: licensing of source art, known caveats, follow-ups. -->