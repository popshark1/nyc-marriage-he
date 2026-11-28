const t = (k, v) => I18N.t(k, v);
const boroName = b => (t("boros") || {})[b] || b;
let META = null;
const PAGE = 50;
const $ = s => document.querySelector(s);
const f = $("#f"), out = $("#out");
const engine = new NYCEngine.Engine("data/");
let mode = "phonetic", boros = new Set(), page = 1, sort = "relevance", current = null, lastQ = null;
let kind = "free";
const filters = new Map();            // קבוצה (מילה / שדה) → קבוצת כתיבים נבחרים
const qfree = $("#qfree"), det = $("#detailed");

const esc = s => (s ?? "").toString().replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fmt = n => Number(n).toLocaleString(I18N.L[I18N.lang]._locale);
function countLabel(n){
  const L = I18N.L[I18N.lang];
  if (L.records_one) { const k = "records_" + new Intl.PluralRules(L._locale).select(n); if (L[k]) return t(k, {n: fmt(n)}); }
  return n === 1 ? t("record1") : t("records", {n: fmt(n)});
}
const errMsg = e => (I18N.L.he[e.message] ? t(e.message) : e.message) + (e.detail ? ` (${e.detail})` : "");
function toast(t){const e=$("#toast");e.textContent=t;e.classList.add("on");clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove("on"),1800)}

async function loadMeta(){
  try{
    META = await engine.init();
    paintDynamic();
    restore();
  }catch(e){ out.innerHTML = `<div class="err">${esc(t("E_META"))} ${esc(e.detail||"")}</div>` }
}

/** חלקים שנבנים ב־JS ותלויים בשפה */
function paintDynamic(){
  if (META) {
    const m = META;
    $("#stats").innerHTML = `
      <div class="stat"><b>${fmt(m.total)}</b><span>${t("stat.total")}</span></div>
      <div class="stat"><b dir="ltr">${m.min_year}–${m.max_year}</b><span>${t("stat.years")}</span></div>
      <div class="stat"><b>${(m.boroughs||[]).length}</b><span>${t("stat.boros")}</span></div>`;
    const list = (m.boroughs && m.boroughs.length) ? m.boroughs : Object.keys(t("boros"));
    $("#boros").innerHTML = list.map(b=>`<button type="button" class="chip ${boros.has(b)?"on":""}" data-v="${esc(b)}">${esc(boroName(b))}</button>`).join("");
    $("#boros").querySelectorAll(".chip").forEach(c=>c.onclick=()=>{c.classList.toggle("on");c.classList.contains("on")?boros.add(c.dataset.v):boros.delete(c.dataset.v)});
  }
  $("#examples").innerHTML = t("examples").map(x => `<button type="button" dir="auto">${esc(x)}</button>`).join("");
  $("#examples").querySelectorAll("button").forEach(b => b.onclick = () => { qfree.value = b.textContent; kind = "free"; page = 1; filters.clear(); run(); });
  $("#toggleAdv").textContent = det.hidden ? t("adv.open") : t("adv.close");
}

