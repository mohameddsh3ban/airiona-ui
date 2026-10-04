// `shoot`: builds the playground, opens the page at 390 (touch phone), 768 and 1280 px, saves full-page
// screenshots and runs the mobile-first checks. Errors fail the run; warnings go in the report.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';
import { PAGES, PLAYGROUND, ROOT } from './core.mjs';
import { serve } from '../../serve.mjs';

const VIEWPORTS = [
  { name: '390', width: 390, height: 844, touch: true, scale: 2 },
  { name: '768', width: 768, height: 1024, touch: true, scale: 1 },
  { name: '1280', width: 1280, height: 860, touch: false, scale: 1 },
];

/**
 * Builds the playground. With a slug, builds only that page (configuration "check": a routes file and tsconfig
 * limited to it), so one page's type error never blocks another page's check.
 */
export function buildPlayground(slug) {
  if (slug) {
    const app = join(ROOT, 'projects/playground');
    const page = join(PLAYGROUND, slug, `${slug}.page.ts`);
    const cls = (/^\/\/ @page \S+ (\w+)/m.exec(readFileSync(page, 'utf8')) || [])[1];
    writeFileSync(join(PLAYGROUND, 'pages.routes.check.ts'), `// Written by tools/page/lib/shoot.mjs for a single-page build. Not committed.\nimport { Routes } from '@angular/router';\n\nexport const PAGE_ROUTES: Routes = [\n  { path: '${slug}', loadComponent: () => import('./${slug}/${slug}.page').then((m) => m.${cls}) },\n];\n`);
    writeFileSync(join(app, 'tsconfig.check.json'), JSON.stringify({
      extends: './tsconfig.app.json',
      include: ['src/main.ts', 'src/app/*.ts', 'src/app/shared/**/*.ts', 'src/app/pages/pages.routes.check.ts', `src/app/pages/${slug}/**/*.ts`],
    }, null, 2) + '\n');
    try {
      execSync('npx ng build playground --configuration check --base-href ./ --output-path dist/playground', { stdio: 'inherit', cwd: ROOT });
    } finally {
      // The single-page files exist only for this build.
      rmSync(join(PLAYGROUND, 'pages.routes.check.ts'), { force: true });
      rmSync(join(app, 'tsconfig.check.json'), { force: true });
    }
    return;
  }
  execSync('npx ng build playground --configuration development --base-href ./ --output-path dist/playground', { stdio: 'inherit', cwd: ROOT });
}

/** Full-page captures draw fixed bars where the first screen ends; move them to the end of the page for the shot. */
async function fullPageShot(page, path) {
  await page.evaluate(() => {
    const h = document.documentElement.scrollHeight;
    for (const el of document.querySelectorAll('main.pg *')) {
      const cs = getComputedStyle(el);
      if (cs.position !== 'fixed' || cs.bottom === 'auto') continue;
      el.dataset.pgShot = el.getAttribute('style') || '';
      el.style.position = 'absolute';
      el.style.top = `${h - el.getBoundingClientRect().height}px`;
      el.style.bottom = 'auto';
    }
  });
  // Grow the viewport to the page instead of a beyond-viewport capture: Chromium composites blurred and animated
  // layers (glass cards, grain) wrongly in that mode. Restore the size afterwards.
  const vp = page.viewportSize();
  const full = await page.evaluate(() => document.documentElement.scrollHeight);
  if (vp && full > vp.height) { await page.setViewportSize({ width: vp.width, height: full }); await page.waitForTimeout(500); }
  await page.screenshot({ path, fullPage: true });
  if (vp && full > vp.height) await page.setViewportSize(vp);
  await page.evaluate(() => {
    for (const el of document.querySelectorAll('[data-pg-shot]')) { el.setAttribute('style', el.dataset.pgShot); delete el.dataset.pgShot; }
  });
}

