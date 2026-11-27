// Wedding hide-and-seek — a small blocky (voxel-style) 3D game.
// All textures are generated in code; no external assets.
import * as THREE from "./lib/three.module.min.js";

// ------------------------------------------------------------------ i18n
const STR = {
  he: {
    dir: "rtl", title: "מחבואים בחתונה",
    sub: "החתן והכלה התחבאו זה מזה בין האורחים בגן. בחרו דמות ומצאו את בן או בת הזוג כדי שהחופה תתחיל!",
    choose: "בחרו דמות", bride: "כלה", groom: "חתן",
    storyB: "בחרת להיות הכלה. החתן התחבא איפשהו בגן – מצאי אותו!", storyG: "בחרת להיות החתן. הכלה התחבאה איפשהו בגן – מצא אותה!",
    easy: "קל", easyD: "נשאר/ת במקום, ויש מד חם־קר", hard: "קשה", hardD: "מחליף/ה מקום כל 45 שניות, בלי רמזים",
    start: "התחילו!", ctrlD: "WASD / חיצים – הליכה · עכבר – הסתכלות (לחצו על המסך) · Shift – ריצה",
    ctrlM: "ג׳ויסטיק בצד – הליכה · גרירה בצד השני – הסתכלות",
    hints: ["קפוא", "קר", "פושר", "חם", "רותח!"], movedG: "שמעת צחקוק… החתן עבר מקום!", movedB: "שמעת צחקוק… הכלה עברה מקום!",
    win: "מזל טוב!", foundG: "מצאת את החתן תוך {t} שניות", foundB: "מצאת את הכלה תוך {t} שניות",
    best: "השיא שלך: {t} שנ׳", newBest: "שיא חדש!", again: "שחקו שוב", back: "חזרה לחיפוש",
    home: "חזרה לאתר", sound: "צלילים", menu: "תפריט", tip: "טיפ: חפשו מאחורי עוגות, עצים, הבמה של הלהקה ובין האורחים",
  },
  en: {
    dir: "ltr", title: "Wedding Hide & Seek",
    sub: "The bride and groom are hiding from each other among the guests. Pick a character and find your partner so the ceremony can begin!",
    choose: "Choose your character", bride: "Bride", groom: "Groom",
    storyB: "You're the bride. The groom is hiding somewhere in the garden — find him!", storyG: "You're the groom. The bride is hiding somewhere in the garden — find her!",
    easy: "Easy", easyD: "Stays put, with a hot/cold meter", hard: "Hard", hardD: "Moves every 45 seconds, no hints",
    start: "Start!", ctrlD: "WASD / arrows — walk · mouse — look (click the scene) · Shift — run",
    ctrlM: "Joystick — walk · drag on the other side — look",
    hints: ["Freezing", "Cold", "Warm", "Hot", "Burning!"], movedG: "You heard a giggle… the groom moved!", movedB: "You heard a giggle… the bride moved!",
    win: "Mazel Tov!", foundG: "You found the groom in {t} seconds", foundB: "You found the bride in {t} seconds",
    best: "Your best: {t}s", newBest: "New record!", again: "Play again", back: "Back to search",
    home: "Back to the site", sound: "Sound", menu: "Menu", tip: "Tip: look behind the cake, trees, the band stage and among the guests",
  },
  yi: {
    dir: "rtl", title: "באַהאַלטערלעך אויף דער חתונה",
    sub: "דער חתן און די כּלה האָבן זיך באַהאַלטן איינער פֿונעם אַנדערן צווישן די געסט. קלײַבט אויס אַ פֿיגור און געפֿינט דעם פּאַרטנער, כּדי די חופּה זאָל זיך אָנהייבן!",
    choose: "קלײַבט אויס אַ פֿיגור", bride: "כּלה", groom: "חתן",
    storyB: "דו ביסט די כּלה. דער חתן האָט זיך באַהאַלטן ערגעץ אין גאָרטן – געפֿין אים!", storyG: "דו ביסט דער חתן. די כּלה האָט זיך באַהאַלטן ערגעץ אין גאָרטן – געפֿין זי!",
    easy: "גרינג", easyD: "בלײַבט אויפֿן אָרט, מיט אַ הייס־קאַלט מעסטער", hard: "שווער", hardD: "בײַט דעם אָרט יעדע 45 סעקונדעס, אָן אָנווײַזונגען",
    start: "הייבט אָן!", ctrlD: "WASD / פֿײַלן – גיין · מויז – קוקן (קליקט אויפֿן בילד) · Shift – לויפֿן",
    ctrlM: "דזשויסטיק – גיין · שלעפּן אויף דער אַנדערער זײַט – קוקן",
    hints: ["פֿאַרפֿרוירן", "קאַלט", "וואַרעם", "הייס", "ברענט!"], movedG: "מע האָט געהערט אַ כיכיקען… דער חתן האָט געביטן דעם אָרט!", movedB: "מע האָט געהערט אַ כיכיקען… די כּלה האָט געביטן דעם אָרט!",
    win: "מזל־טובֿ!", foundG: "דו האָסט געפֿונען דעם חתן אין {t} סעקונדעס", foundB: "דו האָסט געפֿונען די כּלה אין {t} סעקונדעס",
    best: "דײַן רעקאָרד: {t} סעק׳", newBest: "אַ נײַער רעקאָרד!", again: "נאָך אַ מאָל", back: "צוריק צום זוכן",
    home: "צוריק צום וועבזײַטל", sound: "קלאַנגען", menu: "מעניו", tip: "עצה: קוקט הינטער דעם טאָרט, די ביימער, די בינע פֿון דער קאַפּעליע און צווישן די געסט",
  },
  fr: {
    dir: "ltr", title: "Cache-cache au mariage",
    sub: "Les mariés se cachent l'un de l'autre parmi les invités. Choisissez un personnage et retrouvez votre moitié pour que la cérémonie commence !",
    choose: "Choisissez votre personnage", bride: "Mariée", groom: "Marié",
    storyB: "Vous êtes la mariée. Le marié se cache quelque part dans le jardin — trouvez-le !", storyG: "Vous êtes le marié. La mariée se cache quelque part dans le jardin — trouvez-la !",
    easy: "Facile", easyD: "Reste sur place, avec un indicateur chaud/froid", hard: "Difficile", hardD: "Change de cachette toutes les 45 s, sans indices",
    start: "C'est parti !", ctrlD: "ZQSD / WASD / flèches — marcher · souris — regarder (cliquez sur la scène) · Maj — courir",
    ctrlM: "Joystick — marcher · glisser de l'autre côté — regarder",
    hints: ["Glacial", "Froid", "Tiède", "Chaud", "Brûlant !"], movedG: "Un petit rire… le marié a changé de cachette !", movedB: "Un petit rire… la mariée a changé de cachette !",
    win: "Mazel Tov !", foundG: "Vous avez trouvé le marié en {t} secondes", foundB: "Vous avez trouvé la mariée en {t} secondes",
    best: "Votre record : {t} s", newBest: "Nouveau record !", again: "Rejouer", back: "Retour à la recherche",
    home: "Retour au site", sound: "Son", menu: "Menu", tip: "Astuce : regardez derrière le gâteau, les arbres, la scène de l'orchestre et parmi les invités",
  },
};
const LANGS = ["he", "en", "yi", "fr"];
const NAMES = { he: "עברית", en: "English", yi: "ייִדיש", fr: "Français" };
let lang = (() => {
  const q = new URLSearchParams(location.search).get("lang");
  if (q && STR[q]) return q;
  try { const s = localStorage.getItem("lang"); if (s && STR[s]) return s; } catch (e) { /* */ }
  return "he";
})();
const T = (k, v) => { let s = STR[lang][k] ?? STR.he[k]; if (typeof s === "string" && v) s = s.replace(/\{(\w+)\}/g, (_, x) => v[x]); return s; };
const store = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* */ } },
};

