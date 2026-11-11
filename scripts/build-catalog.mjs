#!/usr/bin/env node
// Regenerates the unified browsing surface from projects/*/project.json:
//   index.html (gallery), catalog.json, README.md / README.zh-CN.md catalog blocks.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export function loadProjects(root = ROOT) {
  const dir = path.join(root, "projects");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => {
      const p = path.join(dir, d.name, "project.json");
      if (!fs.existsSync(p)) return null;
      return JSON.parse(fs.readFileSync(p, "utf8"));
    })
    .filter(Boolean)
    .sort((a, b) => a.id.localeCompare(b.id));
}

function countsLine(p, lang) {
  const c = p.counts || {};
  const atlas = p.atlas && p.atlas.size ? p.atlas.size.join("×") : "—";
  return lang === "zh"
    ? `${c.pages ?? 0} 页 · ${c.components ?? 0} 组件 · ${c.sprites ?? 0} 精灵 · ${c.engines ?? 0} 引擎 · 图集 ${atlas}`
    : `${c.pages ?? 0} pages · ${c.components ?? 0} components · ${c.sprites ?? 0} sprites · ${c.engines ?? 0} engines · atlas ${atlas}`;
}

function readmeBlock(projects, lang) {
  const zh = lang === "zh";
  if (!projects.length) return zh ? "_（暂无项目）_\n" : "_（no projects yet）_\n";
  const head = zh
    ? "| 预览 | 项目 | 平台 · 比例 | 内容 | 入口 |\n|---|---|---|---|---|\n"
    : "| Preview | Project | Platform · ratio | Contents | Links |\n|---|---|---|---|---|\n";
  const rows = projects
    .map((p) => {
      const base = `projects/${p.id}/`;
      const prev = p.preview ? `<img src="${base}${p.preview}" width="220" alt="${p.id}">` : "";
      const title = zh ? p.title_zh || p.title : p.title || p.title_zh;
      const links = [
        `[${zh ? "目录" : "catalog"}](${base}index.html)`,
        `[README](${base}README.md)`,
        `[manifest](${base}exports/web/manifest.json)`,
      ].join(" · ");
      const deprecated = p.status === "deprecated" ? (zh ? "（已弃用）" : " (deprecated)") : "";
      return `| ${prev} | [**${p.id}**](${base}) ${title}${deprecated} | ${p.platform} · ${p.ratio} | ${countsLine(p, lang)} | ${links} |`;
    })
    .join("\n");
  return head + rows + "\n";
}

function injectReadme(root, projects) {
  for (const [file, lang] of [
    ["README.md", "en"],
    ["README.zh-CN.md", "zh"],
  ]) {
    const p = path.join(root, file);
    if (!fs.existsSync(p)) continue;
    const text = fs.readFileSync(p, "utf8");
    const block = `<!-- catalog:start -->\n${readmeBlock(projects, lang)}<!-- catalog:end -->`;
    const next = text.replace(/<!-- catalog:start -->[\s\S]*?<!-- catalog:end -->/, block);
    fs.writeFileSync(p, next);
  }
}

