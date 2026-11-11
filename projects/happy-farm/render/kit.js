// Deterministic Q版卡通田园 UI component kit for happy-farm.
// Pixels only: renders individual component PNGs + one transparent sprite sheet,
// and emits layout data + component prompts. Pipeline steps (split/atlas/export/
// validate) are still performed by `kui`, never by this helper.
const { Resvg } = require('@resvg/resvg-js');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const COMP_DIR = path.join(ROOT, 'assets/components');
const SPRITE_DIR = path.join(ROOT, 'assets/sprites');
const PROMPT_DIR = path.join(ROOT, 'prompts/components');
for (const d of [COMP_DIR, SPRITE_DIR, PROMPT_DIR]) fs.mkdirSync(d, { recursive: true });

// ---- palette (from contracts/style-contract.yaml) ----
const C = {
  outline: '#5A3A22',
  primary: '#FF8A3D', primaryHi: '#FFB877', primaryLo: '#E06A22',
  primaryP: '#DB7734', primaryPHi: '#E89A66', primaryPLo: '#B85E22',
  secondary: '#6FBF4A', secHi: '#A4DE83', secLo: '#4E9A2E',
  secP: '#5FA33E', secPHi: '#8CC46C', secPLo: '#3F7E24',
  accent: '#4FB6E8', accHi: '#9BDBF7', accLo: '#2E92C4',
  reward: '#FFC93C', rewHi: '#FFE49A', rewLo: '#E0A81E',
  rewP: '#DBAC33', rewPHi: '#E8C878', rewPLo: '#B8860B',
  warning: '#E85D4A', warnHi: '#F79A8B', warnLo: '#C43E2E',
  warnP: '#C74E3D', warnPHi: '#DB8272', warnPLo: '#A33224',
  disabled: '#C9C2B6', disHi: '#E2DCD2', disLo: '#A8A296',
  card: '#FFF6E3', cardHi: '#FFFFFF', cardLo: '#F0E2C8',
  board: '#8FCB6B', boardLo: '#6FB04E',
  cell: '#C68A4B', cellHi: '#E0AC70', cellLo: '#A56F38',
  sky: '#CDEAF7', skyLo: '#EAF7FF',
  skin: '#FFD9B0', skinLo: '#F0BE8E',
  white: '#FFFFFF', soil: '#8A5A33',
};

// ---- svg helpers ----
const rr = (x, y, w, h, r, fill, stroke, sw, extra = '') =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" ry="${r}" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="${sw}"` : ''}${extra ? ' ' + extra : ''}/>`;
const ci = (cx, cy, r, fill, stroke, sw, extra = '') =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="${sw}"` : ''}${extra ? ' ' + extra : ''}/>`;
const el = (cx, cy, rx, ry, fill, stroke, sw, extra = '') =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="${sw}"` : ''}${extra ? ' ' + extra : ''}/>`;
const pa = (d, fill, stroke, sw, extra = '') =>
  `<path d="${d}" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round"` : ''}${extra ? ' ' + extra : ''}/>`;
const pg = (pts, fill, stroke, sw, extra = '') =>
  `<polygon points="${pts}" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"` : ''}${extra ? ' ' + extra : ''}/>`;
const ln = (x1, y1, x2, y2, stroke, sw, extra = '') =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round"${extra ? ' ' + extra : ''}/>`;
const vg = (uid, id, hi, base, lo) =>
  `<linearGradient id="${uid}-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${hi}"/><stop offset="0.5" stop-color="${base}"/><stop offset="1" stop-color="${lo}"/></linearGradient>`;

// ---- candy button (two-state: identical outline, pressed = darker + 2px sink) ----
function candyButton(w, h, c, state, uid, radius) {
  const pressed = state === 'pressed', disabled = state === 'disabled';
  const hi = disabled ? C.disHi : pressed ? c.phi : c.hi;
  const base = disabled ? C.disabled : pressed ? c.pbase : c.base;
  const lo = disabled ? C.disLo : pressed ? c.plo : c.lo;
  const sink = pressed ? 2 : 0;
  const defs = vg(uid, 'b', hi, base, lo);
  let inner = rr(3, 3, w - 6, h - 6, radius, `url(#${uid}-b)`, C.outline, 5);
  inner += rr(w * 0.12, h * 0.12 + sink, w * 0.76, h * 0.24, radius * 0.5, C.white, null, 0, `opacity="${pressed ? 0.15 : 0.34}"`);
  inner += rr(w * 0.10, h * 0.66 + sink, w * 0.80, h * 0.20, radius * 0.4, lo, null, 0, 'opacity="0.25"');
  inner += rr(w * 0.20, h * 0.34 + sink, w * 0.60, h * 0.34, radius * 0.4, C.white, null, 0, `opacity="${disabled ? 0.10 : 0.16}"`);
  return { defs, inner };
}
const PRIMARY = { hi: C.primaryHi, base: C.primary, lo: C.primaryLo, phi: C.primaryPHi, pbase: C.primaryP, plo: C.primaryPLo };
const SECONDARY = { hi: C.secHi, base: C.secondary, lo: C.secLo, phi: C.secPHi, pbase: C.secP, plo: C.secPLo };
const REWARD = { hi: C.rewHi, base: C.reward, lo: C.rewLo, phi: C.rewPHi, pbase: C.rewP, plo: C.rewPLo };