// ------------------------------------------------------------------ textures
function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
function pixTex(draw, size = 16, seed = 1) {
  const c = document.createElement("canvas"); c.width = c.height = size;
  const g = c.getContext("2d"); draw(g, size, rng(seed));
  const t = new THREE.CanvasTexture(c);
  t.magFilter = THREE.NearestFilter; t.minFilter = THREE.NearestFilter; t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}
const shade = (hex, f) => { const c = new THREE.Color(hex); c.multiplyScalar(f); return "#" + c.getHexString(); };
function noise(base, spread = 0.18, seed = 1) {
  return pixTex((g, n, r) => { for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { g.fillStyle = shade(base, 1 - spread / 2 + r() * spread); g.fillRect(x, y, 1, 1); } }, 16, seed);
}
const TEX = {
  grass: noise("#5fa64a", 0.28, 3),
  hedge: pixTex((g, n, r) => { for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { const v = r(); g.fillStyle = v < .12 ? "#2f6b2a" : v < .2 ? "#6fbf55" : shade("#3f8a36", .85 + r() * .3); g.fillRect(x, y, 1, 1); } }, 16, 5),
  wood: pixTex((g, n, r) => { for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { g.fillStyle = shade(x % 4 === 0 ? "#6b4a2b" : "#8a6239", .9 + r() * .2); g.fillRect(x, y, 1, 1); } }, 16, 7),
  plank: pixTex((g, n, r) => { for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { g.fillStyle = shade(y % 4 === 3 ? "#9a7446" : "#c49a63", .92 + r() * .16); g.fillRect(x, y, 1, 1); } }, 16, 9),
  cloth: noise("#f4f1ea", 0.06, 11),
  runner: pixTex((g, n, r) => { for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { g.fillStyle = (x === 1 || x === 14) ? "#d9c27a" : shade("#fbfaf6", .96 + r() * .05); g.fillRect(x, y, 1, 1); } }, 16, 13),
  canopy: pixTex((g, n, r) => { for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { const s = (y === 2 || y === 3 || y === 12 || y === 13); g.fillStyle = s ? shade("#2c5aa0", .9 + r() * .2) : shade("#f8f6ef", .95 + r() * .06); g.fillRect(x, y, 1, 1); } }, 16, 15),
  stone: pixTex((g, n, r) => { for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { g.fillStyle = (x % 8 === 0 || y % 8 === 0) ? "#8b8b84" : shade("#bdbab0", .9 + r() * .2); g.fillRect(x, y, 1, 1); } }, 16, 17),
  floor: pixTex((g, n) => { for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { g.fillStyle = ((x >> 3) + (y >> 3)) % 2 ? "#2b2b33" : "#e9e4d6"; g.fillRect(x, y, 1, 1); } }, 16, 19),
  leaves: pixTex((g, n, r) => { for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { const v = r(); g.fillStyle = v < .1 ? "#1f5a24" : shade("#2f7d32", .8 + r() * .4); g.fillRect(x, y, 1, 1); } }, 16, 21),
  flowers: pixTex((g, n, r) => { for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { const v = r(); g.fillStyle = v < .16 ? "#f2a7c3" : v < .26 ? "#ffffff" : v < .32 ? "#e2556f" : v < .36 ? "#f5d76e" : shade("#3f8a36", .8 + r() * .3); g.fillRect(x, y, 1, 1); } }, 16, 23),
  cake: pixTex((g, n, r) => { for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { g.fillStyle = y % 5 === 0 ? "#f2c6d6" : (x + y) % 7 === 0 ? "#fffbe8" : shade("#fff6ec", .96 + r() * .05); g.fillRect(x, y, 1, 1); } }, 16, 25),
  barrel: pixTex((g, n, r) => { for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { g.fillStyle = (y === 2 || y === 13) ? "#555" : shade("#7a5230", .85 + r() * .25); g.fillRect(x, y, 1, 1); } }, 16, 27),
};
TEX.grass.repeat.set(64, 64);
const MAT = {};
for (const [k, t] of Object.entries(TEX)) MAT[k] = new THREE.MeshLambertMaterial({ map: t });
const flat = {};
const col = hex => (flat[hex] ||= new THREE.MeshLambertMaterial({ color: hex }));
const glow = hex => (flat["g" + hex] ||= new THREE.MeshLambertMaterial({ color: hex, emissive: hex, emissiveIntensity: .45 }));