function galleryHtml(projects) {
  const data = JSON.stringify({ projects }).replace(/</g, "\\u003c");
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>open-assets · game UI asset gallery</title>
<style>
  :root{--bg:#151019;--card:#221a29;--line:#3a2f44;--fg:#f2ecf7;--mut:#a99bb8;--acc:#ff8a3d;--acc2:#6fbf4a;}
  *{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.55 -apple-system,"Segoe UI",Roboto,"PingFang SC","Microsoft YaHei",sans-serif}
  header{padding:28px 24px 8px;max-width:1200px;margin:0 auto}
  h1{margin:0 0 4px;font-size:26px}h1 span{color:var(--acc)}
  .sub{color:var(--mut);margin:0 0 14px}
  .bar{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin:0 0 6px}
  input[type=search]{flex:1;min-width:200px;background:var(--card);border:1px solid var(--line);color:var(--fg);border-radius:10px;padding:9px 12px}
  button{background:var(--card);border:1px solid var(--line);color:var(--fg);border-radius:999px;padding:6px 12px;cursor:pointer}
  button.on{background:var(--acc);border-color:var(--acc);color:#20140a;font-weight:600}
  .tags{display:flex;gap:6px;flex-wrap:wrap;margin:8px 0 0}
  main{max-width:1200px;margin:0 auto;padding:16px 24px 48px;display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:18px}
  .card{background:var(--card);border:1px solid var(--line);border-radius:14px;overflow:hidden;display:flex;flex-direction:column}
  .card img{width:100%;aspect-ratio:16/9;object-fit:cover;display:block;background:#000}
  .body{padding:14px 16px 16px;display:flex;flex-direction:column;gap:8px;flex:1}
  .t{font-size:17px;font-weight:700}.t small{color:var(--mut);font-weight:400}
  .meta{color:var(--mut);font-size:13px}
  .ct{color:var(--acc2);font-size:13px}
  .lk{display:flex;gap:8px;flex-wrap:wrap;margin-top:auto}
  .lk a{color:var(--acc);text-decoration:none;border:1px solid var(--line);border-radius:8px;padding:5px 10px;font-size:13px}
  .lk a:hover{border-color:var(--acc)}
  .dep{color:#e85d4a;font-size:12px}
  footer{color:var(--mut);text-align:center;padding:0 0 32px;font-size:13px}
  a{color:var(--acc)}
</style>
</head>
<body>
<header>
  <h1>open<span>-assets</span></h1>
  <p class="sub" data-en="Open game UI asset packs — pages, sprites, atlases, tokens, engine handoff." data-zh="开放游戏 UI 资产包 —— 页面、精灵、图集、令牌、引擎交付。"></p>
  <div class="bar">
    <input type="search" id="q" placeholder="Search id / title / tag…" />
    <button id="lang">中文</button>
    <a href="https://github.com/kaying-ai/open-assets" style="align-self:center">GitHub</a>
    <a href="catalog.json" style="align-self:center">catalog.json</a>
  </div>
  <div class="tags" id="tags"></div>
</header>
<main id="grid"></main>
<footer data-en="Artwork CC-BY-4.0 · code MIT · generated by scripts/build-catalog.mjs" data-zh="美术 CC-BY-4.0 · 代码 MIT · 由 scripts/build-catalog.mjs 生成"></footer>
<script>
const DATA = ${data};
let lang = "en", tag = "", q = "";
const $ = (s) => document.querySelector(s);
function txt(el){ el.textContent = el.dataset[lang] || el.dataset.en || ""; }
function applyLang(){ document.querySelectorAll("[data-en]").forEach(txt); $("#lang").textContent = lang==="en"?"中文":"EN"; render(); }
function allTags(){ const s=new Set(); DATA.projects.forEach(p=>(p.tags||[]).forEach(t=>s.add(t))); return [...s].sort(); }
function renderTags(){ $("#tags").innerHTML = ""; const mk=(t,label)=>{const b=document.createElement("button");b.textContent=label;b.className=(tag===t?"on":"");b.onclick=()=>{tag=(tag===t?"":t);renderTags();render();};$("#tags").appendChild(b);};
  mk("", lang==="en"?"all":"全部"); allTags().forEach(t=>mk(t,t)); }
function card(p){
  const base = "projects/"+p.id+"/";
  const title = lang==="zh" ? (p.title_zh||p.title) : (p.title||p.title_zh);
  const c = p.counts||{};
  const counts = lang==="zh"
    ? \`\${c.pages||0} 页 · \${c.components||0} 组件 · \${c.sprites||0} 精灵 · \${c.engines||0} 引擎\`
    : \`\${c.pages||0} pages · \${c.components||0} components · \${c.sprites||0} sprites · \${c.engines||0} engines\`;
  const el = document.createElement("div"); el.className="card";
  el.innerHTML = \`
    <img loading="lazy" src="\${base}\${p.preview||""}" alt="\${p.id}">
    <div class="body">
      <div class="t">\${p.id} <small>\${title||""}</small></div>
      \${p.status==="deprecated"?'<div class="dep">deprecated</div>':""}
      <div class="meta">\${p.platform||""} · \${p.ratio||""} · \${p.style||""}</div>
      <div class="ct">\${counts}</div>
      <div class="lk">
        <a href="\${base}index.html">\${lang==="zh"?"浏览":"Browse"}</a>
        <a href="\${base}README.md">README</a>
        <a href="\${base}exports/web/manifest.json">manifest</a>
      </div>
    </div>\`;
  return el;
}
function render(){
  const grid=$("#grid"); grid.innerHTML="";
  const list = DATA.projects.filter(p=>{
    const hay = (p.id+" "+(p.title||"")+" "+(p.title_zh||"")+" "+(p.tags||[]).join(" ")).toLowerCase();
    return (!q || hay.includes(q)) && (!tag || (p.tags||[]).includes(tag));
  });
  list.forEach(p=>grid.appendChild(card(p)));
  if(!list.length){ grid.innerHTML = '<p style="color:var(--mut)">no match</p>'; }
}
$("#q").addEventListener("input", e=>{ q=e.target.value.trim().toLowerCase(); render(); });
$("#lang").onclick = ()=>{ lang = lang==="en"?"zh":"en"; applyLang(); renderTags(); };
applyLang(); renderTags();
</script>
</body>
</html>
`;
}

export function buildCatalog(root = ROOT) {
  const projects = loadProjects(root);
  const catalog = {
    schema_version: 1,
    generated_at: new Date().toISOString(),
    repository: "kaying-ai/open-assets",
    pages_url: "https://kaying-ai.github.io/open-assets/",
    projects: projects.map((p) => ({
      id: p.id,
      title: p.title,
      title_zh: p.title_zh,
      tags: p.tags || [],
      platform: p.platform,
      ratio: p.ratio,
      resolution: p.resolution,
      style: p.style,
      counts: p.counts,
      atlas: p.atlas,
      version: p.version,
      status: p.status || "active",
      license: p.license,
      preview: p.preview,
      entry: p.entry,
      readme: p.readme,
      path: `projects/${p.id}/`,
    })),
  };
  fs.writeFileSync(path.join(root, "catalog.json"), JSON.stringify(catalog, null, 2) + "\n");
  fs.writeFileSync(path.join(root, "index.html"), galleryHtml(projects));
  injectReadme(root, projects);
  return catalog;
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const c = buildCatalog();
  console.log(`catalog: ${c.projects.length} project(s) -> index.html, catalog.json, README blocks`);
}