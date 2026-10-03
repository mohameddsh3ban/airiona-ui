// Real-browser captures of the built catalog (run tools/build-catalog.mjs first).
//   node tools/shoot.mjs thumbs                                 card thumbnails -> dist/catalog-thumbs (copied into dist/catalog/thumbs)
//   node tools/shoot.mjs png [--scale 3] [--fw react|angular|both] [--only Ring,TabBar] [--out exports/png]
// PNGs show each component's settled state: entrance animations are run to their end before capture.
import { cpSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { serve } from './serve.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist/catalog');
const [mode = 'png', ...rest] = process.argv.slice(2);
const opt = (name, def) => { const i = rest.indexOf(`--${name}`); return i >= 0 ? rest[i + 1] : def; };
const FREEZE = '*,*::before,*::after{animation-play-state:paused!important;animation-delay:-60s!important;transition:none!important;caret-color:transparent!important}';
const PORT = 4471;

const { chromium } = await import('playwright').catch(() => {
  console.error('Playwright is not installed. Run: npm install (it is a devDependency) and npx playwright install chromium');
  process.exit(1);
});
const manifest = JSON.parse(readFileSync(join(DIST, 'data/manifest.json'), 'utf8'));
const only = opt('only') ? opt('only').split(',') : null;
const list = manifest.components.filter((c) => !only || only.includes(c.name));
const server = await serve(DIST, PORT, { quiet: true });
const browser = await chromium.launch();
const url = (c, fw) => (fw === 'react' ? `http://127.0.0.1:${PORT}/react/${c.name}.html` : `http://127.0.0.1:${PORT}/ng/index.html?solo#${c.slug}`);
const stageSel = (fw) => (fw === 'react' ? '#root' : '#solo-stage');

async function capture(ctx, c, fw, file, type) {
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  try {
    await page.goto(url(c, fw), { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1600);
    await page.addStyleTag({ content: FREEZE });
    await page.waitForTimeout(150);
    const el = await page.$(stageSel(fw));
    await el.screenshot({ path: file, type, ...(type === 'jpeg' ? { quality: 84 } : {}), animations: 'disabled' });
    return errors;
  } finally {
    await page.close();
  }
}

async function run(jobs, ctx, label) {
  let done = 0; const failures = [];
  const queue = [...jobs];
  await Promise.all(Array.from({ length: 4 }, async () => {
    while (queue.length) {
      const j = queue.shift();
      try {
        const errs = await capture(ctx, j.c, j.fw, j.file, j.type);
        if (errs.length) failures.push(`${j.c.name} (${j.fw}): ${errs[0]}`);
      } catch (e) { failures.push(`${j.c.name} (${j.fw}): ${e.message.split('\n')[0]}`); }
      done++;
    }
  }));
  console.log(`${label}: ${done - failures.length}/${done} captured`);
  if (failures.length) { console.log(failures.map((f) => '  ' + f).join('\n')); process.exitCode = 1; }
}

try {
  if (mode === 'thumbs') {
    // Thumbnails live in a cache next to the build so rebuilding the catalog keeps them.
    const dir = join(ROOT, 'dist/catalog-thumbs');
    mkdirSync(dir, { recursive: true });
    const ctx = await browser.newContext({ viewport: { width: 860, height: 600 }, deviceScaleFactor: 1.5 });
    await run(list.map((c) => ({ c, fw: 'react', file: join(dir, `${c.slug}.jpg`), type: 'jpeg' })), ctx, 'thumbnails');
    cpSync(dir, join(DIST, 'thumbs'), { recursive: true });
  } else if (mode === 'png') {
    const scale = Math.min(4, Math.max(1, +opt('scale', 2)));
    const fws = opt('fw', 'both') === 'both' ? ['react', 'angular'] : [opt('fw')];
    const out = resolve(ROOT, opt('out', 'exports/png'));
    const ctx = await browser.newContext({ viewport: { width: +opt('width', 860), height: 600 }, deviceScaleFactor: scale });
    for (const fw of fws) {
      mkdirSync(join(out, fw), { recursive: true });
      await run(list.map((c) => ({ c, fw, file: join(out, fw, `${c.slug}@${scale}x.png`), type: 'png' })), ctx, `${fw} PNG @${scale}x`);
    }
    console.log(`PNGs in ${out}`);
  } else {
    console.error(`unknown mode "${mode}". Use thumbs or png.`);
    process.exitCode = 1;
  }
} finally {
  await browser.close();
  server.close();
}