// ------------------------------------------------------------------ scene
const canvas = document.getElementById("game");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
const scene = new THREE.Scene();
scene.background = new THREE.Color("#9fd3ff");
scene.fog = new THREE.Fog("#cfe8ff", 22, 60);
const camera = new THREE.PerspectiveCamera(72, 1, 0.05, 120);
scene.add(new THREE.HemisphereLight("#dff1ff", "#4c7a3a", 1.15));
const sun = new THREE.DirectionalLight("#fff3d6", 1.6); sun.position.set(18, 30, 10); scene.add(sun);

const ground = new THREE.Mesh(new THREE.PlaneGeometry(64, 64), MAT.grass);
ground.rotation.x = -Math.PI / 2; scene.add(ground);

// batched blocks: one InstancedMesh per material
const UNIT = new THREE.BoxGeometry(1, 1, 1);
const batches = new Map();
function block(mat, x, y, z, sx = 1, sy = 1, sz = 1) {
  if (!batches.has(mat)) batches.set(mat, []);
  batches.get(mat).push(new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), new THREE.Quaternion(), new THREE.Vector3(sx, sy, sz)));
}
function flushBlocks() {
  for (const [mat, list] of batches) {
    const m = new THREE.InstancedMesh(UNIT, mat, list.length);
    list.forEach((mx, i) => m.setMatrixAt(i, mx));
    scene.add(m);
  }
  batches.clear();
}

// colliders: axis-aligned rectangles on the ground (x0,z0,x1,z1)
const solids = [];
const solid = (x0, z0, x1, z1) => solids.push([Math.min(x0, x1), Math.min(z0, z1), Math.max(x0, x1), Math.max(z0, z1)]);
// helper: a solid box centred at x,z
function prop(mat, x, y, z, sx, sy, sz, collide = true) {
  block(mat, x, y, z, sx, sy, sz);
  if (collide) solid(x - sx / 2, z - sz / 2, x + sx / 2, z + sz / 2);
}

const R = rng(20261127);
const W = 24;           // garden half-size

// hedges around the garden (gap at the south entrance)
for (let i = -W; i <= W; i++) {
  for (const h of [0.5, 1.5]) {
    block(MAT.hedge, i, h, -W); block(MAT.hedge, -W, h, i); block(MAT.hedge, W, h, i);
    if (Math.abs(i) > 2) block(MAT.hedge, i, h, W);
  }
}
solid(-W - .5, -W - .5, W + .5, -W + .5); solid(-W - .5, -W, -W + .5, W); solid(W - .5, -W, W + .5, W);
solid(-W, W - .5, -2.5, W + .5); solid(2.5, W - .5, W, W + .5);

// chuppah
const CH = { x: 0, z: -14 };
for (const [dx, dz] of [[-2, -2], [2, -2], [-2, 2], [2, 2]]) prop(MAT.wood, CH.x + dx, 1.6, CH.z + dz, .35, 3.2, .35);
block(MAT.canopy, CH.x, 3.3, CH.z, 4.6, .2, 4.6);
for (const [dx, dz] of [[-2, -2], [2, -2], [-2, 2], [2, 2]]) block(MAT.flowers, CH.x + dx, 3.55, CH.z + dz, .7, .5, .7);
block(MAT.runner, 0, .03, -5, 3, .06, 18);                       // aisle runner
// flower wall behind the chuppah
for (let x = -4; x <= 4; x++) for (let y = 0; y < 3; y++) block(MAT.flowers, x, y + .5, -17.5);
solid(-4.5, -18, 4.5, -17);
// ceremony chairs + seated guests
const seated = [];
for (let z = -10; z <= -2; z += 2) for (const x of [-9, -7, -5, -3, 3, 5, 7, 9]) {
  block(MAT.plank, x, .45, z, .8, .12, .8); block(MAT.plank, x, .95, z + .35, .8, .9, .12);
  for (const [lx, lz] of [[-.32, -.32], [.32, -.32], [-.32, .32], [.32, .32]]) block(MAT.wood, x + lx, .2, z + lz, .1, .4, .1);
  solid(x - .4, z - .4, x + .4, z + .45);
  if (R() < .55) seated.push([x, z]);
}
// reception tables
const TABLES = [[-12, 5], [-5, 9], [-12, 13], [-5, 17], [2, 13], [-14, 20]];
for (const [x, z] of TABLES) {
  block(MAT.wood, x, .35, z, .3, .7, .3);
  block(MAT.cloth, x, .8, z, 2.6, .2, 2.6);
  block(MAT.cloth, x, .5, z, 2.4, .5, 2.4);
  block(MAT.flowers, x, 1.15, z, .5, .5, .5);
  solid(x - 1.3, z - 1.3, x + 1.3, z + 1.3);
}
// dance floor + band stage
const DF = { x: 13, z: 10 };
block(MAT.floor, DF.x, .02, DF.z, 9, .04, 9);
prop(MAT.plank, 20.2, .4, 10, 3, .8, 8);
for (const [x, z, c] of [[20, 7.5, "#c9a227"], [20.5, 10, "#6b3f1f"], [20, 12.5, "#222"]]) block(col(c), x, 1.3, z, .6, 1, .6);
// cake table
prop(MAT.cloth, -18, .5, 0, 1.6, 1, 3);
block(MAT.cake, -18, 1.35, 0, 1, .7, 1); block(MAT.cake, -18, 1.95, 0, .7, .5, .7); block(MAT.cake, -18, 2.35, 0, .45, .3, .45);
block(col("#ffffff"), -18, 2.6, 0, .12, .2, .12);
// second flower wall (photo corner)
for (let z = -11; z <= -5; z++) for (let y = 0; y < 3; y++) block(MAT.flowers, -19.5, y + .5, z);
solid(-20, -11.5, -19, -4.5);
// bar with barrels
prop(MAT.plank, 18.5, .6, -6, 1.2, 1.2, 5);
for (const z of [-8, -6.8]) prop(MAT.barrel, 21.5, .6, z, 1.1, 1.2, 1.1);
for (const z of [-4.5]) prop(MAT.barrel, 21.5, .6, z, 1.1, 1.2, 1.1);
// trees
function tree(x, z, h = 4) {
  prop(MAT.wood, x, h / 2, z, .8, h, .8);
  for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++) for (let dy = 0; dy < 2; dy++) {
    if (dy === 1 && (Math.abs(dx) + Math.abs(dz) === 2)) continue;
    block(MAT.leaves, x + dx * 1.1, h + .3 + dy * 1.1, z + dz * 1.1, 1.1, 1.1, 1.1);
  }
}
for (const [x, z] of [[-18, -18], [18, -17], [-20, 18], [20, 20], [8, 21], [-9, -20], [11, -12], [-22, 7]]) tree(x, z, 3.6 + R() * 1.2);
// bushes
for (const [x, z] of [[-14, -4], [14, 2], [-2, 22], [6, -18], [-16, 10], [16, 17]]) prop(MAT.hedge, x, .6, z, 1.4, 1.2, 1.4);
flushBlocks();