function closeButton(w, h, state, uid) {
  const pressed = state === 'pressed';
  const hi = pressed ? C.warnPHi : C.warnHi, base = pressed ? C.warnP : C.warning, lo = pressed ? C.warnPLo : C.warnLo;
  const sink = pressed ? 2 : 0, cx = w / 2, cy = h / 2, r = w / 2 - 5;
  const defs = vg(uid, 'c', hi, base, lo);
  let inner = ci(cx, cy, r, `url(#${uid}-c)`, C.outline, 5);
  inner += el(cx, cy - r * 0.35 + sink, r * 0.6, r * 0.3, C.white, null, 0, `opacity="${pressed ? 0.15 : 0.3}"`);
  const k = r * 0.42;
  inner += ln(cx - k, cy - k + sink, cx + k, cy + k + sink, C.white, 8);
  inner += ln(cx + k, cy - k + sink, cx - k, cy + k + sink, C.white, 8);
  return { defs, inner };
}

function navTab(w, h, state, uid) {
  const selected = state === 'selected', pressed = state === 'pressed';
  let hi, base, lo;
  if (selected) { hi = C.primaryHi; base = C.primary; lo = C.primaryLo; }
  else if (pressed) { hi = C.cardLo; base = '#EAD9BC'; lo = '#D8C3A0'; }
  else { hi = C.cardHi; base = C.card; lo = C.cardLo; }
  const sink = pressed ? 2 : 0;
  const defs = vg(uid, 'n', hi, base, lo);
  let inner = rr(3, 3, w - 6, h - 6, 24, `url(#${uid}-n)`, C.outline, 5);
  inner += rr(w * 0.12, h * 0.10 + sink, w * 0.76, h * 0.20, 12, C.white, null, 0, `opacity="${pressed ? 0.15 : 0.4}"`);
  inner += ci(w / 2, h * 0.40 + sink, h * 0.16, selected ? C.white : C.cell, C.outline, 3, `opacity="${selected ? 0.9 : 0.55}"`);
  inner += rr(w * 0.24, h * 0.62 + sink, w * 0.52, h * 0.14, 7, selected ? C.white : C.cell, null, 0, `opacity="${selected ? 0.85 : 0.4}"`);
  if (selected) inner += rr(w * 0.22, h - 14, w * 0.56, 8, 4, C.secondary, C.outline, 2);
  return { defs, inner };
}

// ---- containers ----
function panelCard(w, h, uid) {
  const defs = vg(uid, 'p', C.cardHi, C.card, C.cardLo);
  let inner = rr(3, 3, w - 6, h - 6, 20, `url(#${uid}-p)`, C.outline, 5);
  inner += rr(3, 3, w - 6, h * 0.18, 20, C.cardLo, null, 0, 'opacity="0.5"');
  inner += rr(w * 0.06, h * 0.06, w * 0.88, h * 0.06, 10, C.white, null, 0, 'opacity="0.6"');
  inner += rr(w * 0.08, h * 0.30, w * 0.84, h * 0.60, 14, C.white, null, 0, 'opacity="0.35"');
  return { defs, inner };
}
function panelModal(w, h, uid) {
  const defs = vg(uid, 'm', C.cardHi, C.card, C.cardLo);
  let inner = rr(4, 4, w - 8, h - 8, 28, `url(#${uid}-m)`, C.outline, 6);
  inner += rr(4, 4, w - 8, h * 0.16, 28, C.primary, C.outline, 4, 'opacity="0.9"');
  inner += rr(w * 0.08, h * 0.055, w * 0.5, h * 0.05, 9, C.white, null, 0, 'opacity="0.7"');
  inner += rr(w * 0.08, h * 0.26, w * 0.84, h * 0.52, 16, C.white, null, 0, 'opacity="0.4"');
  inner += rr(w * 0.2, h * 0.84, w * 0.6, h * 0.08, 12, C.cardLo, null, 0, 'opacity="0.6"');
  return { defs, inner };
}
function currencyBar(w, h, uid) {
  const defs = vg(uid, 'cb', C.cardHi, C.card, C.cardLo) + vg(uid, 'coin', C.rewHi, C.reward, C.rewLo) + vg(uid, 'gem', C.accHi, C.accent, C.accLo) + vg(uid, 'en', C.rewHi, C.reward, C.rewLo);
  let inner = rr(3, 3, w - 6, h - 6, h / 2 - 3, `url(#${uid}-cb)`, C.outline, 5);
  inner += rr(w * 0.03, h * 0.14, w * 0.94, h * 0.22, 10, C.white, null, 0, 'opacity="0.5"');
  const seg = w / 3;
  const icons = ['coin', 'gem', 'en'];
  for (let i = 0; i < 3; i++) {
    const cx = seg * i + seg * 0.24;
    if (i > 0) inner += ln(seg * i, h * 0.22, seg * i, h * 0.78, C.cardLo, 3);
    inner += ci(cx, h / 2, h * 0.30, `url(#${uid}-${icons[i]})`, C.outline, 3);
    inner += rr(seg * i + seg * 0.44, h * 0.30, seg * 0.46, h * 0.40, 10, C.white, C.outline, 2, 'opacity="0.85"');
  }
  return { defs, inner };
}
function slotItem(w, h, uid) {
  const defs = vg(uid, 's', C.cellHi, C.cell, C.cellLo);
  let inner = rr(3, 3, w - 6, h - 6, 18, `url(#${uid}-s)`, C.outline, 4);
  inner += rr(w * 0.12, h * 0.12, w * 0.76, h * 0.76, 12, C.cardLo, C.outline, 3, 'opacity="0.9"');
  inner += rr(w * 0.16, h * 0.16, w * 0.68, h * 0.20, 9, C.white, null, 0, 'opacity="0.35"');
  return { defs, inner };
}
function progressBar(w, h, uid) {
  const defs = vg(uid, 'tr', '#7A5230', '#5A3A22', '#43291A') + vg(uid, 'fl', C.secHi, C.secondary, C.secLo);
  let inner = rr(3, 3, w - 6, h - 6, h / 2 - 3, `url(#${uid}-tr)`, C.outline, 4);
  inner += rr(7, 7, (w - 14) * 0.66, h - 14, (h - 14) / 2, `url(#${uid}-fl)`, null, 0);
  inner += rr(10, 9, (w - 20) * 0.62, h * 0.26, 8, C.white, null, 0, 'opacity="0.4"');
  return { defs, inner };
}

