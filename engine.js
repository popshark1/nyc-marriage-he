/*
 * מנוע החיפוש של אינדקס הנישואים – גרסה סטטית שרצה בדפדפן.
 * המאגר מפוצל מראש לקבצים קטנים לפי מפתח פונטי של שם המשפחה (data/b/*.gz),
 * והדפדפן מוריד רק את הקבצים הרלוונטיים לחיפוש.
 * הלוגיקה הפונטית זהה ל-phonetic.py (נבדק בבדיקת התאמה).
 */
(function (root) {
  "use strict";

  // ------------------------------------------------------------ Latin key
  const LATIN_MULTI = [["SCH", "S"], ["TSCH", "S"], ["TSH", "S"], ["SH", "S"], ["SZ", "S"], ["CZ", "S"],
    ["TZ", "S"], ["TS", "S"], ["ZH", "S"], ["CH", "K"], ["KH", "K"], ["CK", "K"],
    ["PH", "P"], ["TH", "T"], ["GH", "G"], ["QU", "K"], ["WH", "B"]];
  const LATIN_SINGLE = { B: "B", V: "B", W: "B", F: "P", P: "P", D: "T", T: "T", G: "G", J: "G",
    K: "K", Q: "K", H: "K", X: "KS", S: "S", Z: "S", L: "L", M: "M", N: "N", R: "R" };
  const VOWELS = "AEIOUY";

  function normLatin(s) {
    if (!s) return "";
    return s.normalize("NFKD").replace(/[̀-ͯ]/g, "").toUpperCase().replace(/[^A-Z]/g, "");
  }
  const collapse = k => k.replace(/(.)\1+/g, "$1");

  const _lkCache = new Map();
  function latinKey(s) {
    s = normLatin(s);
    if (!s) return "";
    const hit = _lkCache.get(s);
    if (hit !== undefined) return hit;
    let out = "", i = 0;
    outer: while (i < s.length) {
      for (const [pat, rep] of LATIN_MULTI) {
        if (s.startsWith(pat, i)) { out += rep; i += pat.length; continue outer; }
      }
      const c = s[i];
      if (c === "C") {
        const nxt = s[i + 1] || "";
        out += (nxt === "" || "EIY".includes(nxt)) ? "S" : "K";   // כמו בפייתון: "" in "EIY" == True
      } else if (!VOWELS.includes(c)) {
        out += LATIN_SINGLE[c] || "";
      }
      i++;
    }
    const r = collapse(out);
    if (_lkCache.size < 200000) _lkCache.set(s, r);
    return r;
  }

  // ------------------------------------------------------------ Hebrew coarse keys
  const HEB = { "ב": "B", "ג": "G", "ד": "T", "ז": "S", "ח": "K", "ט": "T", "כ": "K", "ך": "K",
    "ל": "L", "מ": "M", "ם": "M", "נ": "N", "ן": "N", "ס": "S", "פ": "P", "ף": "P",
    "צ": "S", "ץ": "S", "ק": "K", "ר": "R", "ש": "S", "ת": "T" };
  const isHebrew = s => /[\u0590-\u05FF\uFB1D-\uFB4F]/.test(s || "");

  /** יידיש: ליגטורות (װ ײ ױ), אותיות עם ניקוד מוכן מראש (אַ אָ פֿ שׂ) ופתח/קמץ/רפה – לאותיות בסיס */
  function normYiddish(s) {
    return (s || "").normalize("NFKD")
      .replace(/\u05F0/g, "וו").replace(/\u05F1/g, "וי").replace(/\u05F2/g, "יי")
      .replace(/(?<=[\u05D0-\u05EA][\u0591-\u05C7]*)\u05D0\u05B8/g, "°")   // אָ באמצע מילה = O (סימן פנימי)
      .replace(/[\u0591-\u05C7]/g, "")
      .replace(/דזש/g, "ג").replace(/טש/g, "צ");      // דזשאָן = John, ־וויטש = -WITZ / -WICZ
  }

  function* product(slots, idx = 0, acc = "") {      // סדר זהה ל-itertools.product
    if (idx === slots.length) { yield acc; return; }
    for (const opt of slots[idx]) yield* product(slots, idx + 1, acc + opt);
  }

  function hebrewKeys(s, maxVariants = 16) {
    s = normYiddish(s).replace(/[֑-ׇ]/g, "").replace(/['׳"״]/g, "").replace(/[^א-ת]/g, "");
    if (!s) return [];
    const slots = [], n = s.length;
    let i = 0;
    while (i < n) {
      const c = s[i];
      if (c === "י" && i === 0) { slots.push(["", "G"]); i++; continue; }
      if (c === "ו") {
        if (s[i + 1] === "ו") { slots.push(["B"]); i += 2; continue; }
        slots.push(i > 0 ? ["", "B"] : ["B", ""]);
      } else if (c === "י") {
        if (s[i + 1] === "י") { i += 2; continue; }
        slots.push([""]);
      } else if (c === "א" || c === "ע") slots.push([""]);
      else if (c === "ה") slots.push(i === n - 1 ? [""] : ["K", ""]);
      else slots.push([HEB[c] || ""]);
      i++;
    }
    const out = [];
    for (const combo of product(slots)) {
      const k = collapse(combo);
      if (k && !out.includes(k)) out.push(k);
      if (out.length >= maxVariants) break;
    }
    return out;
  }

  const keysForQuery = s => isHebrew(s) ? hebrewKeys(s) : (latinKey(s) ? [latinKey(s)] : []);

  // ------------------------------------------------------------ ranking sequences
  const FINE_MULTI = [["TSCH", "S"], ["SCH", "S"], ["TSH", "S"], ["SH", "S"], ["SZ", "S"], ["CZ", "S"], ["TZ", "S"],
    ["TS", "S"], ["ZH", "S"], ["CH", "X"], ["KH", "X"], ["CK", "K"], ["PH", "P"], ["TH", "T"],
    ["GH", "G"], ["QU", "K"], ["WH", "B"]];
  const SEQ_MULTI = FINE_MULTI.concat([["EE", "i"], ["IE", "i"], ["EI", "i"], ["EY", "i"], ["AY", "i"], ["OO", "o"],
    ["OU", "o"], ["AU", "o"], ["OE", "o"], ["UE", "o"]]);
  const VCLASS = { A: "a", E: "a", I: "i", Y: "i", O: "o", U: "o" };
  const VORD = "aoi";

  function mergeSeq(seq, hebrew = false) {
    const res = [];
    for (const ch of seq) {
      const last = res[res.length - 1];
      if (last === ch) continue;
      if (last !== undefined && VORD.includes(ch) && VORD.includes(last) && (!hebrew || ch === "a" || last === "a")) {
        res[res.length - 1] = VORD.indexOf(ch) > VORD.indexOf(last) ? ch : last;
        continue;
      }
      res.push(ch);
    }
    return res.join("");
  }

  const _seqCache = new Map();
  function latinSeq(s) {
    s = normLatin(s);
    const hit = _seqCache.get(s);
    if (hit !== undefined) return hit;
    const n = s.length;
    let out = "", i = 0;
    outer: while (i < n) {
      for (const [pat, rep] of SEQ_MULTI) {
        if (s.startsWith(pat, i)) { out += rep; i += pat.length; continue outer; }
      }
      const c = s[i];
      if (c === "C") out += "EIY".includes(s[i + 1] || "#") ? "S" : "K";
      else if (c === "H") { if (!(i === n - 1 && i > 0 && VOWELS.includes(s[i - 1]))) out += "H"; }
      else if (c === "Y" && i === 0 && n > 1 && VOWELS.includes(s[1])) out += "i";
      else if (c === "E" && i === n - 1 && i > 1) out += "a";
      else if (VCLASS[c]) out += VCLASS[c];
      else out += LATIN_SINGLE[c] || "";
      i++;
    }
    const r = mergeSeq(out);
    if (_seqCache.size < 200000) _seqCache.set(s, r);
    return r;
  }

  function hebrewSeqs(s, maxVariants = 48) {
    s = normYiddish(s);
    const geresh = new Set(), letters = [];
    for (const ch of s) {
      if ((ch === "'" || ch === "׳") && letters.length) geresh.add(letters.length - 1);
      else if ((ch >= "א" && ch <= "ת") || ch === "°") letters.push(ch);
    }
    const n = letters.length, slots = [];
    let i = 0;
    while (i < n) {
      const c = letters[i], nxt = letters[i + 1] || "";
      if (geresh.has(i) && "גזצץ".includes(c)) slots.push(c === "ג" ? ["G"] : ["S"]);
      else if (c === "°") slots.push(["o"]);
      else if (c === "ו") {
        if (nxt === "ו") { slots.push(["B"]); i++; }
        else if (i === 0) slots.push(["B"]);
        else slots.push(["o", "B"]);
      } else if (c === "י") {
        if (nxt === "י") { slots.push(["i", "ai"]); i++; }
        else if (i === 0) slots.push(["G", "i"]);
        else slots.push(["i"]);
      } else if (c === "א" || c === "ע") slots.push(["a"]);
      else if (c === "ה") slots.push(i === n - 1 ? ["a"] : ["H", ""]);
      else if (c === "ח") slots.push(["X", "H"]);
      else if (c === "כ") slots.push(i === 0 ? ["K"] : ["K", "X"]);
      else if (c === "ך") slots.push(["X", "K"]);
      else slots.push([HEB[c] || ""]);
      i++;
    }
    const out = [];
    for (const combo of product(slots)) {
      const k = mergeSeq(combo, true);
      if (k && !out.includes(k)) out.push(k);
      if (out.length >= maxVariants) break;
    }
    return out;
  }

  const indel = c => c === "a" ? 0.25 : (c === "o" || c === "i") ? 0.6 : c === "H" ? 0.5 : 1.0;
  const ins = c => c === "a" ? 0.15 : c === "o" ? 0.2 : c === "i" ? 0.35 : c === "H" ? 0.5 : 1.0;
  function sub(x, y) {
    if (x === y) return 0;
    if (VORD.includes(x) && VORD.includes(y)) return ((x === "o" && y === "i") || (x === "i" && y === "o")) ? 0.6 : 0.4;
    if ((x === "H" && y === "X") || (x === "X" && y === "H")) return 0.3;
    if ((x === "K" && y === "X") || (x === "X" && y === "K")) return 0.5;
    return 1.2;
  }
  function wdist(a, b, cap = 9.0) {
    let prev = [0];
    for (const ch of b) prev.push(prev[prev.length - 1] + ins(ch));
    for (const ca of a) {
      const cur = [prev[0] + indel(ca)];
      let best = cur[0];
      for (let j = 1; j <= b.length; j++) {
        const cb = b[j - 1];
        const v = Math.min(prev[j] + indel(ca), cur[j - 1] + ins(cb), prev[j - 1] + sub(ca, cb));
        cur.push(v);
        if (v < best) best = v;
      }
      if (best > cap) return cap;
      prev = cur;
    }
    return prev[prev.length - 1];
  }
  const querySeqs = q => isHebrew(q) ? hebrewSeqs(q) : [latinSeq(q)];
  function scoreName(qs, name) {
    if (!qs.length) return 9;
    const ls = latinSeq(name);
    let m = Infinity;
    for (const h of qs) m = Math.min(m, wdist(h, ls));
    return m;
  }
  const round = (x, d) => Math.round(x * 10 ** d) / 10 ** d;

  /** rows: [[n, cnt]] → [{n, cnt, d, score}] ממוין (score נמוך = טוב יותר) */
  function rankNames(q, rows, extraExact = [], freqWeight = 0.2) {
    const qs = querySeqs(q), qn = normLatin(q);
    const exact = new Set(extraExact);
    if (qn) exact.add(qn);
    const out = rows.map(([n, cnt]) => {
      const d = exact.has(n) ? 0 : scoreName(qs, n);
      return { n, cnt, d: round(d, 2), score: round(d - freqWeight * Math.log10(cnt + 1), 3) };
    });
    out.sort((a, b) => a.score - b.score);
    return out;
  }

  // ------------------------------------------------------------ first names
  const HEB_FIRST = {
    "אברהם": "ABRAHAM ABE AVRAHAM", "יצחק": "ISAAC IRVING ITZHAK YITZCHAK", "יעקב": "JACOB JACK YAAKOV",
    "משה": "MOSES MORRIS MOSHE", "אהרן": "AARON ARON", "אהרון": "AARON ARON", "דוד": "DAVID",
    "שלמה": "SOLOMON SAUL SHLOMO", "שמואל": "SAMUEL SAM SHMUEL", "יוסף": "JOSEPH JOSE YOSEF",
    "בנימין": "BENJAMIN BENYAMIN", "יהודה": "JUDAH JUDA YEHUDA LEON", "מרדכי": "MORDECAI MORRIS MAX",
    "חיים": "HYMAN CHAIM HAIM HERMAN", "ישראל": "ISRAEL ISIDORE", "מיכאל": "MICHAEL MICHEL",
    "דניאל": "DANIEL", "יונתן": "JONATHAN", "יהונתן": "JONATHAN", "נתן": "NATHAN NATE",
    "אליהו": "ELIJAH ELIAS ELI", "אלי": "ELI ELIAS", "יהושע": "JOSHUA", "גבריאל": "GABRIEL",
    "רפאל": "RAPHAEL RAFAEL", "צבי": "HARRY HERSCHEL HIRSCH ZVI", "הרשל": "HERSCHEL HARRY",
    "ברוך": "BARUCH BENEDICT", "מנחם": "MENACHEM MENDEL", "זאב": "WILLIAM WOLF ZEEV", "אריה": "LEO LEON ARYEH",
    "שרה": "SARAH SARA SADIE", "רבקה": "REBECCA RIVKA BETTY", "רחל": "RACHEL RAE", "לאה": "LEAH LEA LENA",
    "מרים": "MIRIAM MARIAN", "אסתר": "ESTHER ESTELLE", "חנה": "HANNAH ANNA ANN ANNIE",
    "רות": "RUTH", "דבורה": "DEBORAH DEBRA DORA", "יהודית": "JUDITH JUDY", "אילנה": "ILANA",
    "מרי": "MARY MARIE", "ג'ון": "JOHN", "יוחנן": "JOHN JOHANAN", "פרץ": "PERETZ", "גולדה": "GOLDIE GOLDA",
    "בלומה": "BLANCHE BLUMA", "פייגה": "FAY FANNIE FEIGA", "פרומה": "FRIEDA FRUMA", "שיינדל": "JEANETTE SHAINDEL",
    "רייזל": "ROSE ROSA", "שושנה": "ROSE SUSAN SHOSHANA", "ציפורה": "CELIA ZIPPORAH",
    // יידיש (אחרי הסרת ניקוד)
    "יאנקל": "JACOB JACK YANKEL", "יאנקעל": "JACOB JACK YANKEL", "הערשל": "HERSCHEL HARRY HERSHEL",
    "הירש": "HARRY HIRSCH HERMAN", "פייגע": "FAY FANNIE FEIGA FAYE", "גאלדע": "GOLDIE GOLDA",
    "בלומע": "BLANCHE BLUMA", "פרומע": "FRIEDA FRUMA", "שיינדעל": "JEANETTE SHAINDEL",
    "לייב": "LEO LOUIS LEIB LEON", "וואלף": "WOLF WILLIAM", "בערל": "BERNARD BERL",
    "מענדל": "MENDEL MAX", "מאטל": "MAX MOTEL", "זעליג": "SELIG SIGMUND", "מאיר": "MEYER MEIER MAYER",
    "איציק": "ISAAC IRVING ITZIK", "סארע": "SARAH SADIE", "ריווקע": "REBECCA RIVKA BETTY",
    "ליבע": "LIBBY LIBA", "חאנע": "HANNAH ANNA ANNIE", "מאלקע": "MOLLY MALKA", "דבורע": "DEBORAH DORA",
    "שמעון": "SIMON SAM", "פנחס": "PINCUS PAUL PINCHAS", "נחום": "NATHAN NORMAN NACHUM",
  };
  const plainHeb = s => normYiddish(s).replace(/°/g, "א");
  const hebFirstNames = s => (HEB_FIRST[plainHeb(s).trim()] || "").split(" ").filter(Boolean);

  const NICKNAMES = {
    WILLIAM: ["BILL", "WILL", "BILLY", "WILLIE", "WM"], ROBERT: ["BOB", "ROB", "BOBBY", "ROBT"],
    RICHARD: ["RICK", "DICK", "RICH"], JAMES: ["JIM", "JIMMY", "JAS"], JOHN: ["JACK", "JOHNNY", "JON"],
    JOSEPH: ["JOE", "JOS", "JOEY"], MICHAEL: ["MIKE", "MICKEY"], THOMAS: ["TOM", "TOMMY", "THOS"],
    CHARLES: ["CHARLIE", "CHAS", "CHUCK"], ELIZABETH: ["BETTY", "LIZ", "BETH", "ELIZA", "BETSY"],
    MARGARET: ["PEGGY", "MAGGIE", "MARGE", "PEG"], KATHERINE: ["KATE", "KATHY", "KATIE", "CATHERINE"],
    DOROTHY: ["DOT", "DOTTIE"], BARBARA: ["BARB", "BABS"], SUSAN: ["SUE", "SUZY"],
    DAVID: ["DAVE", "DAVY"], SAMUEL: ["SAM", "SAMMY"], BENJAMIN: ["BEN", "BENNY"],
    ABRAHAM: ["ABE"], ISAAC: ["IKE"], JACOB: ["JAKE"], MOSES: ["MOE", "MOSHE"],
    REBECCA: ["BECKY", "RIVKA"], SARAH: ["SARA", "SADIE"], HANNAH: ["ANNA", "ANN", "ANNE"],
    EDWARD: ["ED", "EDDIE", "TED"], ANTHONY: ["TONY"], FRANCIS: ["FRANK"], PATRICIA: ["PAT", "PATTY"],
  };
  const NICK_REV = new Map();
  for (const [k, vs] of Object.entries(NICKNAMES)) {
    const grp = [k, ...vs];
    for (const v of grp) {
      if (!NICK_REV.has(v)) NICK_REV.set(v, new Set());
      grp.forEach(x => NICK_REV.get(v).add(x));
    }
  }
  const nickGroup = n => [...(NICK_REV.get(n) || [n])].sort();

  // ------------------------------------------------------------ bucket routing
  function fnv1a(s) {
    let h = 0x811c9dc5;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
    return h >>> 0;
  }

  // ------------------------------------------------------------ data access
  const BORO = { M: "Manhattan", B: "Brooklyn", X: "Bronx", Q: "Queens", S: "Staten Island" };
  const hex3 = n => n.toString(16).padStart(3, "0");

  async function fetchGz(url) {
    const r = await fetch(url);
    if (r.status === 404) return "";
    if (!r.ok) { const e = new Error("E_LOAD"); e.detail = `${url} (${r.status})`; throw e; }
    const buf = new Uint8Array(await r.arrayBuffer());
    if (buf[0] === 0x1f && buf[1] === 0x8b) {         // השרת לא פתח את הדחיסה – פותחים כאן
      const ds = new Blob([buf]).stream().pipeThrough(new DecompressionStream("gzip"));
      return await new Response(ds).text();
    }
    return new TextDecoder().decode(buf);
  }

  function parseRow(line) {
    const f = line.split("\t");
    const mk = (first, middle, last) => ({ first, middle, last, ln: normLatin(last), fn: normLatin(first),
      mids: (middle || "").split(/\s+/).map(normLatin).filter(Boolean),
      lws: (last || "").split(/[\s-]+/).map(normLatin).filter(Boolean) });
    return {
      year: f[0] ? +f[0] : null, borough: BORO[f[1]] || null, license: f[2] || "",
      date: f[3] && f[0] ? `${f[0]}-${f[3]}` : null,
      s1: mk(f[4], f[5], f[6]), s2: mk(f[7], f[8], f[9]),
    };
  }

  // ------------------------------------------------------------ free-text parsing
  const BORO_WORDS = {
    "מנהטן": "Manhattan", "manhattan": "Manhattan", "ברוקלין": "Brooklyn", "brooklyn": "Brooklyn",
    "ברונקס": "Bronx", "bronx": "Bronx", "קווינס": "Queens", "קוינס": "Queens", "queens": "Queens",
    "סטטן": "Staten Island", "staten": "Staten Island", "statenisland": "Staten Island",
    "מאַנהעטן": "Manhattan", "מאנהעטן": "Manhattan", "בראָנקס": "Bronx", "בראנקס": "Bronx", "סטעטן": "Staten Island",
  };
  const STOP = new Set(["של", "עם", "בשנת", "שנת", "בין", "נישואים", "נישואין", "חתונה", "רישיון", "איילנד", "island",
    "married", "marriage", "with", "in", "the", "nyc", "license", "ניו", "יורק", "new", "york", "שנות", "ה",
    "de", "du", "la", "le", "mariage", "licence", "en", "à", "פֿון", "פון", "חתונה", "יאָר", "יאר", "דער", "אין", "יאָרן"]);
  const SEP_WORDS = ["et", "און", "un"];
  const SEP = new Set(["&", "+", "ו", "and", "/", "עם"]);

  function parseFree(text) {
    const out = { persons: [[]], year_from: null, year_to: null, boroughs: [], license: "", notes: [] };
    let t = " " + (text || "").replace(/[,;:()"״]/g, " ") + " ";
    t = t.replace(/(?:#|רישיון\s*|license\s*(?:no\.?|#)?\s*)(\d{1,6})\b/gi, (_, d) => { out.license = d; return " "; });
    t = t.replace(/\b(19[5-9]\d|20[01]\d)\s*[-–]\s*(19[5-9]\d|20[01]\d|\d{2})\b/g, (_, a, b) => {
      out.year_from = +a; out.year_to = b.length === 2 ? +(a.slice(0, 2) + b) : +b; return " "; });
    t = t.replace(/(?:שנות\s*ה[-־]?\s*|années\s*|די\s*|\b)(19)?([5-9]0)(?:'?s|ער)?(?=\s)/gi, (m, c, d) => {
      if (!/שנות|années|ער|s/i.test(m)) return m;
      out.year_from = 1900 + +d; out.year_to = 1909 + +d; return " "; });
    t = t.replace(/\b(19[5-9]\d|20[01]\d)\b/g, (_, y) => {
      if (out.year_from === null) { out.year_from = out.year_to = +y; } return " "; });
    for (let raw of t.split(/\s+/)) {
      if (!raw) continue;
      const low = raw.toLowerCase();
      if (SEP.has(low) || SEP_WORDS.includes(low)) { if (out.persons[out.persons.length - 1].length) out.persons.push([]); continue; }
      const bw = BORO_WORDS[low] || BORO_WORDS[low.replace(/^ב/, "")];
      if (bw) { if (!out.boroughs.includes(bw)) out.boroughs.push(bw); continue; }
      if (STOP.has(low)) continue;
      let w = raw.replace(/[^A-Za-z\u0591-\u05F4\uFB1D-\uFB4F'׳*?\-]/g, "");
      if (isHebrew(w) && plainHeb(w)[0] === "ו" && out.persons[out.persons.length - 1].length && HEB_FIRST[plainHeb(w).slice(1)]) {
        // "ודוד", "ושרה" – ו' החיבור לפני שם פרטי מוכר מתחילה בן/בת זוג שני/ה (וייס, וולף נשארים שמות)
        out.persons.push([]); w = plainHeb(w).slice(1);
      }
      if (w.replace(/[*?'׳\-\u0591-\u05C7]/g, "").length < 2) continue;
      out.persons[out.persons.length - 1].push(w);
    }
    out.persons = out.persons.filter(p => p.length).slice(0, 2);
    return out;
  }

  class Engine {
    constructor(base = "data/") {
      this.base = base;
      this.meta = null;
      this.cache = new Map();
    }
    async init() {
      const r = await fetch(this.base + "meta.json");
      if (!r.ok) throw new Error("E_META");
      this.meta = await r.json();
      this.heavy = new Set(this.meta.heavy_first || []);
      return this.meta;
    }
    _cached(url) {
      if (!this.cache.has(url)) {
        const p = fetchGz(url).catch(e => { this.cache.delete(url); throw e; });
        this.cache.set(url, p);
        if (this.cache.size > 400) this.cache.delete(this.cache.keys().next().value);
      }
      return this.cache.get(url);
    }

    // ---------------------------------------------------------- name indexes
    async namesByKeys(part, keys) {
      const dir = part === "last" ? "kl" : "kf";
      const want = new Set(keys.filter(Boolean));
      const ids = [...new Set([...want].map(k => hex3(fnv1a(k) % this.meta.nk)))];
      const texts = await Promise.all(ids.map(id => this._cached(`${this.base}${dir}/${id}.gz`)));
      const out = new Map();
      for (const t of texts) for (const line of t.split("\n")) {
        if (!line) continue;
        const [n, cnt, k] = line.split("\t");
        if (want.has(k)) out.set(n, { cnt: +cnt, k });
      }
      return out;
    }
    async namesByPattern(part, pattern) {
      const pre = pattern.split(/[*?]/)[0];
      if (pre.length < 2) return null;
      const t = await this._cached(`${this.base}${part === "last" ? "p" : "pf"}/${pre.slice(0, 2)}.gz`);
      const re = new RegExp("^" + pattern.replace(/\*/g, ".*").replace(/\?/g, ".") + "$");
      const out = [];
      for (const line of t.split("\n")) {
        if (!line) continue;
        const [n, cnt, k] = line.split("\t");
        if (re.test(n)) out.push({ n, cnt: +cnt, k, d: 0, score: 0 });
      }
      out.sort((a, b) => b.cnt - a.cnt);
      return out;
    }

    /**
     * מתאם לשם: {test(n)→score|null, list:[{n,cnt,k,d,score}] | null, total}
     * list=null פירושו שאי אפשר לשלוף לפי השדה הזה (למשל אות אחת), רק לסנן.
     */
    async matcher(value, part, mode) {
      value = (value || "").trim();
      if (!value) return null;
      const heb = isHebrew(value);
      const n = normLatin(value);
      const finish = (list, exact = new Set([n])) => {
        // לדירוג שורות: קודם כל קרבת הכתיב, אחר כך הכתיב המדויק שהוקלד, ושכיחות רק כשובר שוויון (Mary לפני Maria)
        const map = new Map(list.map(r => [r.n, r.d + (exact.has(r.n) ? 0 : 0.05) - 0.02 * Math.log10(r.cnt + 1)]));
        return { test: x => map.has(x) ? map.get(x) : null, list, total: list.reduce((a, r) => a + r.cnt, 0) };
      };
      if (!heb && /[*?]/.test(value)) {
        const pat = value.toUpperCase().replace(/[^A-Z*?]/g, "");
        const list = await this.namesByPattern(part, pat);
        if (list) return finish(list.slice(0, 300));
        const re = new RegExp("^" + pat.replace(/\*/g, ".*").replace(/\?/g, ".") + "$");
        return { test: x => re.test(x) ? 0 : null, list: null, total: Infinity };
      }
      if (!heb) {
        if (!n) return null;
        if (part === "first" && n.length === 1) return { test: x => x.startsWith(n) ? 0 : null, list: null, total: Infinity };
        if (mode === "prefix") {
          const list = await this.namesByPattern(part, n + "*");
          if (list) return finish(list.slice(0, 300));
          return { test: x => x.startsWith(n) ? 0 : null, list: null, total: Infinity };
        }
        if (mode === "exact") {
          const names = part === "first" ? nickGroup(n) : [n];
          const idx = await this.namesByKeys(part, names.map(latinKey));
          return finish(names.map(x => ({ n: x, cnt: (idx.get(x) || {}).cnt || 0, k: latinKey(x), d: 0, score: 0 })));
        }
      }
      // צליל דומה / עברית – מול האינדקס המלא (שכיחויות אמיתיות)
      let keys, extra = [];
      if (heb) {
        keys = keysForQuery(value);
        if (part === "first") { extra = hebFirstNames(value); keys = keys.concat(extra.map(latinKey)); }
      } else {
        extra = part === "first" ? nickGroup(n) : [];
        keys = [latinKey(n)].concat(extra.map(latinKey));
      }
      const idx = await this.namesByKeys(part, keys);
      const cands = [...idx.entries()].map(([nm, v]) => [nm, v.cnt]).sort((a, b) => b[1] - a[1]).slice(0, 1500);
      const ranked = rankNames(value, cands, extra);
      const strong = ranked.filter(r => r.d <= 1.0);
      const list = (strong.length ? strong : ranked).slice(0, 200).map(r => Object.assign(r, { k: idx.get(r.n).k }));
      return finish(list, new Set([n, ...extra]));
    }

    // ---------------------------------------------------------- row retrieval
    /** קבצים לשליפה, לפי סדר עדיפות, עם תקציב (MAX_FILES). files.truncated = לא כל הכתיבים נטענו. */
    filesFor(part, list, yf, yt) {
      const MAX_FILES = 40;
      const files = new Set();
      let truncated = false;
      const add = f => { if (files.size >= MAX_FILES && !files.has(f)) { truncated = true; return false; } files.add(f); return true; };
      if (part === "last") {
        for (const r of list) add(`b/${hex3(fnv1a(r.k) % this.meta.nb)}`);
      } else {
        const bands = (this.meta.bands || []).filter(b => (!yt || b <= yt) && (!yf || b + 9 >= yf)).map(String);
        if (!yf && !yt) bands.push("0");
        // לשליפה לפי שם פרטי: רק הכתיבים הקרובים (שאר הכתיבים עדיין משמשים לסינון)
        const close = list.filter(r => r.d <= 0.35);
        const pick = (close.length ? close : list.slice(0, 1)).slice(0, 20);
        const all = list.reduce((x, r) => x + r.cnt, 0), got = pick.reduce((x, r) => x + r.cnt, 0);
        if (all - got > 0.15 * all) truncated = true;     // כתיבים שלא נטענו מהווים חלק משמעותי
        for (const r of pick) {
          if (this.heavy.has(r.n)) { for (const b of bands) add(`f/${hex3(fnv1a(`${r.n}|${b}`) % this.meta.nf)}`); }
          else add(`f/${hex3(fnv1a(r.n) % this.meta.nf)}`);
        }
      }
      const out = [...files];
      out.truncated = truncated;
      return out;
    }
    async loadRows(files) {
      const texts = await Promise.all(files.map(f => this._cached(`${this.base}${f}.gz`)));
      const seen = new Set(), rows = [];
      for (const t of texts) for (const line of t.split("\n")) {
        if (!line || seen.has(line)) continue;
        seen.add(line);
        rows.push(parseRow(line));
      }
      return rows;
    }
    /** בוחר את השדה הממקד ביותר (הכי מעט רשומות) ומוריד רק אותו */
    async retrieve(cands, yf, yt) {
      const usable = cands.filter(c => c.m && c.m.list && c.m.list.length);
      if (!usable.length) throw new Error("E_NAME_FULL");
      usable.sort((a, b) => a.cost - b.cost);
      const best = usable[0];
      const files = best.files || this.filesFor(best.part, best.m.list, yf, yt);
      return { rows: await this.loadRows(files), files: files.length, via: best.label, truncated: !!files.truncated };
    }

    filters(q) {
      return {
        yf: +q.year_from || 0, yt: +q.year_to || 0,
        boros: new Set((Array.isArray(q.borough) ? q.borough : (q.borough || "").split(",")).filter(Boolean)),
        lic: String(q.license || "").replace(/\D/g, "").replace(/^0+/, ""),
      };
    }
    passes(r, F) {
      if (F.yf && !(r.year >= F.yf)) return false;
      if (F.yt && !(r.year && r.year <= F.yt)) return false;
      if (F.boros.size && !F.boros.has(r.borough)) return false;
      if (F.lic && r.license !== F.lic) return false;
      return true;
    }

    // ---------------------------------------------------------- detailed (fielded) search
    async search(q) {
      const mode = q.mode || "phonetic";
      const F = this.filters(q);
      const slots = ["a_last", "a_first", "b_last", "b_first"];
      const ms = {};
      await Promise.all(slots.map(async s => { ms[s] = await this.matcher(q[s], s.endsWith("last") ? "last" : "first", mode); }));
      if (!slots.some(s => ms[s])) throw new Error("E_NAME");
      const cands = slots.map(s => {
        const part = s.endsWith("last") ? "last" : "first";
        const m = ms[s];
        if (!m || !m.list) return { m };
        const files = this.filesFor(part, m.list, F.yf, F.yt);
        return { m, part, files, label: s, cost: part === "last" ? m.total : Math.min(m.total, files.length * 4000) };
      });
      const { rows, files, via, truncated } = await this.retrieve(cands, F.yf, F.yt);
      const hasB = !!(ms.b_last || ms.b_first);
      const hasA = !!(ms.a_last || ms.a_first);
      const pScore = (pl, pf, s) => {
        let sc = 0;
        if (pl) { const t = pl.test(s.ln); if (t === null) return null; sc += t; }
        if (pf) { const t = pf.test(s.fn); if (t === null) return null; sc += t; }
        return sc;
      };
      const results = [];
      for (const r of rows) {
        if (!this.passes(r, F)) continue;
        let best = null, matched = null;
        for (const [sa, sb, side] of [[r.s1, r.s2, "s1"], [r.s2, r.s1, "s2"]]) {
          const a = hasA ? pScore(ms.a_last, ms.a_first, sa) : 0;
          if (a === null) continue;
          const b = hasB ? pScore(ms.b_last, ms.b_first, sb) : 0;
          if (b === null) continue;
          if (best === null || a + b < best) { best = a + b; matched = hasA ? side : (side === "s1" ? "s2" : "s1"); }
        }
        if (best === null) continue;
        r.score = best; r.matched = matched; r.hl = hasA && hasB ? ["s1", "s2"] : [matched];
        results.push(r);
      }
      const variants = {};
      for (const s of slots) if (ms[s] && ms[s].list) variants[s] = ms[s].list.slice(0, 40).map(v => ({ n: v.n, cnt: v.cnt, d: v.d }));
      return { results, variants, files, via, truncated };
    }

    // ---------------------------------------------------------- free-text search
    async searchFree(text, extra = {}) {
      const P = parseFree(text);
      const F = this.filters({
        year_from: extra.year_from || P.year_from, year_to: extra.year_to || P.year_to,
        borough: (extra.borough ? String(extra.borough).split(",") : []).concat(P.boroughs).join(","),
        license: extra.license || P.license,
      });
      const tokens = P.persons.flat();
      if (!tokens.length) throw new Error("E_FREE_NAME");
      const tm = await Promise.all(tokens.map(async tok => {
        const [L, Fi] = await Promise.all([this.matcher(tok, "last", "phonetic"), this.matcher(tok, "first", "phonetic")]);
        // שם פרטי עברי מוכר (חיים, שרה) – עדיפות לפירוש כשם פרטי
        if (L && hebFirstNames(tok).length) { const t0 = L.test; L.test = x => { const v = t0(x); return v === null ? null : v + 0.3; }; }
        return { tok, L, Fi };
      }));
      // עלות לכל מילה = רשומות כשם משפחה + כשם פרטי; שולפים לפי המילה הזולה ביותר
      const cands = tm.map(t => {
        const fl = t.L && t.L.list ? this.filesFor("last", t.L.list) : [];
        const ff = t.Fi && t.Fi.list ? this.filesFor("first", t.Fi.list, F.yf, F.yt) : [];
        const ok = (t.L && t.L.list) || (t.Fi && t.Fi.list);
        const files = fl.concat(ff);
        // קטיעה בפירוש כשם פרטי משנה רק אם זה הפירוש העיקרי של המילה
        const lt = t.L ? t.L.total : 0, ft = t.Fi ? t.Fi.total : 0;
        files.truncated = !!(fl.truncated || (ff.truncated && ft > lt));
        return { m: ok ? { list: [1] } : null, files, label: t.tok,
          cost: (t.L ? t.L.total : 0) + (t.Fi ? Math.min(t.Fi.total, ff.length * 4000) : 0) };
      });
      const { rows, files, via, truncated } = await this.retrieve(cands, F.yf, F.yt);

      const tokScore = (t, s) => {          // ההתאמה הטובה ביותר של מילה לשדות של בן/בת זוג אחד/ת
        let best = null;
        const upd = v => { if (v !== null && (best === null || v < best)) best = v; };
        if (t.L) { upd(t.L.test(s.ln)); for (const w of s.lws) if (w !== s.ln) upd(t.L.test(w)); }
        if (t.Fi) { upd(t.Fi.test(s.fn)); for (const w of s.mids) upd(t.Fi.test(w) === null ? null : t.Fi.test(w) + 0.1); }
        return best;
      };
      const groups = P.persons.length === 2 ? [tm.slice(0, P.persons[0].length), tm.slice(P.persons[0].length)] : [tm];
      const results = [];
      for (const r of rows) {
        if (!this.passes(r, F)) continue;
        let best = null, hl = null;
        if (groups.length === 2) {
          for (const [sa, sb, a, b] of [[r.s1, r.s2, "s1", "s2"], [r.s2, r.s1, "s2", "s1"]]) {
            let sc = 0;
            for (const t of groups[0]) { const v = tokScore(t, sa); if (v === null) { sc = null; break; } sc += v; }
            if (sc === null) continue;
            for (const t of groups[1]) { const v = tokScore(t, sb); if (v === null) { sc = null; break; } sc += v; }
            if (sc !== null && (best === null || sc < best)) { best = sc; hl = [a, b]; }
          }
        } else {
          // כל המילים אצל אותו אדם – עדיף; פיצול בין בני הזוג – מותר בקנס קטן
          for (const [s, side] of [[r.s1, "s1"], [r.s2, "s2"]]) {
            let sc = 0;
            for (const t of tm) { const v = tokScore(t, s); if (v === null) { sc = null; break; } sc += v; }
            if (sc !== null && (best === null || sc < best)) { best = sc; hl = [side]; }
          }
          if (best === null && tm.length > 1) {
            let sc = 0;
            const used = new Set();
            for (const t of tm) {
              const a = tokScore(t, r.s1), b = tokScore(t, r.s2);
              if (a === null && b === null) { sc = null; break; }
              if (b === null || (a !== null && a <= b)) { sc += a; used.add("s1"); } else { sc += b; used.add("s2"); }
            }
            if (sc !== null) { best = sc + 0.5; hl = [...used]; }
          }
        }
        if (best === null) continue;
        r.score = best; r.hl = hl;
        results.push(r);
      }
      const variants = {};
      tm.forEach((t, i) => {
        const merged = [];
        const firstOnly = isHebrew(t.tok) && hebFirstNames(t.tok).length;
        if (t.L && t.L.list && !firstOnly) merged.push(...t.L.list.slice(0, 20).map(v => ({ n: v.n, cnt: v.cnt, d: v.d, part: "last" })));
        if (t.Fi && t.Fi.list) merged.push(...t.Fi.list.slice(0, 20).map(v => ({ n: v.n, cnt: v.cnt, d: v.d, part: "first" })));
        merged.sort((a, b) => b.cnt - a.cnt);
        variants[`t${i}`] = { tok: t.tok, list: merged.filter(v => v.d <= 0.6 || v.cnt > 50).slice(0, 24) };
      });
      return { results, variants, files, via, truncated, parsed: { ...P, year_from: F.yf || null, year_to: F.yt || null, boroughs: [...F.boros], license: F.lic } };
    }
  }

  const api = { Engine, parseFree, normYiddish, normLatin, latinKey, hebrewKeys, keysForQuery, latinSeq, hebrewSeqs, wdist, rankNames, fnv1a, isHebrew };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.NYCEngine = api;
})(typeof window !== "undefined" ? window : globalThis);