// ------------------------------------------------------------------ blocky people
function faceTex(skin, hair, bride) {
  return pixTex((g, n) => {
    g.fillStyle = skin; g.fillRect(0, 0, n, n);
    g.fillStyle = hair; g.fillRect(0, 0, n, 4);
    if (bride) { g.fillRect(0, 0, 2, 12); g.fillRect(14, 0, 2, 12); }
    g.fillStyle = "#fff"; g.fillRect(3, 7, 3, 2); g.fillRect(10, 7, 3, 2);
    g.fillStyle = "#2b2b2b"; g.fillRect(4, 7, 2, 2); g.fillRect(10, 7, 2, 2);
    g.fillStyle = shade(skin, .8); g.fillRect(7, 9, 2, 2);
    g.fillStyle = "#9b4a43"; g.fillRect(6, 12, 4, 1);
  }, 16, 1);
}
const SKINS = ["#f1c9a5", "#e0ac7e", "#c68c5a", "#8d5a3b", "#f6d7bf"];
const HAIRS = ["#2b1d14", "#5a3a22", "#a0662c", "#d8b25a", "#1a1a1a", "#7d7d7d"];
const CLOTHES = ["#2c3e66", "#7a2e3a", "#3c6e47", "#5b4a8a", "#b5651d", "#2e7d8c", "#6d6d6d", "#a33b6b", "#1f2a44", "#c9a227"];

const at = (mesh, x, y, z) => { mesh.position.set(x, y, z); return mesh; };
function person(o) {
  const g = new THREE.Group();
  const skin = o.skin || SKINS[(R() * SKINS.length) | 0], hair = o.hair || HAIRS[(R() * HAIRS.length) | 0];
  const top = o.top || CLOTHES[(R() * CLOTHES.length) | 0], legs = o.legs || shade(top, .6);
  const headM = [col(hair), col(hair), col(hair), col(skin), new THREE.MeshLambertMaterial({ map: faceTex(skin, hair, o.bride) }), col(hair)];
  const head = new THREE.Mesh(new THREE.BoxGeometry(.5, .5, .5), headM); head.position.y = 1.55; g.add(head);
  // head faces +z (the box's +z face is index 4)
  const C = o.glow ? glow : col;
  const body = new THREE.Mesh(new THREE.BoxGeometry(.56, .7, .3), C(top)); body.position.y = 1.0; g.add(body);
  const mkLimb = (w, h, d, c, x, y) => {
    const pivot = new THREE.Group(); pivot.position.set(x, y, 0);
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), C(c)); m.position.y = -h / 2; pivot.add(m); g.add(pivot); return pivot;
  };
  const armL = mkLimb(.18, .66, .2, o.sleeve || top, -.37, 1.33), armR = mkLimb(.18, .66, .2, o.sleeve || top, .37, 1.33);
  armL.children[0].add(at(new THREE.Mesh(new THREE.BoxGeometry(.17, .14, .19), col(skin)), 0, -.38, 0));
  armR.children[0].add(at(new THREE.Mesh(new THREE.BoxGeometry(.17, .14, .19), col(skin)), 0, -.38, 0));
  let legL, legR;
  if (o.dress) {
    const skirt = new THREE.Mesh(new THREE.BoxGeometry(o.dressW || .8, .66, o.dressW || .6), C(o.dress)); skirt.position.y = .33; g.add(skirt);
  } else {
    legL = mkLimb(.24, .66, .26, legs, -.14, .66); legR = mkLimb(.24, .66, .26, legs, .14, .66);
    for (const l of [legL, legR]) l.children[0].add(at(new THREE.Mesh(new THREE.BoxGeometry(.25, .1, .3), col("#1b1b1b")), 0, -.3, .02));
  }
  if (o.kippah) { const k = new THREE.Mesh(new THREE.BoxGeometry(.3, .06, .3), col(o.kippah)); k.position.set(0, 1.83, -.04); g.add(k); }
  if (o.hat) { const h1 = new THREE.Mesh(new THREE.BoxGeometry(.62, .06, .62), col(o.hat)); h1.position.y = 1.83; const h2 = new THREE.Mesh(new THREE.BoxGeometry(.44, .26, .44), col(o.hat)); h2.position.y = 1.97; g.add(h1, h2); }
  if (o.veil) {
    const vm = new THREE.MeshLambertMaterial({ color: "#ffffff", transparent: true, opacity: .55 });
    const v = new THREE.Mesh(new THREE.BoxGeometry(.6, 1.1, .08), vm); v.position.set(0, 1.35, -.3); g.add(v);
    const crown = new THREE.Mesh(new THREE.BoxGeometry(.54, .08, .54), col("#f5d76e")); crown.position.y = 1.83; g.add(crown);
    const bouquet = new THREE.Mesh(new THREE.BoxGeometry(.26, .26, .2), MAT.flowers); bouquet.position.set(0, -.42, .14); armR.children[0].add(bouquet);
  }
  if (o.tie) { const t = new THREE.Mesh(new THREE.BoxGeometry(.18, .5, .02), col("#ffffff")); t.position.set(0, 1.08, .16); g.add(t); const b = new THREE.Mesh(new THREE.BoxGeometry(.12, .07, .03), col("#111")); b.position.set(0, 1.3, .17); g.add(b); }
  g.userData = { armL, armR, legL, legR, head, phase: R() * 6.28 };
  scene.add(g);
  return g;
}
function randomGuest(extra = {}) {
  const woman = R() < .5;
  const top = CLOTHES[(R() * CLOTHES.length) | 0];
  return person(Object.assign(woman
    ? { top, dress: shade(top, .85), dressW: .72, hat: R() < .25 ? shade(top, .7) : null }
    : { top: R() < .6 ? "#1f2433" : top, kippah: R() < .7 ? (R() < .5 ? "#1a1a1a" : "#2c5aa0") : null, tie: R() < .5 }, extra));
}

