// Wedding hide-and-seek — a small blocky (voxel-style) 3D game.
// All textures are generated in code; no external assets.
import * as THREE from "./lib/three.module.min.js";
import { TUNES, nf, wavBlob, LOOP_SECONDS } from "./klezmer.js";

// ------------------------------------------------------------------ i18n
const STR = {
  he: {
    dir: "rtl", title: "מחבואים בחתונה",
    sub: "החתן והכלה התחבאו זה מזה בין האורחים בגן. בחרו דמות ומצאו את בן או בת הזוג כדי שהחופה תתחיל!",
    choose: "בחרו דמות", bride: "כלה", groom: "חתן",
    storyB: "בחרת להיות הכלה. החתן התחבא איפשהו בגן – מצאי אותו!", storyG: "בחרת להיות החתן. הכלה התחבאה איפשהו בגן – מצא אותה!",
    easy: "קל", easyD: "מחליף/ה מקום מדי פעם בהליכה איטית, עם מד חם־קר", hard: "קשה", hardD: "זז/ה הרבה ובורח/ת כשמתקרבים, בלי רמזים",
    start: "התחילו!", ctrlD: "WASD / חיצים – הליכה · עכבר – הסתכלות (לחצו על המסך) · Shift – ריצה",
    ctrlM: "ג׳ויסטיק בצד – הליכה · גרירה בצד השני – הסתכלות",
    hints: ["קפוא", "קר", "פושר", "חם", "רותח!"], movedG: "שמעת צחקוק… החתן מתגנב למקום אחר!", movedB: "שמעת צחקוק… הכלה מתגנבת למקום אחר!",
    win: "מזל טוב!", foundG: "מצאת את החתן תוך {t} שניות", foundB: "מצאת את הכלה תוך {t} שניות",
    best: "השיא שלך: {t} שנ׳", newBest: "שיא חדש!", again: "שחקו שוב", back: "חזרה לחיפוש",
    procession: "ההורים של שני הצדדים מלווים את החתן והכלה אל החופה", skip: "לחיצה לדילוג",
    home: "חזרה לאתר", fledG: "החתן ברח ממך!", fledB: "הכלה ברחה ממך!", music: "מוזיקה", musicNote: "מוזיקה: לחנים מקוריים בסגנון כליזמר (פריילעכס ובולגר)", rabbiHint: "הרב: „נדמה לי שראיתי {who} ליד {place}…”", whoG: "את החתן", whoB: "את הכלה", sound: "צלילים", menu: "תפריט", tip: "טיפ: לכו אל הרב שמתחת לחופה והוא ייתן לכם רמז. חפשו גם מאחורי העוגה, העצים והבמה, ובין האורחים",
  },
  en: {
    dir: "ltr", title: "Wedding Hide & Seek",
    sub: "The bride and groom are hiding from each other among the guests. Pick a character and find your partner so the ceremony can begin!",
    choose: "Choose your character", bride: "Bride", groom: "Groom",
    storyB: "You're the bride. The groom is hiding somewhere in the garden — find him!", storyG: "You're the groom. The bride is hiding somewhere in the garden — find her!",
    easy: "Easy", easyD: "Sneaks to a new spot now and then, slowly, with a hot/cold meter", hard: "Hard", hardD: "Moves often and runs away when you get close, no hints",
    start: "Start!", ctrlD: "WASD / arrows — walk · mouse — look (click the scene) · Shift — run",
    ctrlM: "Joystick — walk · drag on the other side — look",
    hints: ["Freezing", "Cold", "Warm", "Hot", "Burning!"], movedG: "You heard a giggle… the groom is sneaking to a new spot!", movedB: "You heard a giggle… the bride is sneaking to a new spot!",
    win: "Mazel Tov!", foundG: "You found the groom in {t} seconds", foundB: "You found the bride in {t} seconds",
    best: "Your best: {t}s", newBest: "New record!", again: "Play again", back: "Back to search",
    procession: "Both sets of parents walk the groom and the bride to the chuppah", skip: "Tap to skip",
    home: "Back to the site", fledG: "The groom ran away!", fledB: "The bride ran away!", music: "Music", musicNote: "Music: original klezmer-style tunes (a freylekhs and a bulgar)", rabbiHint: "Rabbi: “I think I saw {who} near {place}…”", whoG: "the groom", whoB: "the bride", sound: "Sound", menu: "Menu", tip: "Tip: walk up to the rabbi under the chuppah for a hint. Also look behind the cake, the trees, the stage and among the guests",
  },
  yi: {
    dir: "rtl", title: "באַהאַלטערלעך אויף דער חתונה",
    sub: "דער חתן און די כּלה האָבן זיך באַהאַלטן איינער פֿונעם אַנדערן צווישן די געסט. קלײַבט אויס אַ פֿיגור און געפֿינט דעם פּאַרטנער, כּדי די חופּה זאָל זיך אָנהייבן!",
    choose: "קלײַבט אויס אַ פֿיגור", bride: "כּלה", groom: "חתן",
    storyB: "דו ביסט די כּלה. דער חתן האָט זיך באַהאַלטן ערגעץ אין גאָרטן – געפֿין אים!", storyG: "דו ביסט דער חתן. די כּלה האָט זיך באַהאַלטן ערגעץ אין גאָרטן – געפֿין זי!",
    easy: "גרינג", easyD: "גנבֿעט זיך פֿון צײַט צו צײַט צו אַן אַנדער אָרט, פּאַמעלעך, מיט אַ הייס־קאַלט מעסטער", hard: "שווער", hardD: "באַוועגט זיך אָפֿט און אַנטלויפֿט ווען מע קומט נאָענט, אָן אָנווײַזונגען",
    start: "הייבט אָן!", ctrlD: "WASD / פֿײַלן – גיין · מויז – קוקן (קליקט אויפֿן בילד) · Shift – לויפֿן",
    ctrlM: "דזשויסטיק – גיין · שלעפּן אויף דער אַנדערער זײַט – קוקן",
    hints: ["פֿאַרפֿרוירן", "קאַלט", "וואַרעם", "הייס", "ברענט!"], movedG: "מע האָט געהערט אַ כיכיקען… דער חתן גנבֿעט זיך צו אַן אַנדער אָרט!", movedB: "מע האָט געהערט אַ כיכיקען… די כּלה גנבֿעט זיך צו אַן אַנדער אָרט!",
    win: "מזל־טובֿ!", foundG: "דו האָסט געפֿונען דעם חתן אין {t} סעקונדעס", foundB: "דו האָסט געפֿונען די כּלה אין {t} סעקונדעס",
    best: "דײַן רעקאָרד: {t} סעק׳", newBest: "אַ נײַער רעקאָרד!", again: "נאָך אַ מאָל", back: "צוריק צום זוכן",
    procession: "די עלטערן פֿון ביידע צדדים פֿירן דעם חתן און די כּלה צו דער חופּה", skip: "דריקט צו איבערשפּרינגען",
    home: "צוריק צום וועבזײַטל", fledG: "דער חתן איז אַנטלאָפֿן!", fledB: "די כּלה איז אַנטלאָפֿן!", music: "מוזיק", musicNote: "מוזיק: אָריגינעלע ניגונים אין קלעזמער־סטיל (אַ פֿריילעכס און אַ בולגאַר)", rabbiHint: "דער רבֿ: „מיר דאַכט זיך, אַז איך האָב געזען {who} לעבן {place}…“", whoG: "דעם חתן", whoB: "די כּלה", sound: "קלאַנגען", menu: "מעניו", tip: "עצה: גייט צום רבֿ אונטער דער חופּה, ער וועט אײַך געבן אַ רמז. קוקט אויך הינטער דעם טאָרט, די ביימער, די בינע און צווישן די געסט",
  },
  fr: {
    dir: "ltr", title: "Cache-cache au mariage",
    sub: "Les mariés se cachent l'un de l'autre parmi les invités. Choisissez un personnage et retrouvez votre moitié pour que la cérémonie commence !",
    choose: "Choisissez votre personnage", bride: "Mariée", groom: "Marié",
    storyB: "Vous êtes la mariée. Le marié se cache quelque part dans le jardin — trouvez-le !", storyG: "Vous êtes le marié. La mariée se cache quelque part dans le jardin — trouvez-la !",
    easy: "Facile", easyD: "Change de cachette de temps en temps, lentement, avec un indicateur chaud/froid", hard: "Difficile", hardD: "Bouge souvent et s'enfuit quand vous approchez, sans indices",
    start: "C'est parti !", ctrlD: "ZQSD / WASD / flèches — marcher · souris — regarder (cliquez sur la scène) · Maj — courir",
    ctrlM: "Joystick — marcher · glisser de l'autre côté — regarder",
    hints: ["Glacial", "Froid", "Tiède", "Chaud", "Brûlant !"], movedG: "Un petit rire… le marié se faufile vers une autre cachette !", movedB: "Un petit rire… la mariée se faufile vers une autre cachette !",
    win: "Mazel Tov !", foundG: "Vous avez trouvé le marié en {t} secondes", foundB: "Vous avez trouvé la mariée en {t} secondes",
    best: "Votre record : {t} s", newBest: "Nouveau record !", again: "Rejouer", back: "Retour à la recherche",
    procession: "Les parents des deux familles accompagnent le marié et la mariée jusqu’à la houppa", skip: "Toucher pour passer",
    home: "Retour au site", fledG: "Le marié s'est enfui !", fledB: "La mariée s'est enfuie !", music: "Musique", musicNote: "Musique : airs originaux dans le style klezmer (un freylekhs et un bulgar)", rabbiHint: "Le rabbin : « Il me semble avoir vu {who} près de {place}… »", whoG: "le marié", whoB: "la mariée", sound: "Son", menu: "Menu", tip: "Astuce : allez voir le rabbin sous la houppa pour un indice. Regardez aussi derrière le gâteau, les arbres, la scène et parmi les invités",
  },
  ru: {
    dir: "ltr", title: "Прятки на свадьбе",
    sub: "Жених и невеста спрятались друг от друга среди гостей в саду. Выберите персонажа и найдите свою половинку, чтобы началась хупа!",
    choose: "Выберите персонажа", bride: "Невеста", groom: "Жених",
    storyB: "Вы — невеста. Жених спрятался где-то в саду — найдите его!", storyG: "Вы — жених. Невеста спряталась где-то в саду — найдите её!",
    easy: "Легко", easyD: "Иногда тихонько перебирается в другое место, есть индикатор «горячо-холодно»", hard: "Сложно", hardD: "Часто перемещается и убегает, когда вы рядом, без подсказок",
    start: "Начать!", ctrlD: "WASD / стрелки — ходьба · мышь — обзор (нажмите на сцену) · Shift — бег",
    ctrlM: "Джойстик — ходьба · проведите пальцем с другой стороны — обзор",
    hints: ["Лёд", "Холодно", "Тепло", "Горячо", "Обжигает!"], movedG: "Послышался смешок… жених крадётся в другое место!", movedB: "Послышался смешок… невеста крадётся в другое место!",
    fledG: "Жених убежал от вас!", fledB: "Невеста убежала от вас!",
    win: "Мазл тов!", foundG: "Вы нашли жениха за {t} сек.", foundB: "Вы нашли невесту за {t} сек.",
    best: "Ваш рекорд: {t} сек.", newBest: "Новый рекорд!", again: "Играть ещё", back: "Назад к поиску",
    rabbiHint: "Раввин: «Кажется, я видел {who} возле {place}…»", whoG: "жениха", whoB: "невесту",
    procession: "Родители с обеих сторон ведут жениха и невесту к хупе", skip: "Нажмите, чтобы пропустить",
    home: "Назад на сайт", music: "Музыка", musicNote: "Музыка: оригинальные мелодии в стиле клезмер (фрейлехс и булгар)", sound: "Звуки", menu: "Меню",
    tip: "Совет: подойдите к раввину под хупой — он даст подсказку. Ищите также за тортом, деревьями, сценой и среди гостей",
  },
};
const LANGS = ["he", "en", "yi", "fr", "ru"];
const NAMES = { he: "עברית", en: "English", yi: "ייִדיש", fr: "Français", ru: "Русский" };
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
const hemi = new THREE.HemisphereLight("#dff1ff", "#4c7a3a", 1.15); scene.add(hemi);
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

