// Pixel parity between the React and Angular builds of every component (run tools/build-catalog.mjs first).
// Screenshots each component's React page and Angular solo page at the same width, with animations frozen at
// their end state, and diffs them. Exit 1 when any component differs beyond the threshold.
//   node tools/audit-parity.mjs [--width 860] [--only Ring,TabBar] [--threshold 0.002]
// Known live content: AnalogClock shows the current time, so its seconds hand always differs (ignored).
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import { serve } from './serve.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist/catalog');
const args = process.argv.slice(2);
const opt = (n, d) => (args.includes(`--${n}`) ? args[args.indexOf(`--${n}`) + 1] : d);
const WIDTH = +opt('width', 860);
const THRESHOLD = +opt('threshold', 0.002);
const LIVE = new Set(['AnalogClock']);
const OUT = join(ROOT, 'dist/parity');
const PORT = 4473;
// Videos are hidden: playback position differs between the two runs, the poster frame underneath does not.
const FREEZE = '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}video{visibility:hidden!important}';

const manifest = JSON.parse(readFileSync(join(DIST, 'data/manifest.json'), 'utf8'));
const only = opt('only') ? opt('only').split(',') : null;
const list = manifest.components.filter((c) => !only || only.includes(c.name));
mkdirSync(OUT, { recursive: true });
const server = await serve(DIST, PORT, { quiet: true });
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: WIDTH, height: 400 }, deviceScaleFactor: 1 });

async function shot(url) {
  const page = await ctx.newPage();
  try {
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.addStyleTag({ content: FREEZE });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1800);
    return PNG.sync.read(await page.screenshot({ fullPage: true }));
  } finally { await page.close(); }
}
const pad = (png, h) => { const o = new PNG({ width: WIDTH, height: h }); o.data.fill(255); PNG.bitblt(png, o, 0, 0, Math.min(png.width, WIDTH), png.height, 0, 0); return o; };

const results = [];
const queue = [...list];
await Promise.all(Array.from({ length: 4 }, async () => {
  while (queue.length) {
    const c = queue.shift();
    try {
      const r = await shot(`http://127.0.0.1:${PORT}/react/${c.name}.html`);
      const a = await shot(`http://127.0.0.1:${PORT}/ng/index.html?solo#${c.slug}`);
      const h = Math.max(r.height, a.height);
      const ra = pad(r, h), aa = pad(a, h), d = new PNG({ width: WIDTH, height: h });
      const px = pixelmatch(ra.data, aa.data, d.data, WIDTH, h, { threshold: 0.12 });
      const ratio = px / (WIDTH * h);
      if (ratio > THRESHOLD) {
        const o = new PNG({ width: WIDTH * 3 + 20, height: h }); o.data.fill(200);
        PNG.bitblt(ra, o, 0, 0, WIDTH, h, 0, 0); PNG.bitblt(aa, o, 0, 0, WIDTH, h, WIDTH + 10, 0); PNG.bitblt(d, o, 0, 0, WIDTH, h, WIDTH * 2 + 20, 0);
        writeFileSync(join(OUT, `${c.slug}.png`), PNG.sync.write(o));
      }
      results.push({ name: c.name, ratio, heights: [r.height, a.height] });
    } catch (e) { results.push({ name: c.name, error: e.message.split('\n')[0] }); }
  }
}));
await browser.close();
server.close();

results.sort((x, y) => (y.ratio ?? 1) - (x.ratio ?? 1));
writeFileSync(join(OUT, 'results.json'), JSON.stringify(results, null, 1));
const bad = results.filter((r) => r.error || (r.ratio > THRESHOLD && !LIVE.has(r.name)));
for (const r of results.slice(0, 8)) console.log(r.error ? `ERROR ${r.name}: ${r.error}` : `${(r.ratio * 100).toFixed(3)}% ${r.name} h=${r.heights.join('/')}${LIVE.has(r.name) ? ' (live clock)' : ''}`);
console.log(`parity @${WIDTH}px: ${results.length - bad.length}/${results.length} identical within ${(THRESHOLD * 100).toFixed(1)}%. Diff images: dist/parity/`);
if (bad.length) process.exit(1);
