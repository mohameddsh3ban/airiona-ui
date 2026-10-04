// Airiona motion piece (1080x1920, 30fps, 18.5s: 15s reel plus the credit card). Deterministic: window.render(t) places every element for time t
// (seconds), so the renderer can step frame by frame. One ease family: expo-out for every arrival, its mirror
// expo-in for every exit, smooth for continuous camera moves; nothing sits still at a cut.

/* Voice-over timing, passed by the renderer: ?vo=<start s>&visit=<absolute s when she says "visit"> */
const Q = new URLSearchParams(location.search);
const VO_START = Number(Q.get('vo') || 15.45);
const VISIT_AT = Number(Q.get('visit') || 16.45);

/* ---------- easing ---------- */
function bezier(x1, y1, x2, y2) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx, cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sx = (t) => ((ax * t + bx) * t + cx) * t, sy = (t) => ((ay * t + by) * t + cy) * t, dx = (t) => (3 * ax * t + 2 * bx) * t + cx;
  return (x) => {
    if (x <= 0) return 0; if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i++) { const e = sx(t) - x; const d = dx(t); if (Math.abs(e) < 1e-6 || !d) break; t -= e / d; }
    return sy(Math.min(1, Math.max(0, t)));
  };
}
const OUT = bezier(0.16, 1, 0.3, 1), IN = bezier(0.7, 0, 0.84, 0), SMOOTH = bezier(0.65, 0, 0.35, 1), POP = bezier(0.34, 1.56, 0.64, 1);
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const seg = (t, a, b) => clamp((t - a) / (b - a));
const lerp = (a, b, p) => a + (b - a) * p;
const $ = (id) => document.getElementById(id);
const css = (el, o) => Object.assign(el.style, o);

/* ---------- build ---------- */
const PW = 560; // centre phone width
// Bezel-less phones: the screen is the whole device box.
const SCREEN = { x: 260, y: 640, w: PW, h: PW * 844 / 390 };
const K = SCREEN.w / 390; // capture css px to stage px inside a phone screen

function mountPhone(id, slug, w, full) {
  $(id).outerHTML = phone(slug, { w, x: 0, y: 0, cls: 'is-bare', id, full, scrollId: `${id}Scroll` });
  css($(id), { left: '0px', top: '0px', zIndex: 8, transformOrigin: '50% 50%' });
}
mountPhone('phA', 'flight-home', PW, true);
mountPhone('phB', 'flight-booking', PW, true);
mountPhone('phC', 'operator-dashboard', PW, false);
mountPhone('phD', 'aircraft-market', PW, false);
mountPhone('phE', 'hangar-market', PW, false);
// Selection ring, ripple and radio fill on the booking screen (row 2: Citation Latitude, measured at 390px).
const bScreen = $('phB').querySelector('.phone__screen');
bScreen.insertAdjacentHTML('beforeend', '<div class="ring" id="ring"></div><div class="ripple" id="ripple"></div><div class="dot-fill" id="radio"></div>');
const BOOK_SCROLL = 880; // css px: the aircraft section at the top of the screen
const ROW = { x: 16, y: 1182, w: 358, h: 84 };
css($('ring'), { left: `${ROW.x * K}px`, top: `${(ROW.y - BOOK_SCROLL) * K}px`, width: `${ROW.w * K}px`, height: `${ROW.h * K}px` });
const RADIO = { x: (ROW.x + ROW.w - 14 - 22) * K, y: (ROW.y - BOOK_SCROLL + ROW.h / 2 - 11) * K, s: 22 * K };
css($('radio'), { left: `${RADIO.x}px`, top: `${RADIO.y}px`, width: `${RADIO.s}px`, height: `${RADIO.s}px` });

$('dashBrowser').outerHTML = browser('operator-dashboard', { w: 980, x: 50, y: 760, cls: 'is-dark', id: 'dashBrowser', url: 'airiona.app/operator' });

// Component plane: the catalogue thumbnails on a true isometric plane, plus four floating heroes.
fetch('thumbs.json').then((r) => r.json()).catch(() => []).then((list) => {
  $('plane').innerHTML = list.slice(0, 120).map((f, i) => {
    const r = Math.floor(i / 12), c = i % 12;
    return `<div class="tile" style="left:${c * 262 + (r % 2 ? 131 : 0)}px;top:${r * 190}px"><img src="../../dist/catalog-thumbs/${f}" alt=""></div>`;
  }).join('');
  window.__planeReady = true;
});
const HEROES = [['boarding-pass', 70, 640, 470], ['segment-gauge', 560, 760, 450], ['option-list', 90, 1210, 500], ['balance-chart', 520, 1330, 500]];
$('heroes').innerHTML = HEROES.map(([n, x, y, w], i) => `<div class="hero-card" id="hero${i}" style="left:${x}px;top:${y}px;width:${w}px"><img src="../../dist/catalog-thumbs/${n}.jpg" alt=""></div>`).join('');