// ------------------------------------------------------------------ the couple's faces (pixel art, loosely based on reference photos)
function mapTex(rows, pal, seed = 1) {
  return pixTex((g, n, r) => rows.forEach((row, y) => [...row].forEach((ch, x) => {
    const c = pal[ch]; g.fillStyle = Array.isArray(c) ? c[(r() * c.length) | 0] : c; g.fillRect(x, y, 1, 1);
  })), 16, seed);
}
const GROOM_PAL = {
  s: "#e8b896", S: "#d29f7d", h: ["#3a2a1e", "#4a3626", "#2f2219", "#433022"], b: "#2e2118", e: "#2b211b",
  r: "#e39a86", m: "#a8584a", W: "#fbfaf4", x: "#7a2f2a",
};
const GROOM_HEAD = {          // a generic young groom: short dark hair, clean-shaven, laughing
  front: ["hhhhhhhhhhhhhhhh", "hhhhhhhhhhhhhhhh", "hhhhhhhhhhhhhhhh", "hhhhshhhhhhhhhhh",
          "hssssssssssssssh", "ssbbbbssssbbbbss", "ssssssssssssssss", "ssseesssssseesss",
          "ssessessssessess", "srrssssSSssssrrs", "sssssssSSsssssss", "ssmssssssssssmss",
          "sssmWWWWWWWWmsss", "ssssmxxxxxxmssss", "sssssmmmmmmsssss", "ssssssssssssssss"],
  side:  [...Array(5).fill("hhhhhhhhhhhhhhhh"), ...Array(2).fill("sssssssssssshhhh"), ...Array(3).fill("sssssssSSsssshhh"), ...Array(6).fill("ssssssssssssssss")],
  back:  [...Array(12).fill("hhhhhhhhhhhhhhhh"), ...Array(4).fill("ssssssssssssssss")],
  top:   Array.from({ length: 16 }, () => "hhhhhhhhhhhhhhhh"),
};
const BRIDE_PAL = {
  H: ["#3b2a20", "#4a3428", "#2f211a", "#55392b"], s: "#efc8ad", S: "#dcae92", e: "#3a2a22", b: "#3b2a20",
  p: "#eca295", m: "#c86d70", W: "#fffdf8", r: "#9c3f4a",
};
const BRIDE_HEAD = {          // a generic bride: dark hair in an up-do under the veil, beaming
  front: ["HHHHHHHHHHHHHHHH", "HHHHHHHHHHHHHHHH", "HHHHHHHHHHHHHHHH", "HHssssssssssssHH",
          "HsbbbssssssbbbsH", "HssssssssssssssH", "HsseesssssseessH", "HsessessssessesH",
          "HsppsssSSsssppsH", "HsppssssssssppsH", "ssmssssssssssmss", "sssmWWWWWWWWmsss",
          "ssssmrrrrrrmssss", "sssssmmmmmmsssss", "ssssssssssssssss", "ssssssssssssssss"],
  side:  [...Array(5).fill("HHHHHHHHHHHHHHHH"), ...Array(5).fill("ssssssssssssHHHH"), ...Array(6).fill("ssssssssssssssss")],
  back:  [...Array(13).fill("HHHHHHHHHHHHHHHH"), ...Array(3).fill("ssssssssssssssss")],
  top:   Array.from({ length: 16 }, () => "HHHHHHHHHHHHHHHH"),
};
for (const H of [GROOM_HEAD, BRIDE_HEAD]) for (const k in H) H[k] = H[k].map(r => (r + r.slice(-1).repeat(16)).slice(0, 16));
function headMats(H, pal, seed) {
  const f = mapTex(H.front, pal, seed), sd = mapTex(H.side, pal, seed + 1), bk = mapTex(H.back, pal, seed + 2), tp = mapTex(H.top, pal, seed + 3);
  const M = t => new THREE.MeshLambertMaterial({ map: t });
  return [M(sd), M(sd), M(tp), col(pal.s), M(f), M(bk)];
}
const SKINS = ["#f1c9a5", "#e0ac7e", "#c68c5a", "#8d5a3b", "#f6d7bf"];
const HAIRS = ["#2b1d14", "#5a3a22", "#a0662c", "#d8b25a", "#1a1a1a", "#7d7d7d"];
const CLOTHES = ["#2c3e66", "#7a2e3a", "#3c6e47", "#5b4a8a", "#b5651d", "#2e7d8c", "#6d6d6d", "#a33b6b", "#1f2a44", "#c9a227"];

