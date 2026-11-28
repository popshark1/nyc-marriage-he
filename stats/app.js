"use strict";
const $ = s => document.querySelector(s);
const NS = "http://www.w3.org/2000/svg";
const t = (k, v) => I18N.t(k, v);
const fmt = n => n.toLocaleString(I18N.L[I18N.lang]._locale);
const pct = (a, b, d = 1) => (b ? (100 * a / b) : 0).toLocaleString(I18N.L[I18N.lang]._locale, {minimumFractionDigits: d, maximumFractionDigits: d}) + "%";
const css = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
function el(tag, attrs = {}, parent) {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}
const BOROS = ["Brooklyn", "Manhattan", "Staten Island", "Queens", "Bronx"];
const BORO_COL = {"Brooklyn": "--s1", "Manhattan": "--s2", "Staten Island": "--s3", "Queens": "--s4", "Bronx": "--s7"};
// chart groups (fixed order = fixed colour), with the fine categories they fold
const GROUPS = [
  {k: "israeli", c: "--s1", sub: ["israeli"]},
  {k: "hebrew",  c: "--s2", sub: ["hebrew"]},
  {k: "ashk",    c: "--s3", sub: ["ashk", "orth"]},
  {k: "seph",    c: "--s4", sub: ["nafrica", "mizrahi", "syrian", "persian"]},
  {k: "fsu",     c: "--s5", sub: ["fsu", "bukh"]},
  {k: "maybe",   c: "--s6", sub: ["maybe"]},
  {k: "nonj",    c: "--s7", sub: ["nonj"]},
  {k: "unk",     c: "--s-unk", sub: ["unk"]},
];
const SUBNAME = {israeli: "g.israeli", hebrew: "g.hebrew", ashk: "g.ashk", orth: "g.orth", nafrica: "g.nafrica", mizrahi: "g.mizrahi", syrian: "g.syrian",
  persian: "g.persian", fsu: "g.fsuonly", bukh: "g.bukh", maybe: "g.maybe", nonj: "g.nonj", unk: "g.unk"};
let D;

function tooltip(box) {
  let tip = box.querySelector(".tip");
  if (!tip) { tip = document.createElement("div"); tip.className = "tip"; box.appendChild(tip); }
  return {
    show(html, x, y) {
      tip.innerHTML = html; tip.style.opacity = 1;
      const w = tip.offsetWidth, bw = box.clientWidth;
      tip.style.left = Math.max(0, Math.min(bw - w, x + 14 > bw - w ? x - w - 14 : x + 14)) + "px";
      tip.style.top = Math.max(0, y - tip.offsetHeight - 10) + "px";
    },
    hide() { tip.style.opacity = 0; }
  };
}
function setDir(node) { node.setAttribute("dir", I18N.L[I18N.lang]._dir); }

/* ---------------- KPIs ---------------- */
function kpis() {
  const Y = Object.values(D.years);
  const couples = Y.reduce((a, v) => a + (v.couples || 0), 0), persons = Y.reduce((a, v) => a + (v.persons || 0), 0), both = Y.reduce((a, v) => a + (v.israeli || 0), 0);
  $("#kpis").innerHTML = [
    [fmt(D.total), t("k.couples")],
    [fmt(D.jewish_tot[1]) + ` <small style="font-size:16px;color:var(--muted)">(${pct(D.jewish_tot[1], D.jewish_tot[0])})</small>`, t("k.jew")],
    [fmt(persons), t("k.isr")],
    [fmt(both), t("k.both")],
  ].map(([b, s]) => `<div class="kpi"><b>${b}</b><span>${s}</span></div>`).join("");
}

