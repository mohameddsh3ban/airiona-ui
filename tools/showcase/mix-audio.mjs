// Mixes the sound for the motion piece and muxes it onto the rendered video. Every effect is placed from the
// timeline's own cues (showcase/out/cues.json, written by render-video.mjs from window.CUES) and shifted by the
// measured position of its loudest moment inside the file, so the peak lands on the visual hit.
// The music bed runs underneath, ducked under the closing voice-over (showcase/audio/voiceover.json).
//   node tools/showcase/mix-audio.mjs [video.mp4] [durationSeconds]
//   node tools/showcase/mix-audio.mjs --stem out.wav [durationSeconds]   -> the effects alone, for checking sync
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, renameSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const A = (f) => join(ROOT, 'showcase/audio', f);
const STEM = process.argv[2] === '--stem' ? process.argv[3] : null;
const video = STEM ? null : process.argv[2] || join(ROOT, 'showcase/out/airiona-motion.mp4');
const END = Number(process.argv[STEM ? 4 : 3] || 18.5);
if (!existsSync(A('bed.mp3'))) { console.log('no showcase/audio/bed.mp3: leaving the video silent'); process.exit(0); }
const CUES = JSON.parse(readFileSync(join(ROOT, 'showcase/out/cues.json'), 'utf8'));
const VO_FILE = A('voiceover.json');
const VO = !STEM && existsSync(VO_FILE) ? JSON.parse(readFileSync(VO_FILE, 'utf8')) : null;

/** Seconds from the start of a sound file to its loudest 10 ms. */
function peakOffset(file) {
  const raw = execFileSync('ffmpeg', ['-v', 'error', '-i', file, '-f', 'f32le', '-ac', '1', '-ar', '48000', '-']);
  const x = new Float32Array(raw.buffer, raw.byteOffset, raw.byteLength / 4);
  const win = 480;
  let best = 0, at = 0, sum = 0;
  for (let i = 0; i < x.length; i++) {
    sum += Math.abs(x[i]);
    if (i >= win) sum -= Math.abs(x[i - win]);
    if (sum > best) { best = sum; at = i - win / 2; }
  }
  return Math.max(0, at) / 48000;
}
const sounds = [...new Set(CUES.map((c) => c.sound))];
const offset = Object.fromEntries(sounds.map((s) => [s, peakOffset(A(`${s}.mp3`))]));
console.log('peak offsets', Object.fromEntries(Object.entries(offset).map(([k, v]) => [k, v.toFixed(3)])));

const ms = (s) => Math.max(0, Math.round(s * 1000));
const inputs = [...(STEM ? ['-f', 'lavfi', '-i', `anullsrc=r=44100:cl=stereo:d=${END}`] : ['-i', video]), '-i', A('bed.mp3'), ...sounds.flatMap((s) => ['-i', A(`${s}.mp3`)]), ...(VO ? ['-i', A(VO.file)] : [])];
const idx = Object.fromEntries(sounds.map((s, i) => [s, i + 2]));
const parts = [`[1:a]atrim=0:${END},asetpts=PTS-STARTPTS,volume=0.72,afade=t=in:st=0:d=0.25,afade=t=out:st=${END - 1.4}:d=1.4[bed]`];
// Each sound feeds several cues: split it once per use.
for (const s of sounds) {
  const uses = CUES.filter((c) => c.sound === s).length;
  parts.push(`[${idx[s]}:a]aresample=44100,aformat=channel_layouts=stereo,asplit=${uses}${Array.from({ length: uses }, (_, i) => `[${s}${i}]`).join('')}`);
}
const used = Object.fromEntries(sounds.map((s) => [s, 0]));
const labels = CUES.map((c, i) => {
  const src = `${c.sound}${used[c.sound]++}`;
  const at = c.t - offset[c.sound];
  parts.push(`[${src}]volume=${c.gain},adelay=${ms(at)}|${ms(at)}[c${i}]`);
  return `[c${i}]`;
});
if (STEM) {
  // Silence (input 0) as the base, the bed decoded but left out.
  parts.push(`[bed]anullsink`, `[0:a]${labels.join('')}amix=inputs=${1 + labels.length}:normalize=0:duration=first[mix]`);
  execFileSync('ffmpeg', ['-y', '-v', 'error', ...inputs, '-filter_complex', parts.join(';'), '-map', '[mix]', STEM], { stdio: 'inherit' });
  console.log('effects stem written to', STEM);
  process.exit(0);
}
let bed = '[bed]', voLabel = '';
if (VO) {
  const vi = sounds.length + 2;
  parts.push(`[${vi}:a]aresample=44100,aformat=channel_layouts=stereo,volume=1.6,adelay=${ms(VO.start)}|${ms(VO.start)},apad=whole_dur=${END},asplit=2[vo][vosc]`);
  parts.push('[bed][vosc]sidechaincompress=threshold=0.02:ratio=8:attack=60:release=500:makeup=1[bedd]');
  bed = '[bedd]'; voLabel = '[vo]';
}
parts.push(`${bed}${labels.join('')}${voLabel}amix=inputs=${1 + labels.length + (VO ? 1 : 0)}:normalize=0:duration=first,alimiter=limit=0.95,atrim=0:${END}[mix]`);
const tmp = video.replace(/\.mp4$/, '.tmp.mp4');
execFileSync('ffmpeg', ['-y', '-v', 'error', ...inputs, '-filter_complex', parts.join(';'), '-map', '0:v', '-map', '[mix]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', tmp], { stdio: 'inherit' });
renameSync(tmp, video);
console.log(`mixed ${CUES.length} cues${VO ? ' and the voice-over' : ''} into`, video);
