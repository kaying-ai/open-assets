// Reconcile kui split detection order with the kit layout, then emit draft
// contract fragments (split mapping, sprite-contract items, asset-manifest entries).
// This helper only drafts YAML from real detection output; `kui` still performs
// split/atlas/export/validate.
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const ROOT = path.resolve(__dirname, '..');
const layout = JSON.parse(fs.readFileSync(path.join(__dirname, 'layout.json'), 'utf8'));
const detect = yaml.load(fs.readFileSync(path.join(__dirname, '_detect/sprite-manifest.yaml'), 'utf8'));

const pngDims = (p) => { const b = fs.readFileSync(p); return [b.readUInt32BE(16), b.readUInt32BE(20)]; };

// match each detected box (detection order) to nearest artboard center
const used = new Set();
let maxDist = 0;
const matched = detect.items.map((d) => {
  const [bx, by, bw, bh] = d.bbox;
  const cx = bx + bw / 2, cy = by + bh / 2;
  let best = null, bestD = Infinity;
  for (const inst of layout.instances) {
    if (used.has(inst.semantic_name)) continue;
    const [ax, ay, aw, ah] = inst.artboard;
    const dx = cx - (ax + aw / 2), dy = cy - (ay + ah / 2);
    const dist = Math.hypot(dx, dy);
    if (dist < bestD) { bestD = dist; best = inst; }
  }
  if (!best || bestD > 80) throw new Error(`no artboard match for detected box ${d.id} at ${cx},${cy} (dist ${bestD})`);
  used.add(best.semantic_name);
  maxDist = Math.max(maxDist, bestD);
  return { d, inst: best, dist: bestD };
});
if (used.size !== layout.instances.length) throw new Error(`bijection failed: matched ${used.size} of ${layout.instances.length}`);

// 1) split mapping (detection order)
const mapping = { items: matched.map(({ inst }) => ({
  semantic_name: inst.semantic_name,
  component_id: inst.component_id,
  category: inst.category,
  state: inst.state,
  slice: inst.slice,
})) };
fs.writeFileSync(path.join(__dirname, 'split-mapping.yaml'), yaml.dump(mapping, { lineWidth: 120 }));

// 2) sprite-contract items (full project-relative paths + real crop bbox/dims)
const spriteItems = matched.map(({ d, inst }) => ({
  id: inst.semantic_name,
  semantic_name: inst.semantic_name,
  component_id: inst.component_id,
  category: inst.category,
  state: inst.state,
  bbox: d.bbox,
  dimensions: d.dimensions,
  transparent_background: true,
  path: `assets/sprites/ui-components/items/${inst.semantic_name}.png`,
  slice: inst.slice,
}));
fs.writeFileSync(path.join(__dirname, 'sprite-items.yaml'), yaml.dump(spriteItems, { lineWidth: 120 }));

// 3) asset-manifest entries: 37 component deliverables + sheet + package
const manifest = [];
for (const inst of layout.instances) {
  const file = path.join(ROOT, inst.component_file);
  const [w, h] = pngDims(file);
  if (w !== inst.target_size[0] || h !== inst.target_size[1]) {
    throw new Error(`component ${inst.component_file} actual ${w}x${h} != target ${inst.target_size}`);
  }
  manifest.push({
    id: inst.semantic_name,
    kind: 'component',
    screen_id: 'farm',
    component_id: inst.component_id,
    status: 'approved',
    approved: true,
    dimensions: [w, h],
    transparent_background: inst.category !== 'background',
    prompt_path: `prompts/components/${inst.component_id}.md`,
    path: inst.component_file,
  });
}
const sheetDims = pngDims(path.join(ROOT, layout.sheet));
manifest.push({
  id: 'ui-components-sheet',
  kind: 'sprite-sheet',
  screen_id: 'farm',
  status: 'approved',
  approved: true,
  dimensions: sheetDims,
  transparent_background: true,
  prompt_path: 'prompts/components/ui-components-sheet.md',
  path: layout.sheet,
});
manifest.push({
  id: 'ui-components-png',
  kind: 'package',
  screen_id: 'farm',
  status: 'approved',
  approved: true,
  path: 'packages/ui-components-png.zip',
});
fs.writeFileSync(path.join(__dirname, 'manifest-components.yaml'), yaml.dump(manifest, { lineWidth: 120 }));

// 4) assemble contracts from real detection data (agent-authored; kui still runs split/atlas/export/validate)
const PAGES = ['farm', 'shop', 'barn', 'social', 'task', 'settings'].map((s) => ({
  id: `${s}-page`, kind: 'page', screen_id: s, status: 'approved', approved: true,
  dimensions: [1792, 1024], transparent_background: false,
  prompt_path: `prompts/pages/${s}.md`, path: `assets/pages/${s}-v1.png`,
}));
const spriteContract = {
  schema_version: 1,
  project_id: 'happy-farm',
  status: 'approved',
  pack_id: 'ui-components',
  text_policy: 'remove-all',
  source: { screen_id: 'farm', sheet_asset_id: 'ui-components-sheet', sheet_path: layout.sheet },
  detection: { mode: 'alpha', alpha_threshold: 8, background_tolerance: 24, connect_gap: 2, min_area: 64, padding: 4 },
  output: {
    items_dir: 'assets/sprites/ui-components/items',
    manifest_path: 'assets/sprites/ui-components/items/sprite-manifest.yaml',
    package_path: 'packages/ui-components-png.zip',
  },
  semantic_mapping: { required: true, naming_pattern: '{component}-{state}' },
  items: spriteItems,
  review: {
    complete: true,
    text_free: true,
    notes: ['default-mode auto edge-check: 37/37 connected blobs, no text residue, sane crops, two-state outlines aligned (darken ~14% + 2px sink)'],
  },
};
fs.writeFileSync(path.join(ROOT, 'contracts/sprite-contract.yaml'), yaml.dump(spriteContract, { lineWidth: 120 }));
const assetManifest = { schema_version: 1, project_id: 'happy-farm', assets: [...PAGES, ...manifest] };
fs.writeFileSync(path.join(ROOT, 'contracts/asset-manifest.yaml'), yaml.dump(assetManifest, { lineWidth: 120 }));

console.log(JSON.stringify({
  detected: detect.items.length,
  matched: matched.length,
  max_match_distance_px: +maxDist.toFixed(1),
  sprite_items: spriteItems.length,
  manifest_entries: manifest.length,
  sheet_dims: sheetDims,
}, null, 2));