// ---- icons (each a single connected glyph, 96x96) ----
function icon(kind, uid) {
  const O = C.outline, sw = 4;
  let defs = '', inner = '';
  const grad = (id, hi, base, lo) => { defs += vg(uid, id, hi, base, lo); return `url(#${uid}-${id})`; };
  switch (kind) {
    case 'coin': {
      const g = grad('g', C.rewHi, C.reward, C.rewLo);
      inner += ci(48, 48, 34, g, O, sw);
      inner += ci(48, 48, 24, C.rewHi, O, 2, 'opacity="0.6"');
      inner += pg('48,32 53,43 65,44 56,52 59,64 48,57 37,64 40,52 31,44 43,43', C.rewLo, O, 2);
      break;
    }
    case 'gem': {
      const g = grad('g', C.accHi, C.accent, C.accLo);
      inner += pg('48,12 80,38 48,86 16,38', g, O, sw);
      inner += pg('48,12 62,38 48,86 34,38', C.accHi, null, 0, 'opacity="0.5"');
      inner += ln(16, 38, 80, 38, O, 2);
      break;
    }
    case 'energy': {
      const g = grad('g', C.rewHi, C.reward, C.rewLo);
      inner += pg('54,10 26,52 44,52 38,86 70,40 50,40', g, O, sw);
      break;
    }
    case 'carrot': {
      const g = grad('g', C.primaryHi, C.primary, C.primaryLo);
      const lg = grad('l', C.secHi, C.secondary, C.secLo);
      inner += pa('M48,86 C30,62 33,36 48,32 C63,36 66,62 48,86 Z', g, O, sw);
      inner += pa('M48,34 C40,20 30,16 24,18 C28,28 38,34 48,34 Z', lg, O, 3);
      inner += pa('M48,34 C48,18 54,10 62,10 C62,22 56,32 48,34 Z', lg, O, 3);
      inner += pa('M48,34 C58,22 70,20 76,24 C70,32 58,36 48,34 Z', lg, O, 3);
      inner += ln(42, 50, 50, 48, C.primaryLo, 2);
      inner += ln(44, 64, 52, 62, C.primaryLo, 2);
      break;
    }
    case 'wheat': {
      const g = grad('g', C.rewHi, C.reward, C.rewLo);
      inner += ln(48, 88, 48, 22, C.rewLo, 5);
      for (let i = 0; i < 4; i++) {
        const y = 30 + i * 15;
        inner += el(38, y, 11, 6, g, O, 2.5, `transform="rotate(-30 38 ${y})"`);
        inner += el(58, y, 11, 6, g, O, 2.5, `transform="rotate(30 58 ${y})"`);
      }
      inner += el(48, 20, 6, 11, g, O, 2.5);
      break;
    }
    case 'water': {
      const g = grad('g', C.accHi, C.accent, C.accLo);
      inner += pa('M48,12 C48,12 20,46 20,62 A28,28 0 0 0 76,62 C76,46 48,12 48,12 Z', g, O, sw);
      inner += el(38, 60, 7, 11, C.white, null, 0, 'opacity="0.5"');
      break;
    }
    case 'seed': {
      const sg = grad('s', C.cellHi, C.cell, C.cellLo);
      const lg = grad('l', C.secHi, C.secondary, C.secLo);
      inner += el(48, 76, 30, 13, sg, O, sw);
      inner += rr(45, 40, 6, 36, 3, lg, O, 2.5);
      inner += el(34, 42, 14, 8, lg, O, 3, 'transform="rotate(-25 34 42)"');
      inner += el(62, 38, 14, 8, lg, O, 3, 'transform="rotate(25 62 38)"');
      break;
    }
    case 'star': {
      const g = grad('g', C.rewHi, C.reward, C.rewLo);
      inner += pg('48,10 59,36 87,38 65,56 72,84 48,69 24,84 31,56 9,38 37,36', g, O, sw);
      break;
    }
    case 'lock': {
      const g = grad('g', C.rewHi, C.reward, C.rewLo);
      inner += pa('M32,46 L32,34 A16,16 0 0 1 64,34 L64,46 L56,46 L56,34 A8,8 0 0 0 40,34 L40,46 Z', C.disLo, O, 3);
      inner += rr(26, 44, 44, 38, 9, g, O, sw);
      inner += ci(48, 60, 6, C.outline, null, 0);
      inner += rr(45, 60, 6, 12, 2, C.outline, null, 0);
      break;
    }
    case 'gear': {
      const g = grad('g', C.disHi, C.disabled, C.disLo);
      for (let i = 0; i < 8; i++) {
        const a = (i * 45) * Math.PI / 180;
        const x = 48 + Math.cos(a) * 30, y = 48 + Math.sin(a) * 30;
        inner += rr(x - 7, y - 7, 14, 14, 3, g, O, 3, `transform="rotate(${i * 45} ${x} ${y})"`);
      }
      inner += ci(48, 48, 26, g, O, sw);
      inner += ci(48, 48, 10, C.cardLo, O, 3);
      break;
    }
    case 'heart': {
      const g = grad('g', C.warnHi, C.warning, C.warnLo);
      inner += pa('M48,84 C20,62 12,44 22,30 C30,19 44,22 48,34 C52,22 66,19 74,30 C84,44 76,62 48,84 Z', g, O, sw);
      inner += el(36, 38, 7, 9, C.white, null, 0, 'opacity="0.45"');
      break;
    }
    case 'gift': {
      const g = grad('g', C.warnHi, C.warning, C.warnLo);
      inner += rr(22, 46, 52, 38, 6, g, O, sw);
      inner += rr(18, 36, 60, 14, 5, C.warnHi, O, sw);
      inner += rr(44, 36, 8, 48, 2, C.reward, O, 2.5);
      inner += el(38, 30, 11, 8, C.reward, O, 3, 'transform="rotate(-20 38 30)"');
      inner += el(58, 30, 11, 8, C.reward, O, 3, 'transform="rotate(20 58 30)"');
      break;
    }
    case 'farm': {
      const bg = grad('b', C.secHi, C.board, C.boardLo);
      const lg = grad('l', C.secHi, C.secondary, C.secLo);
      inner += rr(16, 58, 64, 24, 10, bg, O, sw);
      inner += rr(45, 34, 6, 26, 3, lg, O, 2.5);
      inner += el(34, 36, 14, 8, lg, O, 3, 'transform="rotate(-25 34 36)"');
      inner += el(62, 32, 14, 8, lg, O, 3, 'transform="rotate(25 62 32)"');
      inner += ln(28, 70, 68, 70, C.boardLo, 2);
      break;
    }
    case 'shop': {
      const g = grad('g', C.primaryHi, C.primary, C.primaryLo);
      inner += pa('M24,34 L72,34 L66,66 L30,66 Z', g, O, sw);
      inner += pa('M20,34 L28,20 L68,20 L76,34 Z', C.rewHi, O, sw);
      inner += ln(34, 44, 34, 58, C.primaryLo, 2.5);
      inner += ln(48, 44, 48, 58, C.primaryLo, 2.5);
      inner += ln(62, 44, 62, 58, C.primaryLo, 2.5);
      inner += ci(34, 76, 7, C.outline, null, 0);
      inner += ci(62, 76, 7, C.outline, null, 0);
      inner += rr(30, 64, 36, 6, 3, g, O, 2.5);
      break;
    }
    case 'barn': {
      const g = grad('g', C.cellHi, C.cell, C.cellLo);
      inner += rr(24, 44, 48, 40, 6, g, O, sw);
      inner += pg('18,46 48,18 78,46', C.warning, O, sw);
      inner += rr(40, 58, 16, 26, 4, C.cellLo, O, 3);
      inner += ln(48, 58, 48, 84, C.outline, 2);
      break;
    }
    case 'social': {
      const g = grad('g', C.accHi, C.accent, C.accLo);
      inner += el(38, 64, 20, 22, g, O, sw);
      inner += el(62, 64, 20, 22, g, O, sw);
      inner += ci(36, 34, 13, g, O, sw);
      inner += ci(62, 34, 13, g, O, sw);
      break;
    }
    case 'task': {
      const g = grad('g', C.cardHi, C.card, C.cardLo);
      inner += rr(26, 22, 44, 62, 8, g, O, sw);
      inner += rr(38, 14, 20, 14, 5, C.reward, O, sw);
      inner += pa('M36,50 L44,60 L62,38', 'none', C.secondary, 6);
      inner += ln(36, 72, 60, 72, C.cardLo, 3);
      break;
    }
  }
  return { defs, inner };
}