// seated guests (chairs face the chuppah: -z)
for (const [x, z] of seated) {
  const p = randomGuest(); p.position.set(x, -.25, z); p.rotation.y = Math.PI;
  const u = p.userData; if (u.legL) { u.legL.rotation.x = u.legR.rotation.x = -Math.PI / 2; }
  u.seated = true;
}
// ------------------------------------------------------------------ hiding spots
const SPOTS = [
  [-20.6, 0], [22.4, 10], [-21.2, -8], [-19.8, -19.8], [22.6, -6.4], [-5, 19.4],
  [0, -19.5], [21.8, 21.6], [-22.2, 20.6], [13, 10], [-14, 21.9], [10.2, -13.6], [-22.4, 8.6],
];
const nearSpot = (x, z) => SPOTS.some(([a, b]) => Math.hypot(a - x, b - z) < 1.3);
// standing guests by the tables and the bar
const idlers = [];
for (const [x, z] of TABLES) {
  const n = 2 + ((R() * 3) | 0);
  for (let i = 0; i < n; i++) {
    const a = R() * 6.28, rr = 2.0 + R() * .4;
    const gx = x + Math.cos(a) * rr, gz = z + Math.sin(a) * rr;
    if (nearSpot(gx, gz)) continue;
    const p = randomGuest(); p.position.set(gx, 0, gz);
    p.lookAt(x, 0, z); idlers.push(p);
  }
}
for (const [x, z] of [[17, -7.5], [17, -5], [16.5, -3.5], [-16, 1.5], [-16.2, -1.2], [4, 3], [-4, 2.5], [8, -14], [-8, -14]]) {
  const p = randomGuest(); p.position.set(x, 0, z); p.rotation.y = R() * 6.28; idlers.push(p);
}
// hora circle (moving occluders)
const hora = [];
for (let i = 0; i < 12; i++) { const p = randomGuest(); hora.push(p); }
// klezmer band
for (const [x, z] of [[20.2, 7.5], [20.6, 10], [20.2, 12.5]]) { const p = randomGuest({ kippah: "#1a1a1a", top: "#1f2433" }); p.position.set(x + .1, .8, z - .6); p.rotation.y = -Math.PI / 2; idlers.push(p); }
for (const p of idlers) solid(p.position.x - .3, p.position.z - .3, p.position.x + .3, p.position.z + .3);

const START = { x: 0, z: -11.2, yaw: Math.PI };

// ------------------------------------------------------------------ player / partner
let role = null, partner = null, partnerSpot = -1, difficulty = store.get("wed_diff") || "easy";
const P = { x: START.x, z: START.z, yaw: START.yaw, pitch: -0.05, bob: 0 };
function makePartner(r) {
  if (partner) scene.remove(partner);
  partner = r === "bride"
    ? person({ skin: "#f1c9a5", hair: "#2b1d14", top: "#1c1f2b", legs: "#1c1f2b", kippah: "#ffffff", tie: true })
    : person({ skin: "#f1c9a5", hair: "#6b3f1f", top: "#fbfaf6", dress: "#fbfaf6", dressW: 1.0, veil: true, bride: true, sleeve: "#fbfaf6", glow: true });
}
function placePartner(exclude = -1) {
  let i, tries = 0;
  do { i = (Math.random() * SPOTS.length) | 0; tries++; }
  while ((i === exclude || Math.hypot(SPOTS[i][0] - P.x, SPOTS[i][1] - P.z) < 12) && tries < 50);
  partnerSpot = i;
  const [x, z] = SPOTS[i];
  partner.position.set(x, 0, z);
  partner.rotation.y = Math.atan2(START.x - x, START.z - z);
}
function collides(x, z, r = .3) {
  for (const [a, b, c, d] of solids) if (x + r > a && x - r < c && z + r > b && z - r < d) return true;
  for (const p of hora) if (Math.hypot(p.position.x - x, p.position.z - z) < r + .3) return true;
  if (partner && Math.hypot(partner.position.x - x, partner.position.z - z) < r + .35) return true;
  return false;
}