const at = (mesh, x, y, z) => { mesh.position.set(x, y, z); return mesh; };
function person(o) {
  const g = new THREE.Group();
  const skin = o.skin || SKINS[(R() * SKINS.length) | 0], hair = o.hair || HAIRS[(R() * HAIRS.length) | 0];
  const top = o.top || CLOTHES[(R() * CLOTHES.length) | 0], legs = o.legs || shade(top, .6);
  const headM = o.headMats || [col(hair), col(hair), col(hair), col(skin), new THREE.MeshLambertMaterial({ map: faceTex(skin, hair, o.bride) }), col(hair)];
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
    const v = new THREE.Mesh(new THREE.BoxGeometry(.66, 1.15, .08), vm); v.position.set(0, 1.32, -.4); g.add(v);
    if (!o.longHair) { const crown = new THREE.Mesh(new THREE.BoxGeometry(.54, .08, .54), col("#f5d76e")); crown.position.y = 1.83; g.add(crown); }
    const bouquet = new THREE.Mesh(new THREE.BoxGeometry(.26, .26, .2), MAT.flowers); bouquet.position.set(0, -.42, .14); armR.children[0].add(bouquet);
  }
  if (o.tie) { const t = new THREE.Mesh(new THREE.BoxGeometry(.18, .5, .02), col("#ffffff")); t.position.set(0, 1.08, .16); g.add(t); const b = new THREE.Mesh(new THREE.BoxGeometry(.12, .07, .03), col("#111")); b.position.set(0, 1.3, .17); g.add(b); }
  if (o.longHair) {             // wavy hair falling to the shoulders
    const hm = new THREE.MeshLambertMaterial({ map: mapTex(Array.from({ length: 16 }, () => "HHHHHHHHHHHHHHHH"), BRIDE_PAL, 9) });
    const back = new THREE.Mesh(new THREE.BoxGeometry(.6, .72, .14), hm); back.position.set(0, 1.33, -.29); g.add(back);
    for (const sx of [-1, 1]) {
      const side = new THREE.Mesh(new THREE.BoxGeometry(.1, .62, .4), hm); side.position.set(sx * .3, 1.36, -.03); g.add(side);
      const curl = new THREE.Mesh(new THREE.BoxGeometry(.14, .16, .2), hm); curl.position.set(sx * .31, 1.02, .02); g.add(curl);
    }
    const crown = new THREE.Mesh(new THREE.BoxGeometry(.58, .1, .58), MAT.flowers); crown.position.y = 1.84; g.add(crown);
  }
  if (o.bun) {                  // hair gathered in a bun behind the veil
    const hm = new THREE.MeshLambertMaterial({ map: mapTex(Array.from({ length: 16 }, () => "HHHHHHHHHHHHHHHH"), BRIDE_PAL, 9) });
    const bn = new THREE.Mesh(new THREE.BoxGeometry(.3, .26, .18), hm); bn.position.set(0, 1.66, -.33); g.add(bn);
  }
  if (o.necklace) { const nk = new THREE.Mesh(new THREE.BoxGeometry(.3, .05, .32), glow(o.necklace)); nk.position.set(0, 1.3, .01); g.add(nk); }
  if (o.glasses) {               // a thin 3D frame in front of the face
    const fm = col("#121212");
    for (const sx of [-1, 1]) { const fr = new THREE.Mesh(new THREE.BoxGeometry(.2, .02, .02), fm); fr.position.set(sx * .12, 1.6, .26); g.add(fr); }
  }
  if (o.tallit) { const tl = new THREE.Mesh(new THREE.BoxGeometry(.64, .34, .34), MAT.canopy); tl.position.y = 1.2; g.add(tl); }
  if (o.beard) {
    const b1 = new THREE.Mesh(new THREE.BoxGeometry(.5, .24, .1), glow(o.beard)); b1.position.set(0, 1.36, .27); g.add(b1);
    const b2 = new THREE.Mesh(new THREE.BoxGeometry(.36, .24, .1), glow(o.beard)); b2.position.set(0, 1.14, .25); g.add(b2);
  }
  if (o.book) { const bk = new THREE.Mesh(new THREE.BoxGeometry(.26, .32, .08), col("#3b2a1a")); bk.position.set(0, -.42, .14); armL.children[0].add(bk); }
  if (o.tray) {
    const tr = new THREE.Mesh(new THREE.BoxGeometry(.62, .04, .5), col("#c9cdd2")); tr.position.set(.52, 2.03, 0); g.add(tr);
    for (const [dx, dz] of [[-.15, -.1], [.12, .08], [.02, -.14]]) { const gl = new THREE.Mesh(new THREE.BoxGeometry(.08, .16, .08), col("#f3e3a0")); gl.position.set(.52 + dx, 2.13, dz); g.add(gl); }
  }
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
const seatedPeople = [];
for (const [x, z] of seated) {
  const p = randomGuest(); p.position.set(x, -.25, z); p.rotation.y = Math.PI;
  const u = p.userData; if (u.legL) { u.legL.rotation.x = u.legR.rotation.x = -Math.PI / 2; }
  u.seated = true; seatedPeople.push(p);
}
// the rabbi, under the chuppah
const RABBI = { x: 0, z: -15.1 };
const rabbi = person({ skin: "#f1c9a5", hair: "#bdbdbd", top: "#151515", sleeve: "#151515", dress: "#151515", dressW: .74, hat: "#0d0d0d", beard: "#eeeeee", book: true, tallit: true });
rabbi.position.set(RABBI.x, 0, RABBI.z);
solid(RABBI.x - .4, RABBI.z - .4, RABBI.x + .4, RABBI.z + .4);
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
const hora = [], HORA_OUT = 12;
for (let i = 0; i < HORA_OUT + 5; i++) { const p = randomGuest(); hora.push(p); }     // outer ring of 12, inner ring of 5
// klezmer band
for (const [x, z] of [[20.2, 7.5], [20.6, 10], [20.2, 12.5]]) { const p = randomGuest({ kippah: "#1a1a1a", top: "#1f2433" }); p.position.set(x + .1, .8, z - .6); p.rotation.y = -Math.PI / 2; p.userData.band = true; idlers.push(p); }
for (const p of idlers) solid(p.position.x - .3, p.position.z - .3, p.position.x + .3, p.position.z + .3);

const START = { x: 0, z: -11.2, yaw: Math.PI };

// ------------------------------------------------------------------ player / partner
let role = null, partner = null, partnerSpot = -1, difficulty = store.get("wed_diff") || "easy";
const P = { x: START.x, z: START.z, yaw: START.yaw, pitch: -0.05, bob: 0 };
const makeGroom = () => person({ skin: GROOM_PAL.s, top: "#1c1f2b", legs: "#1c1f2b", kippah: "#ffffff", tie: true, headMats: headMats(GROOM_HEAD, GROOM_PAL, 31) });
const makeBride = () => person({ skin: BRIDE_PAL.s, top: "#fbfaf6", dress: "#fbfaf6", dressW: 1.0, veil: true, bride: true, sleeve: "#fbfaf6", glow: true,
                                 bun: true, necklace: "#f4efe0", headMats: headMats(BRIDE_HEAD, BRIDE_PAL, 41) });
function makePartner(r) {
  if (partner) scene.remove(partner);
  partner = r === "bride" ? makeGroom() : makeBride();
}
function pickSpot(exclude = [], minFromPlayer = 12) {
  const ok = SPOTS.map((s, i) => i).filter(i => !exclude.includes(i) && Math.hypot(SPOTS[i][0] - P.x, SPOTS[i][1] - P.z) >= minFromPlayer);
  const pool = ok.length ? ok : SPOTS.map((s, i) => i).filter(i => !exclude.includes(i));
  return pool[(Math.random() * pool.length) | 0];
}
function placePartner() {
  const last = +store.get("wed_last");
  const i = pickSpot(Number.isFinite(last) ? [last] : []);      // a different hiding place every game
  store.set("wed_last", String(i));
  partnerSpot = i;
  const [x, z] = SPOTS[i];
  partner.position.set(x, 0, z);
  partner.rotation.y = Math.atan2(START.x - x, START.z - z);
}
// partner AI: hide for a while, then sneak to another spot; in hard mode, run away when you get close
const AI = { mover: null, mode: "hide", until: 0, fleeCool: 0 };
const hideTime = () => (difficulty === "easy" ? 20 + Math.random() * 15 : 10 + Math.random() * 8) * 1000;
function sneakTo(i, speed) {
  const [x, z] = SPOTS[i];
  const path = findPath(partner.position.x, partner.position.z, x, z);
  if (!path) return false;
  partnerSpot = i; AI.mover.path = path; AI.mover.speed = speed; AI.mode = "move";
  return true;
}
const wanderers = [];
function staticHit(x, z, r) {
  for (const [a, b, c, d] of solids) if (x + r > a && x - r < c && z + r > b && z - r < d) return true;
  return false;
}
function collides(x, z, r = .3) {
  if (staticHit(x, z, r)) return true;
  for (const p of hora) if (Math.hypot(p.position.x - x, p.position.z - z) < r + .3) return true;
  for (const w of wanderers) if (Math.hypot(w.obj.position.x - x, w.obj.position.z - z) < r + .3) return true;
  if (partner && Math.hypot(partner.position.x - x, partner.position.z - z) < r + .35) return true;
  return false;
}