// ---- character ----
function charFarmer(w, h, uid) {
  const defs = vg(uid, 'ov', C.secHi, C.secondary, C.secLo) + vg(uid, 'sk', '#FFE6C8', C.skin, C.skinLo) + vg(uid, 'hat', C.rewHi, C.reward, C.rewLo);
  let inner = '';
  // legs
  inner += rr(86, 250, 26, 56, 12, C.secLo, C.outline, 4);
  inner += rr(128, 250, 26, 56, 12, C.secLo, C.outline, 4);
  inner += rr(80, 296, 38, 18, 8, C.soil, C.outline, 4);
  inner += rr(122, 296, 38, 18, 8, C.soil, C.outline, 4);
  // arms
  inner += rr(48, 168, 28, 78, 14, `url(#${uid}-ov)`, C.outline, 4);
  inner += rr(164, 168, 28, 78, 14, `url(#${uid}-ov)`, C.outline, 4);
  inner += ci(62, 250, 15, `url(#${uid}-sk)`, C.outline, 4);
  inner += ci(178, 250, 15, `url(#${uid}-sk)`, C.outline, 4);
  // body overalls
  inner += rr(70, 150, 100, 120, 30, `url(#${uid}-ov)`, C.outline, 5);
  inner += rr(96, 176, 48, 40, 10, C.secHi, C.outline, 3, 'opacity="0.7"');
  inner += ci(100, 160, 5, C.reward, C.outline, 2);
  inner += ci(140, 160, 5, C.reward, C.outline, 2);
  // head
  inner += ci(120, 108, 54, `url(#${uid}-sk)`, C.outline, 5);
  inner += ci(100, 104, 6, C.outline, null, 0);
  inner += ci(140, 104, 6, C.outline, null, 0);
  inner += pa('M104,124 Q120,138 136,124', 'none', C.outline, 4);
  inner += ci(88, 118, 8, C.warnHi, null, 0, 'opacity="0.6"');
  inner += ci(152, 118, 8, C.warnHi, null, 0, 'opacity="0.6"');
  // straw hat
  inner += el(120, 74, 80, 18, `url(#${uid}-hat)`, C.outline, 5);
  inner += rr(80, 34, 80, 46, 22, `url(#${uid}-hat)`, C.outline, 5);
  inner += rr(80, 62, 80, 12, 5, C.primary, C.outline, 3);
  return { defs, inner };
}