function paintGameArt(){
  const cv = document.querySelector(".game-art"); if (!cv) return;
  const g = cv.getContext("2d"), W = 168, H = 96, px = 4;
  g.fillStyle = "#9fd3ff"; g.fillRect(0, 0, W, H);
  g.fillStyle = "#5fa64a"; g.fillRect(0, 64, W, 32);
  g.fillStyle = "#3f8a36"; for (let x = 0; x < W; x += 8) g.fillRect(x, 56, 8, 8 + ((x / 8) % 2) * 4);
  // chuppah
  g.fillStyle = "#8a6239"; g.fillRect(64, 28, 4, 40); g.fillRect(100, 28, 4, 40);
  g.fillStyle = "#f8f6ef"; g.fillRect(58, 22, 52, 8); g.fillStyle = "#2c5aa0"; g.fillRect(58, 24, 52, 2);
  // groom behind a tree (peeking), bride with veil
  g.fillStyle = "#6b4a2b"; g.fillRect(20, 36, 10, 32); g.fillStyle = "#2f7d32"; g.fillRect(8, 16, 34, 24);
  const fig = (x, y, top, head, hair) => { g.fillStyle = hair; g.fillRect(x, y, 12, 4); g.fillStyle = head; g.fillRect(x, y + 4, 12, 8);
    g.fillStyle = "#2b2b2b"; g.fillRect(x + 2, y + 7, 2, 2); g.fillRect(x + 8, y + 7, 2, 2); g.fillStyle = top; g.fillRect(x - 2, y + 12, 16, 16); };
  // groom: bald, glasses, salt-and-pepper beard
  fig(30, 38, "#1c1f2b", "#e7b48f", "#e7b48f"); g.fillStyle = "#ffffff"; g.fillRect(32, 36, 8, 2);
  g.fillStyle = "#161616"; g.fillRect(30, 44, 12, 2); g.fillStyle = "#7d7771"; g.fillRect(30, 48, 12, 2);
  // bride: wavy auburn hair, turquoise necklace
  fig(132, 38, "#fbfaf6", "#f3d2be", "#7f3d2d"); g.fillStyle = "#e9eef5"; g.fillRect(128, 40, 4, 24); g.fillRect(146, 40, 4, 24);
  g.fillStyle = "#7f3d2d"; g.fillRect(130, 40, 2, 14); g.fillRect(144, 40, 2, 14); g.fillStyle = "#2bb3a0"; g.fillRect(134, 50, 8, 2);
  g.fillStyle = "#fbfaf6"; g.fillRect(126, 54, 26, 12);
  g.fillStyle = "#e2556f"; g.fillRect(150, 14, 4, 4); g.fillRect(156, 20, 4, 4); g.fillStyle = "#f5d76e"; g.fillRect(118, 10, 4, 4);
  g.fillStyle = "#14213d"; g.font = "bold 18px monospace"; g.fillText("?", 52, 50); g.fillText("?", 112, 50);
}
paintGameArt();
function syncGameLink(){ const a = $("#gameLink"); if (a) a.href = "games/wedding.html?lang=" + I18N.lang; const s = $("#statsLink"); if (s) s.href = "stats.html?lang=" + I18N.lang; }
syncGameLink();

function setLang(lang){
  I18N.set(lang);
  syncGameLink();
  paintDynamic();
  if (current) render(current);
  const u = new URL(location.href); u.searchParams.set("lang", lang); history.replaceState(null, "", u);
}
document.querySelectorAll(".langs button").forEach(b => b.onclick = () => setLang(b.dataset.lang));
I18N.set(I18N.lang);
paintDynamic();

$("#mode").querySelectorAll("button").forEach(b=>b.onclick=()=>{
  $("#mode").querySelectorAll("button").forEach(x=>x.classList.remove("on"));b.classList.add("on");mode=b.dataset.v;
});

function params(){
  const p = new URLSearchParams();
  if (kind === "free") p.set("q", qfree.value.trim());
  else {
    for (const [k,v] of new FormData(f)) if (v.trim()) p.set(k, v.trim());
    p.set("mode", mode); if (boros.size) p.set("borough",[...boros].join(","));
  }
  if (page > 1) p.set("page", page); if (sort !== "relevance") p.set("sort", sort);
  return p;
}

function restore(){
  const p = new URLSearchParams(location.hash.slice(1));
  if (![...p.keys()].length) return;
  page = +p.get("page")||1; sort = p.get("sort")||"relevance";
  if (p.has("q")) { kind = "free"; qfree.value = p.get("q"); run(false); return; }
  kind = "det"; det.hidden = false;
  for (const el of f.elements) if (el.name && p.has(el.name)) el.value = p.get(el.name);
  mode = p.get("mode")||"phonetic"; $("#mode").querySelectorAll("button").forEach(b=>b.classList.toggle("on",b.dataset.v===mode));
  (p.get("borough")||"").split(",").filter(Boolean).forEach(b=>{boros.add(b);const c=$(`.chip[data-v="${CSS.escape(b)}"]`);c&&c.classList.add("on")});
  page = +p.get("page")||1; sort = p.get("sort")||"relevance";
  run(false);
}