// ------------------------------------------------------------------ navigation grid + A*
const NAV = { cell: .5, min: -W + .7 };
NAV.n = Math.floor((2 * (W - .7)) / NAV.cell) + 1;
NAV.blocked = new Uint8Array(NAV.n * NAV.n);
for (let i = 0; i < NAV.n; i++) for (let j = 0; j < NAV.n; j++)
  NAV.blocked[i * NAV.n + j] = staticHit(NAV.min + i * NAV.cell, NAV.min + j * NAV.cell, .38) ? 1 : 0;
const clampI = v => Math.max(0, Math.min(NAV.n - 1, v));
const cellOf = (x, z) => [clampI(Math.round((x - NAV.min) / NAV.cell)), clampI(Math.round((z - NAV.min) / NAV.cell))];
const posOf = (i, j) => [NAV.min + i * NAV.cell, NAV.min + j * NAV.cell];
function nearestFree(i, j) {
  if (!NAV.blocked[i * NAV.n + j]) return [i, j];
  for (let r = 1; r < 8; r++) for (let di = -r; di <= r; di++) for (let dj = -r; dj <= r; dj++) {
    const a = clampI(i + di), b = clampI(j + dj);
    if (!NAV.blocked[a * NAV.n + b]) return [a, b];
  }
  return [i, j];
}
function lineFree(x0, z0, x1, z1) {
  const d = Math.hypot(x1 - x0, z1 - z0), n = Math.ceil(d / .25);
  for (let k = 1; k <= n; k++) { const t = k / n; if (staticHit(x0 + (x1 - x0) * t, z0 + (z1 - z0) * t, .32)) return false; }
  return true;
}
function findPath(x0, z0, x1, z1) {
  const N = NAV.n, B = NAV.blocked;
  const [si, sj] = nearestFree(...cellOf(x0, z0)), [ti, tj] = nearestFree(...cellOf(x1, z1));
  const S = si * N + sj, Tn = ti * N + tj;
  const g = new Float32Array(N * N).fill(Infinity), came = new Int32Array(N * N).fill(-1), closed = new Uint8Array(N * N);
  const heap = [];
  const push = (node, f) => { heap.push([f, node]); let i = heap.length - 1; while (i > 0) { const p = (i - 1) >> 1; if (heap[p][0] <= heap[i][0]) break; [heap[p], heap[i]] = [heap[i], heap[p]]; i = p; } };
  const pop = () => { const top = heap[0], last = heap.pop(); if (heap.length) { heap[0] = last; let i = 0; for (;;) { const l = 2 * i + 1, r = l + 1; let m = i; if (l < heap.length && heap[l][0] < heap[m][0]) m = l; if (r < heap.length && heap[r][0] < heap[m][0]) m = r; if (m === i) break; [heap[m], heap[i]] = [heap[i], heap[m]]; i = m; } } return top[1]; };
  const h = n => Math.hypot(((n / N) | 0) - ti, (n % N) - tj);
  g[S] = 0; push(S, h(S));
  while (heap.length) {
    const cur = pop();
    if (closed[cur]) continue;
    if (cur === Tn) break;
    closed[cur] = 1;
    const ci = (cur / N) | 0, cj = cur % N;
    for (let di = -1; di <= 1; di++) for (let dj = -1; dj <= 1; dj++) {
      if (!di && !dj) continue;
      const ni = ci + di, nj = cj + dj;
      if (ni < 0 || nj < 0 || ni >= N || nj >= N) continue;
      const nn = ni * N + nj;
      if (B[nn] || closed[nn]) continue;
      if (di && dj && (B[(ci + di) * N + cj] || B[ci * N + cj + dj])) continue;   // no corner cutting
      const ng = g[cur] + (di && dj ? 1.4142 : 1);
      if (ng < g[nn]) { g[nn] = ng; came[nn] = cur; push(nn, ng + h(nn)); }
    }
  }
  if (S !== Tn && came[Tn] === -1) return null;
  const cells = [];
  for (let n = Tn; n !== -1 && n !== S; n = came[n]) cells.push(posOf((n / N) | 0, n % N));
  cells.reverse();
  // string-pulling: skip waypoints that are in direct line of sight
  const out = []; let cx = x0, cz = z0, k = 0;
  while (k < cells.length) {
    let far = k;
    for (let m = cells.length - 1; m > k; m--) if (lineFree(cx, cz, cells[m][0], cells[m][1])) { far = m; break; }
    out.push(cells[far]); [cx, cz] = cells[far]; k = far + 1;
  }
  return out;
}