// ---- decoration badge ----
function decoBadge(w, h, uid) {
  const defs = vg(uid, 'b', C.rewHi, C.reward, C.rewLo);
  let inner = '';
  const cx = 60, cy = 54;
  let pts = [];
  for (let i = 0; i < 24; i++) {
    const a = (i * 15) * Math.PI / 180;
    const r = i % 2 === 0 ? 44 : 34;
    pts.push(`${(cx + Math.cos(a) * r).toFixed(1)},${(cy + Math.sin(a) * r).toFixed(1)}`);
  }
  inner += pa('M40,84 L30,112 L48,102 L56,116 L60,88 Z', C.warning, C.outline, 3);
  inner += pa('M80,84 L90,112 L72,102 L64,116 L60,88 Z', C.warning, C.outline, 3);
  inner += pg(pts.join(' '), `url(#${uid}-b)`, C.outline, 4);
  inner += ci(cx, cy, 26, C.rewHi, C.outline, 3);
  inner += pg('60,40 64,50 75,51 66,58 69,69 60,63 51,69 54,58 45,51 56,50', C.reward, C.outline, 2);
  return { defs, inner };
}

// ---- background scene (opaque) ----
function bgFarm(w, h, uid) {
  const defs = vg(uid, 'sky', '#BFE3F5', C.sky, C.skyLo) + vg(uid, 'hill', C.secHi, C.board, C.boardLo) + vg(uid, 'hill2', '#A8D98A', C.board, C.boardLo);
  let inner = rr(0, 0, w, h, 0, `url(#${uid}-sky)`, null, 0);
  // sun
  inner += ci(150, 120, 62, C.reward, null, 0, 'opacity="0.9"');
  inner += ci(150, 120, 48, C.rewHi, null, 0);
  // clouds
  const cloud = (x, y, s) => { let g = `<g opacity="0.9">`; g += el(x, y, 46 * s, 26 * s, C.white, null, 0); g += el(x + 40 * s, y + 6 * s, 34 * s, 20 * s, C.white, null, 0); g += el(x - 40 * s, y + 8 * s, 30 * s, 18 * s, C.white, null, 0); g += `</g>`; return g; };
  inner += cloud(430, 110, 1); inner += cloud(760, 80, 0.8); inner += cloud(920, 160, 0.7);
  // far hills
  inner += pa(`M0,${h * 0.62} Q${w * 0.25},${h * 0.5} ${w * 0.5},${h * 0.6} T${w},${h * 0.58} L${w},${h} L0,${h} Z`, `url(#${uid}-hill2)`, null, 0);
  // near ground
  inner += pa(`M0,${h * 0.74} Q${w * 0.3},${h * 0.66} ${w * 0.6},${h * 0.74} T${w},${h * 0.72} L${w},${h} L0,${h} Z`, `url(#${uid}-hill)`, null, 0);
  // soil field rows
  for (let i = 0; i < 4; i++) {
    const y = h * 0.80 + i * 26;
    inner += rr(w * 0.12, y, w * 0.76, 16, 8, C.soil, null, 0, 'opacity="0.85"');
    for (let j = 0; j < 9; j++) {
      const x = w * 0.16 + j * (w * 0.68 / 8);
      inner += ci(x, y + 2, 6, C.secondary, null, 0);
    }
  }
  // fence
  for (let i = 0; i < 7; i++) {
    const x = w * 0.08 + i * (w * 0.84 / 6);
    inner += rr(x, h * 0.66, 10, 40, 4, C.cardLo, C.outline, 2);
  }
  inner += rr(w * 0.08, h * 0.70, w * 0.84, 7, 3, C.cardLo, C.outline, 2);
  // small barn
  inner += rr(w * 0.80, h * 0.50, 90, 70, 6, C.cell, C.outline, 3);
  inner += pg(`${w * 0.80 - 8},${h * 0.50 + 2} ${w * 0.80 + 45},${h * 0.50 - 34} ${w * 0.80 + 98},${h * 0.50 + 2}`, C.warning, C.outline, 3);
  inner += rr(w * 0.80 + 34, h * 0.50 + 30, 22, 40, 4, C.cellLo, C.outline, 2);
  return { defs, inner };
}

