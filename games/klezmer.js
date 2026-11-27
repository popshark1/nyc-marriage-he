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
// ---------------------------------------------------------------- instruments
// S = { c: (Offline)AudioContext, out: destination node, noise: AudioBuffer }

// One continuous voice for the whole melody: notes glide into each other (legato) instead of
// stopping and restarting, which is what made the earlier version sound choppy.
function melodyVoice(S, notes, end, opt) {
  const a = S.c, g = a.createGain(), lp = a.createBiquadFilter(), mix = a.createGain();
  lp.type = "lowpass"; lp.frequency.value = opt.lp; lp.Q.value = .9;
  mix.gain.value = 1 / opt.types.length;
  const lfo = a.createOscillator(), depth = a.createGain();   // vibrato in cents (independent of pitch)
  lfo.frequency.value = 5.4; depth.gain.value = 0; lfo.connect(depth);
  const oscs = opt.types.map((type, i) => {
    const o = a.createOscillator(); o.type = type; o.detune.value = i ? opt.detune : 0;
    depth.connect(o.detune); o.connect(mix); return o;
  });
  mix.connect(lp).connect(g).connect(S.out);
  const V = opt.vol, setF = (v, t) => oscs.forEach(o => o.frequency.setValueAtTime(v, t)), rampF = (v, t) => oscs.forEach(o => o.frequency.linearRampToValueAtTime(v, t));
  g.gain.setValueAtTime(0, 0);
  setF(notes[0].f * opt.mul, 0);
  let prevEnd = -1, prevF = 0;
  for (const n of notes) {
    const f = n.f * opt.mul, t = n.t, e = n.t + n.d;
    const joined = Math.abs(t - prevEnd) < .002;               // continues straight from the previous note
    if (joined) {
      // short glide into the new pitch, and a soft dip in volume to articulate the note
      setF(prevF, t - .018); rampF(f, t + .012);
      g.gain.setValueAtTime(V, t - .02); g.gain.linearRampToValueAtTime(V * .72, t); g.gain.linearRampToValueAtTime(V, t + .05);
    } else {
      setF(f, Math.max(0, t - .005));
      g.gain.setValueAtTime(0, Math.max(0, t - .005)); g.gain.linearRampToValueAtTime(V, t + .03);
    }
    if (opt.krekhts && n.d >= .38) {                          // klezmer "sob": a quick bend down into long notes
      setF(f * 1.03, t + (joined ? .012 : 0)); rampF(f, t + .07);
    }
    // vibrato only on longer notes, fading in
    depth.gain.setValueAtTime(0, t); if (n.d >= .3) depth.gain.linearRampToValueAtTime(opt.vib, t + Math.min(.25, n.d * .6));
    if (!n.next) { g.gain.setValueAtTime(V, e - .06); g.gain.linearRampToValueAtTime(0, e + .02); }   // rest follows
    prevEnd = e; prevF = f;
  }
  oscs.forEach(o => { o.start(0); o.stop(end); }); lfo.start(0); lfo.stop(end);
}
// sustained accordion bed for each bar, plus a light rhythmic "push" on the off-beats
function accordionPad(S, c, t, dur) {
  for (const n of CHORD[c]) for (const det of [-7, 7]) {
    const a = S.c, o = a.createOscillator(), g = a.createGain(), lp = a.createBiquadFilter();
    o.type = "sawtooth"; o.frequency.value = nf(n) * 2; o.detune.value = det;
    lp.type = "lowpass"; lp.frequency.value = 1400;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.012, t + .06);
    g.gain.setValueAtTime(.012, t + dur - .05); g.gain.linearRampToValueAtTime(0, t + dur + .03);
    o.connect(lp).connect(g).connect(S.out); o.start(t); o.stop(t + dur + .05);
  }
}
function accordionPush(S, c, t) {
  for (const n of CHORD[c]) {
    const a = S.c, o = a.createOscillator(), g = a.createGain(), lp = a.createBiquadFilter();
    o.type = "square"; o.frequency.value = nf(n) * 2;
    lp.type = "lowpass"; lp.frequency.value = 2000;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.03, t + .015); g.gain.exponentialRampToValueAtTime(.002, t + .22);
    o.connect(lp).connect(g).connect(S.out); o.start(t); o.stop(t + .24);
  }
}
function tuba(S, f, t) {                             // fundamental + upper partials so it is audible on phone speakers
  for (const [mul, type, vol] of [[1, "triangle", .28], [2, "sawtooth", .08], [4, "triangle", .05]]) {
    const a = S.c, o = a.createOscillator(), g = a.createGain(), lp = a.createBiquadFilter();
    o.type = type; o.frequency.value = f * mul; lp.type = "lowpass"; lp.frequency.value = 900;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .02); g.gain.setTargetAtTime(0, t + .12, .09);
    o.connect(lp).connect(g).connect(S.out); o.start(t); o.stop(t + .6);
  }
}
function drum(S, kind, t, vol = 1) {
  const a = S.c;
  if (kind === "kick") {
    const o = a.createOscillator(), g = a.createGain(); o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(55, t + .1);
    g.gain.setValueAtTime(.3 * vol, t); g.gain.exponentialRampToValueAtTime(.001, t + .16); o.connect(g).connect(S.out); o.start(t); o.stop(t + .17);
  } else {
    const src = a.createBufferSource(), bp = a.createBiquadFilter(), g = a.createGain(); src.buffer = S.noise;
    bp.type = "bandpass"; bp.frequency.value = 2400; bp.Q.value = .7;
    g.gain.setValueAtTime(.16 * vol, t); g.gain.exponentialRampToValueAtTime(.001, t + .09);
    src.connect(bp).connect(g).connect(S.out); src.start(t); src.stop(t + .1);
  }
}
function noiseBuf(c) {
  const len = Math.floor(c.sampleRate * .2), buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  return buf;
}
// The whole medley as absolute times: A twice, then B twice, then back to A (the loop).
function arrange() {
  const parts = [[TUNES[0], 2], [TUNES[1], 2]];
  const notes = [], acc = [];
  let t0 = 0;
  for (const [tn, loops] of parts) {
    const spb = 60 / tn.bpm, { ev, len } = buildEvents(tn);
    for (let l = 0; l < loops; l++) {
      for (const e of ev) {
        const t = t0 + (l * len + e.b) * spb;
        if (e.k === "mel") notes.push({ t, d: e.d * spb, f: nf(e.n) });
        else if (e.k === "chord") acc.push({ k: "push", t, c: e.c });
        else acc.push({ ...e, t });
      }
      tn.chords.forEach((c, bar) => acc.push({ k: "pad", t: t0 + (l * len + bar * tn.beats) * spb, c, d: tn.beats * spb }));
      if (l === loops - 1) {                         // snare fill leading into the next tune
        const last = t0 + (l * len + len - 1) * spb;
        for (let i = 0; i < 4; i++) acc.push({ k: "snare", t: last + i * spb / 4, v: .6 + i * .15 });
      }
    }
    t0 += loops * len * spb;
  }
  notes.sort((x, y) => x.t - y.t);
  notes.forEach((n, i) => { const nx = notes[i + 1]; n.next = !!nx && Math.abs(nx.t - (n.t + n.d)) < .002; });
  return { notes, acc, length: t0 };
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
export const LOOP_SECONDS = (() => TUNES.reduce((s, tn) => s + tn.chords.length * tn.beats * 2 * 60 / tn.bpm, 0))();

export async function renderKlezmer(rate = 44100) {
  const OC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  const { notes, acc, length } = arrange();
  const TAIL = 1.5;                                   // render past the end, then fold it into the start: seamless loop
  const c = new OC(1, Math.ceil((length + TAIL) * rate), rate);
  const comp = c.createDynamicsCompressor(); comp.threshold.value = -16; comp.knee.value = 18; comp.ratio.value = 3; comp.attack.value = .012; comp.release.value = .3;
  const out = c.createGain(); out.gain.value = 1; out.connect(comp); comp.connect(c.destination);
  const S = { c, out, noise: noiseBuf(c) };
  melodyVoice(S, notes, length + TAIL, { types: ["sawtooth", "square"], detune: 5, lp: 2900, vol: .3, mul: 1, vib: 14, krekhts: true });   // clarinet
  melodyVoice(S, notes, length + TAIL, { types: ["triangle", "sawtooth"], detune: -4, lp: 1700, vol: .12, mul: .5, vib: 10, krekhts: false }); // violin, an octave below
  for (const e of acc) {
    if (e.k === "pad") accordionPad(S, e.c, e.t, e.d);
    else if (e.k === "push") accordionPush(S, e.c, e.t);
    else if (e.k === "bass") tuba(S, e.f, e.t);
    else drum(S, e.k, e.t, e.v || 1);
  }
  const buf = await c.startRendering();
  const all = buf.getChannelData(0), n = Math.round(length * rate), d = new Float32Array(n);
  d.set(all.subarray(0, n));
  for (let i = 0; i < all.length - n; i++) d[i] += all[n + i];   // tail of the last bar rings into the first
  let pk = 0; for (let i = 0; i < n; i++) pk = Math.max(pk, Math.abs(d[i]));
  return { data: d, rate, gain: pk ? .93 / pk : 1, loopSeconds: length };
}