// ------------------------------------------------------------------ input
const keys = new Set();
addEventListener("keydown", e => { keys.add(e.code); if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(e.code)) e.preventDefault(); });
addEventListener("keyup", e => keys.delete(e.code));
const touch = matchMedia("(pointer: coarse)").matches;
let dragging = false, lastX = 0, lastY = 0;
const LOOK = 0.0035;
canvas.addEventListener("mousedown", e => {
  if (state !== "play") return;
  if (!touch && canvas.requestPointerLock) canvas.requestPointerLock();
  dragging = true; lastX = e.clientX; lastY = e.clientY;
});
addEventListener("mouseup", () => dragging = false);
addEventListener("mousemove", e => {
  if (state !== "play") return;
  if (document.pointerLockElement === canvas) { look(e.movementX, e.movementY); return; }
  if (dragging) { look(e.clientX - lastX, e.clientY - lastY); lastX = e.clientX; lastY = e.clientY; }
});
function look(dx, dy) {
  const rtlFlip = 1;
  P.yaw -= dx * LOOK * rtlFlip;
  P.pitch = Math.max(-1.2, Math.min(1.2, P.pitch - dy * LOOK));
}
// touch: joystick on one side, look-drag on the other
const joy = { id: null, ox: 0, oy: 0, dx: 0, dy: 0 }, lookT = { id: null, x: 0, y: 0 };
const joyEl = document.getElementById("joy"), knob = document.getElementById("knob");
canvas.addEventListener("touchstart", e => {
  if (state !== "play") return;
  for (const t of e.changedTouches) {
    const leftSide = t.clientX < innerWidth / 2;
    if (leftSide && joy.id === null) {
      joy.id = t.identifier; joy.ox = t.clientX; joy.oy = t.clientY; joy.dx = joy.dy = 0;
      joyEl.style.left = (t.clientX - 60) + "px"; joyEl.style.top = (t.clientY - 60) + "px"; joyEl.classList.add("on");
    } else if (lookT.id === null) { lookT.id = t.identifier; lookT.x = t.clientX; lookT.y = t.clientY; }
  }
  e.preventDefault();
}, { passive: false });
canvas.addEventListener("touchmove", e => {
  for (const t of e.changedTouches) {
    if (t.identifier === joy.id) {
      let dx = t.clientX - joy.ox, dy = t.clientY - joy.oy; const m = Math.hypot(dx, dy), max = 50;
      if (m > max) { dx = dx / m * max; dy = dy / m * max; }
      joy.dx = dx / max; joy.dy = dy / max; knob.style.transform = `translate(${dx}px, ${dy}px)`;
    } else if (t.identifier === lookT.id) {
      look((t.clientX - lookT.x) * 1.6, (t.clientY - lookT.y) * 1.6); lookT.x = t.clientX; lookT.y = t.clientY;
    }
  }
  e.preventDefault();
}, { passive: false });
const endTouch = e => {
  for (const t of e.changedTouches) {
    if (t.identifier === joy.id) { joy.id = null; joy.dx = joy.dy = 0; knob.style.transform = ""; joyEl.classList.remove("on"); }
    if (t.identifier === lookT.id) lookT.id = null;
  }
};
canvas.addEventListener("touchend", endTouch); canvas.addEventListener("touchcancel", endTouch);

// ------------------------------------------------------------------ sound (synthesised)
let actx = null, soundOn = store.get("wed_sound") !== "off";
function ac() { if (!actx) { try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { /* */ } } return actx; }
function tone(freq, t0, dur, type = "triangle", vol = .12) {
  const a = ac(); if (!a || !soundOn) return;
  const o = a.createOscillator(), g = a.createGain(); o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(0, a.currentTime + t0); g.gain.linearRampToValueAtTime(vol, a.currentTime + t0 + .02);
  g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + t0 + dur);
  o.connect(g).connect(a.destination); o.start(a.currentTime + t0); o.stop(a.currentTime + t0 + dur + .05);
}
function glassBreak() {
  const a = ac(); if (!a || !soundOn) return;
  const len = a.sampleRate * .5, buf = a.createBuffer(1, len, a.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
  const s = a.createBufferSource(); s.buffer = buf;
  const hp = a.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 2500;
  const g = a.createGain(); g.gain.value = .35;
  s.connect(hp).connect(g).connect(a.destination); s.start();
}
// "Siman Tov u'Mazal Tov" (traditional folk tune, public domain) — first phrase
function mazalTovTune() {
  const n = { D: 293.66, E: 329.63, F: 349.23, G: 392, A: 440, Bb: 466.16, C5: 523.25, D5: 587.33 };
  const seq = [["D", .25], ["F", .25], ["A", .5], ["A", .25], ["Bb", .25], ["A", .25], ["G", .25], ["F", .5], ["G", .25], ["A", .25], ["G", .25], ["F", .25], ["E", .25], ["D", .75]];
  let t = .55; for (const [k, d] of seq) { tone(n[k], t, d * .9, "square", .05); tone(n[k] * 2, t, d * .9, "triangle", .04); t += d * .6; }
}
function giggle() { [880, 990, 1100, 990].forEach((f, i) => tone(f, i * .07, .09, "sine", .05)); }

// ------------------------------------------------------------------ confetti
const CONF_N = 420;
const confetti = new THREE.InstancedMesh(new THREE.BoxGeometry(.08, .02, .08), new THREE.MeshBasicMaterial({ vertexColors: false }), CONF_N);
confetti.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(CONF_N * 3), 3);
const confData = [];
const CC = ["#f2a7c3", "#ffffff", "#f5d76e", "#2c5aa0", "#e2556f", "#8fd3a6"].map(c => new THREE.Color(c));
for (let i = 0; i < CONF_N; i++) { confetti.setColorAt(i, CC[i % CC.length]); confData.push({ p: new THREE.Vector3(0, -10, 0), v: new THREE.Vector3(), r: R() * 6 }); }
confetti.visible = false; scene.add(confetti);
const tmpM = new THREE.Matrix4(), tmpQ = new THREE.Quaternion(), tmpE = new THREE.Euler(), ONE = new THREE.Vector3(1, 1, 1);
function burst(x, z) {
  confetti.visible = true;
  confData.forEach(c => { c.p.set(x + (Math.random() - .5), 2.2, z + (Math.random() - .5)); c.v.set((Math.random() - .5) * 5, 3 + Math.random() * 5, (Math.random() - .5) * 5); });
}