f.onsubmit = e => {
  e.preventDefault();
  const inDet = e.submitter && e.submitter.id === "goDet" || det.contains(document.activeElement);
  kind = inDet ? "det" : "free";
  if (kind === "free" && !qfree.value.trim()) { qfree.focus(); return; }
  page = 1; filters.clear(); run();
};
$("#toggleAdv").onclick = () => { det.hidden = !det.hidden; $("#toggleAdv").textContent = det.hidden ? t("adv.open") : t("adv.close"); };
$("#reset").onclick = () => { f.reset(); qfree.value = ""; filters.clear(); boros.clear(); document.querySelectorAll(".chip").forEach(c=>c.classList.remove("on")); out.innerHTML=""; current=null; history.replaceState(null,"",location.pathname + location.search); };

const SORTERS = {
  relevance: (a,b) => a.score-b.score || (a.year??9999)-(b.year??9999),
  year: (a,b) => (a.year??9999)-(b.year??9999) || (a.date||"").localeCompare(b.date||""),
  year_desc: (a,b) => (b.year??0)-(a.year??0) || (b.date||"").localeCompare(a.date||""),
  name: (a,b) => (a.s1.last||"").localeCompare(b.s1.last||"") || (a.s1.first||"").localeCompare(b.s1.first||""),
};

async function run(push=true){
  const p = params();
  history.replaceState(null, "", "#"+p.toString());
  const q = Object.fromEntries(p);
  const key = JSON.stringify({...q, page:0, sort:0, kind});
  if (!current || key !== lastQ){
    out.innerHTML = `<div class="bar"><h2>${t("searching")}</h2></div><div class="list">${'<div class="skel"></div>'.repeat(4)}</div>`;
    try{
      const t0 = performance.now();
      current = kind === "free" ? await engine.searchFree(q.q) : await engine.search(q);
      current.kind = kind;
      current.ms = Math.round(performance.now()-t0);
      lastQ = key;
    }catch(e){ current = null; out.innerHTML = `<div class="err">${esc(errMsg(e))}</div>`; return; }
  }
  current.results.sort(SORTERS[sort] || SORTERS.relevance);
  render(current);
}

function nameHTML(s, hit){
  const full = [s.first, s.middle].filter(Boolean).join(" ");
  return `<span class="nm ${hit?"hit":""}"><span class="ln">${esc(s.last||"—")}</span>${full?`, <span class="fn">${esc(full)}</span>`:""}</span>`;
}

const SLOTS = ["a_last", "a_first", "b_last", "b_first"];
function variantsHTML(d){
  const v = d.variants || {};
  if (d.kind === "free") {
    const rows = Object.values(v).filter(t => t.list && t.list.length);
    if (!rows.length) return "";
    return `<div class="vars">${Object.entries(v).filter(([, tk]) => tk.list && tk.list.length).map(([g, tk]) => `<div class="vrow"><span class="lbl">${esc(t("spellTok", {t: tk.tok}))}</span>${
      tk.list.map(x => `<button class="vchip ${x.d > 0.6 ? "far" : ""} ${filters.get(g)?.has(x.n) ? "on" : ""}" data-g="${g}" data-fn="${esc(x.n)}" title="${t(x.part === "last" ? "chip.last" : x.part === "first" ? "chip.first" : "chip.both")}">${esc(x.n)}<i>${fmt(x.cnt)}</i></button>`).join("")}</div>`).join("")}
      <div class="vnote">${t("vnote.free")}</div></div>`;
  }
  const slots = SLOTS.filter(k => v[k] && v[k].length);
  if (!slots.length) return "";
  return `<div class="vars">${slots.map(k => `<div class="vrow"><span class="lbl">${t("slot")[k]} ${t("spellings")}</span>${
    v[k].slice(0, 14).map(x => `<button class="vchip ${x.d > 0.6 ? "far" : ""} ${filters.get(k)?.has(x.n) ? "on" : ""}" data-g="${k}" data-fn="${esc(x.n)}">${esc(x.n)}<i>${fmt(x.cnt)}</i></button>`).join("")
  }${v[k].length > 14 ? `<span class="vnote">${t("moreN", {n: v[k].length - 14})}</span>` : ""}</div>`).join("")}
  <div class="vnote">${t("vnote.free")}</div></div>`;
}

