// Crops a region out of a PNG for QA inspection.
// Usage: node render/crop.mjs <in.png> <out.png> <x> <y> <w> <h>

import fs from "node:fs";
import { decodePng, encodePng } from "/Users/feng/.workbuddy/skills/kaying-for-ui/scripts/png.mjs";

const [, , inPath, outPath, xs, ys, ws, hs] = process.argv;
const x0 = Number(xs), y0 = Number(ys), w = Number(ws), h = Number(hs);
const img = decodePng(fs.readFileSync(inPath));
const out = new Uint8Array(w * h * 4);
for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    const si = ((y0 + y) * img.width + (x0 + x)) * 4;
    const di = (y * w + x) * 4;
    out[di] = img.data[si];
    out[di + 1] = img.data[si + 1];
    out[di + 2] = img.data[si + 2];
    out[di + 3] = 255;
  }
}
fs.writeFileSync(outPath, encodePng({ width: w, height: h, data: out }));
console.log(`${outPath} ${w}x${h}`);