/** The mobile-native option: the page in app mode inside the phone frame (#/native/<slug>), as native.png. */
async function shootNative(browser, port, spec, out, report) {
  const ctx = await browser.newContext({ viewport: { width: 540, height: 920 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(`http://127.0.0.1:${port}/index.html#/native/${spec.page}`, { waitUntil: 'networkidle' });
  const frame = page.frameLocator('iframe.pg-native__view');
  const ok = await frame.locator('main.pg').waitFor({ timeout: 15000 }).then(() => true, () => false);
  if (!ok) { report.errors.push('native: the page did not render inside the app frame'); await ctx.close(); return; }
  const handle = await page.$('iframe.pg-native__view');
  const inner = await handle.contentFrame();
  const native = await inner.evaluate(() => ({
    flag: document.documentElement.classList.contains('is-native'),
    sideways: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  }));
  if (!native.flag) report.errors.push('native: app mode (?native) was not applied inside the frame');
  if (native.sideways > 1) report.errors.push(`native: the app view scrolls sideways by ${native.sideways}px`);
  await page.waitForTimeout(1600);
  await page.locator('.pg-native__frame').screenshot({ path: join(out, 'native.png') });
  report.viewports.native = { width: 390, height: 844, sideways: native.sideways };
  await ctx.close();
}

export async function shoot(spec, { build = true, port = 4474 } = {}) {
  const { chromium } = await import('playwright');
  if (build) buildPlayground(spec.page);
  const out = join(PAGES, spec.page, 'shots');
  mkdirSync(out, { recursive: true });
  const server = await serve(join(ROOT, 'dist/playground/browser'), port, { quiet: true });
  const browser = await chromium.launch();
  // No timestamp: the report is committed next to the shots, and an unchanged page should leave no diff.
  const report = { page: spec.page, viewports: {}, errors: [], warnings: [] };
  try {
    for (const vp of VIEWPORTS) {
      const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: vp.scale, hasTouch: vp.touch });
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
      const metrics = await page.evaluate((vw) => {
        const visible = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
        const label = (el) => `${el.tagName.toLowerCase()}${el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : ''}${el.textContent ? ` "${el.textContent.trim().slice(0, 24)}"` : ''}`;
        // Measured against the configured width, not innerWidth (which a page that overflows can widen).
        const overflow = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - vw;
        const clipped = (el) => { for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) if (getComputedStyle(a).overflowX !== 'visible') return true; return false; };
        // Too wide: an element whose box, or whose content spilling out of a visible-overflow box, passes the edge.
        const reach = (el) => { const r = el.getBoundingClientRect(); return Math.max(r.right, getComputedStyle(el).overflowX === 'visible' ? r.left + el.scrollWidth : 0); };
        const over = overflow > 1 ? [...document.querySelectorAll('body *')].filter((el) => visible(el) && reach(el) > vw + 1 && !clipped(el)) : [];
        // Report the innermost culprits (the element that is actually too wide, not every ancestor it pushes).
        const wide = over.filter((el) => !over.some((o) => o !== el && el.contains(o))).slice(0, 5).map((el) => `${label(el).slice(0, 60)} (reaches ${Math.round(reach(el))}px)`);
        const targets = [...document.querySelectorAll('main.pg :is(button, a[href], input, select, textarea, [role=button], [role=tab], [role=radio], [role=switch], [role=checkbox], [role=option])')].filter(visible);
        // A visually hidden native input is operated through its label: measure the label.
        // A transparent ::before/::after with negative insets enlarges the hit area without changing the look.
        const box = (el) => {
          const lab = el.closest('label');
          let r = el.getBoundingClientRect();
          if (r.width <= 2 && lab) r = lab.getBoundingClientRect();
          let { left, top, right, bottom } = r;
          for (const ps of ['::before', '::after']) {
            const cs = getComputedStyle(el, ps);
            if (cs.content === 'none' || cs.position !== 'absolute') continue;
            const n = (v) => (v.endsWith('px') ? parseFloat(v) : 0);
            left = Math.min(left, r.left + n(cs.left)); top = Math.min(top, r.top + n(cs.top));
            right = Math.max(right, r.right - n(cs.right)); bottom = Math.max(bottom, r.bottom - n(cs.bottom));
          }
          return { width: right - left, height: bottom - top };
        };
        const small = targets.map((el) => { const r = box(el); return { el: label(el), w: Math.round(r.width), h: Math.round(r.height) }; }).filter((t) => Math.max(t.w, t.h) < 44 || Math.min(t.w, t.h) < 24);
        const tiny = [...document.querySelectorAll('main.pg *')].filter((el) => el.childNodes.length && [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) && visible(el) && parseFloat(getComputedStyle(el).fontSize) < 11).slice(0, 5).map(label);
        const fixed = [...document.querySelectorAll('main.pg *')].filter((el) => getComputedStyle(el).position === 'fixed' && visible(el));
        const h1s = [...document.querySelectorAll('main.pg h1')].filter(visible).map((h) => h.textContent.trim().slice(0, 40));
        const levels = [...document.querySelectorAll('main.pg :is(h1, h2, h3, h4)')].filter(visible).map((h) => +h.tagName[1]);
        const skips = levels.filter((l, i) => i > 0 && l > levels[i - 1] + 1).length;
        return { overflow, wide, small: small.slice(0, 12), smallCount: small.length, targetCount: targets.length, tiny, fixedCount: fixed.length, height: document.documentElement.scrollHeight, h1s, skips };
      }, vp.width);
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
      await fullPageShot(page, join(out, `${vp.name}.png`));
      const v = { ...metrics, covered, pageErrors: [...pageErrors] };
      report.viewports[vp.name] = v;
      if (pageErrors.length) report.errors.push(`${vp.name}px: script errors: ${pageErrors.slice(0, 3).join(' | ').slice(0, 300)}`);
      if (metrics.overflow > 1) report.errors.push(`${vp.name}px: page scrolls sideways by ${metrics.overflow}px: ${metrics.wide.join(', ') || 'an element wider than the screen'}`);
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
          // A form can span sections (fields in one, a sticky pay bar in another): click its submit wherever it
          // sits and look for its messages in every section of that form.
          const sels = (spec.sections || []).filter((x) => x.form === f.id).map((x) => `main.pg .pg-s--${x.id} form`);
          const res = await page.evaluate(async ({ expected, sels }) => {
            const forms = sels.map((q) => document.querySelector(q)).filter(Boolean);
            const btn = forms.map((fm) => [...fm.querySelectorAll('[type="submit"]')].find((b) => b.offsetParent !== null || getComputedStyle(b).position === 'fixed')).find(Boolean);
            if (!btn) return { error: 'no visible submit button in the form' };
            btn.click();
            await new Promise((r) => setTimeout(r, 400));
            // Count the spec's own messages that are now visible on the page.
            const text = forms.flatMap((fm) => [...fm.querySelectorAll('*')]).filter((e) => e.offsetParent !== null && e.childNodes.length && [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())).map((e) => e.textContent.trim());
            const msgs = expected.filter((m) => text.some((t) => t.includes(m)));
            const active = document.activeElement;
            return { msgs, focusInForm: !!active && forms.some((fm) => fm.contains(active)) && active !== btn, focused: active ? active.tagName.toLowerCase() + (active.getAttribute('aria-label') ? `[${active.getAttribute('aria-label')}]` : '') : null };
          }, { expected, sels });
          report.viewports[vp.name][`submit:${f.id}`] = res;
          if (res.error) report.errors.push(`form ${f.id}: ${res.error}`);
          else {
            if (required && res.msgs.length < required) report.errors.push(`form ${f.id}: empty submit showed ${res.msgs.length} messages for ${required} required fields`);
            if (required && !res.focusInForm) report.warnings.push(`form ${f.id}: focus did not move to the first invalid field (focused: ${res.focused})`);
          }
          await fullPageShot(page, join(out, `390-${f.id}-errors.png`));
        }
      }
      await ctx.close();
    }
    await shootNative(browser, port, spec, out, report);
  } finally {
    await browser.close();
    server.close();
  }
  writeFileSync(join(out, 'report.json'), JSON.stringify(report, null, 1));
  return report;
}