$('endWord').innerHTML = '<span class="clip">' + [...'airiona'].map((c, i) => `<span class="ch" id="ch${i}">${c}</span>`).join('') + '</span><span class="end-dot" id="endDot"></span>';

// Copy lines: every .line > span rises through its clip.
const lines = (id) => [...$(id).querySelectorAll('.line > span')];
function copyIn(id, t, a, out) {
  const el = $(id);
  const step = el.querySelector('.step');
  const pIn = seg(t, a, a + 0.6);
  const pOut = out ? IN(seg(t, out, out + 0.32)) : 0;
  const vis = t >= a - 0.01 && (!out || t <= out + 0.32);
  el.style.display = vis ? '' : 'none';
  if (!vis) return;
  css(step, { opacity: String(OUT(seg(t, a, a + 0.4)) * (1 - pOut)), transform: `translateY(${lerp(20, 0, OUT(seg(t, a, a + 0.5))) - pOut * 60}px)` });
  lines(id).forEach((s, i) => {
    const p = OUT(seg(t, a + 0.08 + i * 0.1, a + 0.7 + i * 0.1));
    css(s, { transform: `translateY(${lerp(110, 0, p) - pOut * 120}%)` });
  });
  el.style.opacity = String(1 - pOut);
  void pIn;
}

/* ---------- sound cues ----------
   Every visual hit, in seconds, from the same constants the motion uses, so sound and picture cannot drift.
   A whoosh peaks at the moment of greatest motion: the middle of a smooth move, just after an arrival starts,
   as an exit ends. A tap lands as a popping element becomes visible; the chime lands where the falling dot
   first touches down. */
function firstArrival(ease, a, b) {
  for (let i = 0; i <= 1000; i++) if (ease(i / 1000) >= 1) return a + (b - a) * (i / 1000);
  return b;
}
window.CUES = [
  { t: 0.24, sound: 'whoosh', gain: 0.35 },                     // title lines rise
  { t: 1.875, sound: 'whoosh', gain: 0.55 },                    // hero video shrinks into the phone (smooth 1.55 to 2.2)
  { t: 4.42, sound: 'whoosh', gain: 0.5 },                      // booking arrives, landing slides to the fan
  { t: 5.46, sound: 'tap', gain: 0.95 },                        // tap ripple on Citation Latitude
  { t: 6.66, sound: 'whoosh', gain: 0.6 },                      // hard switch to midnight, phones fall at full speed
  { t: 7.5, sound: 'whoosh', gain: 0.45 },                      // dashboard rises
  { t: 8.96, sound: 'whoosh', gain: 0.55 },                     // dashboard tilts away, switch to light
  ...[0, 1, 2, 3].map((i) => ({ t: 9.39 + i * 0.12, sound: 'tap', gain: 0.4 })), // four parts pop in
  { t: 11.35, sound: 'whoosh', gain: 0.6 },                     // whip: components out, aircraft market in
  { t: 12.25, sound: 'whoosh', gain: 0.6 },                     // whip: aircraft out, hangars in
  { t: 13.05, sound: 'whoosh', gain: 0.5 },                     // into the end card
  { t: firstArrival(POP, 13.3, 13.8), sound: 'chime', gain: 0.85 }, // the logo dot lands
  { t: 15.1, sound: 'whoosh', gain: 0.5 },                      // end card lifts, credit rises
  { t: VISIT_AT + 0.04, sound: 'tap', gain: 0.85 },           // m2a-dev.de pill pops in
];

