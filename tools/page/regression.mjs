// Regression probes for the page pipeline: each probe states what must happen, runs it, and prints PASS/FAIL.
// Covers the findings of the first independent review (overflow on phones, multi-form submit, field inputs,
// responsive show/sticky, single-page builds, typed bind paths, html wiring, enum values).
//   node tools/page/regression.mjs
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { PAGES, PLAYGROUND, ROOT } from './lib/core.mjs';
import { lint } from './lib/lint.mjs';
import { scaffold, writeRoutes } from './lib/scaffold.mjs';
import { shoot } from './lib/shoot.mjs';

const results = [];
const probe = (name, ok, detail = '') => { results.push({ name, ok }); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${detail})` : ''}`); };
const clean = (slug) => { rmSync(join(PAGES, slug), { recursive: true, force: true }); rmSync(join(PLAYGROUND, slug), { recursive: true, force: true }); };

/* ---------- lint probes (mutations of the flight-home spec) ---------- */
const base = JSON.parse(readFileSync(join(PAGES, 'flight-home/page.spec.json'), 'utf8'));
const clone = () => JSON.parse(JSON.stringify(base));
const find = (s, id) => s.sections.flatMap((x) => x.elements).find((e) => e.id === id);
const lintProbe = (name, mutate, expect) => {
  const s = clone(); mutate(s);
  const r = lint(s);
  const hit = r.errors.some((e) => expect.test(e));
  probe(`lint: ${name}`, hit, hit ? '' : `errors: ${r.errors.slice(0, 2).join(' | ') || 'none'}`);
};
lintProbe('bind index outside the sample', (s) => { find(s, 'dealFeatured').bind.title = 'deals[7].title'; }, /index 7 but the sample has/);
lintProbe('bind to a field the type lacks', (s) => { find(s, 'dealFeatured').bind.title = 'deals[0].nope'; }, /has no field "nope"/);
lintProbe('string field feeding a union input', (s) => { s.types.Deal.tone = 'string'; }, /type the field "deals\[0\]\.tone" with that union/);
lintProbe('literal outside a union input', (s) => { const e = find(s, 'dealFeatured'); delete e.bind.tone; e.inputs = { ...(e.inputs || {}), tone: 'purple' }; }, /"purple" is not one of/);
lintProbe('item path outside each', (s) => { find(s, 'dealFeatured').bind.title = 'item.title'; }, /only defined inside an element with "each"/);
lintProbe('each over a non-list', (s) => { find(s, 'hotel').each = 'hotels[0]'; }, /not a list/);
lintProbe('item field the list type lacks', (s) => { find(s, 'hotel').bind.title = 'item.nope'; }, /has no field "nope"/);
lintProbe('bind on an html element', (s) => { s.sections.find((x) => x.id === 'deals').elements.push({ id: 'p1', component: 'html', tag: 'p', text: 'x', bind: { text: 'deals[0].text' } }); }, /html elements ignore "bind"/);
lintProbe('submit on an html element', (s) => { s.sections.find((x) => x.id === 'search').elements.push({ id: 'p2', component: 'html', tag: 'p', text: 'Search', submit: true }); }, /html elements ignore "submit"/);
lintProbe('sticky value typo', (s) => { s.sections[0].sticky = { base: 'botom' }; }, /"botom" is not one of/);
lintProbe('show value not boolean', (s) => { s.sections[0].show = { base: 'no' }; }, /true or false/);
lintProbe('unknown source kind', (s) => { s.source.kind = 'napkin'; }, /source.kind/);
lintProbe('unknown success kind', (s) => { s.forms[0].submit.success.kind = 'confetti'; }, /success.kind/);
lintProbe('navigate without to', (s) => { s.forms[0].submit.success = { kind: 'navigate' }; }, /needs "to"/);
lintProbe('gap for a missing element', (s) => { s.gaps.push({ element: 'ghost', need: 'x', nearest: 'y', proposal: 'z' }); }, /no element with this id/);
lintProbe('field twin with a component not listed', (s) => { find(s, 'tripTypeDesktop').component = 'Select'; }, /element is a Select/);
{
  const r = lint(clone());
  probe('lint: flight-home (field twin, each, intro) has no errors', r.errors.length === 0, r.errors.slice(0, 2).join(' | '));
}