const rowHas = (r, n) => [r.s1, r.s2].some(s => s.ln === n || s.fn === n || s.mids.includes(n) || s.lws.includes(n));
/** בין קבוצות: וגם. בתוך קבוצה: או */
const passFilters = r => [...filters.values()].every(set => [...set].some(n => rowHas(r, n)));
function toggleFilter(group, n){
  if (!filters.has(group)) filters.set(group, new Set());
  const set = filters.get(group);
  set.has(n) ? set.delete(n) : set.add(n);
  if (!set.size) filters.delete(group);
  page = 1; render(current);
}

function parsedHTML(d){
  if (d.kind !== "free" || !d.parsed) return "";
  const P = d.parsed, parts = [];
  P.persons.forEach((p, i) => parts.push(`<b>${P.persons.length > 1 ? (i ? t("spouse2") : t("spouse1")) : t("names")} <span dir="auto">${esc(p.join(" "))}</span></b>`));
  if (P.year_from) parts.push(`<b dir="ltr">${P.year_from === P.year_to ? P.year_from : P.year_from + "–" + P.year_to}</b>`);
  P.boroughs.forEach(b => parts.push(`<b>${esc(boroName(b))}</b>`));
  if (P.license) parts.push(`<b dir="ltr">License #${esc(P.license)}</b>`);
  return `<div class="parsed">${t("parsed")} ${parts.join("")}</div>`;
}

