// The eight Dribbble/Behance stills (1600x1200, rendered at 2x). Concepts and numbers from the art-direction brief.
const SHADOW = '0 60px 120px -30px rgba(10,15,36,.35), 0 20px 40px rgba(10,15,36,.12)';
const corner = (dark) => `<div class="abs" style="right:64px;bottom:52px;z-index:60">${wordmark(`font-size:30px;${dark ? 'color:#fff' : ''}`)}</div>`;
const tilt = (x, y, z, extra = '') => `rotateX(${x}deg) rotateY(${y}deg) rotateZ(${z}deg) ${extra}`;

const SHOTS = {
  /* 1. Wheels Up: one stage, three widths */
  'wheels-up': () => `
    <div id="stage" class="bg-light">
      ${glow(980, 640, 900, '#cfdcff', 0.7)}
      <div class="abs" style="left:80px;top:74px;z-index:5">
        <div class="kicker" style="color:#2b5cff;font-size:13px">Private aviation · Charter · Marketplace</div>
        <h1 class="display" style="font-size:60px;margin-top:16px;color:#0a0f24">The sky <span style="color:#2b5cff">is yours.</span></h1>
      </div>
      ${browser('flight-home', { w: 1250, x: 300, y: 250, cls: 'is-bare', t: tilt(8, -18, 2) })}
      ${phone('flight-booking', { w: 272, x: 120, y: 470, cls: 'is-bare', t: tilt(8, -18, 2, 'translateZ(140px)') })}
      ${phone('operator-dashboard', { w: 240, x: 1290, y: 300, cls: 'is-bare', t: tilt(8, -18, 2, 'translateZ(80px)') })}
      ${corner(false)}${grain()}
    </div>`,

  /* 2. Ten Pages: true isometric grid on midnight */
  'ten-pages': () => {
    const rows = [['flight-home', 'flight-booking', 'aircraft-market', 'aircraft-detail', 'hangar-market'], ['hangar-detail', 'operator-dashboard', 'login', 'signup', 'stay-checkout']];
    const cards = rows.map((r, ri) => r.map((s, ci) => `<div class="abs p3d" style="left:${ci * 464}px;top:${ri * 683}px;width:416px;height:635px;border-radius:24px;overflow:hidden;background:#fff;box-shadow:0 0 0 1px rgba(255,255,255,.08),40px 40px 80px rgba(0,0,0,.5);transform:translateZ(${(ri * 5 + ci) % 2 ? 60 : 0}px)">
        <img src="../captures/desk-full-${s}.png" style="width:100%;height:auto" alt=""></div>`).join('')).join('');
    return `
    <div id="stage" class="bg-dark" style="perspective:none;background:linear-gradient(160deg,#070b2a,#0a0f24)">
      ${glow(820, 80, 800, 'rgba(43,92,255,.35)', 1)}
      <div class="world" style="left:736px;top:660px;width:2272px;height:1318px;margin:-659px 0 0 -1136px;transform:rotateX(55deg) rotateZ(-45deg) scale(1.15)">${cards}</div>
      <div class="abs" style="inset:0;z-index:40;background:linear-gradient(35deg,rgba(7,11,42,.96) 0%,rgba(7,11,42,.82) 24%,rgba(7,11,42,0) 52%)"></div>
      <div class="abs" style="left:80px;bottom:110px;z-index:60">
        <h2 class="display" style="font-size:52px;color:#fff">Ten screens.<br>One system.</h2>
        <div style="margin-top:14px;font:500 17px/1 var(--sans);color:#8da8ff">Charter · Marketplace · Hangars · Operators</div>
      </div>
      ${corner(true)}${grain()}
    </div>`;
  },

  /* 3. Book. Buy. Operate.: the three-phone fan */
  'book-buy-operate': () => `
    <div id="stage" class="bg-light" style="background:#eceef2;perspective:2000px">
      ${glow(240, 260, 1120, '#dde7ff', 0.9)}
      <div class="abs" style="left:50%;top:612px;width:560px;height:560px;margin:-280px 0 0 -280px;border-radius:50%;box-shadow:inset 0 0 0 2px rgba(255,198,92,.55)"></div>
      <div class="abs" style="left:0;right:0;top:64px;text-align:center;z-index:5">
        <h1 class="display" style="font-size:54px;color:#0a0f24">Book. Buy. Operate.</h1>
        <div style="margin-top:12px;font:500 18px/1 var(--sans);color:rgba(10,15,36,.6)">One app. Three businesses.</div>
      </div>
      ${phone('flight-booking', { w: 320, x: 352, y: 290, cls: 'is-bare', t: 'rotateZ(-12deg) translateY(40px)' })}
      ${phone('operator-dashboard', { w: 320, x: 928, y: 290, cls: 'is-bare', t: 'rotateZ(12deg) translateY(40px)' })}
      ${phone('flight-home', { w: 320, x: 640, y: 250, cls: 'is-bare', t: 'scale(1.06) translateZ(60px)' })}
      ${corner(false)}${grain()}
    </div>`,

  /* 4. 128 Parts: the component wall with five floating heroes */
  'component-wall': () => {
    const thumbs = (window.THUMBS || []).slice(0, 128);
    const tiles = thumbs.map((t, i) => {
      const r = Math.floor(i / 16), c = i % 16;
      return `<div class="abs" style="left:${c * 224 + (r % 2 ? 112 : 0)}px;top:${r * 164}px;width:200px;height:140px;border-radius:20px;overflow:hidden;background:#fff;box-shadow:0 8px 24px rgba(10,15,36,.08)"><img src="../../dist/catalog-thumbs/${t}" style="width:100%;height:100%;object-fit:cover" alt=""></div>`;
    }).join('');
    const heroes = [['boarding-pass', 230, 330, 380], ['balance-chart', 600, 470, 420], ['segment-gauge', 1060, 300, 380], ['destination-card', 270, 720, 380], ['option-list', 960, 690, 420]]
      .map(([n, x, y, w]) => `<div class="card" style="left:${x}px;top:${y}px;width:${w}px;transform:translateZ(120px);box-shadow:${SHADOW};z-index:10"><img src="../../dist/catalog-thumbs/${n}.jpg" style="height:auto" alt=""></div>`).join('');
    return `
    <div id="stage" class="bg-light" style="background:linear-gradient(#fff,#eceef2);perspective:3000px">
      <div class="world" style="left:-560px;top:-120px;width:3700px;height:1400px;transform:rotateX(32deg) rotateZ(-8deg) scale(1.3) translateY(8%);-webkit-mask:linear-gradient(transparent 0,#000 15%,#000 90%,transparent);mask:linear-gradient(transparent 0,#000 15%,#000 90%,transparent)">${tiles}</div>
      ${heroes}
      <div class="abs" style="left:80px;top:70px;z-index:60">
        <h2 class="display" style="font-size:48px;color:#0a0f24">128 components.</h2>
        <div style="margin-top:12px;font:500 16px/1 var(--sans);color:#545b6e">Cards · Charts · Tickets · Gauges · Calendars</div>
      </div>
      ${corner(false)}${grain()}
    </div>`;
  },

  /* 5. Exploded hero: the landing page tilted, its badge, headline and search lifted off in depth */
  'exploded-hero': () => {
    const k = 1.12, ox = 120, oy = 50;
    // The empty slot a lifted layer leaves behind: canvas fill with a dashed Ion Blue outline.
    const socket = (sx, sy, sw, sh, r) => `<div class="abs" style="left:${(sx - ox) * k}px;top:${(sy - oy) * k}px;width:${sw * k}px;height:${sh * k}px;border-radius:${r}px;background:#eef1f7;box-shadow:inset 0 0 0 2px rgba(43,92,255,.35);outline:2px dashed rgba(43,92,255,.45);outline-offset:-2px;transform:translateZ(1px)"></div>`;
    const crop = (sx, sy, sw, sh, z, extra = '') => `<div class="abs" style="left:${(sx - ox) * k}px;top:${(sy - oy) * k}px;width:${sw * k}px;height:${sh * k}px;background:url(../captures/desk-flight-home.png) ${-sx * k}px ${-sy * k}px / ${1440 * k}px auto no-repeat;transform:translateZ(${z}px);${extra}"></div>`;
    return `
    <div id="stage" style="background:radial-gradient(110% 90% at 30% 10%,#fff,#eceef2 60%,#dfe3ec);perspective:2200px;perspective-origin:40% 45%">
      ${glow(900, 500, 900, '#cfdcff', 0.6)}
      <div class="world" style="left:150px;top:150px;width:${1200 * k}px;height:${820 * k}px;transform:rotateX(14deg) rotateY(-22deg) rotateZ(3deg)">
        <div class="abs" style="inset:0;border-radius:34px;overflow:hidden;background:url(../captures/desk-flight-home.png) ${-ox * k}px ${-oy * k}px / ${1440 * k}px auto no-repeat;box-shadow:0 0 0 1px rgba(10,15,36,.08),0 80px 140px -40px rgba(10,15,36,.4)"></div>
        ${socket(1118, 126, 160, 120, 24)}${socket(218, 646, 1004, 160, 30)}${socket(140, 180, 500, 400, 22)}
        ${crop(140, 180, 500, 400, 70, 'border-radius:22px;background-color:#eceef2;box-shadow:0 40px 80px -30px rgba(10,15,36,.35)')}
        ${crop(1118, 126, 160, 120, 190, 'border-radius:24px;box-shadow:0 50px 90px -24px rgba(10,15,36,.45)')}
        ${crop(218, 646, 1004, 160, 130, 'border-radius:30px;box-shadow:0 50px 90px -30px rgba(10,15,36,.4)')}
      </div>
      <div class="abs" style="left:80px;top:70px;z-index:60">
        <div class="kicker" style="color:#2b5cff;font-size:13px">Landing · exploded view</div>
        <h2 class="display" style="font-size:52px;margin-top:14px;color:#0a0f24">Built in layers.</h2>
      </div>
      ${corner(false)}${grain()}
    </div>`;
  },

  /* 6. Specimen: type and colour card */
  'specimen': () => {
    const sw = [['Canvas', '#eceef2', '#0a0f24'], ['Ink', '#0a0f24', '#fff'], ['Midnight', '#070b2a', '#fff'], ['Ion Blue', '#2b5cff', '#fff'], ['Blue 300', '#8da8ff', '#0a0f24'], ['Blue 50', '#eef3ff', '#0a0f24'], ['Gold', '#ffc65c', '#0a0f24']]
      .map(([n, c, t]) => `<div style="height:88px;border-radius:24px;background:${c};color:${t};display:flex;align-items:center;justify-content:space-between;padding:0 28px;font:600 17px/1 var(--sans);${c === '#eceef2' || c === '#eef3ff' ? 'box-shadow:inset 0 0 0 1px rgba(10,15,36,.08)' : ''}"><span>${n}</span><span style="font:500 15px/1 var(--mono);opacity:.75">${c}</span></div>`).join('');
    return `
    <div id="stage" style="background:#eceef2">
      <div class="card" style="left:80px;top:80px;width:1440px;height:1040px;border-radius:34px;box-shadow:0 30px 80px rgba(10,15,36,.10);display:grid;grid-template-columns:55% 45%;padding:72px;gap:56px;overflow:visible">
        <div style="display:flex;flex-direction:column;min-width:0">
          <div style="font:800 330px/.8 var(--display);letter-spacing:-.04em;color:#0a0f24">Aa</div>
          <div style="margin-top:34px;font:500 15px/1 var(--sans);color:#545b6e">Bricolage Grotesque, display · Geist, text</div>
          <div style="margin-top:36px;display:flex;flex-direction:column;gap:14px;color:#0a0f24">
            <div style="font:700 34px/1.1 var(--display);letter-spacing:-.03em">Charter · Marketplace · Hangars</div>
            <div style="font:400 20px/1.4 var(--sans)">Charter · Marketplace · Hangars</div>
            <div style="font:400 16px/1.4 var(--sans);color:#545b6e">Charter · Marketplace · Hangars</div>
            <div style="font:400 14px/1.4 var(--sans);color:#545b6e">Charter · Marketplace · Hangars</div>
          </div>
          <div style="margin-top:auto;display:flex;gap:18px;align-items:flex-end">
            ${[24, 28, 34].map((r) => `<div style="width:92px;height:92px;border-radius:${r}px;background:#eef3ff;box-shadow:inset 0 0 0 1px rgba(43,92,255,.2);display:grid;place-items:center;font:600 14px var(--mono);color:#1534b0">${r}</div>`).join('')}
            ${['0 1px 2px rgba(10,15,36,.06)', '0 12px 32px -12px rgba(10,15,36,.14)', '0 28px 64px -20px rgba(10,15,36,.3)'].map((s) => `<div style="width:92px;height:92px;border-radius:24px;background:#fff;box-shadow:${s},inset 0 0 0 1px rgba(10,15,36,.04)"></div>`).join('')}
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:14px">${sw}
          <div style="margin-top:auto;display:flex;align-items:baseline;justify-content:space-between">${wordmark('font-size:52px')}<span style="font:500 16px var(--sans);color:#545b6e">Light luxury.</span></div>
        </div>
      </div>
      ${grain()}
    </div>`;
  },

  /* 7. Night Approach: dark cinematic sign-in */
  'night-approach': () => `
    <div id="stage" style="background:#070b2a;perspective:2600px">
      <img class="abs" src="../../design-system/assets/photos/aviation/auth-wing.webp" style="inset:0;width:100%;height:100%;object-fit:cover;filter:blur(40px) saturate(1.2);opacity:.25" alt="">
      <div class="abs" style="inset:0;background:radial-gradient(70% 60% at 50% 55%,transparent 0,rgba(7,11,42,.85) 100%)"></div>
      <img class="abs" src="../captures/desk-login.png" style="left:240px;top:330px;width:1120px;filter:blur(60px);opacity:.4" alt="">
      <div class="abs" style="left:0;right:0;top:70px;text-align:center;z-index:5">
        <h1 class="display" style="font-size:56px;color:#fff">Wheels up at golden hour.</h1>
        <div style="margin-top:14px;font:500 16px/1 var(--sans);color:#8da8ff">Sign in · Sign up</div>
      </div>
      ${browser('login', { w: 1120, x: 240, y: 300, cls: 'is-dark', url: 'airiona.app/login', t: 'rotateX(12deg)', style: 'box-shadow:0 0 0 1px rgba(141,168,255,.25),0 80px 160px -40px rgba(0,0,0,.8);' })}
      ${phone('signup', { w: 256, x: 1180, y: 600, cls: 'is-bare on-dark', t: 'rotateX(12deg) rotateZ(6deg) translateZ(120px)' })}
      <div class="abs" style="left:64px;bottom:52px;z-index:60">${wordmark('font-size:30px;color:#fff')}</div>${grain()}
    </div>`,

  /* 8. End to End: every page as a full-length phone scroll on a tilted plane */
  'end-to-end': () => {
    const pages = ['flight-home', 'flight-booking', 'aircraft-market', 'aircraft-detail', 'hangar-detail', 'operator-dashboard', 'signup'];
    const strips = pages.map((p, i) => `<div class="abs" style="left:${i * 340}px;top:${i % 2 ? -260 : 0}px;width:300px;border-radius:38px;overflow:hidden;background:#fff;box-shadow:0 0 0 1px rgba(10,15,36,.06),30px 40px 80px -20px rgba(10,15,36,.3)"><img src="../captures/phone-full-${p}.png" style="width:100%;height:auto" alt=""></div>`).join('');
    return `
    <div id="stage" style="background:linear-gradient(120deg,#fff,#eceef2 55%,#dde4f5);perspective:none">
      ${glow(1000, 100, 800, '#cfdcff', 0.7)}
      <div class="world" style="left:-260px;top:-1100px;width:2400px;height:3200px;transform:rotateX(50deg) rotateZ(-30deg) scale(0.92)">${strips}</div>
      <div class="abs" style="inset:0;z-index:40;background:linear-gradient(35deg,rgba(236,238,242,.98) 0%,rgba(236,238,242,.85) 26%,rgba(236,238,242,0) 50%)"></div>
      <div class="abs" style="left:80px;bottom:96px;z-index:60">
        <div class="kicker" style="color:#2b5cff;font-size:13px">Native app · every screen</div>
        <h2 class="display" style="font-size:56px;margin-top:14px;color:#0a0f24">Every page,<br>end to end.</h2>
        <div style="margin-top:14px;font:500 16px/1 var(--sans);color:#545b6e">mohameddsh3ban.github.io/airiona-ui</div>
      </div>
      ${corner(false)}${grain()}
    </div>`;
  },

  /* 9-11. Product chapters: a desktop window with its phone app in front, one per product */
  'dubai-to-london': () => pair({ desk: 'flight-booking', ph: 'flight-booking', kicker: 'Charter · Booking', title: 'Dubai to London,<br>all-in.', tint: '#dde7ff', phoneOn: 'right' }),
  'aircraft-marketplace': () => pair({ desk: 'aircraft-detail', ph: 'aircraft-market', kicker: 'Aircraft marketplace', title: 'A Gulfstream G550,<br>one tap away.', tint: '#e8eefc', phoneOn: 'left' }),
  'hangar-marketplace': () => pair({ desk: 'hangar-detail', ph: 'hangar-market', kicker: 'Hangar marketplace', title: 'A roof for<br>the jet.', tint: '#fdf0d8', phoneOn: 'right' }),
};

function pair({ desk, ph, kicker, title, tint, phoneOn }) {
  const right = phoneOn === 'right';
  return `
    <div id="stage" style="background:radial-gradient(110% 90% at ${right ? '20%' : '80%'} 0%,#fff,#eceef2 58%,#dfe3ec);perspective:2600px">
      ${glow(right ? 900 : 100, 520, 900, tint, 0.9)}
      <div class="abs" style="${right ? 'left:80px' : 'right:80px;text-align:right'};top:76px;z-index:60">
        <div class="kicker" style="color:#2b5cff;font-size:13px">${kicker}</div>
        <h2 class="display" style="font-size:58px;margin-top:16px;color:#0a0f24">${title}</h2>
      </div>
      ${browser(desk, { w: 1180, x: right ? 110 : 310, y: 330, cls: 'is-bare', t: `rotateY(${right ? 10 : -10}deg) rotateX(4deg)` })}
      ${phone(ph, { w: 330, x: right ? 1150 : 120, y: 360, cls: 'is-bare', t: `rotateY(${right ? -14 : 14}deg) translateZ(160px)` })}
      ${corner(false)}${grain()}
    </div>`;
}
