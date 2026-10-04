// Mixes the sound for the motion piece and muxes it onto the rendered video: the music bed (first 15s, faded),
// a whoosh on every cut, a tap on the aircraft selection and a chime when the logo dot lands. Cue times match
// showcase/stage/video.js.
//   node tools/showcase/mix-audio.mjs [video.mp4]
import { execFileSync } from 'node:child_process';
import { existsSync, renameSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const A = (f) => join(ROOT, 'showcase/audio', f);
const video = process.argv[2] || join(ROOT, 'showcase/out/airiona-motion-15s.mp4');
if (!existsSync(A('bed.mp3'))) { console.log('no showcase/audio/bed.mp3: leaving the video silent'); process.exit(0); }

const WHOOSH = [1.25, 4.0, 6.05, 8.55, 10.85, 11.8, 12.65]; // whoosh starts, about 0.3s before each cut
const TAP = 5.45, CHIME = 13.6;
const inputs = ['-i', video, '-i', A('bed.mp3'), ...WHOOSH.flatMap(() => ['-i', A('whoosh.mp3')]), '-i', A('tap.mp3'), '-i', A('chime.mp3')];
const ms = (s) => Math.round(s * 1000);
const parts = ['[1:a]atrim=0:15,asetpts=PTS-STARTPTS,volume=0.72,afade=t=in:st=0:d=0.25,afade=t=out:st=13.9:d=1.1[bed]'];
WHOOSH.forEach((t, i) => parts.push(`[${i + 2}:a]volume=0.5,adelay=${ms(t)}|${ms(t)}[w${i}]`));
const tapIdx = WHOOSH.length + 2, chimeIdx = tapIdx + 1;
parts.push(`[${tapIdx}:a]volume=0.9,adelay=${ms(TAP)}|${ms(TAP)}[tap]`, `[${chimeIdx}:a]volume=0.85,adelay=${ms(CHIME)}|${ms(CHIME)}[chime]`);
parts.push(`[bed]${WHOOSH.map((_, i) => `[w${i}]`).join('')}[tap][chime]amix=inputs=${WHOOSH.length + 3}:normalize=0:duration=first,alimiter=limit=0.95,atrim=0:15[mix]`);
const tmp = video.replace(/\.mp4$/, '.tmp.mp4');
execFileSync('ffmpeg', ['-y', '-v', 'error', ...inputs, '-filter_complex', parts.join(';'), '-map', '0:v', '-map', '[mix]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', tmp], { stdio: 'inherit' });
renameSync(tmp, video);
console.log('mixed audio into', video);