function render(d){
  const all = d.results;
  all.forEach((r, i) => r._i = i);
  const view = filters.size ? all.filter(passFilters) : all;
  const total = view.length;
  if (!total){
    out.innerHTML = `${parsedHTML(d)}${variantsHTML(d)}<div class="empty"><div class="big">${t("empty.big")}</div>${t("empty.p")}</div>`;
    bindVariants(); return;
  }
  const pages = Math.ceil(total/PAGE);
  if (page > pages) page = pages;
  const slice = view.slice((page-1)*PAGE, page*PAGE);
  out.innerHTML = `
    <div class="bar">
      <h2>${t("results")}</h2><span class="count">${countLabel(total)} · <span dir="ltr">${d.ms} ${t("ms")}</span></span>
      <span class="sp"></span>
      <select id="sort">
        <option value="relevance">${t("sort.rel")}</option><option value="year">${t("sort.year")}</option>
        <option value="year_desc">${t("sort.yeard")}</option><option value="name">${t("sort.name")}</option>
      </select>
      <button class="btn ghost" id="csv">⬇ CSV</button>
    </div>
    ${parsedHTML(d)}
    ${d.truncated ? `<div class="notice">${t("trunc")}</div>` : ""}
    ${filters.size ? `<div class="parsed">${t("filtered")} ${[...filters.entries()].map(([g, set], gi) =>
        (gi ? `<span class="fand">+</span>` : "") + `<span class="fgroup">${[...set].map(n => `<span class="ffilter">${esc(n)}<button data-rmg="${esc(g)}" data-rmn="${esc(n)}" title="${t("clear")}">✕</button></span>`).join(`<span class="for">/</span>`)}</span>`).join("")}
        ${[...filters.values()].reduce((a, s) => a + s.size, 0) > 1 ? `<button class="linkbtn" id="clrAll" style="margin:0 8px">${t("clearAll")}</button>` : ""}</div>` : ""}
    ${variantsHTML(d)}
    <div class="list">${slice.map((r,i)=>`
      <article class="rec" data-i="${r._i}">
        <div class="yr">${esc(r.year||"?")}${r.date?`<small title="${t("married")}">${esc(r.date)}</small>`:""}</div>
        <div>
          <div class="couple">${nameHTML(r.s1, (r.hl||[]).includes("s1"))}<span class="heart">♥</span>${nameHTML(r.s2, (r.hl||[]).includes("s2"))}</div>
          <div class="metaline">
            ${r.borough?`<span class="tag boro">${esc(boroName(r.borough))}</span>`:""}
            ${r.license?`<span class="tag lic">License #${esc(r.license)}</span>`:""}
          </div>
        </div>
        <div class="acts">
          <button class="icon" data-copy title="${t("copy")}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg></button>
        </div>
      </article>`).join("")}
    </div>
    ${pages>1?pager(page,pages):""}`;
  $("#sort").value = sort;
  $("#sort").onchange = e => { sort = e.target.value; page = 1; run(); };
  $("#csv").onclick = () => exportCSV(view);
  out.querySelectorAll("[data-rmg]").forEach(b => b.onclick = () => toggleFilter(b.dataset.rmg, b.dataset.rmn));
  const ca = $("#clrAll"); if (ca) ca.onclick = () => { filters.clear(); page = 1; render(d); };
  out.querySelectorAll(".pager button[data-p]").forEach(b=>b.onclick=()=>{page=+b.dataset.p;run();window.scrollTo({top:out.offsetTop-20,behavior:"smooth"})});
  bindVariants();
  out.querySelectorAll("[data-copy]").forEach(b=>b.onclick=()=>{
    const r = d.results[+b.closest(".rec").dataset.i];
    const n = s => [s.first,s.middle,s.last].filter(Boolean).join(" ");
    const txt = `NYC Marriage License — ${n(r.s1)} & ${n(r.s2)} — ${r.borough||""} ${r.year||""}${r.date?" (married "+r.date+")":""} — License #${r.license||"?"} — Source: NYC Marriage Index, Reclaim The Records`;
    navigator.clipboard.writeText(txt).then(()=>toast(t("copied")));
  });
}

function bindVariants(){
  out.querySelectorAll(".vchip[data-fn]").forEach(b => b.onclick = () => toggleFilter(b.dataset.g, b.dataset.fn));
}

function exportCSV(rows){
  const h = t("csv");
  const q = v => { let x = (v??"").toString(); if (/^[=+\-@\t\r]/.test(x)) x = "'" + x; return `"${x.replace(/"/g,'""')}"`; };   // no spreadsheet formulas from data
  const lines = [h.map(q).join(",")].concat(rows.map(r => [r.year,r.date,r.borough,r.license,r.s1.first,r.s1.middle,r.s1.last,r.s2.first,r.s2.middle,r.s2.last].map(q).join(",")));
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob(["﻿"+lines.join("\r\n")], {type:"text/csv;charset=utf-8"}));
  a.download = "nyc_marriage_results.csv"; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href), 2000);
}

function pager(cur, n){
  const nums = new Set([1, n, cur-1, cur, cur+1, cur-2, cur+2].filter(x=>x>=1&&x<=n));
  const arr = [...nums].sort((a,b)=>a-b); let html = `<button data-p="${cur-1}" ${cur<=1?"disabled":""}>${document.documentElement.dir==="rtl"?"›":"‹"}</button>`, prev=0;
  for (const x of arr){ if (x-prev>1) html += `<button disabled>…</button>`; html += `<button data-p="${x}" class="${x===cur?"on":""}">${x}</button>`; prev=x; }
  return `<div class="pager">${html}<button data-p="${cur+1}" ${cur>=n?"disabled":""}>${document.documentElement.dir==="rtl"?"‹":"›"}</button></div>`;
}

loadMeta();