/* ---------- render ---------- */
window.render = function render(t) {
  // Backgrounds: light, a hard switch to midnight for the dashboard, back to light for the system.
  const dark = t >= 6.6 && t < 9.0;
  $('bgDark').style.opacity = dark ? '1' : '0';

  /* S1 hook 0 to 2.2: full-bleed video, title rises, underline draws; the frame morphs into the phone screen */
  const morph = SMOOTH(seg(t, 1.55, 2.2));
  const box = $('heroBox');
  box.style.display = t < 2.6 ? '' : 'none';
  css(box, {
    left: `${lerp(0, SCREEN.x, morph)}px`, top: `${lerp(0, SCREEN.y, morph)}px`, width: `${lerp(1080, SCREEN.w, morph)}px`, height: `${lerp(1920, SCREEN.h, morph)}px`,
    borderRadius: `${lerp(0, PW * 0.12, morph)}px`, opacity: String(1 - seg(t, 2.3, 2.6)),
  });
  $('vHero').style.transform = `scale(${lerp(1.14, 1, OUT(seg(t, 0, 2.0)))})`;
  $('heroScrim').style.opacity = String(1 - morph);
  const hc = $('hookCopy');
  hc.style.display = t < 2.0 ? '' : 'none';
  const hookOut = IN(seg(t, 1.45, 1.85));
  css($('hookKicker'), { opacity: String(OUT(seg(t, 0.05, 0.5)) * (1 - hookOut)) });
  ['hk1', 'hk2'].forEach((id, i) => css($(id), { transform: `translateY(${lerp(110, 0, OUT(seg(t, 0.12 + i * 0.12, 0.8 + i * 0.12))) - hookOut * 130}%)` }));
  const path = $('hookPath'), len = 560;
  css(path, { strokeDasharray: `${len}`, strokeDashoffset: `${len * (1 - OUT(seg(t, 0.6, 1.25)))}` });
  $('hookLine').style.opacity = String(1 - hookOut);

  /* S2 landing phone 2.0 to 4.4, then it becomes the left phone of the fan */
  const A = $('phA');
  A.style.display = t >= 2.0 && t < 6.75 ? '' : 'none';
  const fanA = SMOOTH(seg(t, 4.2, 4.85));
  const dropA = IN(seg(t, 6.3, 6.7));
  css(A, {
    opacity: String(seg(t, 2.0, 2.2)),
    transform: `translate3d(${260 + lerp(0, -330, fanA)}px, ${640 + lerp(0, 90, fanA) + dropA * 1500}px, 0) rotateX(${lerp(4, 0, fanA)}deg) rotateY(${lerp(0, -14, SMOOTH(seg(t, 2.0, 4.2))) * (1 - fanA)}deg) rotateZ(${lerp(0, -10, fanA)}deg) scale(${lerp(1, 0.8, fanA)})`,
  });
  $('phAScroll').style.transform = `translateY(${-lerp(0, 700, SMOOTH(seg(t, 2.55, 4.2))) * K}px)`;
  // Once the dark hero scrolls away, the status bar turns dark on a frosted strip, as on iOS.
  const aStatus = A.querySelector('.phone__status'), aScrolled = SMOOTH(seg(t, 2.55, 4.2)) * 700 > 260;
  aStatus.classList.toggle('is-light', !aScrolled);
  aStatus.classList.toggle('is-frosted', aScrolled);
  copyIn('copy2', t, 2.25, 4.1);

  /* S3 booking fan 4.3 to 6.7: booking slides in to centre, dashboard to the right; a tap selects Citation Latitude */
  const B = $('phB'), C = $('phC');
  B.style.display = t >= 4.25 && t < 6.8 ? '' : 'none';
  C.style.display = t >= 4.45 && t < 6.8 ? '' : 'none';
  const inB = OUT(seg(t, 4.3, 5.0)), dropB = IN(seg(t, 6.35, 6.75));
  css(B, { zIndex: 9, transform: `translate3d(${260 + lerp(820, 0, inB)}px, ${600 + dropB * 1500}px, 60px) rotateY(${lerp(-24, 0, inB)}deg) scale(1.02)` });
  B.querySelector('.phone__status').classList.add('is-frosted');
  $('phBScroll').style.transform = `translateY(${-lerp(560, BOOK_SCROLL, SMOOTH(seg(t, 4.5, 5.35))) * K}px)`;
  const inC = OUT(seg(t, 4.5, 5.2)), dropC = IN(seg(t, 6.25, 6.65));
  css(C, { zIndex: 7, transform: `translate3d(${260 + lerp(900, 330, inC)}px, ${730 + dropC * 1500}px, 0) rotateZ(${lerp(20, 10, inC)}deg) scale(0.8)` });
  const tap = seg(t, 5.45, 5.95);
  css($('ripple'), {
    opacity: String(tap > 0 && tap < 1 ? 1 - tap : 0),
    width: `${lerp(20, 520, OUT(tap))}px`, height: `${lerp(20, 520, OUT(tap))}px`,
    left: `${ROW.x * K + ROW.w * K * 0.55 - lerp(20, 520, OUT(tap)) / 2}px`, top: `${(ROW.y - BOOK_SCROLL + ROW.h / 2) * K - lerp(20, 520, OUT(tap)) / 2}px`,
  });
  const sel = POP(seg(t, 5.5, 5.9));
  css($('ring'), { opacity: String(seg(t, 5.5, 5.62)), transform: `scale(${lerp(0.94, 1, sel)})` });
  css($('radio'), { opacity: String(seg(t, 5.55, 5.65)), transform: `scale(${lerp(0.2, 1, sel)})` });
  copyIn('copy3', t, 4.45, 6.3);

  /* S4 dashboard 6.6 to 9.1 on midnight: the number counts, the laptop rises */
  const s4 = $('s4');
  s4.style.display = t >= 6.55 && t < 9.0 ? '' : 'none';
  const count = OUT(seg(t, 6.7, 7.6));
  $('num').textContent = '$' + (1.28 * count).toFixed(2) + 'M';
  const up = SMOOTH(seg(t, 7.45, 8.25)), exit4 = IN(seg(t, 8.6, 8.97));
  css($('numWrap'), { opacity: String(seg(t, 6.6, 6.8) * (1 - exit4)), transform: `translateY(${lerp(80, 0, OUT(seg(t, 6.6, 7.2))) - up * 380}px) scale(${lerp(1, 0.62, up)})` });
  const rise = OUT(seg(t, 7.4, 8.4));
  css($('dashBrowser'), {
    opacity: String(1 - exit4),
    transform: `translateY(${lerp(1300, 0, rise)}px) rotateX(${lerp(30, 12, rise) + exit4 * 43}deg) rotateZ(${exit4 * -45}deg) scale(${lerp(0.9, 1, rise) - exit4 * 0.2})`,
  });
  copyIn('copy4', t, 7.9, 8.55);

  /* S5 components 9.0 to 11.4 on light: the isometric plane pans, four heroes pop */
  const s5 = $('s5');
  s5.style.display = t >= 8.95 && t < 11.45 ? '' : 'none';
  const whip5 = IN(seg(t, 11.05, 11.4));
  css($('plane'), { transform: `rotateX(55deg) rotateZ(-45deg) translateX(${-lerp(0, 600, SMOOTH(seg(t, 9.0, 11.4)))}px)`, opacity: String(seg(t, 8.95, 9.2)) });
  HEROES.forEach((_, i) => {
    const p = POP(seg(t, 9.35 + i * 0.12, 9.85 + i * 0.12));
    css($(`hero${i}`), { opacity: String(seg(t, 9.35 + i * 0.12, 9.5 + i * 0.12)), transform: `translateX(${-whip5 * 1400}px) scale(${lerp(0.4, 1, p)})` });
  });
  s5.style.filter = whip5 > 0.05 && whip5 < 0.95 ? `blur(${whip5 * 10}px)` : 'none';
  copyIn('copy5', t, 9.1, 11.05);

  /* S6 marketplace 11.3 to 13.0: whip in, whip across, settle */
  const D = $('phD'), E = $('phE');
  D.style.display = t >= 11.25 && t < 12.6 ? '' : 'none';
  E.style.display = t >= 12.05 && t < 13.2 ? '' : 'none';
  const inD = OUT(seg(t, 11.3, 11.8)), outD = IN(seg(t, 12.05, 12.4));
  css(D, { zIndex: 9, transform: `translate3d(${260 + lerp(1100, 0, inD) - outD * 1300}px, 600px, 0) rotateY(${lerp(-30, 0, inD) + outD * 30}deg)`, filter: inD < 0.6 || outD > 0.2 ? 'blur(3px)' : 'none' });
  const inE = OUT(seg(t, 12.1, 12.6)), outE = IN(seg(t, 12.8, 13.1));
  css(E, { zIndex: 9, transform: `translate3d(${260 + lerp(1100, 0, inE)}px, ${600 - outE * 200}px, 0) rotateY(${lerp(-30, 0, inE)}deg) scale(${1 - outE * 0.5})`, opacity: String(1 - outE), filter: inE < 0.6 ? 'blur(3px)' : 'none' });
  copyIn('copy6a', t, 11.35, 12.0);
  copyIn('copy6b', t, 12.15, 12.85);

  /* S7 end card 12.9 to 15 */
  const s7 = $('s7');
  const endIn = seg(t, 12.85, 13.15);
  s7.style.display = t >= 12.85 && t < 15.3 ? '' : 'none';
  s7.style.opacity = String(endIn);
  // Hands over to the credit: the end card lifts away as the credit card rises after it (one continuous move).
  const lift = IN(seg(t, 14.85, 15.2));
  s7.style.transform = `translateY(${-lift * 1920}px)`;
  css($('endKicker'), { opacity: String(OUT(seg(t, 13.55, 13.95))), transform: `translateY(${lerp(16, 0, OUT(seg(t, 13.55, 14.0)))}px)` });
  [...'airiona'].forEach((_, i) => css($(`ch${i}`), { transform: `translateY(${lerp(115, 0, OUT(seg(t, 13.0 + i * 0.045, 13.6 + i * 0.045)))}%)` }));
  const drop = POP(seg(t, 13.3, 13.8));
  const pulse = t > 14.2 ? 1 + 0.12 * Math.sin(seg(t, 14.2, 15.0) * Math.PI) : 1;
  css($('endDot'), { transform: `translateY(${lerp(-420, 0, drop)}px) scale(${pulse})`, opacity: String(seg(t, 13.3, 13.4)) });
  css($('endUrl'), { opacity: String(OUT(seg(t, 13.75, 14.15))), transform: `translateY(${lerp(18, 0, OUT(seg(t, 13.75, 14.2)))}px)` });
  css($('endRule'), { transform: `scaleX(${OUT(seg(t, 13.9, 14.45))})` });

  /* S8 credit 15.0 to 18.5 */
  const s8 = $('s8');
  s8.style.display = t >= 14.9 ? '' : 'none';
  css(s8, { transform: `translateY(${lerp(1920, 0, OUT(seg(t, 14.95, 15.6)))}px)` });
  // Never still: the type drifts up slowly and the mint light wanders while the voice-over plays.
  const drift = SMOOTH(seg(t, 15.6, VO_START + 9));
  css($('crCopy'), { transform: `translateY(${-drift * 46}px)` });
  css($('crGlow'), { transform: `translate(${drift * 260}px, ${-drift * 180}px) scale(${1 + drift * 0.25})` });
  css($('crKicker'), { opacity: String(OUT(seg(t, 15.35, 15.75))), transform: `translateY(${lerp(18, 0, OUT(seg(t, 15.35, 15.8)))}px)` });
  ['cr1', 'cr2'].forEach((id, i) => css($(id), { transform: `translateY(${lerp(112, 0, OUT(seg(t, 15.45 + i * 0.1, 16.1 + i * 0.1)))}%)` }));
  css($('crRole'), { opacity: String(OUT(seg(t, 15.85, 16.3))), transform: `translateY(${lerp(22, 0, OUT(seg(t, 15.85, 16.35)))}px)` });
  css($('crRule'), { transform: `scaleX(${OUT(seg(t, 16.05, 16.7))})` });
  const mAt = Math.max(16.25, VISIT_AT - 0.45);
  css($('crMore'), { opacity: String(OUT(seg(t, mAt, mAt + 0.4))), transform: `translateY(${lerp(18, 0, OUT(seg(t, mAt, mAt + 0.45)))}px)` });
  const fAt = VISIT_AT + 0.5;
  css($('crFoot'), { opacity: String(OUT(seg(t, fAt, fAt + 0.5))), transform: `translateY(${lerp(24, 0, OUT(seg(t, fAt, fAt + 0.6)))}px)` });
  const pill = POP(seg(t, VISIT_AT, VISIT_AT + 0.55));
  const breathe = t > VISIT_AT + 0.75 ? 1 + 0.025 * Math.sin((t - VISIT_AT - 0.75) * Math.PI * 1.5) : 1;
  css($('crPill'), { opacity: String(seg(t, VISIT_AT, VISIT_AT + 0.15)), transform: `scale(${lerp(0.6, 1, pill) * breathe})` });

  // Videos follow the timeline exactly.
  return seekAll(t);
};

function seekTo(v, time) {
  const d = v.duration || 5;
  const target = ((time % d) + d) % d;
  if (Math.abs(v.currentTime - target) < 0.001) return Promise.resolve();
  return new Promise((res) => { v.addEventListener('seeked', res, { once: true }); v.currentTime = target; setTimeout(res, 800); });
}
function seekAll(t) {
  return Promise.all([seekTo($('vHero'), Math.max(0, t)), seekTo($('vWing'), Math.max(0, t - 12.85))]);
}
window.__videoReady = Promise.all([...document.querySelectorAll('video')].map((v) => (v.readyState >= 2 ? 0 : new Promise((r) => { v.addEventListener('loadeddata', r, { once: true }); setTimeout(r, 8000); }))));