// ------------------------------------------------------------------ walking characters
function stepMover(m, dt, ts) {
  const o = m.obj, u = o.userData;
  if (!m.path || !m.path.length) {
    if (u.legL) { u.legL.rotation.x *= .8; u.legR.rotation.x *= .8; }
    return false;
  }
  const [tx, tz] = m.path[0], dx = tx - o.position.x, dz = tz - o.position.z, dist = Math.hypot(dx, dz), step = m.speed * dt;
  if (dist <= step) { o.position.x = tx; o.position.z = tz; m.path.shift(); }
  else { o.position.x += dx / dist * step; o.position.z += dz / dist * step; }
  if (dist > .01) {
    const want = Math.atan2(dx, dz); let dy = want - o.rotation.y; dy = Math.atan2(Math.sin(dy), Math.cos(dy));
    o.rotation.y += dy * Math.min(1, dt * 10);
  }
  const sw = Math.sin(ts * m.speed * 4.2) * Math.min(.7, m.speed * .3);
  if (u.legL) { u.legL.rotation.x = sw; u.legR.rotation.x = -sw; }
  u.armL.rotation.x = -sw * .8; u.armR.rotation.x = sw * .8; u.armL.rotation.z = 0; u.armR.rotation.z = 0;
  o.position.y = Math.abs(Math.sin(ts * m.speed * 4.2)) * .05;
  return true;
}
// guests who stroll around the garden
for (let k = 0; k < 17; k++) {
  let x, z, tries = 0;
  do { x = (R() - .5) * 38; z = (R() - .5) * 38; tries++; } while ((staticHit(x, z, .6) || nearSpot(x, z) || Math.hypot(x - DF.x, z - DF.z) < 5) && tries < 100);
  const waiter = k >= 14;
  const g = waiter ? person({ top: "#1a1a1a", sleeve: "#ffffff", legs: "#111111", tray: true }) : randomGuest();
  g.position.set(x, 0, z);
  wanderers.push({ obj: g, path: [], speed: waiter ? 1.5 : .8 + R() * .6, wait: R() * 3, waiter });
}
function updateWanderers(dt, ts) {
  for (const w of wanderers) {
    const moving = stepMover(w, dt, ts);
    if (w.waiter) { const u = w.obj.userData; u.armR.rotation.x = 0; u.armR.rotation.z = 2.95; }   // tray held up high
    else if (!moving) { const u = w.obj.userData; u.armR.rotation.x = -.3 + Math.sin(ts * 2 + u.phase) * .3; u.head.rotation.y = Math.sin(ts * .9 + u.phase) * .6; }
    if (moving) continue;
    w.wait -= dt;
    if (w.wait > 0) continue;
    const o = w.obj.position;
    let tx, tz, tries = 0;
    do { tx = o.x + (Math.random() - .5) * 20; tz = o.z + (Math.random() - .5) * 20; tries++; }
    while ((Math.abs(tx) > W - 2 || Math.abs(tz) > W - 2 || staticHit(tx, tz, .5) || Math.hypot(tx - DF.x, tz - DF.z) < 4.5) && tries < 30);
    w.path = findPath(o.x, o.z, tx, tz) || [];
    w.wait = w.waiter ? .5 + Math.random() * 2 : 1.5 + Math.random() * 4;
  }
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
// win fanfare: an original run up the freygish scale, ending on a D major chord
function winFanfare() {
  const run = ["D4", "Eb4", "F#4", "G4", "A4", "Bb4", "C5", "D5"];
  run.forEach((n, i) => tone(nf(n), .5 + i * .07, .12, "square", .045));
  ["D4", "F#4", "A4", "D5"].forEach(n => tone(nf(n), 1.1, 1.0, "triangle", .06));
}

let musicOn = store.get("wed_music") !== "off";
// The klezmer band is pre-rendered (tools/render-music.html → assets/klezmer.mp3). The file is an exact
// musical loop; it is decoded once and looped sample-accurately with Web Audio, so there is no gap or
// stutter at the loop point. A silent <audio> element started in the same tap keeps phones from muting
// Web Audio; if Web Audio is not available, the file falls back to a plain looping <audio> element.
const MUSIC_URL = "assets/klezmer.mp3";
const music = { buf: null, src: null, gain: null, loading: null, want: false, t0: 0, offset: 0, el: null, unlock: null,
  durA: TUNES[0].chords.length * TUNES[0].beats * 2 * 60 / TUNES[0].bpm };
const SILENT_URL = URL.createObjectURL(wavBlob(new Float32Array(4410), 22050));
async function loadMusic() {
  const a = ac();
  const data = await (await fetch(MUSIC_URL)).arrayBuffer();
  music.buf = await new Promise((res, rej) => { const p = a.decodeAudioData(data, res, rej); if (p && p.then) p.then(res, rej); });
  // skip any encoder padding at the very start: the music begins on a downbeat
  const d = music.buf.getChannelData(0); let i = 0; while (i < d.length && Math.abs(d[i]) < .0005) i++;
  music.offset = i / music.buf.sampleRate;
}
function playFallback() {
  if (!music.el) { music.el = new Audio(MUSIC_URL); music.el.loop = true; music.el.setAttribute("playsinline", ""); }
  music.el.play().catch(() => {});
}
function startMusic() {
  if (!musicOn) return;
  music.want = true;
  const a = ac();
  if (!a) { playFallback(); return; }
  if (a.state === "suspended") a.resume();
  if (!music.unlock) {                               // inside the tap: unlock audio output on phones
    music.unlock = new Audio(SILENT_URL); music.unlock.loop = true; music.unlock.setAttribute("playsinline", "");
    music.unlock.play().catch(() => {});
    try { if (navigator.audioSession) navigator.audioSession.type = "playback"; } catch (e) { /* */ }
  } else music.unlock.play().catch(() => {});
  if (!music.buf) {
    if (!music.loading) music.loading = loadMusic().then(() => { if (music.want) startMusic(); }).catch(() => { music.loading = null; if (music.want) playFallback(); });
    return;
  }
  if (music.src) return;
  const loop = LOOP_SECONDS, s = a.createBufferSource(), g = a.createGain();
  s.buffer = music.buf; s.loop = true;
  s.loopStart = music.offset; s.loopEnd = Math.min(music.buf.duration, music.offset + loop);
  g.gain.setValueAtTime(0, a.currentTime); g.gain.setTargetAtTime(.95, a.currentTime, .25);    // gentle fade-in
  s.connect(g).connect(a.destination);
  s.start(a.currentTime + .02, music.offset);
  music.src = s; music.gain = g; music.t0 = a.currentTime + .02;
  // if the audio clock is not running a second later (blocked), use the plain <audio> fallback
  setTimeout(() => { if (music.want && a.state !== "running") { stopMusic(); music.want = true; playFallback(); } }, 1200);
}
function stopMusic() {
  music.want = false;
  if (music.src) {
    const a = actx, s = music.src;
    music.gain.gain.setTargetAtTime(0, a.currentTime, .12); s.stop(a.currentTime + .6);
    music.src = null;
  }
  if (music.el) music.el.pause();
  if (music.unlock) music.unlock.pause();
}
// current beat of the music, so the dancers move in time with it
function musicBeat(ts) {
  const [A, B] = TUNES;
  let t = null;
  if (music.src && actx) t = ((actx.currentTime - music.t0) % LOOP_SECONDS + LOOP_SECONDS) % LOOP_SECONDS;
  else if (music.el && !music.el.paused) t = music.el.currentTime % LOOP_SECONDS;
  if (t === null) return ts * 2.3;
  return t < music.durA ? t * A.bpm / 60 : (t - music.durA) * B.bpm / 60;
}
document.addEventListener("visibilitychange", () => {
  if (actx) { if (document.hidden) actx.suspend(); else actx.resume(); }
  if (music.el && music.want) { if (document.hidden) music.el.pause(); else music.el.play().catch(() => {}); }
});
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
  $("#music").classList.toggle("off", !musicOn); $("#musicHud").classList.toggle("off", !musicOn);
}
document.querySelectorAll(".pick").forEach(b => b.onclick = () => {
  role = b.dataset.role;
  document.querySelectorAll(".pick").forEach(x => x.classList.toggle("on", x === b));
  $("#story").textContent = role === "bride" ? T("storyB") : T("storyG");
  $("#startBtn").disabled = false;
});
document.querySelectorAll(".diff").forEach(b => b.onclick = () => { difficulty = b.dataset.d; store.set("wed_diff", difficulty); applyLang(); });
$("#sound").onclick = () => { soundOn = !soundOn; store.set("wed_sound", soundOn ? "on" : "off"); applyLang(); };
const toggleMusic = () => { musicOn = !musicOn; store.set("wed_music", musicOn ? "on" : "off"); ac(); if (musicOn && state !== "menu") startMusic(); else stopMusic(); applyLang(); };
$("#music").onclick = toggleMusic; $("#musicHud").onclick = toggleMusic;
$("#startBtn").onclick = startGame;
$("#againBtn").onclick = () => { $("#win").hidden = true; startGame(); };
$("#menuBtn").onclick = () => { if (document.pointerLockElement) document.exitPointerLock(); resetCeremony(); state = "menu"; $("#menu").hidden = false; $("#hud").hidden = true; };

function startGame() {
  if (!role) return;
  ac(); if (actx && actx.state === "suspended") actx.resume();
  resetCeremony();
  makePartner(role);
  P.x = START.x; P.z = START.z; P.yaw = START.yaw; P.pitch = -0.05;
  placePartner();
  rabbiCool = 0; rabbiTalk = 0;
  AI.mover = { obj: partner, path: [], speed: 1.6 }; AI.mode = "hide"; AI.until = performance.now() + hideTime(); AI.fleeCool = 0;
  startMusic();
  confetti.visible = false;
  state = "play"; t0 = performance.now(); lastMove = t0; elapsed = 0;
  $("#menu").hidden = true; $("#win").hidden = true; $("#hud").hidden = false;
  $("#heat").hidden = difficulty !== "easy";
  $("#joy").hidden = !touch;
  showMsg(role === "bride" ? T("storyB") : T("storyG"), 4500);
  setTimeout(() => showMsg(T("tip"), 4000), 5200);
}
function showMsg(s, ms = 3000) { const m = $("#msg"); m.textContent = s; m.classList.add("on"); clearTimeout(msgTimer); msgTimer = setTimeout(() => m.classList.remove("on"), ms); }