// ------------------------------------------------------------------ UI / state
const $ = s => document.querySelector(s);
let state = "menu", t0 = 0, elapsed = 0, lastMove = 0, msgTimer = 0;
function applyLang() {
  document.documentElement.lang = lang; document.documentElement.dir = STR[lang].dir;
  document.title = T("title");
  document.querySelectorAll("[data-t]").forEach(el => el.textContent = T(el.dataset.t));
  $("#ctrl").textContent = touch ? T("ctrlM") : T("ctrlD");
  $("#langs").innerHTML = LANGS.map(l => `<button data-l="${l}" class="${l === lang ? "on" : ""}">${NAMES[l]}</button>`).join("");
  $("#langs").querySelectorAll("button").forEach(b => b.onclick = () => { lang = b.dataset.l; store.set("lang", lang); applyLang(); });
  $("#backLink").href = "../index.html?lang=" + lang;
  $("#backLink2").href = "../index.html?lang=" + lang;
  document.querySelectorAll(".diff").forEach(b => b.classList.toggle("on", b.dataset.d === difficulty));
  $("#sound").classList.toggle("off", !soundOn);
}
document.querySelectorAll(".pick").forEach(b => b.onclick = () => {
  role = b.dataset.role;
  document.querySelectorAll(".pick").forEach(x => x.classList.toggle("on", x === b));
  $("#story").textContent = role === "bride" ? T("storyB") : T("storyG");
  $("#startBtn").disabled = false;
});
document.querySelectorAll(".diff").forEach(b => b.onclick = () => { difficulty = b.dataset.d; store.set("wed_diff", difficulty); applyLang(); });
$("#sound").onclick = () => { soundOn = !soundOn; store.set("wed_sound", soundOn ? "on" : "off"); applyLang(); };
$("#startBtn").onclick = startGame;
$("#againBtn").onclick = () => { $("#win").hidden = true; startGame(); };
$("#menuBtn").onclick = () => { if (document.pointerLockElement) document.exitPointerLock(); state = "menu"; $("#menu").hidden = false; $("#hud").hidden = true; };

function startGame() {
  if (!role) return;
  ac(); if (actx && actx.state === "suspended") actx.resume();
  makePartner(role);
  P.x = START.x; P.z = START.z; P.yaw = START.yaw; P.pitch = -0.05;
  placePartner();
  confetti.visible = false;
  state = "play"; t0 = performance.now(); lastMove = t0; elapsed = 0;
  $("#menu").hidden = true; $("#win").hidden = true; $("#hud").hidden = false;
  $("#heat").hidden = difficulty !== "easy";
  $("#joy").hidden = !touch;
  showMsg(role === "bride" ? T("storyB") : T("storyG"), 4500);
  setTimeout(() => showMsg(T("tip"), 4000), 5200);
}
function showMsg(s, ms = 3000) { const m = $("#msg"); m.textContent = s; m.classList.add("on"); clearTimeout(msgTimer); msgTimer = setTimeout(() => m.classList.remove("on"), ms); }

let winAt = 0;
function win() {
  state = "won"; winAt = performance.now();
  if (document.pointerLockElement) document.exitPointerLock();
  const secs = Math.round(elapsed);
  const key = "wed_best_" + difficulty, best = +store.get(key) || 0, isBest = !best || secs < best;
  if (isBest) store.set(key, String(secs));
  glassBreak(); mazalTovTune(); burst(partner.position.x, partner.position.z);
  setTimeout(() => {
    $("#winText").textContent = role === "bride" ? T("foundG", { t: secs }) : T("foundB", { t: secs });
    $("#winBest").textContent = isBest ? T("newBest") : T("best", { t: best });
    $("#win").hidden = false; $("#hud").hidden = true;
  }, 1600);
}

