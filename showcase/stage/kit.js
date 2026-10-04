// Showcase kit helpers: build device frames around the captures in showcase/captures.
const CAP = '../captures/';
// Pages whose first screen is dark under the status bar (light status text).
const LIGHT_STATUS = new Set(['flight-home', 'login', 'signup']);
const STATUS_ICONS = '<svg viewBox="0 0 68 12"><rect x="0" y="7" width="3" height="5" rx="1"/><rect x="5" y="5" width="3" height="7" rx="1"/><rect x="10" y="2.5" width="3" height="9.5" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/><path d="M33 3.2a9.2 9.2 0 0 1 6.5 2.7l1.3-1.3A11 11 0 0 0 33 1.4a11 11 0 0 0-7.8 3.2l1.3 1.3A9.2 9.2 0 0 1 33 3.2zm0 3.6a5.6 5.6 0 0 1 4 1.6l1.3-1.3A7.4 7.4 0 0 0 33 5a7.4 7.4 0 0 0-5.3 2.1L29 8.4a5.6 5.6 0 0 1 4-1.6zm0 3.6c.6 0 1.1.2 1.5.6L33 12.4l-1.5-1.4c.4-.4.9-.6 1.5-.6z"/><rect x="45" y="1" width="20" height="10" rx="3" fill="none" stroke="currentColor" stroke-width="1.2"/><rect x="47" y="3" width="16" height="6" rx="1.6"/><rect x="66" y="4" width="1.6" height="4" rx=".8"/></svg>';

/** A phone around the app capture of `slug`. opts: w, x, y, style, cls, full (use the full-length capture), video. */
function phone(slug, opts = {}) {
  const w = opts.w || 320;
  const light = opts.light ?? LIGHT_STATUS.has(slug);
  const src = `${CAP}phone-${opts.full ? 'full-' : ''}${slug}.png`;
  const media = opts.full
    ? `<img class="scroll" src="${src}" alt="" ${opts.scrollId ? `id="${opts.scrollId}"` : ''}>`
    : `<img src="${src}" alt="">`;
  return `<div class="phone ${opts.cls || ''}" style="--w:${w}px;${pos(opts)}${opts.style || ''}" ${opts.id ? `id="${opts.id}"` : ''}>
    <div class="phone__screen">${media}${opts.overlay || ''}
      <div class="phone__status ${light ? 'is-light' : ''}"><span>9:41</span>${STATUS_ICONS}</div>
      <i class="phone__island"></i><i class="phone__home"></i></div></div>`;
}

/** A browser window around the desktop capture of `slug`. opts: w, x, y, style, cls, url, full. */
function browser(slug, opts = {}) {
  const w = opts.w || 1100;
  const src = `${CAP}desk-${opts.full ? 'full-' : ''}${slug}.png`;
  const url = opts.url || `airiona.app/${slug === 'flight-home' ? '' : slug}`;
  return `<div class="browser ${opts.cls || ''}" style="--w:${w}px;${pos(opts)}${opts.style || ''}" ${opts.id ? `id="${opts.id}"` : ''}>
    <div class="browser__bar"><i></i><i></i><i></i><span class="browser__url">${url}</span></div>
    <div class="browser__screen"><img src="${src}" alt="" ${opts.scrollId ? `id="${opts.scrollId}"` : ''} style="${opts.full ? 'height:auto;' : ''}">${opts.overlay || ''}</div></div>`;
}

function pos(o) {
  return `${o.x !== undefined ? `left:${o.x}px;` : ''}${o.y !== undefined ? `top:${o.y}px;` : ''}${o.t ? `transform:${o.t};` : ''}`;
}

const grain = () => '<div class="grain"></div>';
const glow = (x, y, size, color, opacity = 0.6) => `<i class="glow" style="left:${x}px;top:${y}px;width:${size}px;height:${size}px;background:${color};opacity:${opacity}"></i>`;
const wordmark = (extra = '') => `<span class="wordmark" style="${extra}">airiona<i>.</i></span>`;