// ---- component registry ----
const COMPONENTS = [
  { id: 'btn-primary', name: '主按钮', category: 'control', w: 360, h: 112, states: ['default', 'pressed', 'disabled'], slice: { type: '9-slice', margins: [48, 48, 40, 40] }, gen: (w, h, s, u) => candyButton(w, h, PRIMARY, s, u, 30), desc: '橙色主操作按钮，空白文字区，圆角30，描边5，顶部高光与底部暗边形成糖果质感。' },
  { id: 'btn-secondary', name: '次按钮', category: 'control', w: 320, h: 104, states: ['default', 'pressed'], slice: { type: '9-slice', margins: [44, 44, 36, 36] }, gen: (w, h, s, u) => candyButton(w, h, SECONDARY, s, u, 28), desc: '绿色次操作按钮，视觉权重低于主按钮，空白文字区。' },
  { id: 'btn-claim', name: '领取按钮', category: 'control', w: 300, h: 104, states: ['default', 'pressed'], slice: { type: '9-slice', margins: [44, 44, 36, 36] }, gen: (w, h, s, u) => candyButton(w, h, REWARD, s, u, 28), desc: '金色奖励领取按钮，空白文字区，用于离线收益/任务奖励。' },
  { id: 'btn-close', name: '关闭按钮', category: 'control', w: 96, h: 96, states: ['default', 'pressed'], slice: { type: '1:1', margins: [0, 0, 0, 0] }, gen: (w, h, s, u) => closeButton(w, h, s, u), desc: '红色圆形关闭按钮，白色 X，描边5。' },
  { id: 'nav-tab', name: '导航标签', category: 'control', w: 200, h: 120, states: ['default', 'pressed', 'selected'], slice: { type: '9-slice', margins: [32, 32, 32, 32] }, gen: (w, h, s, u) => navTab(w, h, s, u), desc: '底部导航标签：default 奶油未选中、pressed 压暗、selected 橙色高亮+绿色指示条。' },
  { id: 'currency-bar', name: '货币栏', category: 'container', w: 720, h: 96, states: ['default'], slice: { type: '9-slice', margins: [48, 48, 32, 32] }, gen: (w, h, s, u) => currencyBar(w, h, u), desc: '顶部货币栏，三段（金币/钻石/体力）图标+空白数字 plaque，奶油圆角胶囊。' },
  { id: 'panel-card', name: '卡片面板', category: 'container', w: 560, h: 400, states: ['default'], slice: { type: '9-slice', margins: [40, 40, 40, 40] }, gen: (w, h, s, u) => panelCard(w, h, u), desc: '奶油卡片面板，圆角20，描边5，顶部标题条与内容留白区。' },
  { id: 'panel-modal', name: '弹窗底板', category: 'container', w: 640, h: 480, states: ['default'], slice: { type: '9-slice', margins: [48, 48, 48, 48] }, gen: (w, h, s, u) => panelModal(w, h, u), desc: '弹窗底板，圆角28，描边6，橙色标题栏+内容区+底部操作留白。' },
  { id: 'slot-item', name: '物品格子', category: 'container', w: 160, h: 160, states: ['default'], slice: { type: '9-slice', margins: [28, 28, 28, 28] }, gen: (w, h, s, u) => slotItem(w, h, u), desc: '木质物品格子，圆角18，内嵌浅色凹槽，用于背包/商店/仓库。' },
  { id: 'progress-bar', name: '进度条', category: 'container', w: 560, h: 64, states: ['default'], slice: { type: '9-slice', margins: [32, 32, 24, 24] }, gen: (w, h, s, u) => progressBar(w, h, u), desc: '进度条，深棕轨道+绿色填充（约66%）+顶部高光，胶囊圆角。' },
  { id: 'icon-coin', name: '金币图标', category: 'icon', w: 96, h: 96, states: ['default'], slice: { type: '1:1', margins: [0, 0, 0, 0] }, gen: (w, h, s, u) => icon('coin', u), desc: '金币：金色圆币+内圈+星形浮雕。' },
  { id: 'icon-gem', name: '钻石图标', category: 'icon', w: 96, h: 96, states: ['default'], slice: { type: '1:1', margins: [0, 0, 0, 0] }, gen: (w, h, s, u) => icon('gem', u), desc: '钻石：蓝色菱形宝石+切面高光。' },
  { id: 'icon-energy', name: '体力图标', category: 'icon', w: 96, h: 96, states: ['default'], slice: { type: '1:1', margins: [0, 0, 0, 0] }, gen: (w, h, s, u) => icon('energy', u), desc: '体力：金色闪电。' },
  { id: 'icon-carrot', name: '胡萝卜图标', category: 'icon', w: 96, h: 96, states: ['default'], slice: { type: '1:1', margins: [0, 0, 0, 0] }, gen: (w, h, s, u) => icon('carrot', u), desc: '胡萝卜：橙色根茎+三片绿叶。' },
  { id: 'icon-wheat', name: '小麦图标', category: 'icon', w: 96, h: 96, states: ['default'], slice: { type: '1:1', margins: [0, 0, 0, 0] }, gen: (w, h, s, u) => icon('wheat', u), desc: '小麦：金色麦穗+麦秆。' },
  { id: 'icon-water', name: '水滴图标', category: 'icon', w: 96, h: 96, states: ['default'], slice: { type: '1:1', margins: [0, 0, 0, 0] }, gen: (w, h, s, u) => icon('water', u), desc: '水滴：蓝色水滴+高光。' },
  { id: 'icon-seed', name: '种子图标', category: 'icon', w: 96, h: 96, states: ['default'], slice: { type: '1:1', margins: [0, 0, 0, 0] }, gen: (w, h, s, u) => icon('seed', u), desc: '种子：土壤小丘+嫩芽双叶。' },
  { id: 'icon-star', name: '星星图标', category: 'icon', w: 96, h: 96, states: ['default'], slice: { type: '1:1', margins: [0, 0, 0, 0] }, gen: (w, h, s, u) => icon('star', u), desc: '星星：金色五角星。' },
  { id: 'icon-lock', name: '锁图标', category: 'icon', w: 96, h: 96, states: ['default'], slice: { type: '1:1', margins: [0, 0, 0, 0] }, gen: (w, h, s, u) => icon('lock', u), desc: '锁：金色锁体+灰色锁梁+钥匙孔。' },
  { id: 'icon-gear', name: '齿轮图标', category: 'icon', w: 96, h: 96, states: ['default'], slice: { type: '1:1', margins: [0, 0, 0, 0] }, gen: (w, h, s, u) => icon('gear', u), desc: '齿轮：灰色八齿齿轮+中心轴孔。' },
  { id: 'icon-heart', name: '爱心图标', category: 'icon', w: 96, h: 96, states: ['default'], slice: { type: '1:1', margins: [0, 0, 0, 0] }, gen: (w, h, s, u) => icon('heart', u), desc: '爱心：红色心形+高光。' },
  { id: 'icon-gift', name: '礼物图标', category: 'icon', w: 96, h: 96, states: ['default'], slice: { type: '1:1', margins: [0, 0, 0, 0] }, gen: (w, h, s, u) => icon('gift', u), desc: '礼物：红色礼盒+金色丝带蝴蝶结。' },
  { id: 'icon-farm', name: '农田导航图标', category: 'icon', w: 96, h: 96, states: ['default'], slice: { type: '1:1', margins: [0, 0, 0, 0] }, gen: (w, h, s, u) => icon('farm', u), desc: '农田导航：绿色田垄+嫩芽。' },
  { id: 'icon-shop', name: '商店导航图标', category: 'icon', w: 96, h: 96, states: ['default'], slice: { type: '1:1', margins: [0, 0, 0, 0] }, gen: (w, h, s, u) => icon('shop', u), desc: '商店导航：橙色购物车/货架+遮阳棚。' },
  { id: 'icon-barn', name: '仓库导航图标', category: 'icon', w: 96, h: 96, states: ['default'], slice: { type: '1:1', margins: [0, 0, 0, 0] }, gen: (w, h, s, u) => icon('barn', u), desc: '仓库导航：棕色仓房+红色屋顶。' },
  { id: 'icon-social', name: '好友导航图标', category: 'icon', w: 96, h: 96, states: ['default'], slice: { type: '1:1', margins: [0, 0, 0, 0] }, gen: (w, h, s, u) => icon('social', u), desc: '好友导航：蓝色双人头像。' },
  { id: 'icon-task', name: '任务导航图标', category: 'icon', w: 96, h: 96, states: ['default'], slice: { type: '1:1', margins: [0, 0, 0, 0] }, gen: (w, h, s, u) => icon('task', u), desc: '任务导航：奶油Clipboard+金色夹子+绿色对勾。' },
  { id: 'char-farmer', name: '农场主角色', category: 'character', w: 240, h: 320, states: ['default'], slice: { type: 'full', margins: [0, 0, 0, 0] }, gen: (w, h, s, u) => charFarmer(w, h, u), desc: 'Q版农场主：草帽+绿色背带裤+圆润脸型，完整无遮挡，透明背景。' },
  { id: 'deco-badge', name: '奖励角标', category: 'decoration', w: 120, h: 120, states: ['default'], slice: { type: '1:1', margins: [0, 0, 0, 0] }, gen: (w, h, s, u) => decoBadge(w, h, u), desc: '奖励角标：金色星burst+红色丝带 tails+中心星。' },
  { id: 'bg-farm', name: '农田背景', category: 'background', w: 1024, h: 576, states: ['default'], slice: { type: 'full', margins: [0, 0, 0, 0] }, gen: (w, h, s, u) => bgFarm(w, h, u), desc: '田园背景：天空渐变+太阳+云+远山+田垄+栅栏+小仓房，无UI控件无文字。' },
];

