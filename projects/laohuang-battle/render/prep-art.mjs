// Prepares generated art plates for page composition.
//  - removes the model's red cinnabar seal (top-left) with a clone-stamp patch
//    (flat paper region, cloned from adjacent paper so tone + grain match)
//  - reports the plate's paper tone so page CSS can match it exactly
//
// The platform watermark at the bottom right is NOT patched here: every page
// composition covers the bottom shelf with opaque paper, which hides it.
//
// Usage: node render/prep-art.mjs <in.png> <out.png>

import fs from "node:fs";
import path from "node:path";
import { decodePng, encodePng } from "/Users/feng/.workbuddy/skills/kaying-for-ui/scripts/png.mjs";

const [, , inPath, outPath] = process.argv;
if (!inPath || !outPath) {
  console.error("usage: node render/prep-art.mjs <in.png> <out.png>");
  process.exit(2);
}

const img = decodePng(fs.readFileSync(inPath), path.basename(inPath));
const { width: W, height: H, data } = img;

const at = (x, y) => (y * W + x) * 4;

function medianOf(x0, y0, x1, y1) {
  const rs = [], gs = [], bs = [];
  for (let y = Math.max(0, y0); y < Math.min(H, y1); y += 3) {
    for (let x = Math.max(0, x0); x < Math.min(W, x1); x += 3) {
      const i = at(x, y);
      rs.push(data[i]); gs.push(data[i + 1]); bs.push(data[i + 2]);
    }
  }
  const med = (a) => a.sort((p, q) => p - q)[Math.floor(a.length / 2)];
  return [med(rs), med(gs), med(bs)];
}

function bbox(pred, x0, y0, x1, y1) {
  let minX = Infinity, minY = Infinity, maxX = -1, maxY = -1, hits = 0;
  for (let y = Math.max(0, y0); y < Math.min(H, y1); y++) {
    for (let x = Math.max(0, x0); x < Math.min(W, x1); x++) {
      const i = at(x, y);
      if (pred(i)) {
        hits++;
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }
  return hits > 40 ? { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1, hits } : null;
}

/** Copy pixels from (srcX + dx, srcY + dy), feathered at the patch border. */
function clonePatch(box, pad, dx, dy) {
  const x0 = Math.max(0, box.x - pad);
  const y0 = Math.max(0, box.y - pad);
  const w = box.w + pad * 2;
  const h = box.h + pad * 2;
  const src = new Uint8Array(w * h * 4);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const sx = Math.min(W - 1, Math.max(0, x0 + x + dx));
      const sy = Math.min(H - 1, Math.max(0, y0 + y + dy));
      const si = at(sx, sy);
      const di = (y * w + x) * 4;
      src[di] = data[si];
      src[di + 1] = data[si + 1];
      src[di + 2] = data[si + 2];
    }
  }
  const feather = 14;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const d = Math.min(x, y, w - 1 - x, h - 1 - y);
      const a = Math.min(1, d / feather); // 0 at the border, 1 inside
      const di = at(x0 + x, y0 + y);
      const si = (y * w + x) * 4;
      data[di] = Math.round(data[di] * (1 - a) + src[si] * a);
      data[di + 1] = Math.round(data[di + 1] * (1 - a) + src[si + 1] * a);
      data[di + 2] = Math.round(data[di + 2] * (1 - a) + src[si + 2] * a);
    }
  }
  return { x: x0, y: y0, w, h };
}

const sealBox = bbox(
  (i) => {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    return r > 105 && r - g > 42 && r - b > 36;
  },
  0, 0, Math.round(W * 0.3), Math.round(H * 0.16),
);

const actions = [];
if (sealBox) {
  const pad = 12;
  const dx = sealBox.w + pad * 2 + 40; // clone paper from the right of the seal
  actions.push({ kind: "seal-clone", from: sealBox, patched: clonePatch(sealBox, pad, dx, 0) });
}

// The platform watermark always sits in the bottom-right corner. Patch it with
// paper cloned from directly above so the plate is safe to crop anywhere.
const wm = {
  x: Math.round(W * 0.86),
  y: Math.round(H * 0.955),
  w: Math.round(W * 0.14),
  h: Math.round(H * 0.045),
};
actions.push({ kind: "watermark-clone", patched: clonePatch(wm, 10, 0, -(wm.h + 40)) });

fs.writeFileSync(outPath, encodePng(img));

const hex = (c) => `#${c.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
console.log(
  JSON.stringify(
    {
      in: path.basename(inPath),
      out: path.basename(outPath),
      size: [W, H],
      actions,
      paper_top: hex(medianOf(Math.round(W * 0.35), 6, Math.round(W * 0.65), Math.round(H * 0.05))),
      paper_bottom: hex(medianOf(Math.round(W * 0.3), H - Math.round(H * 0.06), Math.round(W * 0.7), H - 6)),
      paper_left: hex(medianOf(6, Math.round(H * 0.45), Math.round(W * 0.06), Math.round(H * 0.55))),
    },
    null,
    2,
  ),
);