let winAt = 0, rabbiCool = 0, rabbiTalk = 0;
// landmarks the rabbi can point to
const LMARKS = [
  { p: [-18, 0], he: "שולחן העוגה", en: "the cake table", yi: "דעם טאָרט־טיש", fr: "la table du gâteau", ru: "стола с тортом" },
  { p: [20.5, 10], he: "הבמה של הלהקה", en: "the band stage", yi: "דער בינע פֿון דער קאַפּעליע", fr: "la scène de l'orchestre", ru: "сцены оркестра" },
  { p: [19.5, -6], he: "הבר והחביות", en: "the bar and the barrels", yi: "דעם באַר מיט די פֿעסער", fr: "le bar et les tonneaux", ru: "бара с бочками" },
  { p: [-19.5, -8], he: "קיר הפרחים", en: "the flower wall", yi: "דער בלומען־וואַנט", fr: "le mur de fleurs", ru: "стены из цветов" },
  { p: [0, -17.5], he: "הפרחים שמאחורי החופה", en: "the flowers behind the chuppah", yi: "די בלומען הינטער דער חופּה", fr: "les fleurs derrière la houppa", ru: "цветов за хупой" },
  { p: [13, 10], he: "רחבת הריקודים", en: "the dance floor", yi: "דעם טאַנץ־פּלאַץ", fr: "la piste de danse", ru: "танцпола" },
  { p: [-8, 14], he: "שולחנות האורחים", en: "the guests' tables", yi: "די טישן פֿון די געסט", fr: "les tables des invités", ru: "столов гостей" },
  { p: [0, 21], he: "הכניסה לגן", en: "the garden entrance", yi: "דעם אַרײַנגאַנג פֿון גאָרטן", fr: "l'entrée du jardin", ru: "входа в сад" },
  { p: [-0.5, -6], he: "הכיסאות של החופה", en: "the ceremony chairs", yi: "די שטולן פֿאַר דער חופּה", fr: "les chaises de la cérémonie", ru: "стульев для церемонии" },
  { p: [-18, -18], he: "העץ שמאחורי קיר הפרחים", en: "the tree behind the flower wall", yi: "דעם בוים הינטער דער בלומען־וואַנט", fr: "l'arbre derrière le mur de fleurs", ru: "дерева за стеной из цветов" },
  { p: [18, -17], he: "העץ שמאחורי הבר", en: "the tree behind the bar", yi: "דעם בוים הינטערן באַר", fr: "l'arbre derrière le bar", ru: "дерева за баром" },
  { p: [-20, 18], he: "העץ שליד שולחנות האורחים", en: "the tree by the guests' tables", yi: "דעם בוים לעבן די טישן", fr: "l'arbre près des tables", ru: "дерева у столов гостей" },
  { p: [20, 20], he: "העץ שמאחורי רחבת הריקודים", en: "the tree behind the dance floor", yi: "דעם בוים הינטערן טאַנץ־פּלאַץ", fr: "l'arbre derrière la piste de danse", ru: "дерева за танцполом" },
  { p: [8, 21], he: "העץ שליד הכניסה", en: "the tree near the entrance", yi: "דעם בוים לעבן אַרײַנגאַנג", fr: "l'arbre près de l'entrée", ru: "дерева у входа" },
  { p: [-9, -20], he: "העץ שמאחורי החופה", en: "the tree behind the chuppah", yi: "דעם בוים הינטער דער חופּה", fr: "l'arbre derrière la houppa", ru: "дерева за хупой" },
  { p: [11, -12], he: "העץ שליד הכיסאות של החופה", en: "the tree by the ceremony chairs", yi: "דעם בוים לעבן די חופּה־שטולן", fr: "l'arbre près des chaises de la cérémonie", ru: "дерева у стульев для церемонии" },
  { p: [-22, 7], he: "העץ שליד שולחן העוגה", en: "the tree by the cake table", yi: "דעם בוים לעבן דעם טאָרט־טיש", fr: "l'arbre près de la table du gâteau", ru: "дерева у стола с тортом" },
];
function win() {
  state = "won"; winAt = performance.now();
  if (document.pointerLockElement) document.exitPointerLock();
  const secs = Math.round(elapsed);
  const key = "wed_best_" + difficulty, best = +store.get(key) || 0, isBest = !best || secs < best;
  if (isBest) store.set(key, String(secs));
  winFanfare(); burst(partner.position.x, partner.position.z);
  $("#winText").textContent = role === "bride" ? T("foundG", { t: secs }) : T("foundB", { t: secs });
  $("#winBest").textContent = isBest ? T("newBest") : T("best", { t: best });
  $("#hud").hidden = true;
  startCeremony();
}

// ------------------------------------------------------------------ ceremony
// After the couple find each other the lights go down, and both sets of parents walk them to the chuppah.
const DAY = { bg: scene.background.clone(), fog: scene.fog.color.clone(), near: scene.fog.near, far: scene.fog.far, hemi: hemi.intensity, sun: sun.intensity, hsky: hemi.color.clone() };
const NIGHT = { bg: new THREE.Color("#0a0f24"), fog: new THREE.Color("#0d1330"), near: 16, far: 50, hemi: .2, sun: .05, hsky: new THREE.Color("#7d8cc4") };
const nightSet = new THREE.Group(); nightSet.visible = false; scene.add(nightSet);
const lampMat = new THREE.MeshBasicMaterial({ color: "#ffd27a" });
for (let z = 3; z >= -11; z -= 2) for (const x of [-1.85, 1.85]) {                 // lanterns along the aisle
  const l = new THREE.Mesh(new THREE.BoxGeometry(.2, .26, .2), lampMat); l.position.set(x, .2, z); nightSet.add(l);
}
for (const [ax, az, bx, bz] of [[-2.2, -11.8, 2.2, -11.8], [-2.2, -16.2, 2.2, -16.2], [-2.2, -11.8, -2.2, -16.2], [2.2, -11.8, 2.2, -16.2]])
  for (let i = 0; i <= 8; i++) {                                                   // string lights round the canopy
    const b = new THREE.Mesh(new THREE.BoxGeometry(.1, .1, .1), lampMat);
    b.position.set(ax + (bx - ax) * i / 8, 3.12 - Math.sin(i / 8 * Math.PI) * .16, az + (bz - az) * i / 8); nightSet.add(b);
  }
const chLight = new THREE.PointLight("#ffc879", 0, 15, 1.1); chLight.position.set(0, 2.9, -13.8); scene.add(chLight);
const aisleLights = [-1, -8].map(z => { const l = new THREE.PointLight("#ffbf6b", 0, 10, 1.3); l.position.set(0, 1.1, z); scene.add(l); return l; });
const spot = new THREE.SpotLight("#fff0d2", 0, 30, .36, .6, 1); spot.position.set(0, 11, 0); scene.add(spot, spot.target);
function setNight(k) {
  scene.background.copy(DAY.bg).lerp(NIGHT.bg, k);
  scene.fog.color.copy(DAY.fog).lerp(NIGHT.fog, k);
  scene.fog.near = DAY.near + (NIGHT.near - DAY.near) * k; scene.fog.far = DAY.far + (NIGHT.far - DAY.far) * k;
  hemi.intensity = DAY.hemi + (NIGHT.hemi - DAY.hemi) * k; hemi.color.copy(DAY.hsky).lerp(NIGHT.hsky, k);
  sun.intensity = DAY.sun + (NIGHT.sun - DAY.sun) * k;
  nightSet.visible = k > .02;
  chLight.intensity = 9 * k; aisleLights.forEach(l => l.intensity = 3.2 * k);
}

