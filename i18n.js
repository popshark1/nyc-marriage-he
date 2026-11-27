/* תרגומי הממשק: עברית (ראשית), English, ייִדיש, Français */
(function (root) {
  "use strict";
  const LINKEDIN = "https://www.linkedin.com/in/amitay-dan-a63647aa";
  const SRC = {
    site: "https://www.nycmarriageindex.com/",
    rtr: "https://www.reclaimtherecords.org/",
    ia1: "https://archive.org/details/nycmarriageindex_1950-1995_data_sql",
    ia2: "https://archive.org/details/nycmarriageindex_1996-2017_data_sql",
  };

  const L = {
    he: {
      _name: "עברית", _dir: "rtl", _locale: "he-IL",
      title: "אינדקס הנישואים של ניו יורק · 1950–2017",
      h1: "אינדקס הנישואים<br>של <em>ניו יורק</em>",
      lede: "חיפוש ברישיונות נישואים שהוגשו בחמשת הרבעים של העיר בשנים 1950–2017. אפשר להקליד שמות בעברית, באנגלית או ביידיש – המנוע ימצא גם כתיבים וצלילים דומים.",
      "stat.total": "רישיונות במאגר", "stat.years": "טווח שנים", "stat.boros": "רבעים",
      "free.ph": "חיפוש חופשי: משה שוורץ 1955 ברוקלין", search: "חיפוש", try: "נסו:",
      examples: ["שילה רבינוביץ וחיים שפירו", "יצחק פרלמן", "מרים קווינס שנות ה-70", "Rosen* 1960-1965", "אוחיון", "Abraham Lincoln"],
      "free.help": "שמות פרטיים, שמות משפחה או שניהם, בעברית, באנגלית או ביידיש, בכל סדר. אפשר להוסיף שנה (1962), טווח (1960-1965), עשור (שנות ה-60), רובע ומספר רישיון (#1234). שני בני זוג מפרידים ב־&amp; או ב־\"ו\" (שילה רבינוביץ וחיים שפירו).",
      "adv.open": "חיפוש מפורט לפי שדות ▾", "adv.close": "סגירת החיפוש המפורט ▴",
      "p.a": "בן/בת זוג", "p.b": "בן/בת הזוג השני/ה", optional: "(לא חובה)",
      "f.last": "שם משפחה", "f.first": "שם פרטי",
      match: "התאמת שמות", "m.phon": "צליל דומה", "m.pre": "מתחיל ב…", "m.exact": "מדויק",
      years: "שנים", boro: "רובע", reset: "ניקוי", more: "▸ חיפוש מתקדם", license: "מספר רישיון",
      hint: "אפשר לחפש גם לפי שם פרטי בלבד. טיפים: <code>Gold*</code> = כוכבית כתו כללי · אות אחת בשם הפרטי = לפי אות ראשונה · שם בעברית או ביידיש מחפש לפי צליל (<code dir=\"rtl\">שוורץ</code> → Schwartz, Shwarz, Swartz)",
      boros: { Manhattan: "מנהטן", Brooklyn: "ברוקלין", Bronx: "ברונקס", Queens: "קווינס", "Staten Island": "סטטן איילנד" },
      "about1.h": "מה יש במאגר", "about1.p": "כ־4.7 מיליון רישיונות נישואים שהוגשו בעיריית ניו יורק בשנים 1950–2017. Reclaim The Records השיגה אותם בתביעות חופש מידע, והם שוחררו לנחלת הכלל.",
      "about2.h": "מה חסר", "about2.p": "יותר מ־30,000 רשומות חסרות, בעיקר משנות ה־50 וה־60 (כולל כ־28,000 רשומות מנהטן משנת 1967). יש שגיאות כתיב בשמות. רישיון אינו הוכחה שהחתונה נערכה.",
      "about3.h": "מה עושים עם התוצאה", "about3.p": "שנה, רובע ומספר רישיון הם הפרטים הדרושים כדי להזמין עותק של התעודה מעיריית ניו יורק. אפשר להעתיק אותם בלחיצה מכל תוצאה.",
      "src.h": "מקורות",
      "src.site": "האתר הרשמי של המאגר, מאת Reclaim The Records",
      "src.rtr": "ארגון ללא מטרות רווח שהשיג את הנתונים בתביעות חופש מידע (FOIL)",
      "src.ia": "קובצי הנתונים המקוריים (SQL) ב־Internet Archive",
      "src.note": "הנתונים בנחלת הכלל. האתר הזה אינו קשור לעיריית ניו יורק או ל־Reclaim The Records. אם המאגר עזר לכם, שקלו לתרום ל־Reclaim The Records.",
      credit: "נבנה על ידי עמיתי דן", privacy: "החיפוש רץ כולו בדפדפן – שום שאילתה לא נשלחת לשרת.",
      searching: "מחפש…", results: "תוצאות", records: "{n} רשומות", record1: "רשומה אחת", ms: "מ״ש",
      "sort.rel": "מיון: התאמה", "sort.year": "שנה ↑", "sort.yeard": "שנה ↓", "sort.name": "שם משפחה",
      parsed: "זוהה בחיפוש:", names: "שמות:", spouse1: "בן/בת זוג א׳:", spouse2: "בן/בת זוג ב׳:",
      trunc: "חיפוש רחב: נטענו רק הכתיבים הקרובים והנפוצים ביותר. כדי לקבל תוצאות מלאות כדאי להוסיף שם נוסף, שנה או רובע.",
      filtered: "מסונן לפי:", clear: "ביטול",
      slot: { a_last: "שם משפחה (א)", a_first: "שם פרטי (א)", b_last: "שם משפחה (ב)", b_first: "שם פרטי (ב)" },
      spellings: "– כתיבים שנמצאו:", spellTok: "„{t}״ – כתיבים:", moreN: "ועוד {n}…",
      "vnote.det": "לחיצה על כתיב תצמצם את החיפוש אליו בלבד. המספר = כמה פעמים השם מופיע במאגר.",
      "vnote.free": "לחיצה על כתיב תסנן את התוצאות לרשומות שבהן הוא מופיע. המספר = כמה פעמים הוא מופיע בכל המאגר.",
      "empty.big": "לא נמצאו רשומות", "empty.p": "נסו \"צליל דומה\", הרחיבו את טווח השנים, או חפשו רק לפי שם משפחה.",
      copy: "העתקת פרטים", copied: "הפרטים הועתקו", married: "תאריך הנישואין", "chip.last": "שם משפחה", "chip.first": "שם פרטי",
      csv: ["שנה", "תאריך נישואין", "רובע", "מספר רישיון", "שם פרטי 1", "שם אמצעי 1", "שם משפחה 1", "שם פרטי 2", "שם אמצעי 2", "שם משפחה 2"],
      E_META: "לא ניתן לטעון את קובצי המאגר.", E_LOAD: "שגיאה בטעינת קובץ נתונים.",
      E_NAME_FULL: "הקלידו לפחות שם אחד מלא (שתי אותיות ומעלה).", E_NAME: "יש להזין לפחות שם אחד (פרטי או משפחה).",
      E_FREE_NAME: "לא זוהה שם בחיפוש. הקלידו לפחות שם אחד, למשל: משה שוורץ 1955",
    },

    en: {
      _name: "English", _dir: "ltr", _locale: "en-US",
      title: "NYC Marriage Index 1950–2017 · Search",
      h1: "New York City<br><em>Marriage Index</em>",
      lede: "Search marriage licenses filed in New York City's five boroughs, 1950–2017. Type names in English, Hebrew or Yiddish — the engine also finds similar spellings and sound-alikes.",
      "stat.total": "licenses indexed", "stat.years": "years", "stat.boros": "boroughs",
      "free.ph": "Search anything: Moses Schwartz 1955 Brooklyn", search: "Search", try: "Try:",
      examples: ["Sheila Rabinowitz & Hyman Shapiro", "Isaac Perlman", "Miriam Queens 1970s", "Rosen* 1960-1965", "Horowitz 1960s", "Abraham Lincoln"],
      "free.help": "Given names, surnames or both — in English, Hebrew or Yiddish, in any order. Add a year (1962), a range (1960-1965), a decade (1960s), a borough and a license number (#1234). Separate two spouses with &amp; or “and” (Sheila Rabinowitz &amp; Hyman Shapiro).",
      "adv.open": "Advanced search by field ▾", "adv.close": "Close advanced search ▴",
      "p.a": "Spouse", "p.b": "Other spouse", optional: "(optional)",
      "f.last": "Surname", "f.first": "Given name",
      match: "Name matching", "m.phon": "Sounds like", "m.pre": "Starts with…", "m.exact": "Exact",
      years: "Years", boro: "Borough", reset: "Clear", more: "▸ More options", license: "License number",
      hint: "Searching by given name alone works too. Tips: <code>Gold*</code> = wildcard · a single letter as given name = by initial · Hebrew and Yiddish names are matched by sound (<code dir=\"rtl\">שוורץ</code> → Schwartz, Shwarz, Swartz)",
      boros: { Manhattan: "Manhattan", Brooklyn: "Brooklyn", Bronx: "Bronx", Queens: "Queens", "Staten Island": "Staten Island" },
      "about1.h": "What's inside", "about1.p": "About 4.7 million marriage licenses filed with the City of New York, 1950–2017. Reclaim The Records obtained them through Freedom of Information lawsuits, and they were released into the public domain.",
      "about2.h": "What's missing", "about2.p": "Over 30,000 records are missing, mostly from the 1950s–60s (including ~28,000 Manhattan records from 1967). Names contain spelling errors. A license is not proof that a wedding took place.",
      "about3.h": "Using a result", "about3.p": "Year, borough and license number are what you need to order a copy of the certificate from New York City. Copy them from any result with one click.",
      "src.h": "Sources",
      "src.site": "the official index website, by Reclaim The Records",
      "src.rtr": "the nonprofit that obtained the data through Freedom of Information (FOIL) lawsuits",
      "src.ia": "The original data files (SQL) on the Internet Archive",
      "src.note": "The data is in the public domain. This site is not affiliated with the City of New York or with Reclaim The Records. If it helped you, consider donating to Reclaim The Records.",
      credit: "Built by Amitay Dan", privacy: "Search runs entirely in your browser — no query is sent to any server.",
      searching: "Searching…", results: "Results", records: "{n} records", record1: "1 record", ms: "ms",
      "sort.rel": "Sort: relevance", "sort.year": "Year ↑", "sort.yeard": "Year ↓", "sort.name": "Surname",
      parsed: "Understood:", names: "Names:", spouse1: "Spouse 1:", spouse2: "Spouse 2:",
      trunc: "Broad search: only the closest and most common spellings were loaded. Add another name, a year or a borough for complete results.",
      filtered: "Filtered by:", clear: "Clear",
      slot: { a_last: "Surname (1)", a_first: "Given name (1)", b_last: "Surname (2)", b_first: "Given name (2)" },
      spellings: "— spellings found:", spellTok: "“{t}” — spellings:", moreN: "and {n} more…",
      "vnote.det": "Click a spelling to search for it only. The number = how many times the name appears in the index.",
      "vnote.free": "Click a spelling to filter the results to records that contain it. The number = how many times it appears in the whole index.",
      "empty.big": "No records found", "empty.p": "Try “Sounds like”, widen the year range, or search by surname only.",
      copy: "Copy details", copied: "Copied", married: "Wedding date", "chip.last": "Surname", "chip.first": "Given name",
      csv: ["Year", "Wedding date", "Borough", "License number", "Given name 1", "Middle name 1", "Surname 1", "Given name 2", "Middle name 2", "Surname 2"],
      E_META: "Could not load the index files.", E_LOAD: "Error loading a data file.",
      E_NAME_FULL: "Type at least one full name (2 letters or more).", E_NAME: "Enter at least one name (given name or surname).",
      E_FREE_NAME: "No name found in your search. Type at least one name, e.g. Moses Schwartz 1955",
    },

    yi: {
      _name: "ייִדיש", _dir: "rtl", _locale: "he-IL",
      title: "דער ניו־יאָרקער חתונה־אינדעקס · 1950–2017",
      h1: "דער חתונה־אינדעקס<br>פֿון <em>ניו־יאָרק</em>",
      lede: "זוכט אין די חתונה־לײַסענסן וואָס מע האָט אַרײַנגעגעבן אין די פֿינף באָראָס פֿון ניו־יאָרק, 1950–2017. שרײַבט נעמען אויף ייִדיש, העברעיִש אָדער ענגליש – די זוכמאַשין געפֿינט אויך ענלעכע אויסלייגן און קלאַנגען.",
      "stat.total": "לײַסענסן אינעם אינדעקס", "stat.years": "יאָרן", "stat.boros": "באָראָס",
      "free.ph": "זוכט: משה שוואַרץ 1955 ברוקלין", search: "זוכן", try: "פּרוּווט:",
      examples: ["שיילע ראַבינאָוויטש און חיים שאַפּיראָ", "יאַנקל ראַבינאָוויטש", "פֿייגע שוואַרץ ברוקלין", "האָראָוויטש די 60ער", "הערשל גאָלדבערג", "מאיר לעווין"],
      "free.help": "פֿאָרנעמען, פֿאַמיליע־נעמען אָדער ביידע – אויף ייִדיש, העברעיִש אָדער ענגליש, אין וועלכן סדר איר ווילט. מע קען צולייגן אַ יאָר (1962), אַ תּקופֿה (1960-1965), אַ יאָרצענדליק (די 60ער), אַ באָראָ און אַ לײַסענס־נומער (#1234). צוויי פּאַרטנערס צעטיילט מען מיט &amp; אָדער „און“ (שיילע ראַבינאָוויטש און חיים שאַפּיראָ).",
      "adv.open": "פּינקטלעך זוכן לויט פֿעלדער ▾", "adv.close": "פֿאַרמאַכן דאָס פּינקטלעכע זוכן ▴",
      "p.a": "פּאַרטנער", "p.b": "דער צווייטער פּאַרטנער", optional: "(ניט נייטיק)",
      "f.last": "פֿאַמיליע־נאָמען", "f.first": "פֿאָרנאָמען",
      match: "נעמען־פּאַסונג", "m.phon": "ענלעכער קלאַנג", "m.pre": "הייבט זיך אָן מיט…", "m.exact": "פּינקטלעך",
      years: "יאָרן", boro: "באָראָ", reset: "אויסמעקן", more: "▸ נאָך אָפּציעס", license: "לײַסענס־נומער",
      hint: "מע קען זוכן אויך נאָר לויטן פֿאָרנאָמען. עצות: <code>Gold*</code> = שטערנדל פֿאַר וועלכע עס איז אותיות · איין אות אינעם פֿאָרנאָמען = לויטן ערשטן אות · נעמען אויף ייִדיש אָדער העברעיִש זוכט מען לויטן קלאַנג (<code dir=\"rtl\">שוואַרץ</code> → Schwartz, Shwarz, Swartz)",
      boros: { Manhattan: "מאַנהעטן", Brooklyn: "ברוקלין", Bronx: "בראָנקס", Queens: "קווינס", "Staten Island": "סטעטן־אײַלאַנד" },
      "about1.h": "וואָס איז דאָ", "about1.p": "בערך 4.7 מיליאָן חתונה־לײַסענסן וואָס מע האָט אַרײַנגעגעבן בײַ דער שטאָט ניו־יאָרק אין די יאָרן 1950–2017. Reclaim The Records האָט זיי באַקומען דורך געריכט־קלאָגעס לויטן געזעץ פֿון פֿרײַער אינפֿאָרמאַציע, און זיי זײַנען איצט עפֿנטלעך פֿאַרמעגן.",
      "about2.h": "וואָס פֿעלט", "about2.p": "מער ווי 30,000 רעקאָרדס פֿעלן, מערסטנס פֿון די 1950ער–60ער יאָרן (אַרײַנגערעכנט בערך 28,000 מאַנהעטן־רעקאָרדס פֿון 1967). אין די נעמען געפֿינען זיך טעותן. אַ לײַסענס איז ניט קיין באַווײַז אַז די חתונה איז פֿאָרגעקומען.",
      "about3.h": "וואָס טוט מען מיטן רעזולטאַט", "about3.p": "דאָס יאָר, דער באָראָ און דער לײַסענס־נומער זײַנען וואָס מע דאַרף כּדי צו באַשטעלן אַ קאָפּיע פֿונעם חתונה־צייגעניש בײַ דער שטאָט ניו־יאָרק. מע קען זיי קאָפּירן מיט איין קליק.",
      "src.h": "מקורים",
      "src.site": "דער אָפֿיציעלער וועבזײַטל פֿונעם אינדעקס, פֿון Reclaim The Records",
      "src.rtr": "די ניט־פֿאַר־פּראָפֿיט אָרגאַניזאַציע וואָס האָט באַקומען די דאַטן דורך FOIL־קלאָגעס",
      "src.ia": "די אָריגינעלע דאַטן־טעקעס (SQL) אינעם Internet Archive",
      "src.note": "די דאַטן זײַנען עפֿנטלעך פֿאַרמעגן. דער וועבזײַטל איז ניט פֿאַרבונדן מיט דער שטאָט ניו־יאָרק אָדער מיט Reclaim The Records. אויב ער האָט אײַך געהאָלפֿן, באַטראַכט צו שענקען אַ נדבה צו Reclaim The Records.",
      credit: "געבויט פֿון עמיתי דן", privacy: "דאָס זוכן גייט פֿאָר אין גאַנצן אינעם בראַוזער – קיין פֿראַגע ווערט ניט געשיקט צו קיין סערווער.",
      searching: "מע זוכט…", results: "רעזולטאַטן", records: "{n} רעקאָרדס", record1: "1 רעקאָרד", ms: "ms",
      "sort.rel": "סאָרטירן: פּאַסיקייט", "sort.year": "יאָר ↑", "sort.yeard": "יאָר ↓", "sort.name": "פֿאַמיליע־נאָמען",
      parsed: "דערקענט:", names: "נעמען:", spouse1: "פּאַרטנער 1:", spouse2: "פּאַרטנער 2:",
      trunc: "ברייטע זוכונג: מע האָט געלאָדן נאָר די נאָענטסטע און אָפֿטסטע אויסלייגן. לייגט צו נאָך אַ נאָמען, אַ יאָר אָדער אַ באָראָ פֿאַר פֿולע רעזולטאַטן.",
      filtered: "געפֿילטערט לויט:", clear: "אָפּשטעלן",
      slot: { a_last: "פֿאַמיליע־נאָמען (1)", a_first: "פֿאָרנאָמען (1)", b_last: "פֿאַמיליע־נאָמען (2)", b_first: "פֿאָרנאָמען (2)" },
      spellings: "– געפֿונענע אויסלייגן:", spellTok: "„{t}“ – אויסלייגן:", moreN: "און נאָך {n}…",
      "vnote.det": "קליקט אויף אַן אויסלייג כּדי צו זוכן נאָר אים. די צאָל = ווי אָפֿט דער נאָמען קומט פֿאָר אינעם אינדעקס.",
      "vnote.free": "קליקט אויף אַן אויסלייג כּדי צו פֿילטערן די רעזולטאַטן. די צאָל = ווי אָפֿט ער קומט פֿאָר אינעם גאַנצן אינדעקס.",
      "empty.big": "קיין רעקאָרדס ניט געפֿונען", "empty.p": "פּרוּווט „ענלעכער קלאַנג“, פֿאַרברייטערט די יאָרן, אָדער זוכט נאָר לויטן פֿאַמיליע־נאָמען.",
      copy: "קאָפּירן", copied: "קאָפּירט", married: "חתונה־דאַטע", "chip.last": "פֿאַמיליע־נאָמען", "chip.first": "פֿאָרנאָמען",
      csv: ["יאָר", "חתונה־דאַטע", "באָראָ", "לײַסענס־נומער", "פֿאָרנאָמען 1", "מיטל־נאָמען 1", "פֿאַמיליע־נאָמען 1", "פֿאָרנאָמען 2", "מיטל־נאָמען 2", "פֿאַמיליע־נאָמען 2"],
      E_META: "מע קען ניט לאָדן די אינדעקס־טעקעס.", E_LOAD: "אַ טעות בײַם לאָדן אַ דאַטן־טעקע.",
      E_NAME_FULL: "שרײַבט כאָטש איין גאַנצן נאָמען (2 אותיות אָדער מער).", E_NAME: "שרײַבט כאָטש איין נאָמען (פֿאָרנאָמען אָדער פֿאַמיליע־נאָמען).",
      E_FREE_NAME: "קיין נאָמען ניט דערקענט. שרײַבט כאָטש איין נאָמען, למשל: משה שוואַרץ 1955",
    },

    fr: {
      _name: "Français", _dir: "ltr", _locale: "fr-FR",
      title: "Index des mariages de New York · 1950–2017",
      h1: "Index des mariages<br>de <em>New York</em>",
      lede: "Recherchez les licences de mariage déposées dans les cinq arrondissements de New York entre 1950 et 2017. Saisissez les noms en lettres latines, en hébreu ou en yiddish : le moteur trouve aussi les graphies et sonorités proches.",
      "stat.total": "licences indexées", "stat.years": "années", "stat.boros": "arrondissements",
      "free.ph": "Recherche libre : Moses Schwartz 1955 Brooklyn", search: "Rechercher", try: "Essayez :",
      examples: ["Sheila Rabinowitz et Hyman Shapiro", "Isaac Perlman", "Miriam Queens années 70", "Rosen* 1960-1965", "Horowitz années 60", "Abraham Lincoln"],
      "free.help": "Prénoms, noms de famille ou les deux — en lettres latines, en hébreu ou en yiddish, dans n'importe quel ordre. Ajoutez une année (1962), une période (1960-1965), une décennie (années 60), un arrondissement et un numéro de licence (#1234). Séparez les deux époux par &amp; ou « et » (Sheila Rabinowitz et Hyman Shapiro).",
      "adv.open": "Recherche détaillée par champ ▾", "adv.close": "Fermer la recherche détaillée ▴",
      "p.a": "Époux/se", "p.b": "Autre époux/se", optional: "(facultatif)",
      "f.last": "Nom de famille", "f.first": "Prénom",
      match: "Correspondance des noms", "m.phon": "Son proche", "m.pre": "Commence par…", "m.exact": "Exact",
      years: "Années", boro: "Arrondissement", reset: "Effacer", more: "▸ Plus d'options", license: "Numéro de licence",
      hint: "On peut aussi chercher par prénom seul. Astuces : <code>Gold*</code> = joker · une seule lettre en prénom = par initiale · les noms en hébreu ou en yiddish sont cherchés par le son (<code dir=\"rtl\">שוורץ</code> → Schwartz, Shwarz, Swartz)",
      boros: { Manhattan: "Manhattan", Brooklyn: "Brooklyn", Bronx: "Bronx", Queens: "Queens", "Staten Island": "Staten Island" },
      "about1.h": "Contenu", "about1.p": "Environ 4,7 millions de licences de mariage déposées auprès de la ville de New York entre 1950 et 2017. Reclaim The Records les a obtenues grâce à des procès fondés sur la loi sur la liberté d'information, et elles ont été placées dans le domaine public.",
      "about2.h": "Lacunes", "about2.p": "Plus de 30 000 enregistrements manquent, surtout des années 1950–60 (dont environ 28 000 de Manhattan pour 1967). Les noms comportent des fautes d'orthographe. Une licence ne prouve pas que le mariage a eu lieu.",
      "about3.h": "Exploiter un résultat", "about3.p": "L'année, l'arrondissement et le numéro de licence permettent de commander une copie de l'acte auprès de la ville de New York. Copiez-les en un clic depuis chaque résultat.",
      "src.h": "Sources",
      "src.site": "le site officiel de l'index, par Reclaim The Records",
      "src.rtr": "l'association à but non lucratif qui a obtenu les données par des procès FOIL (liberté d'information)",
      "src.ia": "Les fichiers de données originaux (SQL) sur l'Internet Archive",
      "src.note": "Les données sont dans le domaine public. Ce site n'est affilié ni à la ville de New York ni à Reclaim The Records. S'il vous a été utile, pensez à faire un don à Reclaim The Records.",
      credit: "Réalisé par Amitay Dan", privacy: "La recherche s'exécute entièrement dans votre navigateur : aucune requête n'est envoyée à un serveur.",
      searching: "Recherche…", results: "Résultats", records: "{n} résultats", record1: "1 résultat", ms: "ms",
      "sort.rel": "Tri : pertinence", "sort.year": "Année ↑", "sort.yeard": "Année ↓", "sort.name": "Nom de famille",
      parsed: "Compris :", names: "Noms :", spouse1: "Époux/se 1 :", spouse2: "Époux/se 2 :",
      trunc: "Recherche large : seules les graphies les plus proches et les plus courantes ont été chargées. Ajoutez un autre nom, une année ou un arrondissement pour des résultats complets.",
      filtered: "Filtré par :", clear: "Annuler",
      slot: { a_last: "Nom (1)", a_first: "Prénom (1)", b_last: "Nom (2)", b_first: "Prénom (2)" },
      spellings: "— graphies trouvées :", spellTok: "« {t} » — graphies :", moreN: "et {n} de plus…",
      "vnote.det": "Cliquez sur une graphie pour ne chercher qu'elle. Le nombre = nombre d'occurrences du nom dans l'index.",
      "vnote.free": "Cliquez sur une graphie pour filtrer les résultats qui la contiennent. Le nombre = nombre d'occurrences dans tout l'index.",
      "empty.big": "Aucun résultat", "empty.p": "Essayez « Son proche », élargissez les années ou cherchez seulement par nom de famille.",
      copy: "Copier les détails", copied: "Copié", married: "Date du mariage", "chip.last": "Nom de famille", "chip.first": "Prénom",
      csv: ["Année", "Date du mariage", "Arrondissement", "Numéro de licence", "Prénom 1", "Deuxième prénom 1", "Nom 1", "Prénom 2", "Deuxième prénom 2", "Nom 2"],
      E_META: "Impossible de charger les fichiers de l'index.", E_LOAD: "Erreur lors du chargement d'un fichier de données.",
      E_NAME_FULL: "Saisissez au moins un nom complet (2 lettres ou plus).", E_NAME: "Saisissez au moins un nom (prénom ou nom de famille).",
      E_FREE_NAME: "Aucun nom reconnu. Saisissez au moins un nom, p. ex. : Moses Schwartz 1955",
    },
  };

  const ORDER = ["he", "en", "yi", "fr"];
  let cur = "he";
  function pick() {
    const q = new URLSearchParams(location.search).get("lang");
    if (q && L[q]) return q;
    try { const s = localStorage.getItem("lang"); if (s && L[s]) return s; } catch (e) { /* אין אחסון */ }
    return "he";
  }
  function t(key, vars) {
    let v = L[cur][key];
    if (v === undefined) v = L.he[key];
    if (typeof v === "string" && vars) v = v.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
    return v;
  }
  function set(lang) {
    if (!L[lang]) return;
    cur = lang;
    try { localStorage.setItem("lang", lang); } catch (e) { /* אין אחסון */ }
    const html = document.documentElement;
    html.lang = lang; html.dir = L[lang]._dir;
    document.title = t("title");
    document.querySelectorAll("[data-i18n]").forEach(el => { el.innerHTML = t(el.dataset.i18n); });
    document.querySelectorAll("[data-i18n-ph]").forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
    document.querySelectorAll("[data-i18n-title]").forEach(el => { el.title = t(el.dataset.i18nTitle); });
    document.querySelectorAll("[data-i18n-aria]").forEach(el => { el.setAttribute("aria-label", t(el.dataset.i18nAria)); });
    document.querySelectorAll(".langs button").forEach(b => b.classList.toggle("on", b.dataset.lang === lang));
  }
  cur = pick();
  root.I18N = { L, ORDER, t, set, get lang() { return cur; }, LINKEDIN, SRC };
})(window);