/* ---------- build and browser probes ---------- */
const slug = 'zz-regression';
clean(slug);
mkdirSync(join(PAGES, slug), { recursive: true });
const spec = {
  page: slug, title: 'Regression probe', target: 'angular', source: { kind: 'brief' }, audience: 'test', primaryAction: 'test',
  types: { Row: { name: 'string' } },
  data: [{ name: 'rows', type: 'Row[]', source: 'test', sample: [{ name: 'Alpha' }, { name: 'Beta' }, { name: 'Gamma' }, { name: 'Delta' }], states: { loading: 'x', empty: 'No rows', error: 'x' } }],
  sections: [
    { id: 'wide', title: 'Wide', layout: { base: 'stack' }, elements: [{ id: 'longText', component: 'html', tag: 'p', text: 'W'.repeat(120) }] },
    { id: 'list', title: 'List', layout: { base: 'stack' }, elements: [{ id: 'row', component: 'Badge', each: 'rows', text: 'row', why: 'x' }] },
    { id: 'desk', title: 'Desk only', layout: { base: 'stack' }, elements: [{ id: 'deskBadge', component: 'Badge', text: 'Desktop', show: { base: false, lg: true }, why: 'x' }] },
    { id: 'formA', title: 'A', layout: { base: 'stack' }, form: 'a', elements: [
      { id: 'emailA', component: 'TextField', field: 'email' },
      { id: 'goA', component: 'Button', text: 'Send A', submit: true, why: 'x' },
    ] },
    { id: 'formB', title: 'B', layout: { base: 'stack' }, form: 'b', elements: [
      { id: 'nameB', component: 'TextField', field: 'name' },
      { id: 'goB', component: 'Button', text: 'Send B', submit: true, why: 'x' },
    ] },
    { id: 'bar', title: 'Bar', heading: false, layout: { base: 'stack' }, sticky: { base: 'bottom', lg: 'none' }, elements: [
      { id: 'actionBar', component: 'StickyActionBar', why: 'x', children: [{ id: 'barBtn', component: 'Button', text: 'Pay', why: 'x' }] },
    ] },
  ],
  forms: [
    { id: 'a', submit: { label: 'Send A', action: 'x', success: { kind: 'toast', title: 'Sent' }, failure: 'x' }, fields: [
      { name: 'email', label: 'Email', component: 'TextField', default: '', inputs: { type: 'email', autocomplete: 'email', inputMode: 'email' }, validators: [{ type: 'required' }], messages: { required: 'Enter an email A.' } }] },
    { id: 'b', submit: { label: 'Send B', action: 'x', success: { kind: 'toast', title: 'Sent' }, failure: 'x' }, fields: [
      { name: 'name', label: 'Name', component: 'TextField', default: '', inputs: { autocomplete: 'name' }, validators: [{ type: 'required' }], messages: { required: 'Enter a name B.' } }] },
  ],
  motion: [{ where: 'none', component: 'none', why: 'probe' }],
};
writeFileSync(join(PAGES, slug, 'page.spec.json'), JSON.stringify(spec, null, 2));
const lr = lint(spec);
probe('probe spec lints clean', lr.errors.length === 0, lr.errors.slice(0, 3).join(' | '));
scaffold(spec);

// A broken page next to it must not block this page's build (single-page builds).
const broken = join(PLAYGROUND, 'zz-broken');
mkdirSync(broken, { recursive: true });
writeFileSync(join(broken, 'zz-broken.page.ts'), "// @page zz-broken ZzBrokenPage \"Broken\"\nimport { Component } from '@angular/core';\n@Component({ selector: 'pg-zz-broken', template: `<p>{{ missing.prop }}</p>` })\nexport class ZzBrokenPage { readonly n: number = 'not a number'; }\n");
writeRoutes();

let report;
try {
  report = await shoot(spec, { build: true });
  probe('a broken sibling page does not block the build', true);
} catch (e) {
  probe('a broken sibling page does not block the build', false, e.message.split('\n')[0]);
}
if (report) {
  const has = (re) => report.errors.some((e) => re.test(e));
  probe('390: sideways scroll is reported', has(/^390px: page scrolls sideways/), report.errors.find((e) => /sideways/.test(e)) || 'no overflow error');
  probe('390: the wide element is named', /pg-el-longText/.test(report.errors.join(' ')));
  probe('second form: empty submit shows its own message', !report.errors.some((e) => /form b:/.test(e)), report.errors.filter((e) => /form/.test(e)).join(' | '));
  probe('both forms tested', !!report.viewports['390']['submit:a'] && !!report.viewports['390']['submit:b']);
  probe('report has no timestamp', report.at === undefined);

  // DOM probes on the built page.
  const { chromium } = await import('playwright');
  const { serve } = await import('../serve.mjs');
  const server = await serve(join(ROOT, 'dist/playground/browser'), 4470, { quiet: true });
  const browser = await chromium.launch();
  const at = async (width) => {
    const page = await (await browser.newContext({ viewport: { width, height: 900 } })).newPage();
    await page.goto(`http://127.0.0.1:4470/index.html#/${slug}`, { waitUntil: 'networkidle' });
    await page.waitForSelector('main.pg');
    return page;
  };
  const p390 = await at(390);
  const input = await p390.$eval('.pg-el-emailA input', (i) => ({ type: i.type, ac: i.getAttribute('autocomplete'), im: i.getAttribute('inputmode') }));
  probe('field-level inputs reach the control', input.type === 'email' && input.ac === 'email' && input.im === 'email', JSON.stringify(input));
  probe('field label falls back from the field', (await p390.textContent('.pg-el-nameB')).includes('Name'));
  probe('each renders every item', (await p390.$$('.pg-el-row')).length === 4);
  probe('desktop-only element hidden at 390', await p390.$eval('.pg-el-deskBadge', (e) => getComputedStyle(e).display === 'none').catch(() => true));
  const bar390 = await p390.$eval('.pg-s--bar', (e) => ({ pos: getComputedStyle(e).position, h: e.getBoundingClientRect().height }));
  probe('sticky bottom on phone: fixed with real height', bar390.pos === 'fixed' && bar390.h > 40, JSON.stringify(bar390));
  const p1280 = await at(1280);
  probe('desktop-only element visible at 1280', await p1280.$eval('.pg-el-deskBadge', (e) => getComputedStyle(e).display !== 'none'));
  const bar1280 = await p1280.$eval('.pg-s--bar', (e) => ({ pos: getComputedStyle(e).position, child: getComputedStyle(e.querySelector('.m-actionbar')).position }));
  probe('sticky "none" on desktop: back in the flow', bar1280.pos === 'static' && bar1280.child !== 'absolute' && bar1280.child !== 'fixed', JSON.stringify(bar1280));
  await browser.close();
  server.close();
}

clean(slug);
rmSync(broken, { recursive: true, force: true });
writeRoutes();
const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} probes passed`);
if (failed) process.exitCode = 1;
