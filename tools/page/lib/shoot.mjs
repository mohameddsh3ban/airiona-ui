// `shoot`: builds the playground, opens the page at 390 (touch phone), 768 and 1280 px, saves full-page
// screenshots and runs the mobile-first checks. Errors fail the run; warnings go in the report.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';
import { PAGES, ROOT } from './core.mjs';
import { serve } from '../../serve.mjs';

const VIEWPORTS = [
  { name: '390', width: 390, height: 844, mobile: true },
  { name: '768', width: 768, height: 1024, mobile: true },
  { name: '1280', width: 1280, height: 860, mobile: false },
];

export function buildPlayground() {
  execSync('npx ng build playground --configuration development --base-href ./ --output-path dist/playground', { stdio: 'inherit', cwd: ROOT });
}

export async function shoot(spec, { build = true, port = 4474 } = {}) {
  const { chromium } = await import('playwright');
  if (build) buildPlayground();
  const out = join(PAGES, spec.page, 'shots');
  mkdirSync(out, { recursive: true });
  const server = await serve(join(ROOT, 'dist/playground/browser'), port, { quiet: true });
  const browser = await chromium.launch();
  const report = { page: spec.page, at: new Date().toISOString(), viewports: {}, errors: [], warnings: [] };
  try {
    for (const vp of VIEWPORTS) {
      const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 2, isMobile: vp.mobile, hasTouch: vp.mobile });
      const page = await ctx.newPage();
      const pageErrors = [];
      page.on('pageerror', (e) => pageErrors.push(e.message));
      page.on('console', (m) => { if (m.type() === 'error') pageErrors.push(m.text()); });
      await page.goto(`http://127.0.0.1:${port}/index.html#/${spec.page}`, { waitUntil: 'networkidle' });
      await page.waitForSelector('main.pg', { timeout: 15000 }).catch(() => pageErrors.push('page did not render <main class="pg">'));
      await page.evaluate(() => document.fonts.ready);
      // Scroll through once so entrances triggered by scrolling into view run, as they would for a visitor.
      await page.evaluate(async () => {
        for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * 0.8) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 160)); }
        scrollTo(0, 0);
      });
      await page.waitForTimeout(1400);
      const metrics = await page.evaluate(() => {
        const vw = innerWidth;
        const visible = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
        const label = (el) => `${el.tagName.toLowerCase()}${el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : ''}${el.textContent ? ` "${el.textContent.trim().slice(0, 24)}"` : ''}`;
        const overflow = document.documentElement.scrollWidth - vw;
        const wide = overflow > 1 ? [...document.querySelectorAll('main.pg *')].filter((el) => { const r = el.getBoundingClientRect(); return r.right > vw + 1 && visible(el) && !el.closest('[style*="overflow"], .m-snap, .m-chips, .pg-g'); }).slice(0, 5).map(label) : [];
        const targets = [...document.querySelectorAll('main.pg :is(button, a[href], input, select, textarea, [role=button], [role=tab], [role=radio], [role=switch], [role=checkbox], [role=option])')].filter(visible);
        // A visually hidden native input is operated through its label: measure the label.
        const box = (el) => { const r = el.getBoundingClientRect(); const lab = el.closest('label'); return r.width <= 2 && lab ? lab.getBoundingClientRect() : r; };
        const small = targets.map((el) => { const r = box(el); return { el: label(el), w: Math.round(r.width), h: Math.round(r.height) }; }).filter((t) => Math.max(t.w, t.h) < 44 || Math.min(t.w, t.h) < 24);
        const tiny = [...document.querySelectorAll('main.pg *')].filter((el) => el.childNodes.length && [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) && visible(el) && parseFloat(getComputedStyle(el).fontSize) < 11).slice(0, 5).map(label);
        const fixed = [...document.querySelectorAll('main.pg *')].filter((el) => getComputedStyle(el).position === 'fixed' && visible(el));
        const h1s = [...document.querySelectorAll('main.pg h1')].filter(visible).map((h) => h.textContent.trim().slice(0, 40));
        const levels = [...document.querySelectorAll('main.pg :is(h1, h2, h3, h4)')].filter(visible).map((h) => +h.tagName[1]);
        const skips = levels.filter((l, i) => i > 0 && l > levels[i - 1] + 1).length;
        return { overflow, wide, small: small.slice(0, 12), smallCount: small.length, targetCount: targets.length, tiny, fixedCount: fixed.length, height: document.documentElement.scrollHeight, h1s, skips };
      });
      // Content hidden behind a fixed bottom bar once scrolled to the end.
      const covered = await page.evaluate(() => {
        scrollTo(0, document.documentElement.scrollHeight);
        const bars = [...document.querySelectorAll('main.pg *')].filter((el) => getComputedStyle(el).position === 'fixed').map((el) => el.getBoundingClientRect()).filter((r) => r.bottom >= innerHeight - 2 && r.height > 0);
        if (!bars.length) return [];
        const top = Math.min(...bars.map((r) => r.top));
        const content = [...document.querySelectorAll('main.pg .pg-s > .pg-g > *')].filter((el) => getComputedStyle(el.closest('.pg-s')).position !== 'fixed');
        return content.filter((el) => { const r = el.getBoundingClientRect(); return r.height > 0 && r.bottom > top + 4 && r.top < innerHeight; }).slice(0, 3).map((el) => el.className.toString().split(' ').find((c) => c.startsWith('pg-el-')) || el.tagName.toLowerCase());
      });
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({ path: join(out, `${vp.name}.png`), fullPage: true });
      const v = { ...metrics, covered, pageErrors: [...pageErrors] };
      report.viewports[vp.name] = v;
      if (pageErrors.length) report.errors.push(`${vp.name}px: script errors: ${pageErrors.slice(0, 3).join(' | ').slice(0, 300)}`);
      if (vp.mobile && metrics.overflow > 1) report.errors.push(`${vp.name}px: page scrolls sideways by ${metrics.overflow}px (${metrics.wide.join(', ') || 'find the wide element'})`);
      if (vp.name === '390') {
        const bad = metrics.small.filter((t) => Math.min(t.w, t.h) < 24);
        if (bad.length) report.errors.push(`390px: ${bad.length} tap targets under 24px: ${bad.slice(0, 4).map((t) => `${t.el} ${t.w}x${t.h}`).join(', ')}`);
        const meh = metrics.small.filter((t) => Math.min(t.w, t.h) >= 24);
        if (meh.length) report.warnings.push(`390px: ${meh.length} tap targets under 44px on their long side: ${meh.slice(0, 4).map((t) => `${t.el} ${t.w}x${t.h}`).join(', ')}`);
        if (metrics.tiny.length) report.warnings.push(`390px: text under 11px: ${metrics.tiny.join(', ')}`);
      }
      if (metrics.h1s.length !== 1) report.warnings.push(`${vp.name}px: ${metrics.h1s.length} visible h1 headings (${metrics.h1s.join(' | ') || 'none'}); a page has exactly one`);
      if (metrics.skips) report.warnings.push(`${vp.name}px: heading levels skip ${metrics.skips} time(s) (for example h1 then h3)`);
      if (covered.length) report.warnings.push(`${vp.name}px: content ends under the fixed bottom bar: ${covered.join(', ')}`);

      // Forms: an empty submit must show messages and move focus to the first invalid field.
      if (vp.name === '390' && (spec.forms || []).length) {
        for (const f of spec.forms) {
          const required = (f.fields || []).filter((fd) => (fd.validators || []).some((x) => x.type === 'required' || x.type === 'requiredTrue') && (fd.default === undefined || fd.default === null || fd.default === '')).length;
          const expected = (f.fields || []).flatMap((fd) => Object.values(fd.messages || {}));
          const res = await page.evaluate(async (expected) => {
            const form = document.querySelector('main.pg form');
            const btn = form?.querySelector('[type="submit"]');
            if (!btn) return { error: 'no submit button in the form' };
            btn.click();
            await new Promise((r) => setTimeout(r, 400));
            // Count the spec's own messages that are now visible on the page.
            const text = [...form.querySelectorAll('*')].filter((e) => e.offsetParent !== null && e.childNodes.length && [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())).map((e) => e.textContent.trim());
            const msgs = expected.filter((m) => text.some((t) => t.includes(m)));
            const active = document.activeElement;
            return { msgs, focusInForm: !!active && form.contains(active) && active !== btn, focused: active ? active.tagName.toLowerCase() + (active.getAttribute('aria-label') ? `[${active.getAttribute('aria-label')}]` : '') : null };
          }, expected);
          report.viewports[vp.name][`submit:${f.id}`] = res;
          if (res.error) report.errors.push(`form ${f.id}: ${res.error}`);
          else {
            if (required && res.msgs.length < required) report.errors.push(`form ${f.id}: empty submit showed ${res.msgs.length} messages for ${required} required fields`);
            if (required && !res.focusInForm) report.warnings.push(`form ${f.id}: focus did not move to the first invalid field (focused: ${res.focused})`);
          }
          await page.screenshot({ path: join(out, `390-${f.id}-errors.png`), fullPage: true });
        }
      }
      await ctx.close();
    }
  } finally {
    await browser.close();
    server.close();
  }
  writeFileSync(join(out, 'report.json'), JSON.stringify(report, null, 1));
  return report;
}
