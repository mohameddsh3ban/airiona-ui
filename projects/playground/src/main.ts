import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// `?native` runs a page in app mode: the phone frame's status bar and home indicator become safe areas, and the
// browser behaviours an installed app does not have (scrollbars, tap flash, overscroll bounce) are switched off.
// The app view's frame is also named, for hosts that drop the query string.
const native = new URLSearchParams(location.search).has('native') || window.name === 'pg-native';
if (native) {
  document.documentElement.classList.add('is-native');
  watchStatusTone();
}

bootstrapApplication(App, appConfig).catch((err) => console.error(err));

/**
 * Tells the app frame whether the status bar should be light or dark, the way iOS does: sample what sits under the
 * status bar (a photo, a video or a dark surface means light text) and post it to the parent on load and scroll.
 */
function watchStatusTone(): void {
  if (window.parent === window) return;
  let last = '';
  const luminance = (css: string): number | null => {
    const m = /rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/.exec(css);
    if (!m || (m[4] !== undefined && Number(m[4]) < 0.5)) return null;
    const [r, g, b] = [m[1], m[2], m[3]].map((v) => Number(v) / 255);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const sample = (): 'light' | 'dark' => {
    for (const el of document.elementsFromPoint(window.innerWidth / 2, 22)) {
      if (el.matches('img, video, picture') || el.closest('.ar-split__shape, .ar-landing__media, .m-hero__bg')) return 'light';
      const l = luminance(getComputedStyle(el).backgroundColor);
      if (l !== null) return l < 0.45 ? 'light' : 'dark';
    }
    return 'dark';
  };
  const send = () => {
    const tone = sample();
    if (tone === last) return;
    last = tone;
    window.parent.postMessage({ type: 'pg-status', tone }, location.origin);
  };
  let queued = false;
  const queue = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; send(); });
  };
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('hashchange', () => setTimeout(send, 400));
  window.addEventListener('load', () => setTimeout(send, 300));
  setTimeout(send, 800);
}