const cer = { phase: "", t0: 0, me: null, parents: null, actors: [], endAt: 0 };
function makeParents() {
  if (cer.parents) return cer.parents;
  const p = {
    gF: person({ skin: "#e2ac86", hair: "#9b958d", top: "#232a3d", legs: "#232a3d", kippah: "#ffffff", tie: true }),
    gM: person({ skin: "#ecc2a2", hair: "#5b4030", top: "#6e3d63", dress: "#6e3d63", dressW: .74, necklace: "#f5d76e" }),
    bF: person({ skin: "#f0cbb3", hair: "#4a3326", top: "#2a2f3b", legs: "#2a2f3b", kippah: "#1a1a1a", tie: true }),
    bM: person({ skin: "#f3d2be", hair: "#8a4434", top: "#2e7d8c", dress: "#2e7d8c", dressW: .74, hat: "#24606c" }),
  };
  for (const k in p) p[k].visible = false;
  return (cer.parents = p);
}
const UNDER = { gF: [-1.7, -13.0], gM: [-1.45, -14.5], groom: [-.55, -13.7], bride: [.55, -13.7], bF: [1.7, -13.0], bM: [1.45, -14.5] };
const AISLE0 = 1.2, WALK = 1.4, GAP = 3.2;
function startCeremony() {
  cer.phase = "found"; cer.t0 = performance.now();
  cer.me = role === "groom" ? makeGroom() : makeBride(); cer.me.visible = false;
  makeParents();
}
function beginProcession() {
  const now = performance.now();
  const groom = role === "groom" ? cer.me : partner, bride = role === "groom" ? partner : cer.me;
  const P0 = cer.parents;
  const line = (obj, x, end, delay, via) => ({ obj, delay, path: [[x, AISLE0], [x, -11.2], ...(via ? [via] : []), end], face: null, s: 0 });
  cer.actors = [
    line(P0.gF, -.85, UNDER.gF, 0), line(groom, 0, UNDER.groom, 0), line(P0.gM, .85, UNDER.gM, 0, [-.95, -11.9]),
    line(P0.bF, -.85, UNDER.bF, GAP, [.95, -11.9]), line(bride, 0, UNDER.bride, GAP), line(P0.bM, .85, UNDER.bM, GAP),
  ];
  for (const a of cer.actors) {
    a.obj.visible = true; a.obj.position.set(a.path[0][0], 0, a.path[0][1]); a.obj.rotation.set(0, Math.PI, 0);
    const u = a.obj.userData; u.armL.rotation.set(0, 0, 0); u.armR.rotation.set(0, 0, 0); u.head.rotation.set(0, 0, 0);
    a.len = a.path.reduce((L, p, i) => i ? L + Math.hypot(p[0] - a.path[i - 1][0], p[1] - a.path[i - 1][1]) : 0, 0);
    const e = a.path[a.path.length - 1];
    a.face = (a.obj === groom || a.obj === bride) ? Math.PI : Math.atan2(0 - e[0], -13.7 - e[1]);   // couple face the rabbi, parents face the couple
  }
  // keep strolling guests out of the aisle
  for (const w of wanderers) { const o = w.obj.position; w.path = []; w.wait = 1e9; if (Math.abs(o.x) < 2.6 && o.z > -17 && o.z < 5) o.x = Math.sign(o.x || 1) * 4.2; }
  confetti.visible = false;
  cer.phase = "walk"; cer.t0 = now;
  cer.dur = Math.max(...cer.actors.map(a => a.delay + a.len / WALK));
  caption(T("procession"), T("skip"));
}
function placeActor(a, t, dt, ts) {
  const o = a.obj, u = o.userData, s = Math.max(0, Math.min(a.len, (t - a.delay) * WALK));
  let rest = s, i = 1;
  while (i < a.path.length - 1 && rest > Math.hypot(a.path[i][0] - a.path[i - 1][0], a.path[i][1] - a.path[i - 1][1])) { rest -= Math.hypot(a.path[i][0] - a.path[i - 1][0], a.path[i][1] - a.path[i - 1][1]); i++; }
  const [x0, z0] = a.path[i - 1], [x1, z1] = a.path[i], seg = Math.hypot(x1 - x0, z1 - z0) || 1, k = Math.min(1, rest / seg);
  o.position.set(x0 + (x1 - x0) * k, 0, z0 + (z1 - z0) * k);
  const moving = s > 0 && s < a.len;
  const want = moving ? Math.atan2(x1 - x0, z1 - z0) : (s >= a.len ? a.face : Math.PI);
  let dy = want - o.rotation.y; dy = Math.atan2(Math.sin(dy), Math.cos(dy)); o.rotation.y += dy * Math.min(1, dt * 5);
  const sw = moving ? Math.sin(ts * 7 + (a.delay ? 1 : 0)) : 0;
  if (u.legL) { u.legL.rotation.x = sw * .55; u.legR.rotation.x = -sw * .55; }
  u.armL.rotation.x = -sw * .35; u.armR.rotation.x = sw * .35;
  if (o.userData === (role === "groom" ? partner : cer.me).userData && u.armR.children[0]) u.armR.rotation.x = -.5;   // the bride holds her bouquet up
  o.position.y = moving ? Math.abs(sw) * .03 : 0;
  return s >= a.len;
}
const cam = { p: new THREE.Vector3(), l: new THREE.Vector3() };
function ceremonyFrame(now, dt, ts) {
  const t = (now - cer.t0) / 1000;
  if (cer.phase === "found") {
    setNight(Math.max(0, Math.min(1, (t - 1.3) / 2.2)));                         // the lights go down
    if (t > 3.8) { fade(true); cer.phase = "cut"; cer.t0 = now; }
    return false;
  }
  if (cer.phase === "cut") {
    if (t > .55) { setNight(1); beginProcession(); fade(false); }
    return false;
  }
  if (cer.phase === "walk" || cer.phase === "end") {
    let done = true; const groomG = cer.actors[1].obj.position, brideG = cer.actors[4].obj.position;
    for (const a of cer.actors) done = placeActor(a, cer.phase === "end" ? 1e6 : t, dt, ts) && done;
    // follow spot on whoever is walking; camera looks back up the aisle, then settles behind the guests
    const lead = t < cer.actors[4].delay + 4 ? groomG : brideG;
    spot.intensity = cer.phase === "walk" ? 70 : 30; spot.position.set(lead.x, 11, lead.z + 3); spot.target.position.set(lead.x, 0, lead.z);
    const u = cer.phase === "end" ? 1 : Math.max(0, Math.min(1, (t - (cer.dur - 4.5)) / 4.5)), e = u * u * (3 - 2 * u);
    const A = new THREE.Vector3(2.9, 2.9, -11.4), B = new THREE.Vector3(0, 2.6, -5.2);
    const LA = new THREE.Vector3(lead.x, 1.25, lead.z), LB = new THREE.Vector3(0, 1.45, -13.9);
    cam.p.copy(A).lerp(B, e); cam.p.y += Math.sin(Math.PI * e) * 1.3; cam.l.copy(LA).lerp(LB, e);   // arc up over the seated guests
    if (cer.phase === "end") {
      const since = (now - cer.endAt) / 1000;
      if (since > 1.6) for (const a of cer.actors) a.face = 0;   // after the glass, the couple and their parents turn to the guests
      const c = Math.max(0, Math.min(1, (since - 1.6) / 1.6)), ce = c * c * (3 - 2 * c);
      cam.p.lerp(new THREE.Vector3(0, 1.9, -9.0), ce); cam.l.lerp(new THREE.Vector3(0, 1.45, -13.7), ce);
    }
    if (done && cer.phase === "walk") { cer.phase = "end"; cer.endAt = now; }
    if (cer.phase === "end" && !cer.blessed) {                                   // under the chuppah: the glass, the confetti, mazel tov
      cer.blessed = true; caption("", "");
      setTimeout(() => { glassBreak(); winFanfare(); burst(0, -13.7); }, 700);
      setTimeout(() => { if (state === "won") { $("#win").hidden = false; } }, 4300);
    }
    return true;
  }
  return false;
}
function skipCeremony() {
  if (state !== "won") return;
  if (cer.phase === "found" || cer.phase === "cut") { setNight(1); beginProcession(); fade(false); }
  if (cer.phase === "walk") cer.phase = "end";
}
function resetCeremony() {
  cer.phase = ""; cer.blessed = false; setNight(0); spot.intensity = 0; caption("", ""); fade(false, true);
  if (cer.me) { scene.remove(cer.me); cer.me = null; }
  if (cer.parents) for (const k in cer.parents) cer.parents[k].visible = false;
  for (const w of wanderers) w.wait = Math.random() * 2;
}
function fade(on, instant) { const f = $("#fade"); f.style.transition = instant ? "none" : ""; f.classList.toggle("on", on); }
function caption(a, b) { const c = $("#cap"); c.hidden = !a; $("#capT").textContent = a; $("#capS").textContent = b; }
addEventListener("pointerdown", () => { if (state === "won" && cer.phase && cer.phase !== "end") skipCeremony(); });
addEventListener("keydown", e => { if (state === "won" && cer.phase && cer.phase !== "end" && (e.code === "Space" || e.code === "Enter" || e.code === "Escape")) skipCeremony(); });

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
  const beat = musicBeat(ts), hop = Math.abs(Math.sin(beat * Math.PI));
  hora.forEach((p, i) => {
    const inner = i >= HORA_OUT, n = inner ? hora.length - HORA_OUT : HORA_OUT, k = inner ? i - HORA_OUT : i;
    const r = inner ? 1.3 : HORA_R, a = (inner ? -.75 : .55) * ts + k / n * Math.PI * 2;
    p.position.set(DF.x + Math.cos(a) * r, hop * .16, DF.z + Math.sin(a) * r);
    p.rotation.y = inner ? Math.PI - a : -a;             // face the direction of the circle
    const u = p.userData, sw = Math.sin(beat * Math.PI) * .6 * (k % 2 ? 1 : -1);
    if (u.legL) { u.legL.rotation.x = sw; u.legR.rotation.x = -sw; }
    u.armL.rotation.z = -2.4; u.armR.rotation.z = 2.4;  // hands raised, linked
  });
  for (const p of idlers) {
    const u = p.userData;
    u.head.rotation.y = Math.sin(ts * .8 + u.phase) * .55;
    if (u.band) {                                       // the band plays in time
      u.armR.rotation.x = -1.2 + Math.sin(beat * Math.PI * 2) * .35; u.armL.rotation.x = -1 + Math.sin(beat * Math.PI) * .2;
      p.position.y = .8 + hop * .04; continue;
    }
    const mode = ((u.phase * 10) | 0) % 3;              // 0 talking, 1 clapping, 2 swaying
    if (mode === 1) { u.armL.rotation.x = u.armR.rotation.x = -1.15; u.armL.rotation.z = .38 * hop; u.armR.rotation.z = -.38 * hop; }
    else if (mode === 0) { u.armR.rotation.x = -.5 + Math.sin(ts * 2.4 + u.phase) * .4; u.armL.rotation.x = Math.sin(ts * 1.6 + u.phase) * .2; u.armL.rotation.z = u.armR.rotation.z = 0; }
    else { p.position.y = hop * .06; u.armL.rotation.z = -.2 - hop * .2; u.armR.rotation.z = .2 + hop * .2; }
  }
  for (const p of seatedPeople) {                       // seated guests look around and clap along
    const u = p.userData;
    if (cer.phase === "walk") {
      const L = (cer.actors[4].delay * 1000 + cer.t0 > now - 4000 ? cer.actors[1] : cer.actors[4]).obj.position;
      let a = Math.atan2(L.x - p.position.x, L.z - p.position.z) - Math.PI; a = Math.atan2(Math.sin(a), Math.cos(a));
      u.head.rotation.y += (Math.max(-1.3, Math.min(1.3, a)) - u.head.rotation.y) * Math.min(1, dt * 3);
    } else u.head.rotation.y = Math.sin(ts * .6 + u.phase) * .45;
    if (u.phase > 3) { u.armL.rotation.x = u.armR.rotation.x = -1.1; u.armL.rotation.z = .35 * hop; u.armR.rotation.z = -.35 * hop; }
  }
  // the rabbi sways while reading, and turns to you when you come near
  {
    const u = rabbi.userData, dR = Math.hypot(P.x - RABBI.x, P.z - RABBI.z);
    rabbi.rotation.x = Math.sin(ts * 2.2) * .05;
    const want = dR < 8 && state === "play" ? Math.atan2(P.x - RABBI.x, P.z - RABBI.z) : 0;
    let dy = want - rabbi.rotation.y; dy = Math.atan2(Math.sin(dy), Math.cos(dy)); rabbi.rotation.y += dy * Math.min(1, dt * 3);
    u.armL.rotation.x = -.9; u.head.rotation.x = Math.sin(ts * 2.2) * .08;
    u.armR.rotation.x = rabbiTalk > now ? -1.6 + Math.sin(ts * 9) * .3 : -.2;
  }
  updateWanderers(dt, ts);

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
    // partner AI
    const d = Math.hypot(partner.position.x - P.x, partner.position.z - P.z);
    const u = partner.userData;
    if (AI.mode === "move") {
      if (!stepMover(AI.mover, dt, ts)) { AI.mode = "hide"; AI.until = now + hideTime(); partner.position.y = 0; if (u.legL) u.legL.rotation.x = u.legR.rotation.x = 0; }
    } else {
      // hiding: peeks and waves now and then, looks at you when you're close
      u.armL.rotation.x = u.armR.rotation.x = 0;
      u.armR.rotation.z = Math.sin(ts * 3) > .92 ? 2.6 + Math.sin(ts * 18) * .3 : 0;
      u.head.rotation.y = Math.sin(ts * .9) * .6;
      if (d < 7) partner.rotation.y = Math.atan2(P.x - partner.position.x, P.z - partner.position.z);
      const flee = difficulty === "hard" && d < 6.5 && now > AI.fleeCool;
      if (flee || now > AI.until) {
        const i = pickSpot([partnerSpot], flee ? 14 : 10);
        if (sneakTo(i, flee ? 3.3 : (difficulty === "hard" ? 2.3 : 1.5))) {
          if (soundOn && d < 22) giggle();
          if (flee) { AI.fleeCool = now + 9000; showMsg(role === "bride" ? T("fledG") : T("fledB"), 2500); }
          else if (difficulty === "easy") showMsg(role === "bride" ? T("movedG") : T("movedB"), 2500);
        } else AI.until = now + 3000;
      }
    }
    // ask the rabbi: walk up to him for a hint
    if (Math.hypot(P.x - RABBI.x, P.z - RABBI.z) < 2.7 && now > rabbiCool) {
      rabbiCool = now + (difficulty === "easy" ? 10000 : 20000); rabbiTalk = now + 2500;
      const pp = partner.position;
      let best = LMARKS[0], bd = Infinity;
      for (const l of LMARKS) { const dl = Math.hypot(l.p[0] - pp.x, l.p[1] - pp.z); if (dl < bd) { bd = dl; best = l; } }
      showMsg(T("rabbiHint", { who: role === "bride" ? T("whoG") : T("whoB"), place: best[lang] }), 5500);
      tone(196, 0, .18, "triangle", .07); tone(247, .16, .25, "triangle", .07);
    }
    if (d < 2.1) win();
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
  let ceremonyCam = false;
  if (state === "won") ceremonyCam = ceremonyFrame(now, dt, ts);
  if (state === "won" && cer.phase === "found") {
    AI.mode = "hide";
    // turn to face the partner; partner raises both arms
    const ty = Math.atan2(-(partner.position.x - P.x), -(partner.position.z - P.z));
    let dy = ty - P.yaw; dy = Math.atan2(Math.sin(dy), Math.cos(dy)); P.yaw += dy * Math.min(1, dt * 4);
    P.pitch += (0 - P.pitch) * Math.min(1, dt * 4);
    const u = partner.userData; u.armL.rotation.z = -2.7; u.armR.rotation.z = 2.7;
    let py = Math.atan2(P.x - partner.position.x, P.z - partner.position.z) - partner.rotation.y; py = Math.atan2(Math.sin(py), Math.cos(py));
    partner.rotation.y += py * Math.min(1, dt * 6); u.head.rotation.y = 0;       // turn round, beaming, to the one who found them
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
  if (ceremonyCam) { camera.position.copy(cam.p); camera.lookAt(cam.l); }
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
    ? ["....HHHHHH....", "...HHHHHHHH...", "..HHssssssHH..", "..HsBssssBsH..", "..sseesseess..", "..srssssssrs..", "..smWWWWWWms..",
       "...ssmmmmss...", "vvv.wwwwww.vvv", "vv.wqqqqqqw.vv", "v..swwffwws..v", "...swwffwws...", "...wwwwwwww...", "..wwwwwwwwww..",
       ".wwwwwwwwwwww.", ".wwwwwwwwwwww.", "wwwwwwwwwwwwww", "wwwwwwwwwwwwww"]
    : ["....kkkkkk....", "...hhhhhhhh...", "..hssssssssh..", "..sBBssssBBs..", "..seessssees..", "..rssssssssr..", "..smWWWWWWms..",
       "...smmmmmms...", "....ssssss....", "...bbbwwbbb...", "..sbbbxwbbbs..", "..sbbbxwbbbs..", "..sbbbbbbbbs..", "..sbbbbbbbbs..",
       "...bbbbbbbb...", "...bbb..bbb...", "...bbb..bbb...", "...ddd..ddd..."];
  const C = { H: "#3b2a20", h: "#3a2a1e", s: r === "bride" ? "#efc8ad" : "#e8b896", e: "#2b2b2b", m: "#a85b4b", W: "#ffffff", p: "#eba798", r: "#e08a78",
              w: "#fbfaf6", q: "#f4efe0", f: "#f2a7c3", k: "#ffffff", B: "#2e2118", v: "#e3e9ef",
              b: "#1c1f2b", d: "#0d0d0d", x: "#111111" };
  const px = Math.floor(cv.width / 14);
  g.clearRect(0, 0, cv.width, cv.height);
  P0.forEach((row, y) => [...row].forEach((ch, x) => { if (C[ch]) { g.fillStyle = C[ch]; g.fillRect(x * px, y * px, px, px); } }));
}
document.querySelectorAll(".pick canvas").forEach(cv => portrait(cv, cv.dataset.role));
applyLang();
requestAnimationFrame(frame);
window.__wedding = { get state() { return state; }, cer, skipCeremony, win: () => win(), P, get partner() { return partner; }, SPOTS, collides, staticHit, findPath, AI, music, wanderers, RABBI, LMARKS };
