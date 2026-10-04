// Renders the Dribbble/Behance stills from showcase/stage/shots.html into showcase/out/shots (3200x2400 JPEG).
//   node tools/showcase/capture.mjs   (once, after a playground build)
//   node tools/showcase/render.mjs [shot ...]
import { mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { serve } from '../serve.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const OUT = join(ROOT, 'showcase/out/shots');
const ALL = ['wheels-up', 'ten-pages', 'book-buy-operate', 'component-wall', 'exploded-hero', 'specimen', 'night-approach', 'end-to-end', 'dubai-to-london', 'aircraft-marketplace', 'hangar-marketplace'];
const only = process.argv.slice(2);
const PORT = 4482;

mkdirSync(OUT, { recursive: true });
writeFileSync(join(ROOT, 'showcase/stage/thumbs.json'), JSON.stringify(readdirSync(join(ROOT, 'dist/catalog-thumbs')).filter((f) => f.endsWith('.jpg')).sort()));
const server = await serve(ROOT, PORT, { quiet: true });
const browser = await chromium.launch();
try {
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 1200 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  for (const [i, name] of ALL.entries()) {
    if (only.length && !only.includes(name)) continue;
    await page.goto(`http://127.0.0.1:${PORT}/showcase/stage/shots.html?shot=${name}`, { waitUntil: 'networkidle' });
    await page.waitForSelector('body[data-ready="1"]', { timeout: 30000 });
    await page.waitForTimeout(400);
    const file = join(OUT, `${String(i + 1).padStart(2, '0')}-${name}.jpg`);
    await page.locator('#stage').screenshot({ path: file, type: 'jpeg', quality: 92 });
    console.log('rendered', file.replace(ROOT, '.'));
  }
} finally {
  await browser.close();
  server.close();
}
