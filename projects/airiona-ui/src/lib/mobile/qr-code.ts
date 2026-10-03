/**
 * A real QR encoder: byte mode (UTF-8), error correction M, versions 1–10, mask 0.
 * A line-for-line port of the React design system's encoder, which was verified module for module
 * against the reference `qrcode` library. Pure functions, no DOM.
 */

const QR_ECC = [10, 16, 26, 18, 24, 16, 18, 22, 22, 26];
const QR_BLOCKS = [1, 1, 1, 2, 2, 4, 4, 4, 5, 5];

function qrMul(x: number, y: number): number {
  let z = 0;
  for (let i = 7; i >= 0; i--) {
    z = (z << 1) ^ ((z >>> 7) * 0x11d);
    z ^= ((y >>> i) & 1) * x;
  }
  return z & 0xff;
}

function qrDivisor(deg: number): number[] {
  const r: number[] = [];
  let root = 1;
  for (let i = 0; i < deg; i++) r.push(0);
  r[deg - 1] = 1;
  for (let i = 0; i < deg; i++) {
    for (let j = 0; j < deg; j++) {
      r[j] = qrMul(r[j], root);
      if (j + 1 < deg) r[j] ^= r[j + 1];
    }
    root = qrMul(root, 2);
  }
  return r;
}

function qrRemainder(data: number[], div: number[]): number[] {
  const res = div.map(() => 0);
  data.forEach((b) => {
    const f = b ^ (res.shift() as number);
    res.push(0);
    div.forEach((c, i) => {
      res[i] ^= qrMul(c, f);
    });
  });
  return res;
}

function qrRaw(v: number): number {
  let r = (16 * v + 128) * v + 64;
  if (v >= 2) {
    const na = Math.floor(v / 7) + 2;
    r -= (25 * na - 10) * na - 55;
    if (v >= 7) r -= 36;
  }
  return r;
}

function qrAlign(v: number): number[] {
  if (v === 1) return [];
  const na = Math.floor(v / 7) + 2;
  const step = Math.ceil((v * 4 + 4) / (na * 2 - 2)) * 2;
  const res = [6];
  for (let i = 0, pos = v * 4 + 10; i < na - 1; i++, pos -= step) res.splice(1, 0, pos);
  return res;
}

function qrUtf8(text: string): number[] {
  const out: number[] = [];
  const str = unescape(encodeURIComponent(String(text)));
  for (let i = 0; i < str.length; i++) out.push(str.charCodeAt(i));
  return out;
}

