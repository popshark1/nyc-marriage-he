/*
 * מוזיקת רקע: הקלטות חזנות היסטוריות מ־1908 (נחלת הכלל, Wikimedia Commons).
 * מתחילה באינטראקציה הראשונה עם הדף (הדפדפנים חוסמים צליל לפני כן), בעוצמה נמוכה.
 * השתקה נשמרת לביקורים הבאים.
 */
(function () {
  "use strict";
  const C = "https://upload.wikimedia.org/wikipedia/commons/";
  const FP = "https://commons.wikimedia.org/wiki/Special:FilePath/";
  const PAGE = "https://commons.wikimedia.org/wiki/File:";
  const TRACKS = [
    { file: "Birchos_kohanim_(1908).ogg", h: "d/d9", key: "music.t1" },
    { file: "Hajojm_horas_ojlom_(1908).ogg", h: "0/09", key: "music.t2" },
    { file: "Broisch_haschoni_(1908).ogg", h: "0/00", key: "music.t3" },
  ];
  const VOLUME = 0.35;
  const t = k => (window.I18N ? I18N.t(k) : k);
  const store = {
    get() { try { return localStorage.getItem("music"); } catch (e) { return null; } },
    set(v) { try { localStorage.setItem("music", v); } catch (e) { /* אין אחסון */ } },
  };

  let idx = Math.floor(Math.random() * TRACKS.length);
  let failed = 0;
  const audio = new Audio();
  audio.preload = "none";
  audio.volume = VOLUME;

  function srcFor(tr) {
    // MP3 (נתמך בכל הדפדפנים כולל ספארי) → OGG המקורי → קישור FilePath שמפנה לקובץ
    const canOgg = audio.canPlayType('audio/ogg; codecs="vorbis"');
    return [`${C}transcoded/${tr.h}/${tr.file}/${tr.file}.mp3`, canOgg ? `${C}${tr.h}/${tr.file}` : null, `${FP}${tr.file}`].filter(Boolean);
  }
  let srcList = [], srcI = 0;
  function load(i) {
    idx = (i + TRACKS.length) % TRACKS.length;
    srcList = srcFor(TRACKS[idx]); srcI = 0;
    audio.src = srcList[0];
    paint();
  }
  audio.addEventListener("error", () => {
    if (srcI + 1 < srcList.length) { audio.src = srcList[++srcI]; if (wanted()) audio.play().catch(() => {}); return; }
    if (++failed >= TRACKS.length) { el.hidden = true; return; }      // אין חיבור לקבצים – מסתירים את הנגן
    load(idx + 1); if (wanted()) audio.play().catch(() => {});
  });
  audio.addEventListener("ended", () => { load(idx + 1); audio.play().catch(() => {}); });
  audio.addEventListener("playing", () => { failed = 0; paint(); });
  audio.addEventListener("pause", paint);

  const wanted = () => store.get() !== "off";

  // ---------------------------------------------------------------- UI
  const el = document.createElement("div");
  el.className = "music";
  el.innerHTML = `
    <button type="button" class="m-toggle" aria-pressed="false">
      <svg class="i-on" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/></svg>
      <svg class="i-off" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="m23 9-6 6M17 9l6 6"/></svg>
    </button>
    <div class="m-info">
      <span class="m-title"></span>
      <a class="m-credit" target="_blank" rel="noopener"></a>
    </div>
    <button type="button" class="m-next">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M5 5v14l9-7zM15 5h3v14h-3z"/></svg>
    </button>`;
  const $ = s => el.querySelector(s);

  function paint() {
    const on = !audio.paused;
    el.classList.toggle("on", on);
    $(".m-toggle").setAttribute("aria-pressed", String(on));
    $(".m-toggle").title = $(".m-toggle").ariaLabel = on ? t("music.mute") : t("music.unmute");
    $(".m-next").title = $(".m-next").ariaLabel = t("music.next");
    $(".m-title").textContent = t(TRACKS[idx].key);
    const cr = $(".m-credit");
    cr.textContent = t("music.credit");
    cr.href = PAGE + TRACKS[idx].file;
  }

  function play() { store.set("on"); audio.play().catch(() => {}); }
  function mute() { store.set("off"); audio.pause(); paint(); }
  $(".m-toggle").onclick = () => (audio.paused ? play() : mute());
  $(".m-next").onclick = () => { load(idx + 1); if (wanted()) audio.play().catch(() => {}); };

  // התחלה אוטומטית באינטראקציה הראשונה – אלא אם המשתמש השתיק בעבר
  function firstTouch(e) {
    if (el.contains(e.target)) return;                // לחיצה על הנגן עצמו מטופלת בכפתורים
    window.removeEventListener("pointerdown", firstTouch, true);
    window.removeEventListener("keydown", firstTouch, true);
    if (wanted() && audio.paused) audio.play().catch(() => {});
  }
  window.addEventListener("pointerdown", firstTouch, true);
  window.addEventListener("keydown", firstTouch, true);

  function mount() {
    document.body.appendChild(el);
    load(idx);
    // תרגום מחדש כשמחליפים שפה
    document.querySelectorAll(".langs button").forEach(b => b.addEventListener("click", () => setTimeout(paint, 0)));
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount); else mount();
})();
