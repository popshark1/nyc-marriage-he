// Klezmer band: two original tunes in the freygish mode, and a small synthesiser.
// Used by tools/render-music.html to render assets/klezmer.mp3 (the game plays that file).
// ------------------------------------------------------------------ klezmer band (original tunes, synthesised live)
export const nf = n => { const m = /^([A-G])(#|b)?(\d)$/.exec(n); const st = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[m[1]] + (m[2] === "#" ? 1 : m[2] === "b" ? -1 : 0); return 440 * 2 ** (((+m[3] + 1) * 12 + st - 69) / 12); };
const CHORD = { D: ["D3", "F#3", "A3"], Gm: ["G3", "Bb3", "D4"], Cm: ["C3", "Eb3", "G3"], Eb: ["Eb3", "G3", "Bb3"] };
const ROOT = { D: "D2", Gm: "G2", Cm: "C2", Eb: "Eb2" };
// Both tunes are original compositions in the freygish mode (D Eb F# G A Bb C), the classic klezmer scale.
export const TUNES = [
  { name: "freylekhs", bpm: 152, beats: 2, rhythm: "freylekhs",
    chords: ["D", "D", "Gm", "D", "D", "Cm", "D", "D", "Gm", "Gm", "D", "D", "Cm", "Cm", "D", "D"],
    melody: [
      ["A4", .5], ["A4", .5], ["Bb4", .5], ["A4", .5], ["F#4", .5], ["G4", .5], ["A4", 1],
      ["Bb4", .5], ["C5", .5], ["D5", .5], ["Bb4", .5], ["A4", .5], ["G4", .5], ["F#4", .5], ["A4", .5],
      ["D5", .5], ["C5", .5], ["Bb4", .5], ["A4", .5], ["G4", .5], ["Bb4", .5], ["A4", .5], ["G4", .5],
      ["F#4", .5], ["G4", .5], ["Eb4", .5], ["F#4", .5], ["D4", 1], [null, 1],
      ["D5", .5], ["D5", .5], ["Eb5", .5], ["D5", .5], ["C5", .5], ["Bb4", .5], ["C5", .5], ["D5", .5],
      ["A4", .5], ["Bb4", .5], ["C5", .5], ["A4", .5], ["F#4", 1], ["A4", 1],
      ["G4", .5], ["Bb4", .5], ["Eb5", .5], ["D5", .5], ["C5", .5], ["Bb4", .5], ["A4", .5], ["G4", .5],
      ["F#4", .5], ["A4", .5], ["G4", .5], ["Eb4", .5], ["D4", 1.5], [null, .5],
    ] },
  { name: "bulgar", bpm: 132, beats: 4, rhythm: "bulgar",
    chords: ["D", "D", "Gm", "D", "Cm", "D", "Eb", "D", "Gm", "Gm", "D", "D", "Cm", "D", "Eb", "D"],
    melody: [
      ["A4", .5], ["D5", 1], ["C5", .5], ["Bb4", .5], ["A4", .5], ["Bb4", .5], ["A4", .5],
      ["F#4", 1.5], ["G4", 1.5], ["A4", 1],
      ["Bb4", .5], ["A4", .5], ["Bb4", .5], ["D5", .5], ["C5", .5], ["Bb4", .5], ["A4", .5], ["G4", .5],
      ["A4", 1.5], ["F#4", 1.5], ["D4", 1],
      ["G4", .5], ["Eb4", .5], ["G4", .5], ["C5", 1], ["Bb4", .5], ["A4", .5], ["G4", .5],
      ["F#4", .5], ["G4", .5], ["A4", 1], ["D5", .5], ["C5", .5], ["Bb4", .5], ["A4", .5],
      ["Bb4", .5], ["A4", .5], ["G4", .5], ["F#4", .5], ["G4", .5], ["A4", .5], ["Bb4", .5], ["G4", .5],
      ["A4", 2], ["D4", 1], [null, 1],
      ["D5", 1.5], ["Bb4", 1.5], ["G4", 1],
      ["A4", .5], ["Bb4", .5], ["C5", .5], ["D5", .5], ["Eb5", 1], ["D5", 1],
      ["C5", .5], ["Bb4", .5], ["A4", .5], ["Bb4", .5], ["A4", .5], ["G4", .5], ["F#4", 1],
      ["A4", 1.5], ["F#4", 1.5], ["D4", 1],
      ["Eb5", 1.5], ["D5", 1.5], ["C5", 1],
      ["D5", .5], ["C5", .5], ["Bb4", .5], ["A4", .5], ["F#4", 1], ["A4", 1],
      ["G4", .5], ["Bb4", .5], ["Eb5", .5], ["D5", .5], ["C5", .5], ["Bb4", .5], ["A4", .5], ["G4", .5],
      ["F#4", .5], ["A4", .5], ["D5", 1], ["D4", 1], [null, 1],
    ] },
];
function buildEvents(tn) {
  const ev = [], bt = tn.beats;
  let b = 0;
  for (const [n, d] of tn.melody) { if (n) ev.push({ b, k: "mel", n, d }); b += d; }
  tn.chords.forEach((c, bar) => {
    const o = bar * bt, root = nf(ROOT[c]);
    const hits = tn.rhythm === "bulgar" ? [[0, 1], [1.5, 1.5], [3, 1]] : [[0, 1], [1, 1.5]];
    for (const [h, mul] of hits) ev.push({ b: o + h, k: "bass", f: root * mul });
    const stabs = tn.rhythm === "bulgar" ? [0, 1.5, 3] : [.5, 1.5];
    for (const h of stabs) ev.push({ b: o + h, k: "chord", c });
    const kicks = tn.rhythm === "bulgar" ? [0, 1.5, 3] : [0, 1];
    const snares = tn.rhythm === "bulgar" ? [1, 2.5, 3.5] : [.5, 1.5];
    kicks.forEach(h => ev.push({ b: o + h, k: "kick" })); snares.forEach(h => ev.push({ b: o + h, k: "snare" }));
  });
  ev.sort((a, c) => a.b - c.b);
  return { ev, len: tn.chords.length * bt };
}
// instruments – each takes S = { c: AudioContext, out: destination node, noise: AudioBuffer }
function clarinet(S, f, t, dur) {
  const a = S.c, o1 = a.createOscillator(), o2 = a.createOscillator(), lp = a.createBiquadFilter(), g = a.createGain();
  o1.type = "sawtooth"; o2.type = "square"; o2.detune.value = 6;
  lp.type = "lowpass"; lp.frequency.value = 3200; lp.Q.value = 1.4;
  if (dur >= .3) {                                   // "krekhts": a sob-like slide from a semitone above, then vibrato
    for (const o of [o1, o2]) { o.frequency.setValueAtTime(f * 1.0595, t); o.frequency.linearRampToValueAtTime(f, t + .07); }
    const lfo = a.createOscillator(), lg = a.createGain(); lfo.frequency.value = 5.6; lg.gain.value = f * .007;
    lfo.connect(lg); lg.connect(o1.frequency); lg.connect(o2.frequency); lfo.start(t + .12); lfo.stop(t + dur + .05);
  } else { o1.frequency.value = f; o2.frequency.value = f; }
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.32, t + .02);
  g.gain.setValueAtTime(.27, t + Math.max(.03, dur - .05)); g.gain.linearRampToValueAtTime(0, t + dur);
  const m = a.createGain(); m.gain.value = .5;
  o1.connect(m); o2.connect(m); m.connect(lp).connect(g).connect(S.out);
  o1.start(t); o2.start(t); o1.stop(t + dur + .02); o2.stop(t + dur + .02);
}
function accordion(S, c, t) {
  for (const n of CHORD[c]) {
    const a = S.c, o = a.createOscillator(), g = a.createGain(), lp = a.createBiquadFilter();
    o.type = "square"; o.frequency.value = nf(n) * 2; o.detune.value = (Math.random() - .5) * 10;
    lp.type = "lowpass"; lp.frequency.value = 2200;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.05, t + .01); g.gain.exponentialRampToValueAtTime(.001, t + .2);
    o.connect(lp).connect(g).connect(S.out); o.start(t); o.stop(t + .22);
  }
}
function tuba(S, f, t) {                             // fundamental + upper octave so it is audible on phone speakers
  for (const [mul, type, vol] of [[1, "triangle", .3], [2, "sawtooth", .1], [4, "triangle", .06]]) {
    const a = S.c, o = a.createOscillator(), g = a.createGain(), lp = a.createBiquadFilter();
    o.type = type; o.frequency.value = f * mul; lp.type = "lowpass"; lp.frequency.value = 900;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .02); g.gain.exponentialRampToValueAtTime(.001, t + .3);
    o.connect(lp).connect(g).connect(S.out); o.start(t); o.stop(t + .32);
  }
}
function drum(S, kind, t) {
  const a = S.c;
  if (kind === "kick") {
    const o = a.createOscillator(), g = a.createGain(); o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(55, t + .1);
    g.gain.setValueAtTime(.35, t); g.gain.exponentialRampToValueAtTime(.001, t + .14); o.connect(g).connect(S.out); o.start(t); o.stop(t + .15);
  } else {
    const src = a.createBufferSource(), bp = a.createBiquadFilter(), g = a.createGain(); src.buffer = S.noise;
    bp.type = "bandpass"; bp.frequency.value = 2400; bp.Q.value = .7;
    g.gain.setValueAtTime(.22, t); g.gain.exponentialRampToValueAtTime(.001, t + .08);
    src.connect(bp).connect(g).connect(S.out); src.start(t); src.stop(t + .09);
  }
}
function noiseBuf(c) {
  const len = Math.floor(c.sampleRate * .2), buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  return buf;
}
function scheduleTune(S, tn, start, loops) {
  const spb = 60 / tn.bpm, { ev, len } = buildEvents(tn);
  for (let l = 0; l < loops; l++) for (const e of ev) {
    const t = start + (l * len + e.b) * spb;
    if (e.k === "mel") clarinet(S, nf(e.n), t, e.d * spb * .95);
    else if (e.k === "chord") accordion(S, e.c, t);
    else if (e.k === "bass") tuba(S, e.f, t);
    else drum(S, e.k, t);
  }
  return start + loops * len * spb;
}
// 16-bit mono WAV
export function wavBlob(d, rate, gain = 1) {
  const n = d.length, buf = new ArrayBuffer(44 + n * 2), v = new DataView(buf);
  const w = (o, str) => [...str].forEach((ch, i) => v.setUint8(o + i, ch.charCodeAt(0)));
  w(0, "RIFF"); v.setUint32(4, 36 + n * 2, true); w(8, "WAVE"); w(12, "fmt "); v.setUint32(16, 16, true);
  v.setUint16(20, 1, true); v.setUint16(22, 1, true); v.setUint32(24, rate, true); v.setUint32(28, rate * 2, true);
  v.setUint16(32, 2, true); v.setUint16(34, 16, true); w(36, "data"); v.setUint32(40, n * 2, true);
  for (let i = 0; i < n; i++) v.setInt16(44 + i * 2, Math.max(-1, Math.min(1, d[i] * gain)) * 32767, true);
  return new Blob([buf], { type: "audio/wav" });
}

export async function renderKlezmer(rate = 44100) {
  const OC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  const [A, B] = TUNES;
  const durA = A.chords.length * A.beats * 2 * 60 / A.bpm, durB = B.chords.length * B.beats * 2 * 60 / B.bpm;
  const c = new OC(1, Math.ceil((durA + durB + .05) * rate), rate);
  const comp = c.createDynamicsCompressor(); comp.threshold.value = -20; comp.knee.value = 12; comp.ratio.value = 4; comp.attack.value = .003; comp.release.value = .15;
  const out = c.createGain(); out.gain.value = 1; out.connect(comp); comp.connect(c.destination);
  const S = { c, out, noise: noiseBuf(c) };
  const tB = scheduleTune(S, A, 0, 2); scheduleTune(S, B, tB, 2);
  const buf = await c.startRendering();
  const d = buf.getChannelData(0);
  let pk = 0; for (let i = 0; i < d.length; i++) pk = Math.max(pk, Math.abs(d[i]));
  return { data: d, rate, gain: pk ? .95 / pk : 1, durA };
}
