// Captures the raw material for the showcase shots and video: every sample page on desktop (1440x900 at 2x,
// first screen and full length) and as a phone app (390x844 at 3x, first screen and full length).
//   npm run playground:build && node tools/showcase/capture.mjs
// Output: showcase/captures/{desk,desk-full,phone,phone-full}-<page>.png
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { serve } from '../serve.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const OUT = join(ROOT, 'showcase/captures');
const PAGES = ['flight-home', 'flight-booking', 'stay-checkout', 'login', 'signup', 'aircraft-market', 'aircraft-detail', 'hangar-market', 'hangar-detail', 'operator-dashboard'];
const PORT = 4481;

mkdirSync(OUT, { recursive: true });
const server = await serve(join(ROOT, 'dist/playground/browser'), PORT, { quiet: true });
const browser = await chromium.launch();

async function shoot(slug, { width, height, scale, native, prefix }) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: scale, hasTouch: native });
  const page = await ctx.newPage();
  await page.goto(`http://127.0.0.1:${PORT}/index.html${native ? '?native' : ''}#/${slug}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  // Let entrance animations finish and the hero video fade in; then park the page at the top.
  await page.waitForTimeout(3200);
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(300);
  await page.screenshot({ path: join(OUT, `${prefix}-${slug}.png`) });
  const full = await page.evaluate(() => document.documentElement.scrollHeight);
  await page.setViewportSize({ width, height: Math.min(full, 9000) });
  await page.waitForTimeout(900);
  await page.screenshot({ path: join(OUT, `${prefix}-full-${slug}.png`) });
  await ctx.close();
}

try {
  for (const slug of PAGES) {
    await shoot(slug, { width: 1440, height: 900, scale: 2, native: false, prefix: 'desk' });
    await shoot(slug, { width: 390, height: 844, scale: 3, native: true, prefix: 'phone' });
    console.log('captured', slug);
  }
} finally {
  await browser.close();
  server.close();
}