/* ---------------- chart B: stacked bars per year ---------------- */
function groupVal(v, g) { return g.sub.reduce((a, k) => a + (v[k] || 0), 0); }
function chartB() {
  const box = $("#chartB"); box.querySelectorAll("svg").forEach(s => s.remove());
  const years = []; for (let y = 1960; y <= 2017; y++) years.push(y);
  const W = 1060, H = 360, m = {l: 44, r: 10, t: 10, b: 28};
  const iw = W - m.l - m.r, ih = H - m.t - m.b;
  const max = Math.max(...years.map(y => (D.years[y] || {}).couples || 0));
  const top = Math.ceil(max / 100) * 100;
  const svg = el("svg", {viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": t("b.h")}, box);
  const g = el("g", {transform: `translate(${m.l},${m.t})`}, svg);
  for (let v = 0; v <= top; v += 100) {
    const y = ih - ih * v / top;
    el("line", {x1: 0, x2: iw, y1: y, y2: y, stroke: v ? css("--grid") : css("--axis"), "stroke-width": 1}, g);
    el("text", {x: -8, y: y + 4, "text-anchor": "end"}, g).textContent = fmt(v);
  }
  const step = iw / years.length, bw = Math.max(4, step - 2);   // 2px surface gap between bars
  const tip = tooltip(box);
  years.forEach((yr, i) => {
    const v = D.years[yr] || {}; const x = i * step + (step - bw) / 2;
    let acc = 0; const segs = [];
    GROUPS.forEach(gr => {
      const n = groupVal(v, gr); if (!n) return;
      const h = ih * n / top; segs.push({gr, n, y: ih - ih * (acc + n) / top, h}); acc += n;
    });
    segs.forEach((s, j) => {
      const last = j === segs.length - 1;
      const hh = Math.max(0, s.h - (last ? 0 : 1));   // hairline surface gap between stacked segments
      if (last && hh > 4) {
        const r = Math.min(4, bw / 2);
        el("path", {d: `M${x},${s.y + hh} V${s.y + r} Q${x},${s.y} ${x + r},${s.y} H${x + bw - r} Q${x + bw},${s.y} ${x + bw},${s.y + r} V${s.y + hh} Z`, fill: css(s.gr.c)}, g);
      } else el("rect", {x, y: s.y, width: bw, height: hh, fill: css(s.gr.c)}, g);
    });
    if (yr % 5 === 0) el("text", {x: x + bw / 2, y: ih + 18, "text-anchor": "middle"}, g).textContent = yr;
    const hit = el("rect", {x: i * step, y: 0, width: step, height: ih, fill: "transparent"}, g);
    const show = ev => {
      const r = box.getBoundingClientRect(), p = ev.touches ? ev.touches[0] : ev;
      const rows = GROUPS.slice().reverse().map(gr => { const n = groupVal(v, gr); return n ? `<div><span><i style="background:${css(gr.c)}"></i>${t("g." + gr.k)}</span><b style="display:inline;margin:0">${fmt(n)}</b></div>` : ""; }).join("");
      tip.show(`<b>${yr}</b>${rows}<div class="tot"><span>${t("tt.total")}</span><span>${fmt(v.couples || 0)}</span></div>`, p.clientX - r.left, p.clientY - r.top);
      hit.setAttribute("fill", "rgba(20,33,61,.05)");
    };
    hit.addEventListener("mousemove", show); hit.addEventListener("touchstart", show, {passive: true});
    hit.addEventListener("mouseleave", () => { tip.hide(); hit.setAttribute("fill", "transparent"); });
  });
  // direct label on the tallest recent bar total
  const lastY = 2017, lv = (D.years[lastY] || {}).couples || 0;
  el("text", {class: "lbl", x: (years.length - 1) * step + step / 2, y: ih - ih * lv / top - 6, "text-anchor": "end"}, g).textContent = fmt(lv);
  // legend
  const leg = $("#legB"); setDir(leg);
  leg.innerHTML = GROUPS.map(gr => `<li><i style="background:${css(gr.c)}"></i>${t("g." + gr.k)}</li>`).join("");
  // table
  const head = `<tr><th>${t("col.year")}</th><th class="n">${t("col.couples")}</th>${GROUPS.map(gr => `<th class="n">${t("g." + gr.k)}</th>`).join("")}</tr>`;
  const body = Object.keys(D.years).map(Number).sort((a, b) => a - b).map(yr => { const v = D.years[yr];
    return `<tr><td>${yr}</td><td class="n">${fmt(v.couples)}</td>${GROUPS.map(gr => `<td class="n">${fmt(groupVal(v, gr))}</td>`).join("")}</tr>`; }).join("");
  $("#tblB").innerHTML = `<table>${head}${body}</table>`; setDir($("#tblB"));
}

/* ---------------- tables C & D ---------------- */
function tables() {
  const T = {}; Object.values(D.years).forEach(v => { for (const k in v) T[k] = (T[k] || 0) + v[k]; });
  const all = T.couples, maxg = Math.max(...GROUPS.map(g => groupVal(T, g)));
  let rows = "";
  GROUPS.forEach(gr => {
    const n = groupVal(T, gr);
    rows += `<tr class="grp"><td><i style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${css(gr.c)};margin-inline-end:6px"></i>${t("g." + gr.k)}</td><td class="n">${fmt(n)}</td><td class="n">${pct(n, all)}</td><td><span class="bar" style="width:${Math.round(90 * n / maxg)}px;background:${css(gr.c)}"></span></td></tr>`;
    if (gr.sub.length > 1) gr.sub.forEach(s => rows += `<tr class="subrow"><td>${t(SUBNAME[s])}</td><td class="n">${fmt(T[s] || 0)}</td><td class="n">${pct(T[s] || 0, all)}</td><td></td></tr>`);
    if (gr.k === "nonj") Object.entries(D.nonj).sort((a, b) => b[1] - a[1]).forEach(([k, n]) => rows += `<tr class="subrow"><td>${t("n." + k)}</td><td class="n">${fmt(n)}</td><td class="n">${pct(n, all)}</td><td></td></tr>`);
  });
  $("#tblC").innerHTML = `<table><tr><th>${t("col.cat")}</th><th class="n">${t("col.n")}</th><th class="n">${t("col.pct")}</th><th></th></tr>${rows}</table>`;
  const O = Object.entries(D.own).sort((a, b) => (a[0] === "unk") - (b[0] === "unk") || b[1] - a[1]);
  const on = O.reduce((a, x) => a + x[1], 0), om = Math.max(...O.filter(x => x[0] !== "unk").map(x => x[1]));
  $("#tblD").innerHTML = `<table><tr><th>${t("col.cat")}</th><th class="n">${t("col.n")}</th><th class="n">${t("col.pct")}</th><th></th></tr>` +
    O.map(([k, n]) => `<tr><td>${t("o." + k)}</td><td class="n">${fmt(n)}</td><td class="n">${pct(n, on)}</td><td>${k === "unk" ? "" : `<span class="bar" style="width:${Math.round(90 * n / om)}px"></span>`}</td></tr>`).join("") + "</table>";
  setDir($("#tblC")); setDir($("#tblD"));
}

/* ---------------- chart A: lines per borough ---------------- */
function chartA() {
  const box = $("#chartA"); box.querySelectorAll("svg").forEach(s => s.remove());
  const decs = [1950, 1960, 1970, 1980, 1990, 2000, 2010];
  const W = 1060, H = 320, m = {l: 44, r: 120, t: 12, b: 28}, iw = W - m.l - m.r, ih = H - m.t - m.b, top = 14;
  const svg = el("svg", {viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": t("a.h")}, box);
  const g = el("g", {transform: `translate(${m.l},${m.t})`}, svg);
  const X = i => iw * i / (decs.length - 1), Yv = p => ih - ih * p / top;
  for (let v = 0; v <= top; v += 2) { el("line", {x1: 0, x2: iw, y1: Yv(v), y2: Yv(v), stroke: v ? css("--grid") : css("--axis")}, g); el("text", {x: -8, y: Yv(v) + 4, "text-anchor": "end"}, g).textContent = v + "%"; }
  decs.forEach((d, i) => el("text", {x: X(i), y: ih + 18, "text-anchor": "middle"}, g).textContent = d + "s");
  const P = b => decs.map(d => { const x = (D.jewish[b] || {})[d]; return x ? 100 * x[1] / x[0] : 0; });
  const ends = [];
  BOROS.forEach(b => {
    const p = P(b), col = css(BORO_COL[b]);
    el("path", {d: p.map((v, i) => `${i ? "L" : "M"}${X(i)},${Yv(v)}`).join(""), fill: "none", stroke: col, "stroke-width": 2, "stroke-linejoin": "round"}, g);
    p.forEach((v, i) => el("circle", {cx: X(i), cy: Yv(v), r: 4, fill: col, stroke: css("--card"), "stroke-width": 2}, g));
    ends.push({b, y: Yv(p[p.length - 1]), col});
  });
  ends.sort((a, b) => a.y - b.y); for (let i = 1; i < ends.length; i++) if (ends[i].y - ends[i - 1].y < 14) ends[i].y = ends[i - 1].y + 14;
  ends.forEach(e => el("text", {class: "lbl", x: iw + 10, y: e.y + 4}, g).textContent = I18N.t("boros")[e.b]);
  const cross = el("line", {y1: 0, y2: ih, stroke: css("--axis"), "stroke-dasharray": "3 3", opacity: 0}, g);
  const tip = tooltip(box);
  const hit = el("rect", {x: -10, y: 0, width: iw + 20, height: ih, fill: "transparent"}, g);
  const move = ev => {
    const r = svg.getBoundingClientRect(), p = ev.touches ? ev.touches[0] : ev;
    const sx = (p.clientX - r.left) * W / r.width - m.l; const i = Math.max(0, Math.min(decs.length - 1, Math.round(sx / (iw / (decs.length - 1)))));
    cross.setAttribute("x1", X(i)); cross.setAttribute("x2", X(i)); cross.setAttribute("opacity", 1);
    const rows = BOROS.map(b => ({b, v: P(b)[i]})).sort((a, c) => c.v - a.v).map(o => `<div><span><i style="background:${css(BORO_COL[o.b])}"></i>${I18N.t("boros")[o.b]}</span><span>${o.v.toLocaleString(I18N.L[I18N.lang]._locale, {maximumFractionDigits: 1})}%</span></div>`).join("");
    const br = box.getBoundingClientRect();
    tip.show(`<b>${decs[i]}s</b>${rows}`, p.clientX - br.left, p.clientY - br.top);
  };
  hit.addEventListener("mousemove", move); hit.addEventListener("touchstart", move, {passive: true});
  hit.addEventListener("mouseleave", () => { tip.hide(); cross.setAttribute("opacity", 0); });
  const leg = $("#legA"); setDir(leg);
  leg.innerHTML = BOROS.map(b => `<li><i style="background:${css(BORO_COL[b])}"></i>${I18N.t("boros")[b]}</li>`).join("");
  const head = `<tr><th>${t("col.boro")}</th>${decs.map(d => `<th class="n">${d}s</th>`).join("")}</tr>`;
  $("#tblA").innerHTML = `<table>${head}${BOROS.map(b => `<tr><td>${I18N.t("boros")[b]}</td>${decs.map(d => { const x = D.jewish[b][d]; return `<td class="n">${pct(x[1], x[0])} <small style="color:var(--muted)">(${fmt(x[1])})</small></td>`; }).join("")}</tr>`).join("")}</table>`;
  setDir($("#tblA"));
}

function renderAll() { kpis(); chartB(); tables(); chartA();
  document.querySelectorAll(".tblbtn").forEach(b => b.textContent = t($("#" + b.dataset.t).classList.contains("on") ? "tbl.hide" : "tbl.show"));
}
function setLang(l) {
  I18N.set(l); $("#tabSearch").href = "index.html?lang=" + l; $("#tabStats").href = "stats.html?lang=" + l;
  const u = new URL(location.href); u.searchParams.set("lang", l); history.replaceState(null, "", u);
  if (D) renderAll();
}
document.querySelectorAll(".langs button").forEach(b => b.onclick = () => setLang(b.dataset.lang));
document.querySelectorAll(".tblbtn").forEach(b => b.onclick = () => { const w = $("#" + b.dataset.t); w.classList.toggle("on"); b.textContent = t(w.classList.contains("on") ? "tbl.hide" : "tbl.show"); });
setLang(I18N.lang);
fetch("stats/data.json").then(r => r.json()).then(j => { D = j; renderAll(); });
let rt; addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => D && renderAll(), 150); });