/** Encodes `text` into a square matrix of dark (true) / light (false) modules, without the quiet zone. */
export function qrEncode(text: string): boolean[][] {
  let bytes = qrUtf8(text);
  let v: number;
  let cap = 0;
  for (v = 1; v <= 10; v++) {
    cap = (Math.floor(qrRaw(v) / 8) - QR_ECC[v - 1] * QR_BLOCKS[v - 1]) * 8;
    if (4 + (v < 10 ? 8 : 16) + 8 * bytes.length <= cap) break;
  }
  if (v > 10) {
    bytes = bytes.slice(0, 200);
    v = 10;
    cap = (Math.floor(qrRaw(10) / 8) - QR_ECC[9] * QR_BLOCKS[9]) * 8;
  }

  const bits: number[] = [];
  const put = (val: number, len: number) => {
    for (let i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1);
  };
  put(4, 4);
  put(bytes.length, v < 10 ? 8 : 16);
  bytes.forEach((b) => put(b, 8));
  put(0, Math.min(4, cap - bits.length));
  put(0, (8 - (bits.length % 8)) % 8);
  for (let pad = 0xec; bits.length < cap; pad ^= 0xec ^ 0x11) put(pad, 8);

  const data: number[] = [];
  for (let k = 0; k < bits.length; k += 8) {
    let by = 0;
    for (let q = 0; q < 8; q++) by = (by << 1) | bits[k + q];
    data.push(by);
  }

  const nb = QR_BLOCKS[v - 1];
  const ecl = QR_ECC[v - 1];
  const rawCw = Math.floor(qrRaw(v) / 8);
  const nShort = nb - (rawCw % nb);
  const shortLen = Math.floor(rawCw / nb);
  const div = qrDivisor(ecl);
  const blocks: number[][] = [];
  let at = 0;
  for (let bi = 0; bi < nb; bi++) {
    const dat = data.slice(at, at + shortLen - ecl + (bi < nShort ? 0 : 1));
    at += dat.length;
    const ecc = qrRemainder(dat, div);
    if (bi < nShort) dat.push(0);
    blocks.push(dat.concat(ecc));
  }
  const cw: number[] = [];
  for (let ci = 0; ci < blocks[0].length; ci++) {
    for (let bj = 0; bj < nb; bj++) if (ci !== shortLen - ecl || bj >= nShort) cw.push(blocks[bj][ci]);
  }

  const size = v * 4 + 17;
  const mod: boolean[][] = [];
  const fn: boolean[][] = [];
  for (let y = 0; y < size; y++) {
    mod.push([]);
    fn.push([]);
    for (let x = 0; x < size; x++) {
      mod[y].push(false);
      fn[y].push(false);
    }
  }
  const set = (px: number, py: number, dark: boolean) => {
    mod[py][px] = dark;
    fn[py][px] = true;
  };

  // Timing patterns.
  for (let t = 0; t < size; t++) {
    set(6, t, t % 2 === 0);
    set(t, 6, t % 2 === 0);
  }
  // Finder patterns with separators.
  [
    [3, 3],
    [size - 4, 3],
    [3, size - 4],
  ].forEach((c) => {
    for (let dy = -4; dy <= 4; dy++) {
      for (let dx = -4; dx <= 4; dx++) {
        const d = Math.max(Math.abs(dx), Math.abs(dy));
        const xx = c[0] + dx;
        const yy = c[1] + dy;
        if (xx >= 0 && xx < size && yy >= 0 && yy < size) set(xx, yy, d !== 2 && d !== 4);
      }
    }
  });
  // Alignment patterns.
  const al = qrAlign(v);
  const last = al.length - 1;
  al.forEach((ax, i) => {
    al.forEach((ay, j) => {
      if ((i === 0 && j === 0) || (i === 0 && j === last) || (i === last && j === 0)) return;
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) set(ax + dx, ay + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
      }
    });
  });

  // Format bits for error correction M (00) and mask 0.
  const fdata = 0;
  let rem = fdata;
  for (let fi = 0; fi < 10; fi++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
  const fb = ((fdata << 10) | rem) ^ 0x5412;
  const bit = (val: number, i: number) => ((val >>> i) & 1) !== 0;
  for (let a = 0; a <= 5; a++) set(8, a, bit(fb, a));
  set(8, 7, bit(fb, 6));
  set(8, 8, bit(fb, 7));
  set(7, 8, bit(fb, 8));
  for (let a = 9; a < 15; a++) set(14 - a, 8, bit(fb, a));
  for (let a = 0; a < 8; a++) set(size - 1 - a, 8, bit(fb, a));
  for (let a = 8; a < 15; a++) set(8, size - 15 + a, bit(fb, a));
  set(8, size - 8, true);

  // Version information (v7+).
  if (v >= 7) {
    let vr = v;
    for (let vi = 0; vi < 12; vi++) vr = (vr << 1) ^ ((vr >>> 11) * 0x1f25);
    const vb = (v << 12) | vr;
    for (let vk = 0; vk < 18; vk++) {
      const vv = bit(vb, vk);
      const va = size - 11 + (vk % 3);
      const vb2 = Math.floor(vk / 3);
      set(va, vb2, vv);
      set(vb2, va, vv);
    }
  }

  // Data placement in the zig-zag order.
  let bi2 = 0;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let vert = 0; vert < size; vert++) {
      for (let jj = 0; jj < 2; jj++) {
        const x = right - jj;
        const up = ((right + 1) & 2) === 0;
        const y = up ? size - 1 - vert : vert;
        if (!fn[y][x] && bi2 < cw.length * 8) {
          mod[y][x] = ((cw[bi2 >>> 3] >>> (7 - (bi2 & 7))) & 1) !== 0;
          bi2++;
        }
      }
    }
  }

  // Mask 0: (x + y) % 2 === 0.
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) if (!fn[y][x] && (x + y) % 2 === 0) mod[y][x] = !mod[y][x];
  }
  return mod;
}

/** One SVG path (`M x y h1v1h-1z` per dark module), offset by the quiet zone. */
export function qrPath(mod: boolean[][], quiet: number): string {
  const n = mod.length;
  let d = '';
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (mod[y][x]) d += 'M' + (x + quiet) + ' ' + (y + quiet) + 'h1v1h-1z';
  return d;
}
