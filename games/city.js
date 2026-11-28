// A city of 1910 around the wedding garden: tenements with fire escapes and rooftop
// water tanks, shop signs in English and Yiddish, cobbled streets, gas lamps,
// telegraph poles, pushcarts, a synagogue, a clock tower, horse cabs, a wagon,
// a horse-drawn streetcar and people in the clothes of the day.
//
// buildCity(ctx) lays the static streets and buildings (call before the garden's
// blocks are flushed); city.populate(ctx2) adds the moving people and horses.

export function buildCity(ctx) {
  const { THREE, scene, block, solid, col, pixTex, shade, MAT } = ctx;
  const R = ctx.rng(19100614);
  const pick = a => a[(R() * a.length) | 0];

  // ---------------------------------------------------------------- textures
  const night = [];                                 // materials whose glow follows the night
  function litMat(tex, mask, strength = 1) {
    const m = new THREE.MeshLambertMaterial({ map: tex, emissive: "#ffffff", emissiveMap: mask || null, emissiveIntensity: 0 });
    if (mask) night.push([m, strength]);
    return m;
  }
  const brickTex = (base, mortar, seed, win, glowWin) => {
    const draw = (lit) => pixTex((g, n, r) => {
      for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
        const row = y >> 1, off = row % 2 ? 2 : 0;
        const m = y % 2 === 1 || (x + off) % 4 === 3;
        g.fillStyle = lit ? "#000" : (m ? mortar : shade(base, .86 + r() * .26));
        g.fillRect(x, y, 1, 1);
      }
      if (!win) return;
      // stone lintel and sill
      g.fillStyle = lit ? "#000" : "#d9d0bd"; g.fillRect(3, 2, 10, 1); g.fillRect(3, 13, 10, 1);
      // frame + two-over-two sash window
      g.fillStyle = lit ? "#000" : "#efe7d4"; g.fillRect(4, 3, 8, 10);
      for (let y = 4; y < 12; y++) for (let x = 5; x < 11; x++) {
        if (x === 7 || y === 7) { g.fillStyle = lit ? "#000" : "#efe7d4"; g.fillRect(x, y, 1, 1); continue; }
        g.fillStyle = lit ? (glowWin ? (y < 7 ? "#ffd889" : "#ffc66b") : "#000") : (y < 6 && x > 8 ? "#6f8396" : "#2c3846");
        g.fillRect(x, y, 1, 1);
      }
    }, 16, seed);
    return draw;
  };
  const BRICKS = [["#9b3d2c", "#d2c4ae"], ["#7a4a33", "#cdbfa8"], ["#b4703f", "#e0d3bb"], ["#8a2f2a", "#c9b9a1"], ["#a99d8a", "#ece4d4"]];
  const facades = BRICKS.map(([b, m], i) => {
    const d = brickTex(b, m, 40 + i, true, false), l = brickTex(b, m, 40 + i, true, true);
    return { plain: col(shade(b, .92)), lit: litMat(d(false), l(true), .95), dark: litMat(d(false), null) };
  });
  const shopTex = (wood, seed, door) => pixTex((g, n, r) => {
    g.fillStyle = wood; g.fillRect(0, 0, n, n);
    g.fillStyle = shade(wood, .7); g.fillRect(0, 13, n, 3);
    const glass = (x0, x1) => { for (let y = 2; y < 12; y++) for (let x = x0; x < x1; x++) { g.fillStyle = y < 4 && x % 3 === 0 ? "#7d93a6" : shade("#2e3a46", .9 + r() * .2); g.fillRect(x, y, 1, 1); } };
    if (door) { glass(1, 6); glass(10, 15); g.fillStyle = shade(wood, .55); g.fillRect(7, 3, 2, 13); g.fillStyle = "#d8b45a"; g.fillRect(8, 9, 1, 1); }
    else glass(1, 15);
  }, 16, seed);
  const shopMask = door => pixTex((g, n) => {
    g.fillStyle = "#000"; g.fillRect(0, 0, n, n); g.fillStyle = "#ffcf7a";
    if (door) { g.fillRect(1, 2, 5, 10); g.fillRect(10, 2, 5, 10); } else g.fillRect(1, 2, 14, 10);
  });
  const SHOPS = ["#3b2a1a", "#2e4a3a", "#5a2626", "#26364f", "#4a3b26"].map((w, i) => litMat(shopTex(w, 60 + i, i % 2), shopMask(i % 2), .8));
  const stoneArch = (lit) => pixTex((g, n, r) => {
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { g.fillStyle = lit ? "#000" : ((y % 5 === 4) ? "#b9a888" : shade("#dccaa6", .92 + r() * .14)); g.fillRect(x, y, 1, 1); }
    for (let y = 3; y < 14; y++) for (let x = 5; x < 11; x++) {
      if (y === 3 && (x === 5 || x === 10)) continue;
      g.fillStyle = lit ? "#ffd27a" : (y < 6 ? "#3f6aa8" : "#2b3c55"); g.fillRect(x, y, 1, 1);
    }
  }, 16, 77);
  const SYN = litMat(stoneArch(false), stoneArch(true), 1);
  const cornice = pixTex((g, n, r) => { for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { g.fillStyle = y > 10 && x % 3 === 0 ? "#8f8676" : shade("#d8cfbd", .9 + r() * .15); g.fillRect(x, y, 1, 1); } }, 16, 81);
  const CORNICE = new THREE.MeshLambertMaterial({ map: cornice });
  const awnTex = (a, b) => pixTex((g, n) => { for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { g.fillStyle = (x >> 2) % 2 ? a : b; g.fillRect(x, y, 1, 1); } }, 16, 3);
  const AWN = [awnTex("#9c2b2b", "#f1e6cf"), awnTex("#2f6b3a", "#f1e6cf"), awnTex("#23436b", "#efe4cc")].map(t => new THREE.MeshLambertMaterial({ map: t }));
  const stave = pixTex((g, n, r) => { for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { g.fillStyle = (y === 3 || y === 12) ? "#2b2b2b" : shade(x % 3 === 0 ? "#6b4a2b" : "#8d6a43", .9 + r() * .2); g.fillRect(x, y, 1, 1); } }, 16, 91);
  const STAVE = new THREE.MeshLambertMaterial({ map: stave });
  const IRON = col("#1d1d1f"), WOOD = col("#6b4a2b"), ROOF = col("#3a3a3d"), CURB = col("#9d9a91");
  const LAMP = new THREE.MeshLambertMaterial({ color: "#f1e6c4", emissive: "#ffcf6b", emissiveIntensity: .12 });
  night.push([LAMP, 1.6, .12]);

  // ---------------------------------------------------------------- ground
  const tiled = (draw, seed, w, h, per) => { const t = pixTex(draw, 16, seed); t.repeat.set(w / per, h / per); return t; };
  const cobbleDraw = (g, n, r) => {
    g.fillStyle = "#5d5a55"; g.fillRect(0, 0, n, n);
    for (let y = 0; y < n; y += 4) for (let x = (y / 4) % 2 ? 2 : 0; x < n; x += 4) {
      g.fillStyle = shade("#8f8a80", .8 + r() * .35); g.fillRect(x, y, 3, 3);
      g.fillStyle = shade("#a8a397", .9 + r() * .2); g.fillRect(x, y, 2, 1);
    }
  };
  const flagDraw = (g, n, r) => { for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { g.fillStyle = (x % 8 === 0 || y % 8 === 0) ? "#9a968c" : shade("#c9c4b8", .93 + r() * .12); g.fillRect(x, y, 1, 1); } };
  function plane(draw, seed, x0, z0, x1, z1, y, per) {
    const w = x1 - x0, h = z1 - z0;
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshLambertMaterial({ map: tiled(draw, seed, w, h, per) }));
    m.rotation.x = -Math.PI / 2; m.position.set((x0 + x1) / 2, y, (z0 + z1) / 2); scene.add(m); return m;
  }
  const B = 47.5, ZS = 101.5;                      // city bounds
  // cobbles everywhere outside the garden
  plane(cobbleDraw, 5, -B, -B, B, -24.5, 0, 2); plane(cobbleDraw, 6, -B, 24.5, B, ZS, 0, 2);
  plane(cobbleDraw, 7, -B, -24.5, -24.5, 24.5, 0, 2); plane(cobbleDraw, 8, 24.5, -24.5, B, 24.5, 0, 2);
  const far = new THREE.Mesh(new THREE.PlaneGeometry(420, 420), col("#6b8f55")); far.rotation.x = -Math.PI / 2; far.position.y = -.03; scene.add(far);
  // sidewalks: a ring round every block
  function sidewalkRing(x0, z0, x1, z1, w = 2.5) {
    const y = .06;
    plane(flagDraw, 11, x0 - w, z0 - w, x1 + w, z0, y, 2); plane(flagDraw, 12, x0 - w, z1, x1 + w, z1 + w, y, 2);
    plane(flagDraw, 13, x0 - w, z0, x0, z1, y, 2); plane(flagDraw, 14, x1, z0, x1 + w, z1, y, 2);
    // curbs
    block(CURB, (x0 + x1) / 2, .06, z0 - w, x1 - x0 + 2 * w + .2, .12, .2); block(CURB, (x0 + x1) / 2, .06, z1 + w, x1 - x0 + 2 * w + .2, .12, .2);
    block(CURB, x0 - w, .06, (z0 + z1) / 2, .2, .12, z1 - z0 + 2 * w); block(CURB, x1 + w, .06, (z0 + z1) / 2, .2, .12, z1 - z0 + 2 * w);
  }
  const OUT = [[-B, -B, B, -35.5, "s"], [-B, -35.5, -35.5, ZS, "e"], [35.5, -35.5, B, ZS, "w"], [-35.5, 89.5, 35.5, ZS, "n"]];
  const IN = [[-24.5, 35.5, -5.5, 55.5], [5.5, 35.5, 24.5, 55.5], [-24.5, 66.5, -5.5, 78.5], [5.5, 66.5, 24.5, 78.5]];
  sidewalkRing(-24.5, -24.5, 24.5, 24.5);          // round the garden
  for (const [x0, z0, x1, z1] of IN) sidewalkRing(x0, z0, x1, z1);
  // inner edges of the outer rows
  plane(flagDraw, 15, -35.5, -35.5, 35.5, -33, .06, 2); plane(flagDraw, 16, -35.5, -33, -33, 89.5, .06, 2);
  plane(flagDraw, 17, 33, -33, 35.5, 89.5, .06, 2); plane(flagDraw, 18, -33, 87, 33, 89.5, .06, 2);
  block(CURB, 0, .06, -33, 66, .12, .2); block(CURB, -33, .06, 28, .2, .12, 122); block(CURB, 33, .06, 28, .2, .12, 122); block(CURB, 0, .06, 87, 66, .12, .2);
  // streetcar rails along the main street
  for (const x of [-2.1, -.9, .9, 2.1]) block(IRON, x, .03, 58.5, .08, .05, 53);

  // ---------------------------------------------------------------- signs
  const SHOPNAMES = [["BAKERY", "בעקערײַ"], ["TAILOR", "שנײַדער"], ["KOSHER MEAT", "כּשר פֿלייש"], ["HATS & CAPS", "היטלען"], ["GROCERY", "שפּײַזקראָם"],
    ["BOOKS", "ספֿרים"], ["SODA WATER", "סאָדע־וואַסער"], ["DRY GOODS", "שניטוואַרג"], ["WATCHMAKER", "זייגערמאַכער"], ["SHOEMAKER", "שוסטער"],
    ["PICKLES", "זויערע אוגערקעס"], ["DELICATESSEN", "דעליקאַטעסן"], ["CAFE", "קאַפֿע"], ["YIDDISH THEATRE", "ייִדיש טעאַטער"], ["PHOTOGRAPHER", "פֿאָטאָגראַף"],
    ["HARDWARE", "אײַזנוואַרג"], ["CANDY", "צוקערקעס"], ["BANK", "באַנק"], ["FURRIER", "קירזשנער"], ["DRUGGIST", "אַפּטייק"]];
  let shopI = 0;
  function signMat(en, yi, bg) {
    const c = document.createElement("canvas"); c.width = 256; c.height = 64;
    const g = c.getContext("2d");
    g.fillStyle = bg; g.fillRect(0, 0, 256, 64);
    g.strokeStyle = "#e3c26b"; g.lineWidth = 4; g.strokeRect(4, 4, 248, 56);
    g.fillStyle = "#f0d684"; g.textAlign = "center"; g.textBaseline = "middle";
    g.font = "bold 22px Georgia, 'Times New Roman', serif"; g.fillText(en, 128, 22, 236);
    g.font = "bold 20px 'Frank Ruhl Libre', 'David', serif"; g.direction = "rtl"; g.fillText(yi, 128, 45, 236);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
    const m = new THREE.MeshLambertMaterial({ map: t, emissive: "#ffffff", emissiveMap: t, emissiveIntensity: 0 }); night.push([m, .35]);
    return m;
  }
  const SIGNBG = ["#1f3b2c", "#2a1d14", "#3d1414", "#14243d", "#111111"];

  // ---------------------------------------------------------------- buildings
  const tanks = [], cones = [], signs = [];
  // one building: along an edge (dir "x": edge runs along x at z=e; dir "z": runs along z at x=e), n = which way it faces
  function building(dir, e, n, a, b, D, F, opt = {}) {
    const w = b - a, mid = (a + b) / 2, H = F * 3;
    const fac = opt.mat || pick(facades);
    const at = (u, off, y) => dir === "x" ? [u, y, e + n * off] : [e + n * off, y, u];
    const sz = (along, nrm, h) => dir === "x" ? [along, h, nrm] : [nrm, h, along];
    block(fac.plain, ...at(mid, -D / 2, H / 2), ...sz(w, D, H));
    const nb = Math.max(1, Math.round(w / 3)), bw = w / nb;
    for (let f = 0; f < F; f++) for (let i = 0; i < nb; i++) {
      const u = a + (i + .5) * bw;
      const m = f === 0 ? (opt.shop ? pick(SHOPS) : (i % 2 ? pick(SHOPS) : fac.dark)) : (R() < .62 ? fac.lit : fac.dark);
      block(m, ...at(u, .06, 1.5 + 3 * f), ...sz(bw - .03, .12, 3));
    }
    block(CORNICE, ...at(mid, .18, H + .25), ...sz(w + .1, .6, .5));          // cornice
    for (let f = 1; f < F; f++) block(CORNICE, ...at(mid, .1, 3 * f), ...sz(w, .22, .14));   // string courses
    if (opt.shop) {
      const [en, yi] = SHOPNAMES[shopI++ % SHOPNAMES.length];
      const sm = new THREE.Mesh(new THREE.BoxGeometry(...sz(Math.min(w - .4, 6.5), .1, .7)), signMat(en, yi, pick(SIGNBG)));
      sm.position.set(...at(mid, .2, 3.35)); scene.add(sm); signs.push(sm);
      block(pick(AWN), ...at(mid, .65, 2.8), ...sz(w - .5, 1.1, .08));
    }
    // fire escape
    if (opt.fire && F >= 3 && w >= 5.5) {
      const fw = Math.min(w * .55, 4.2), fu = mid;
      for (let f = 1; f < F; f++) {
        const y = 3 * f + .05;
        block(IRON, ...at(fu, .55, y), ...sz(fw, .9, .06));
        block(IRON, ...at(fu, .98, y + .85), ...sz(fw, .05, .05));
        for (const s of [-1, 1]) block(IRON, ...at(fu + s * fw / 2, .98, y + .43), ...sz(.05, .05, .85));
        if (f < F - 1) {
          const run = fw * .55, len = Math.hypot(run, 3), th = Math.atan2(run, 3) * (f % 2 ? 1 : -1);
          if (dir === "x") block(IRON, ...at(fu, .55, y + 1.5), .38, len, .06, 0, 0, th);
          else block(IRON, ...at(fu, .55, y + 1.5), .06, len, .38, th, 0, 0);
        }
      }
    }
    // roof: water tank or chimney
    const rc = at(mid + (R() - .5) * w * .3, -D * .55, H);
    if (opt.tank !== false && R() < .4 && w >= 5) {
      for (const [dx, dz] of [[-.6, -.6], [.6, -.6], [-.6, .6], [.6, .6]]) block(WOOD, rc[0] + dx, H + .6, rc[2] + dz, .14, 1.2, .14);
      tanks.push([rc[0], H + 2.1, rc[2]]); cones.push([rc[0], H + 3.35, rc[2]]);
    } else if (R() < .7) block(col("#7a3a2a"), rc[0], H + .55, rc[2], .55, 1.1, .55);
    return H;
  }
  // fill the street sides of a block with a row of buildings
  function streetRow(dir, e, n, a, b, D, Fmin, Fmax, opt = {}) {
    let u = a;
    while (u < b - .1) {
      let w = 5 + R() * 3.5; if (b - (u + w) < 4) w = b - u;
      if (!(opt.skip && u + w > opt.skip[0] && u < opt.skip[1])) building(dir, e, n, u, u + w, D, Fmin + ((R() * (Fmax - Fmin + 1)) | 0), { shop: opt.shop && R() < .8, fire: R() < .55 });
      u += w;
    }
  }
  for (const [x0, z0, x1, z1] of IN) {
    const D = 8, main = x0 === 5.5 || x1 === -5.5;
    streetRow("x", z0, -1, x0, x1, D, 3, 5, { shop: true });
    streetRow("x", z1, 1, x0, x1, D, 3, 5, { shop: true });
    streetRow("z", x0, -1, z0 + D, z1 - D, D, 3, 5, { shop: x0 === 5.5 });
    streetRow("z", x1, 1, z0 + D, z1 - D, D, 3, 5, { shop: x1 === -5.5 });
    block(ROOF, (x0 + x1) / 2, 3.5, (z0 + z1) / 2, x1 - x0 - 1, 7, z1 - z0 - 1);
    solid(x0, z0, x1, z1);
  }
  streetRow("x", -35.5, 1, -35.5, 35.5, 11, 4, 6, { shop: false });                 // north row (behind the garden)
  streetRow("z", -35.5, 1, -35.5, 89.5, 11, 4, 6, { shop: true });                  // west row
  streetRow("z", 35.5, -1, -35.5, 89.5, 11, 4, 6, { shop: true });                  // east row
  streetRow("x", 89.5, -1, -35.5, 35.5, 11, 4, 6, { shop: true, skip: [-10, 10] }); // south row, leaving room for the synagogue
  for (const [x0, z0, x1, z1] of OUT) { block(ROOF, (x0 + x1) / 2, 4, (z0 + z1) / 2, x1 - x0 - 2, 8, z1 - z0 - 2); solid(x0, z0, x1, z1); }

  // ---------------------------------------------------------------- the synagogue at the end of the main street
  {
    const z = 89.5, x0 = -9, x1 = 9;
    block(col("#cdb994"), 0, 6.5, z + 6, x1 - x0, 13, 12);
    for (let f = 0; f < 2; f++) for (let i = 0; i < 6; i++) block(SYN, x0 + 1.5 + i * 3, 2 + f * 4.6, z - .06, 2.97, 4.4, .12);
    block(CORNICE, 0, 13.2, z - .1, 18.4, .5, .6);
    // gable with the rose window
    block(col("#d8c6a1"), 0, 14.6, z + .3, 8, 2.4, .8);
    const rc = document.createElement("canvas"); rc.width = rc.height = 128;
    const g = rc.getContext("2d");
    g.fillStyle = "#d8c6a1"; g.fillRect(0, 0, 128, 128);
    g.fillStyle = "#2b4f8a"; g.beginPath(); g.arc(64, 64, 58, 0, Math.PI * 2); g.fill();
    g.strokeStyle = "#e9c96b"; g.lineWidth = 7;
    for (const s of [1, -1]) { g.beginPath(); g.moveTo(64, 64 - s * 44); g.lineTo(64 + 38, 64 + s * 22); g.lineTo(64 - 38, 64 + s * 22); g.closePath(); g.stroke(); }
    g.lineWidth = 5; g.beginPath(); g.arc(64, 64, 58, 0, Math.PI * 2); g.stroke();
    const rt = new THREE.CanvasTexture(rc); rt.colorSpace = THREE.SRGBColorSpace;
    const rose = new THREE.MeshLambertMaterial({ map: rt, emissive: "#ffffff", emissiveMap: rt, emissiveIntensity: 0 }); night.push([rose, .7]);
    const rm = new THREE.Mesh(new THREE.BoxGeometry(4.2, 4.2, .15), rose); rm.position.set(0, 10.4, z - .14); scene.add(rm);
    // twin towers with domes
    for (const sx of [-1, 1]) {
      const tx = sx * 10.2;
      block(col("#cdb994"), tx, 8.5, z + 2, 3.4, 17, 4);
      for (let f = 0; f < 4; f++) block(SYN, tx, 2 + f * 4, z - .06, 2.2, 3.6, .12);
      block(CORNICE, tx, 17.2, z + 2, 3.8, .5, 4.4);
      block(col("#8a6f3f"), tx, 18.1, z + 2, 2.6, 1.4, 2.6); block(col("#8a6f3f"), tx, 19.1, z + 2, 1.6, .8, 1.6);
      block(col("#e3c26b"), tx, 20, z + 2, .18, 1.2, .18);
    }
    // steps and doors
    for (let s = 0; s < 3; s++) block(col("#bdb4a3"), 0, .1 + s * .2, z - .6 - (2 - s) * .45, 8 - s * .8, .2, .9);
    block(col("#4a2e1a"), 0, 1.7, z - .1, 2.4, 3.2, .1);
    // a gold Star of David on the gable top
    const st = new THREE.Mesh(new THREE.CircleGeometry(.8, 3), col("#e3c26b")); st.position.set(0, 16.6, z - .2); st.rotation.y = Math.PI; scene.add(st);
    const st2 = st.clone(); st2.rotation.z = Math.PI; scene.add(st2);
  }

  // ---------------------------------------------------------------- clock tower at the main crossing
  {
    const cx = 9.5, cz = 52, Ht = 19;
    block(col("#b8ad98"), cx, Ht / 2, cz, 4, Ht, 4);
    block(CORNICE, cx, Ht + .2, cz, 4.6, .5, 4.6);
    const cc = document.createElement("canvas"); cc.width = cc.height = 64;
    const g = cc.getContext("2d");
    g.fillStyle = "#b8ad98"; g.fillRect(0, 0, 64, 64);
    g.fillStyle = "#f7f2e2"; g.beginPath(); g.arc(32, 32, 29, 0, 7); g.fill();
    g.strokeStyle = "#222"; g.lineWidth = 2; g.stroke();
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; g.fillStyle = "#222"; g.fillRect(32 + Math.sin(a) * 24 - 1.5, 32 - Math.cos(a) * 24 - 1.5, 3, 3); }
    g.lineWidth = 3; g.beginPath(); g.moveTo(32, 32); g.lineTo(32 + 12, 32 - 6); g.moveTo(32, 32); g.lineTo(32 - 3, 32 - 20); g.stroke();
    const ct = new THREE.CanvasTexture(cc); ct.colorSpace = THREE.SRGBColorSpace;
    const clock = new THREE.MeshLambertMaterial({ map: ct, emissive: "#ffffff", emissiveMap: ct, emissiveIntensity: 0 }); night.push([clock, .55]);
    for (const [dx, dz, ry] of [[0, -2.02, Math.PI], [0, 2.02, 0], [-2.02, 0, -Math.PI / 2], [2.02, 0, Math.PI / 2]]) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(3, 3), clock); m.position.set(cx + dx, Ht - 2, cz + dz); m.rotation.y = ry; scene.add(m);
    }
    cones.push([cx, Ht + 1.6, cz, 3.2, 3, 4]);
  }

  // ---------------------------------------------------------------- street furniture
  function lamp(x, z) {
    block(IRON, x, 1.6, z, .14, 3.2, .14); block(IRON, x, .15, z, .32, .3, .32);
    block(LAMP, x, 3.45, z, .42, .5, .42); block(IRON, x, 3.75, z, .56, .1, .56); block(IRON, x, 3.17, z, .3, .06, .3);
    solid(x - .2, z - .2, x + .2, z + .2);
  }
  function ringLamps(x0, z0, x1, z1, off, step) {
    for (let x = x0; x <= x1; x += step) { lamp(x, z0 - off); lamp(x, z1 + off); }
    for (let z = z0 + step; z < z1; z += step) { lamp(x0 - off, z); lamp(x1 + off, z); }
  }
  ringLamps(-24.5, -24.5, 24.5, 24.5, 2.15, 12.25);
  for (const [x0, z0, x1, z1] of IN) ringLamps(x0, z0, x1, z1, 2.15, x1 - x0);
  // telegraph poles + wires along the main street
  const poles = []; for (let z = 36; z <= 86; z += 12.5) poles.push(z);
  for (const z of poles) {
    block(WOOD, -4.9, 3.75, z, .26, 7.5, .26); block(WOOD, -4.9, 7.1, z, 1.8, .14, .16);
    for (const dx of [-.75, -.25, .25, .75]) block(col("#3a5f3a"), -4.9 + dx, 7.25, z, .07, .14, .07);
    solid(-5.05, z - .15, -4.75, z + .15);
  }
  for (let i = 0; i < poles.length - 1; i++) for (const dx of [-.75, -.25, .25, .75])
    block(IRON, -4.9 + dx, 7.33, (poles[i] + poles[i + 1]) / 2, .025, .025, poles[i + 1] - poles[i]);
  // hydrants and a horse trough
  for (const [x, z] of [[-5.1, 35.9], [5.1, 55.1], [-24.1, 66.9], [24.1, 35.9]]) { block(col("#a6281f"), x, .45, z, .3, .8, .3); block(col("#a6281f"), x, .9, z, .4, .12, .4); solid(x - .2, z - .2, x + .2, z + .2); }
  block(WOOD, 12, .45, 34.6, 2.4, .7, .9); block(col("#5d86a8"), 12, .82, 34.6, 2.2, .04, .7); solid(10.8, 34.1, 13.2, 35.1);
  // barrels and crates by the shops
  for (let i = 0; i < 26; i++) {
    const [x0, z0, x1, z1] = pick(IN), side = (R() * 4) | 0;
    const t = .15 + R() * .7;
    let x = x0 + (x1 - x0) * t, z = z0 + (z1 - z0) * t;
    if (side === 0) z = z0 - .6; else if (side === 1) z = z1 + .6; else if (side === 2) x = x0 - .6; else x = x1 + .6;
    if (R() < .5) block(MAT.barrel, x, .5, z, .7, .9, .7); else block(WOOD, x, .35, z, .7, .6, .7);
    solid(x - .35, z - .35, x + .35, z + .35);
  }
  // pushcart market along the cross street
  const carts = [];
  const PRODUCE = ["#c0392b", "#7fb24a", "#e08a2a", "#8a6a3f", "#e8d36a", "#6d4f9b", "#d9d2c1"];
  for (const z of [57.1, 64.9]) for (let x = -21; x <= 21; x += 3.4) {
    if (Math.abs(x) < 7 || R() < .2) continue;
    block(WOOD, x, .9, z, 1.5, .25, .95); for (const [dx, dz] of [[-.65, -.38], [-.65, .38]]) block(WOOD, x + dx, .45, z + dz, .1, .8, .1);
    for (const dz of [-.5, .5]) { block(IRON, x + .55, .5, z + dz, .7, .7, .06); }
    block(WOOD, x - 1.1, .95, z, .9, .07, .07);
    for (let k = 0; k < 6; k++) block(col(pick(PRODUCE)), x - .5 + (k % 3) * .45, 1.15, z - .2 + (k > 2 ? .4 : 0), .38, .22, .34);
    if (R() < .5) { block(WOOD, x, 1.9, z, .06, 1.8, .06); block(pick(AWN), x, 2.8, z, 1.9, .06, 1.6); }
    solid(x - .8, z - .5, x + .8, z + .5); carts.push([x, z]);
  }
  // washing lines across the cross street
  const CLOTH = ["#f4f1ea", "#d9e4f0", "#c94a4a", "#e9d8a6", "#6a8fb5", "#f2c6d6", "#ffffff"];
  for (const x of [-19, -12.5, 12.5, 19]) for (const y of [7.6, 10.6]) {
    block(col("#d8d2c2"), x, y, 61, .03, .03, 11);
    for (let z = 56.8; z < 65.5; z += .75 + R() * .9) block(col(pick(CLOTH)), x, y - .4, z, .05, .7 + R() * .3, .5 + R() * .25);
  }

  // instanced tanks and roofs
  const tankGeo = new THREE.CylinderGeometry(1, 1, 1.8, 10), coneGeo = new THREE.ConeGeometry(1.05, .8, 10);
  const inst = (geo, mat, list) => {
    const m = new THREE.InstancedMesh(geo, mat, list.length), mx = new THREE.Matrix4();
    list.forEach(([x, y, z, sx = 1, sy = 1, seg], i) => { mx.makeScale(sx, sy, sx); mx.setPosition(x, y, z); m.setMatrixAt(i, mx); });
    scene.add(m);
  };
  inst(tankGeo, STAVE, tanks);
  inst(coneGeo, col("#3b3b3b"), cones.filter(c => !c[5]));
  for (const c of cones.filter(c => c[5])) { const m = new THREE.Mesh(new THREE.ConeGeometry(c[3], c[4], 4), col("#4b5a4f")); m.position.set(c[0], c[1], c[2]); m.rotation.y = Math.PI / 4; scene.add(m); }

  // ---------------------------------------------------------------- life: people, horses, carts
  const vehicles = [], walkers = [];
  function horse(color, mane = "#1c140e") {
    const g = new THREE.Group(), C = col(color), D = col(mane);
    const add = (geo, mat, x, y, z, rx = 0) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.rotation.x = rx; g.add(m); return m; };
    add(new THREE.BoxGeometry(.56, .62, 1.5), C, 0, 1.18, 0);
    add(new THREE.BoxGeometry(.3, .8, .36), C, 0, 1.6, .74, .55);
    add(new THREE.BoxGeometry(.1, .7, .14), D, 0, 1.66, .64, .55);
    add(new THREE.BoxGeometry(.3, .32, .66), C, 0, 1.95, 1.08, .3);
    add(new THREE.BoxGeometry(.16, .14, .1), col("#2a2a2a"), 0, 1.85, 1.42, .3);
    for (const s of [-1, 1]) add(new THREE.BoxGeometry(.06, .14, .06), C, s * .09, 2.18, .9);
    add(new THREE.BoxGeometry(.6, .12, .14), col("#2b1d12"), 0, 1.2, .4);                  // harness
    const legs = [];
    for (const [x, z] of [[-.17, .6], [.17, .6], [-.17, -.6], [.17, -.6]]) {
      const p = new THREE.Group(); p.position.set(x, .9, z);
      const l = new THREE.Mesh(new THREE.BoxGeometry(.15, .86, .15), C); l.position.y = -.43; p.add(l);
      const h = new THREE.Mesh(new THREE.BoxGeometry(.17, .12, .19), col("#222")); h.position.y = -.84; p.add(h);
      g.add(p); legs.push(p);
    }
    const tail = new THREE.Group(); tail.position.set(0, 1.4, -.76);
    const tm = new THREE.Mesh(new THREE.BoxGeometry(.1, .7, .12), D); tm.position.y = -.35; tail.add(tm); tail.rotation.x = -.35; g.add(tail);
    g.userData = { legs, tail };
    return g;
  }
  function wheel(r, x, y, z, mat) {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, .09, 10), mat); m.rotation.z = Math.PI / 2; m.position.set(x, y, z);
    const hub = new THREE.Mesh(new THREE.BoxGeometry(.11, r * 1.7, .08), col("#c9a64a")); m.add(hub);
    const hub2 = hub.clone(); hub2.rotation.y = Math.PI / 2; m.add(hub2);
    return m;
  }
  function vehicle(kind, loop, speed) {
    const g = new THREE.Group(); scene.add(g);
    const v = { g, kind, loop, speed, v: speed, d: R() * 100, horses: [], wheels: [], back: [] };
    if (kind === "tram") {
      for (const s of [-1, 1]) { const h = horse(s < 0 ? "#6b4a2f" : "#4a3322"); h.position.x = s * .42; g.add(h); v.horses.push(h); }
      const car = new THREE.Group(); car.position.z = -3.9; g.add(car);
      const body = new THREE.Mesh(new THREE.BoxGeometry(2.1, 1.9, 5.2), col("#b5832a")); body.position.y = 1.75; car.add(body);
      const band = new THREE.Mesh(new THREE.BoxGeometry(2.14, .7, 4.6), col("#2b3d4f")); band.position.y = 2.2; car.add(band);
      const roof = new THREE.Mesh(new THREE.BoxGeometry(2.3, .2, 5.6), col("#5a2626")); roof.position.y = 2.8; car.add(roof);
      for (const z of [-1.7, 1.7]) for (const x of [-.95, .95]) { const w = wheel(.42, x, .42, z, IRON); car.add(w); v.wheels.push(w); }
      const p = ctx2().person({ skin: "#e0ac7e", top: "#1f2a44", legs: "#1f2a44", hat: "#1a1a1a" }); p.position.set(0, .55, 2.3); car.add(p); v.back = [-3.9, -6.2];
    } else {
      const h = horse(pick(["#6b4a2f", "#3b2b20", "#8c6a4a", "#d8d2c6", "#2a2420"])); g.add(h); v.horses.push(h);
      const car = new THREE.Group(); car.position.z = -2.1; g.add(car);
      if (kind === "cab") {
        const c = pick(["#1b1b1f", "#3d1414", "#1d2e22"]);
        const body = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.3, 1.5), col(c)); body.position.y = 1.65; car.add(body);
        const win = new THREE.Mesh(new THREE.BoxGeometry(1.42, .5, .9), col("#2c3846")); win.position.set(0, 1.9, .05); car.add(win);
        const top = new THREE.Mesh(new THREE.BoxGeometry(1.5, .14, 1.7), IRON); top.position.y = 2.36; car.add(top);
        for (const x of [-.8, .8]) { const w = wheel(.75, x, .75, -.1, col("#3a2a1a")); car.add(w); v.wheels.push(w); }
        const p = ctx2().person({ skin: "#e8bb94", top: "#232323", legs: "#232323", hat: "#111111" }); p.position.set(0, 1.25, -.95); p.scale.setScalar(.9); car.add(p);
      } else {
        const body = new THREE.Mesh(new THREE.BoxGeometry(1.5, .5, 2.4), WOOD); body.position.set(0, 1.0, -.4); car.add(body);
        for (let k = 0; k < 4; k++) { const b = new THREE.Mesh(new THREE.BoxGeometry(.55, .75, .55), MAT.barrel); b.position.set(k % 2 ? .35 : -.35, 1.6, -.9 + (k > 1 ? .7 : 0)); car.add(b); }
        for (const [x, z] of [[-.8, .5], [.8, .5], [-.8, -1.3], [.8, -1.3]]) { const w = wheel(.55, x, .55, z, col("#3a2a1a")); car.add(w); v.wheels.push(w); }
        const p = ctx2().person({ skin: "#c68c5a", top: "#5b4a3a", legs: "#3b3128", kippah: "#4a3b2a" }); p.position.set(0, .95, .75); p.scale.setScalar(.9); car.add(p);
      }
      for (const s of [-1, 1]) { const sh = new THREE.Mesh(new THREE.BoxGeometry(.06, .06, 2.2), col("#2b1d12")); sh.position.set(s * .38, 1.05, -1.0); g.add(sh); }
      v.back = [-2.1];
    }
    // precompute the loop
    v.len = 0; v.seg = [];
    for (let i = 0; i < loop.length; i++) { const a = loop[i], b = loop[(i + 1) % loop.length], l = Math.hypot(b[0] - a[0], b[1] - a[1]); v.seg.push([a, b, l, v.len]); v.len += l; }
    vehicles.push(v);
    return v;
  }
  const pointAt = (v, d) => {
    d = ((d % v.len) + v.len) % v.len;
    for (const [a, b, l, s] of v.seg) if (d <= s + l) { const t = (d - s) / l; return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; }
    return v.seg[0][0];
  };
  let _ctx2 = null; const ctx2 = () => _ctx2;

  function populate(c2) {
    _ctx2 = c2;
    vehicle("cab", [[-28.5, -28.5], [28.5, -28.5], [28.5, 82.5], [-28.5, 82.5]], 3.4);
    vehicle("cab", [[-31.5, -31.5], [-31.5, 85.5], [31.5, 85.5], [31.5, -31.5]], 3.1);
    vehicle("wagon", [[-28.5, 28.5], [28.5, 28.5], [28.5, 59.5], [-28.5, 59.5]], 2.5);
    vehicle("cab", [[31.5, 62.5], [-31.5, 62.5], [-31.5, 31.5], [31.5, 31.5]], 3.0);
    vehicle("tram", [[1.5, 32], [1.5, 84], [-1.5, 84], [-1.5, 32]], 2.3);
    // people of 1910
    const COATS = ["#2b2b2b", "#3d3328", "#2f3a4a", "#4a3b2f", "#383838", "#523a2a"], DRESS = ["#4b3b5b", "#5a2f2f", "#2f3f5a", "#3e4a3a", "#6b5a3a", "#2b2b2b", "#7a6a5a"];
    const loops = [[-24.5, -24.5, 24.5, 24.5], ...IN, [-35.5, -35.5, 35.5, 89.5]];
    for (let i = 0; i < 22; i++) {
      const L = loops[i % loops.length], off = i % loops.length === loops.length - 1 ? -1.25 : 1.25;
      const [x0, z0, x1, z1] = [L[0] - off, L[1] - off, L[2] + off, L[3] + off];
      let pts = [[x0, z0], [x1, z0], [x1, z1], [x0, z1]];
      if (R() < .5) pts.reverse();
      const start = (R() * 4) | 0; pts = [...pts.slice(start), ...pts.slice(0, start)];
      const woman = R() < .45, kid = !woman && R() < .15;
      const top = woman ? pick(DRESS) : pick(COATS);
      const p = c2.person(woman
        ? { top, dress: shade(top, .85), dressW: .74, hat: R() < .7 ? pick(["#2b2b2b", "#5a3a2a", "#6b2f3f", "#e8dcc4"]) : null, sleeve: top }
        : { top, legs: shade(top, .8), hat: R() < .55 ? "#151515" : null, kippah: R() < .45 ? pick(["#3a3026", "#2b2b2b"]) : null, tie: R() < .3, beard: R() < .25 ? pick(["#2b1d14", "#7d7d7d", "#cfcfcf"]) : null, book: kid });
      if (kid) p.scale.setScalar(.75);
      const t = R(); const [a, b] = [pts[0], pts[1]];
      p.position.set(a[0] + (b[0] - a[0]) * t, 0, a[1] + (b[1] - a[1]) * t);
      walkers.push({ obj: p, path: [], loop: pts, k: 1, speed: kid ? 1.7 : .9 + R() * .5 });
    }
    // pushcart vendors
    for (const [x, z] of carts.filter((_, i) => i % 2 === 0)) {
      const p = c2.person({ top: pick(COATS), legs: "#2b2b2b", kippah: pick(["#3a3026", "#2b2b2b"]), beard: R() < .5 ? "#5a4a3a" : null });
      p.position.set(x - 1.4, .06, z); p.rotation.y = Math.PI / 2; walkers.push({ obj: p, vendor: true });
    }
  }

  function blocked(x, z, r) {
    for (const v of vehicles) {
      const p = v.g.position, a = v.g.rotation.y, fx = Math.sin(a), fz = Math.cos(a);
      if (Math.hypot(p.x - x, p.z - z) < r + .9) return true;
      for (const b of v.back) if (Math.hypot(p.x + fx * b - x, p.z + fz * b - z) < r + (v.kind === "tram" ? 1.25 : 1.0)) return true;
      if (v.kind === "tram" && Math.hypot(p.x + fx * -5.1 - x, p.z + fz * -5.1 - z) < r + 1.2) return true;
    }
    for (const w of walkers) if (Math.hypot(w.obj.position.x - x, w.obj.position.z - z) < r + .3) return true;
    return false;
  }

  const FAR = 44;                                   // beyond this, buildings hide them anyway: skip drawing
  function update(dt, ts, P, stepMover) {
    if ((update.n = (update.n || 0) + 1) % 10 === 0) for (const s of signs) s.visible = Math.hypot(s.position.x - P.x, s.position.z - P.z) < FAR;
    for (const v of vehicles) {
      v.g.visible = Math.hypot(v.g.position.x - P.x, v.g.position.z - P.z) < FAR;
      // stop for anyone in the road ahead
      const p = v.g.position, a = v.g.rotation.y, fx = Math.sin(a), fz = Math.cos(a);
      let stop = false;
      const ahead = (x, z, near) => { const dx = x - p.x, dz = z - p.z, f = dx * fx + dz * fz, s = Math.abs(dx * fz - dz * fx); return f > 0 && f < near && s < 1.7; };
      if (ahead(P.x, P.z, 4.2)) stop = true;
      for (const o of vehicles) if (o !== v) {
        const q = o.g.position, oa = o.g.rotation.y;
        if (ahead(q.x, q.z, 5.5) || o.back.some(b => ahead(q.x + Math.sin(oa) * b, q.z + Math.cos(oa) * b, 5.5))) stop = true;
      }
      v.v += ((stop ? 0 : v.speed) - v.v) * Math.min(1, dt * (stop ? 6 : 1.5));
      v.d += v.v * dt;
      const [x, z] = pointAt(v, v.d), [lx, lz] = pointAt(v, v.d + 2.2);
      p.set(x, 0, z);
      let want = Math.atan2(lx - x, lz - z), dy = want - v.g.rotation.y; dy = Math.atan2(Math.sin(dy), Math.cos(dy));
      v.g.rotation.y += dy * Math.min(1, dt * 4);
      const ph = v.d * 2.6;
      for (const h of v.horses) {
        h.userData.legs.forEach((l, i) => l.rotation.x = Math.sin(ph + (i === 0 || i === 3 ? 0 : Math.PI)) * .5 * Math.min(1, v.v));
        h.userData.tail.rotation.z = Math.sin(ts * 2.3) * .15;
        h.position.y = Math.abs(Math.sin(ph)) * .04 * Math.min(1, v.v);
      }
      for (const w of v.wheels) w.rotation.x += v.v * dt / .6;
    }
    for (const w of walkers) {
      w.obj.visible = Math.hypot(w.obj.position.x - P.x, w.obj.position.z - P.z) < FAR;
      if (w.vendor) { const u = w.obj.userData; u.armR.rotation.x = -.6 + Math.sin(ts * 2 + u.phase) * .5; u.head.rotation.y = Math.sin(ts * .7 + u.phase) * .7; continue; }
      if (!stepMover(w, dt, ts)) { w.path = [w.loop[w.k]]; w.k = (w.k + 1) % w.loop.length; }
      w.obj.position.y += .06;
    }
  }

  function setNight(k) {
    for (const [m, s, base = 0] of night) m.emissiveIntensity = base + (s - base) * k;
  }

  return { populate, update, blocked, setNight, bounds: { B, ZS } };
}
