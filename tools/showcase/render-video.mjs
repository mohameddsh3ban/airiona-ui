// Renders the 15s motion piece frame by frame from showcase/stage/video.html and encodes it with ffmpeg.
//   node tools/showcase/render-video.mjs              -> showcase/out/airiona-motion.mp4 (1080x1920, 30fps)
//   node tools/showcase/render-video.mjs --preview    -> a contact sheet of key frames in showcase/out/frames-preview
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { serve } from '../serve.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
// The end voice-over (showcase/audio/voiceover.json: start, duration, visit) sets the credit timing and the length.
const VO_FILE = join(ROOT, 'showcase/audio/voiceover.json');
const VO = existsSync(VO_FILE) ? JSON.parse(readFileSync(VO_FILE, 'utf8')) : null;
const FPS = 30, PORT = 4484;
const DURATION = VO ? Math.max(18.5, Math.ceil((VO.start + VO.duration + 1.1) * 10) / 10) : 18.5;
const QUERY = VO ? `?vo=${VO.start}&visit=${VO.visit}` : '';
const preview = process.argv.includes('--preview');
const FRAMES = join(ROOT, preview ? 'showcase/out/frames-preview' : 'showcase/out/frames');
rmSync(FRAMES, { recursive: true, force: true });
mkdirSync(FRAMES, { recursive: true });

const server = await serve(ROOT, PORT, { quiet: true });
const browser = await chromium.launch();
try {
  const ctx = await browser.newContext({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(`http://127.0.0.1:${PORT}/showcase/stage/video.html${QUERY}`, { waitUntil: 'load' });
  await page.evaluate(async () => { await document.fonts.ready; await window.__videoReady; while (!window.__planeReady) await new Promise((r) => setTimeout(r, 50)); });
  await page.evaluate(() => Promise.all([...document.images].map((i) => (i.complete ? i.decode().catch(() => 0) : new Promise((r) => { i.onload = i.onerror = r; })))));
  // The timeline publishes its sound cues; the mixer aligns each sound's peak to them.
  writeFileSync(join(ROOT, 'showcase/out/cues.json'), JSON.stringify(await page.evaluate(() => window.CUES), null, 1));
  const times = preview ? [14.6, 15.0, 15.2, 15.5, 15.8, 16.2, 16.6, 17.0, 18.2] : Array.from({ length: Math.round(FPS * DURATION) }, (_, i) => i / FPS);
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
  const out = join(ROOT, 'showcase/out/airiona-motion.mp4');
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-framerate', String(FPS), '-i', join(FRAMES, 'f%04d.jpg'), '-c:v', 'libx264', '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-crf', '16', '-preset', 'slow', '-movflags', '+faststart', out], { stdio: 'inherit' });
  console.log('wrote', out);
  execFileSync(process.execPath, [join(ROOT, 'tools/showcase/mix-audio.mjs'), out, String(DURATION)], { stdio: 'inherit' });
}