// ------------------------------------------------------------------ loop
function resize() {
  const w = innerWidth, h = innerHeight;
  renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
}
addEventListener("resize", resize); resize();
const clock = new THREE.Clock();
const HORA_R = 3.1;
function frame() {
  const dt = Math.min(clock.getDelta(), .05), now = performance.now(), ts = now / 1000;

  // hora: dancers circle the dance floor
  hora.forEach((p, i) => {
    const a = ts * .55 + i / hora.length * Math.PI * 2;
    p.position.set(DF.x + Math.cos(a) * HORA_R, Math.abs(Math.sin(ts * 6 + i)) * .12, DF.z + Math.sin(a) * HORA_R);
    p.rotation.y = -a;                                  // face along the circle
    const u = p.userData, sw = Math.sin(ts * 7 + i) * .6;
    if (u.legL) { u.legL.rotation.x = sw; u.legR.rotation.x = -sw; }
    u.armL.rotation.z = -2.4; u.armR.rotation.z = 2.4;  // hands raised, linked
  });
  for (const p of idlers) { const u = p.userData; u.head.rotation.y = Math.sin(ts * .7 + u.phase) * .5; u.armR.rotation.x = Math.sin(ts * 1.3 + u.phase) * .25; }

  if (state === "play") {
    elapsed = (now - t0) / 1000;
    let fx = 0, fz = 0;
    if (keys.has("KeyW") || keys.has("ArrowUp") || keys.has("KeyZ")) fz += 1;
    if (keys.has("KeyS") || keys.has("ArrowDown")) fz -= 1;
    if (keys.has("KeyA") || keys.has("KeyQ")) fx -= 1;
    if (keys.has("KeyD")) fx += 1;
    if (keys.has("ArrowLeft")) P.yaw += 2.2 * dt;
    if (keys.has("ArrowRight")) P.yaw -= 2.2 * dt;
    if (joy.id !== null) { fx += joy.dx; fz += -joy.dy; }
    const m = Math.hypot(fx, fz);
    if (m > 0) {
      if (m > 1) { fx /= m; fz /= m; }
      const sp = (keys.has("ShiftLeft") || keys.has("ShiftRight") || Math.hypot(joy.dx, joy.dy) > .95 ? 5.6 : 3.4) * dt;
      const sx = -Math.sin(P.yaw), sz = -Math.cos(P.yaw);           // forward
      const rx = Math.cos(P.yaw), rz = -Math.sin(P.yaw);            // right
      const nx = P.x + (sx * fz + rx * fx) * sp, nz = P.z + (sz * fz + rz * fx) * sp;
      if (!collides(nx, P.z)) P.x = nx;
      if (!collides(P.x, nz)) P.z = nz;
      P.bob += dt * 9;
    }
    // partner: peeks and waves occasionally; looks at you when you're close
    const d = Math.hypot(partner.position.x - P.x, partner.position.z - P.z);
    const u = partner.userData;
    u.armR.rotation.z = Math.sin(ts * 3) > .92 ? 2.6 + Math.sin(ts * 18) * .3 : 0;
    u.head.rotation.y = Math.sin(ts * .9) * .6;
    if (d < 7) partner.rotation.y = Math.atan2(P.x - partner.position.x, P.z - partner.position.z);
    if (d < 2.1) win();
    // hard mode: move every 45 seconds
    if (difficulty === "hard" && now - lastMove > 45000) {
      lastMove = now; placePartner(partnerSpot); giggle(); showMsg(role === "bride" ? T("movedG") : T("movedB"));
    }
    // HUD
    $("#time").textContent = Math.floor(elapsed / 60) + ":" + String(Math.floor(elapsed % 60)).padStart(2, "0");
    if (difficulty === "easy") {
      const heat = Math.max(0, Math.min(1, 1 - (d - 2) / 30));
      const idx = Math.min(4, Math.floor(heat * 5));
      $("#heatFill").style.width = (heat * 100).toFixed(0) + "%";
      $("#heatFill").style.background = `hsl(${(1 - heat) * 210}, 85%, 55%)`;
      $("#heatLbl").textContent = STR[lang].hints[idx];
    }
  }
  if (state === "won") {
    // turn to face the partner; partner raises both arms
    const ty = Math.atan2(-(partner.position.x - P.x), -(partner.position.z - P.z));
    let dy = ty - P.yaw; dy = Math.atan2(Math.sin(dy), Math.cos(dy)); P.yaw += dy * Math.min(1, dt * 4);
    P.pitch += (0 - P.pitch) * Math.min(1, dt * 4);
    const u = partner.userData; u.armL.rotation.z = -2.7; u.armR.rotation.z = 2.7;
    partner.position.y = Math.abs(Math.sin(ts * 6)) * .2;
  }
  if (confetti.visible) {
    confData.forEach((c, i) => {
      c.v.y -= 6 * dt; c.v.multiplyScalar(.985); c.p.addScaledVector(c.v, dt);
      if (c.p.y < .02) { c.p.y = .02; c.v.set(0, 0, 0); }
      c.r += dt * 6; tmpE.set(c.r, c.r * .7, 0); tmpQ.setFromEuler(tmpE);
      confetti.setMatrixAt(i, tmpM.compose(c.p, tmpQ, ONE));
    });
    confetti.instanceMatrix.needsUpdate = true;
  }

  // camera
  const bob = state === "play" ? Math.sin(P.bob) * .04 : 0;
  camera.position.set(P.x, 1.62 + bob, P.z);
  camera.rotation.set(P.pitch, P.yaw, 0, "YXZ");
  if (state === "menu") {                                // slow orbit behind the menu
    const a = ts * .08;
    camera.position.set(Math.cos(a) * 20, 9, Math.sin(a) * 20); camera.lookAt(0, 1, 0);
  }
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}
// menu portraits — small original pixel-art figures
function portrait(cv, r) {
  const g = cv.getContext("2d"), P0 = r === "bride"
    ? ["....hhhhhh....", "...hvvvvvvh...", "...hssssssh...", "..vhseesesv...", "..vhssssssv...", "..v.smmmms.v..", "..v..ssss..v..",
       "...wwwwwwww...", "..swwwwwwwws..", "..swwwffwwws..", "..swwwffwwws..", "...wwwwwwww...", "..wwwwwwwwww..", "..wwwwwwwwww..",
       ".wwwwwwwwwwww.", ".wwwwwwwwwwww.", "wwwwwwwwwwwwww", "wwwwwwwwwwwwww"]
    : ["..............", "....kkkkkk....", "...hhhhhhhh...", "...hssssssh...", "...seesseses..", "...ssssssss...", "....smmmms....",
       ".....ssss.....", "...bbbtwbbb...", "..sbbbtwbbbs..", "..sbbbtwbbbs..", "..sbbbbbbbbs..", "...bbbbbbbb...", "...bbb..bbb...",
       "...bbb..bbb...", "...bbb..bbb...", "...ddd..ddd...", ".............."];
  const C = { h: r === "bride" ? "#6b3f1f" : "#2b1d14", s: "#f1c9a5", e: "#2b2b2b", m: "#9b4a43", w: "#fbfaf6", v: "#e9eef5",
              f: "#f2a7c3", k: "#ffffff", b: "#1c1f2b", t: "#111111", d: "#0d0d0d" };
  const px = Math.floor(cv.width / 14);
  g.clearRect(0, 0, cv.width, cv.height);
  P0.forEach((row, y) => [...row].forEach((ch, x) => { if (C[ch]) { g.fillStyle = C[ch]; g.fillRect(x * px, y * px, px, px); } }));
}
document.querySelectorAll(".pick canvas").forEach(cv => portrait(cv, cv.dataset.role));
applyLang();
requestAnimationFrame(frame);
window.__wedding = { get state() { return state; }, P, get partner() { return partner; }, SPOTS, collides };