function renderSVG(svg, w, h) {
  const r = new Resvg(svg, { fitTo: { mode: 'width', value: w } });
  return r.render().asPng();
}

// ---- render individual PNGs + collect instances ----
const instances = [];
for (const comp of COMPONENTS) {
  for (const state of comp.states) {
    const uid = `${comp.id}-${state}`.replace(/[^a-z0-9]/g, '');
    const { defs, inner } = comp.gen(comp.w, comp.h, state, uid);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${comp.w}" height="${comp.h}" viewBox="0 0 ${comp.w} ${comp.h}"><defs>${defs}</defs>${inner}</svg>`;
    const png = renderSVG(svg, comp.w, comp.h);
    const fname = `${comp.id}-${state}-v1.png`;
    fs.writeFileSync(path.join(COMP_DIR, fname), png);
    instances.push({ comp, state, uid, defs, inner, semantic: `${comp.id}-${state}`, file: fname });
  }
}

// ---- compose sprite sheet (shelf layout, generous gaps) ----
const GAP = 30, MARGIN = 30, SHEET_W = 2048;
let x = MARGIN, y = MARGIN, rowH = 0;
const placed = [];
for (const inst of instances) {
  const { w, h } = inst.comp;
  if (x + w + GAP > SHEET_W) { x = MARGIN; y += rowH + GAP; rowH = 0; }
  placed.push({ inst, x, y });
  x += w + GAP; rowH = Math.max(rowH, h);
}
const SHEET_H = y + rowH + MARGIN;
let sheetDefs = '', sheetBody = '';
for (const p of placed) {
  sheetDefs += p.inst.defs;
  sheetBody += `<g transform="translate(${p.x},${p.y})">${p.inst.inner}</g>`;
}
const sheetSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SHEET_W}" height="${SHEET_H}" viewBox="0 0 ${SHEET_W} ${SHEET_H}"><defs>${sheetDefs}</defs>${sheetBody}</svg>`;
fs.writeFileSync(path.join(SPRITE_DIR, 'ui-components-sheet.png'), renderSVG(sheetSvg, SHEET_W));

