// Renders the 15s motion piece frame by frame from showcase/stage/video.html and encodes it with ffmpeg.
//   node tools/showcase/render-video.mjs              -> showcase/out/airiona-motion-15s.mp4 (1080x1920, 30fps)
//   node tools/showcase/render-video.mjs --preview    -> a contact sheet of key frames in showcase/out/frames-preview
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { serve } from '../serve.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const FPS = 30, DURATION = 15, PORT = 4484;
const preview = process.argv.includes('--preview');
const FRAMES = join(ROOT, preview ? 'showcase/out/frames-preview' : 'showcase/out/frames');
rmSync(FRAMES, { recursive: true, force: true });
mkdirSync(FRAMES, { recursive: true });

const server = await serve(ROOT, PORT, { quiet: true });
const browser = await chromium.launch();
try {
  const ctx = await browser.newContext({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(`http://127.0.0.1:${PORT}/showcase/stage/video.html`, { waitUntil: 'load' });
  await page.evaluate(async () => { await document.fonts.ready; await window.__videoReady; while (!window.__planeReady) await new Promise((r) => setTimeout(r, 50)); });
  await page.evaluate(() => Promise.all([...document.images].map((i) => (i.complete ? i.decode().catch(() => 0) : new Promise((r) => { i.onload = i.onerror = r; })))));
  const times = preview ? [0.6, 1.3, 1.9, 2.4, 3.6, 4.6, 5.3, 5.8, 6.9, 7.8, 8.6, 9.6, 10.6, 11.6, 12.3, 13.1, 13.7, 14.6] : Array.from({ length: FPS * DURATION }, (_, i) => i / FPS);
  for (const [i, t] of times.entries()) {
    await page.evaluate((tt) => window.render(tt), t);
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
    await page.locator('#stage').screenshot({ path: join(FRAMES, `f${String(i).padStart(4, '0')}.jpg`), type: 'jpeg', quality: 95 });
    if (!preview && i % 30 === 0) console.log(`frame ${i}/${times.length}`);
  }
} finally {
  await browser.close();
  server.close();
}
if (!preview) {
  const out = join(ROOT, 'showcase/out/airiona-motion-15s.mp4');
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-framerate', String(FPS), '-i', join(FRAMES, 'f%04d.jpg'), '-c:v', 'libx264', '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-crf', '16', '-preset', 'slow', '-movflags', '+faststart', out], { stdio: 'inherit' });
  console.log('wrote', out);
  execFileSync(process.execPath, [join(ROOT, 'tools/showcase/mix-audio.mjs'), out], { stdio: 'inherit' });
}
