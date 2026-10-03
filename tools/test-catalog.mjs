// End-to-end check of the built catalog in a real browser (run tools/build-catalog.mjs first).
// For every component in "Both" mode: both previews load and size themselves with no page errors, and the
// Code and API tabs show content for React and Angular. Then the controls: width, resolution, PNG export, search.
//   node tools/test-catalog.mjs [--only Ring,DatePicker]
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { serve } from './serve.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist/catalog');
const PORT = 4472;
const BASE = `http://127.0.0.1:${PORT}/`;
const args = process.argv.slice(2);
const only = args.includes('--only') ? args[args.indexOf('--only') + 1].split(',') : null;
const manifest = JSON.parse(readFileSync(join(DIST, 'data/manifest.json'), 'utf8'));
const list = manifest.components.filter((c) => !only || only.includes(c.name));

const server = await serve(DIST, PORT, { quiet: true });
const browser = await chromium.launch();
const failures = [];
const fail = (msg) => { failures.push(msg); };

async function newPage(fw = 'both') {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript((v) => { try { localStorage.setItem('airiona-catalog:fw', JSON.stringify(v)); localStorage.setItem('airiona-catalog:tab', '"code"'); } catch (e) {} }, fw);
  // Collect script errors inside every frame (the previews are iframes).
  await ctx.addInitScript(() => { window.__pageErrors = []; addEventListener('error', (e) => window.__pageErrors.push(String(e.message))); addEventListener('unhandledrejection', (e) => window.__pageErrors.push(String(e.reason))); });
  const page = await ctx.newPage();
  page._errors = [];
  page.on('pageerror', (e) => page._errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/favicon/.test(m.text())) page._errors.push(m.text()); });
  return page;
}

async function checkComponent(page, c) {
  page._errors.length = 0;
  await page.goto(`${BASE}#${c.slug}`);
  await page.waitForSelector('iframe[name="react"]');
  await page.waitForFunction(() => [...document.querySelectorAll('.cx-stage iframe')].every((f) => {
    const d = f.contentDocument; const st = d && (d.getElementById('root') || d.getElementById('solo-stage'));
    return st && st.getBoundingClientRect().height > 0 && parseFloat(f.style.height) >= 120;
  }), null, { timeout: 15000 }).catch(() => fail(`${c.name}: a preview did not render`));
  const frames = await page.evaluate(() => [...document.querySelectorAll('.cx-stage iframe')].map((f) => ({ name: f.name, h: parseFloat(f.style.height), errors: f.contentWindow.__errors || [] })));
  if (frames.length !== 2) fail(`${c.name}: expected 2 previews, got ${frames.length}`);
  // Angular must show the requested demo, not the fallback.
  const ngDemo = await page.frame({ name: 'angular' })?.evaluate(() => document.getElementById('solo-stage')?.getAttribute('data-demo'));
  if (ngDemo !== c.name) fail(`${c.name}: Angular frame shows ${ngDemo}`);
  for (const fw of ['react', 'angular']) {
    await page.click(`[data-codefw="${fw}"]`);
    const code = await page.textContent('#panel pre');
    if (!code || code.length < 60 || /No example yet/.test(code)) fail(`${c.name}: ${fw} code missing`);
    if (fw === 'react' && !code.includes("from '@airiona/react'")) fail(`${c.name}: React code lacks the package import`);
    if (fw === 'angular' && !code.includes("from '@airiona/ui'")) fail(`${c.name}: Angular code lacks the package import`);
  }
  await page.click('[data-tab="api"]');
  const api = await page.textContent('#panel');
  if (!api || api.length < 20) fail(`${c.name}: API tab empty`);
  await page.click('[data-tab="code"]');
  const frameErrors = [];
  for (const f of page.frames().filter((f) => f !== page.mainFrame())) {
    const errs = await f.evaluate(() => window.__pageErrors || []).catch(() => []);
    frameErrors.push(...errs);
  }
  if (frameErrors.length) fail(`${c.name}: preview errors: ${frameErrors.slice(0, 2).join(' | ').slice(0, 200)}`);
  if (page._errors.length) fail(`${c.name}: console/page errors: ${page._errors.slice(0, 2).join(' | ').slice(0, 200)}`);
}

let page = await newPage('both');
let n = 0;
for (const c of list) {
  try { await checkComponent(page, c); } catch (e) { fail(`${c.name}: ${e.message.split('\n')[0]}`); }
  if (++n % 30 === 0) { await page.context().close(); page = await newPage('both'); }
}
console.log(`components: ${list.length} checked in both frameworks`);

// Controls on one component.
if (!only || only.includes('Ring')) {
  await page.goto(`${BASE}#ring`);
  await page.waitForFunction(() => parseFloat(document.querySelector('iframe[name="react"]').style.height) > 120);
  await page.click('[data-width="390"]');
  const w = await page.evaluate(() => document.querySelector('iframe[name="react"]').style.width);
  if (w !== '390px') fail(`width control: got ${w}`);
  await page.click('[data-zoom="3"]');
  const z = await page.evaluate(() => document.querySelector('iframe[name="angular"]').style.zoom);
  if (z !== '3') fail(`resolution control: zoom ${z}`);
  await page.click('#export-png');
  await page.waitForSelector('#modal-body img', { timeout: 30000 }).catch(() => fail('export: no image'));
  const shots = await page.evaluate(() => [...document.querySelectorAll('#modal-body img')].map((i) => ({ w: i.naturalWidth, src: i.src.slice(0, 22) })));
  if (shots.length !== 2 || shots.some((s) => s.src !== 'data:image/png;base64,' || s.w < 300)) fail(`export: ${JSON.stringify(shots)}`);
  else console.log(`export: 2 PNGs at 3x, ${shots.map((s) => s.w + 'px wide').join(', ')}`);
  await page.click('#modal-close');
  await page.goto(`${BASE}#`);
  await page.fill('#search', 'check-in');
  const hits = await page.$$eval('#nav a', (as) => as.map((a) => a.textContent));
  if (!hits.includes('DatePicker')) fail(`search "check-in" missed DatePicker: ${hits.slice(0, 5).join(', ')}`);
  else console.log(`search: "check-in" -> ${hits.slice(0, 4).join(', ')}`);
  for (const view of ['foundations', 'exports', 'pipeline']) {
    await page.goto(`${BASE}#${view}`);
    const h1 = await page.textContent('main h1');
    if (!h1) fail(`${view} page empty`);
  }
  if (page._errors.length) fail(`controls: ${page._errors.slice(0, 2).join(' | ')}`);
}

await browser.close();
server.close();
if (failures.length) {
  console.log(`FAILED (${failures.length}):\n  ${failures.join('\n  ')}`);
  process.exit(1);
}
console.log('catalog: all checks passed');