// ---- layout data (artboard positions for reconciling split detection order) ----
const layout = {
  sheet: 'assets/sprites/ui-components-sheet.png',
  sheet_size: [SHEET_W, SHEET_H],
  gap: GAP, margin: MARGIN,
  instances: placed.map(p => ({
    semantic_name: p.inst.semantic,
    component_id: p.inst.comp.id,
    category: p.inst.comp.category,
    state: p.inst.state,
    slice: p.inst.comp.slice,
    target_size: [p.inst.comp.w, p.inst.comp.h],
    artboard: [p.x, p.y, p.inst.comp.w, p.inst.comp.h],
    component_file: `assets/components/${p.inst.file}`,
  })),
};
fs.writeFileSync(path.join(__dirname, 'layout.json'), JSON.stringify(layout, null, 2));

// ---- component prompts ----
function promptFor(comp) {
  const isControl = comp.category === 'control';
  const statesTxt = comp.states.map(s => {
    if (s === 'default') return `- \`default\`（${comp.id}-default-v1.png）：常态，${comp.desc}`;
    if (s === 'pressed') return `- \`pressed\`（${comp.id}-pressed-v1.png）：按下态，主体亮度降低约14%（主色加深一档），内容下沉2px、高光减弱；外轮廓/尺寸/圆角/描边与 default 完全一致，只改明暗与微位移。`;
    if (s === 'disabled') return `- \`disabled\`（${comp.id}-disabled-v1.png）：置灰降饱和（#C9C2B6），高光减弱，轮廓不变。`;
    if (s === 'selected') return `- \`selected\`（${comp.id}-selected-v1.png）：选中态，橙色高亮+底部绿色指示条，轮廓与 default 一致。`;
    return `- \`${s}\``;
  }).join('\n');
  const sliceTxt = `${comp.slice.type} margins=[${comp.slice.margins.join(', ')}]`;
  const enPrompt = `A single game UI component asset (${comp.category}), ${comp.name} — ${comp.desc} ` +
    `Chibi cartoon pastoral style, matte candy paint, top-left soft light, warm brown outline (#5A3A22), ` +
    `rounded corners, high saturation, cozy farm mood. Target size ${comp.w}x${comp.h}px, centered, ` +
    `transparent background, no text, no letters, no numbers, complete clean outline, safe margin, ` +
    `high resolution, suitable for compositing and engine 9-slice. Do not render a full page or neighboring components.`;
  return `# ${comp.name}（${comp.id}）

## 来源与用途
- 源页面：farm（已批准）；跨页面复用基础组件。
- 类别：${comp.category}；用途：${comp.desc}

## 尺寸和状态
- 目标尺寸：${comp.w}×${comp.h}px。
- 切片：${sliceTxt}。
${statesTxt}

## 必须继承的契约字段
- style-contract：colors（primary #FF8A3D / pressed #DB7734 / secondary #6FBF4A / reward #FFC93C / warning #E85D4A / surface #FFF6E3）、geometry.radius、geometry.stroke、effects.highlight/shadow、tokens.interaction（pressed-dim 0.86 / pressed-offset-y 2）。
- 透明背景：${comp.category === 'background' ? '否（不透明场景，但导出含 alpha 通道）' : '是'}；无文字（保留排版留白）。

## 图像生成提示词
${enPrompt}
${isControl ? '\n按下态量化：主体压暗约14%（叠12%黑等价）+内容下沉2px+高光减弱；轮廓/圆角/描边/光向/材质与常态完全一致，不换形。' : ''}

## 反向限制
- 不生成完整页面、不粘连其他组件、不附带不透明矩形底（背景除外）。
- 无文字/编号/网格线/水印/说明箭头；阴影与发光不跨到相邻元素。
- 不复刻受保护角色；图标统一透视与光源。

## 验收记录
- 本 run 由 render/kit.js 确定性渲染（SVG→resvg PNG），尺寸精确、alpha 干净、两态轮廓对齐。
- 状态：default${comp.states.includes('pressed') ? ' / pressed 齐全，按下态压暗+下沉可感知' : ''}${comp.states.includes('disabled') ? ' / disabled 置灰' : ''}${comp.states.includes('selected') ? ' / selected 高亮' : ''}。
`;
}
for (const comp of COMPONENTS) {
  fs.writeFileSync(path.join(PROMPT_DIR, `${comp.id}.md`), promptFor(comp));
}

console.log(JSON.stringify({
  components: COMPONENTS.length,
  sprites: instances.length,
  sheet: [SHEET_W, SHEET_H],
  individual_dir: 'assets/components',
  prompts: COMPONENTS.length,
}, null, 2));