// `scaffold`: turns a page spec into an Angular page in the playground (template, styles, typed sample data,
// reactive forms with validators and messages, success flow). Regenerate from the spec instead of hand-editing.
import { mkdirSync, readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { PLAYGROUND, angularHost, camel, component, errorKey, pascal, walkElements } from './core.mjs';

const BPS = [['base', 0], ['md', 768], ['lg', 1280]];
const LAYOUT_CSS = {
  stack: 'display: grid; grid-template-columns: minmax(0, 1fr); grid-auto-flow: row;',
  row: 'display: flex; flex-wrap: wrap; align-items: center;',
  'grid-2': 'display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); grid-auto-flow: row;',
  'grid-3': 'display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); grid-auto-flow: row;',
  'grid-4': 'display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); grid-auto-flow: row;',
  split: 'display: grid; grid-template-columns: minmax(0, 2fr) minmax(0, 1fr); grid-auto-flow: row;',
  sidebar: 'display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 2fr); grid-auto-flow: row;',
  // Three cards per view from tablets up, swiping sideways; scroll-x is the phone version (one card and a peek).
  carousel: 'display: grid; grid-template-columns: none; grid-auto-flow: column; grid-auto-columns: calc((100% - 32px) / 3); overflow-x: auto; overscroll-behavior-x: contain; scroll-snap-type: x mandatory; scrollbar-width: none; margin-inline: 0; padding-inline: 0; padding-bottom: 6px;',
  'scroll-x': 'display: grid; grid-template-columns: none; grid-auto-flow: column; grid-auto-columns: min(80%, 320px); overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; margin-inline: -16px; padding-inline: 16px;',
};
const VALIDATOR_CODE = {
  required: () => 'Validators.required', requiredTrue: () => 'Validators.requiredTrue', email: () => 'Validators.email',
  minLength: (v) => `Validators.minLength(${v})`, maxLength: (v) => `Validators.maxLength(${v})`, min: (v) => `Validators.min(${v})`, max: (v) => `Validators.max(${v})`,
  pattern: (v) => `Validators.pattern(${JSON.stringify(v)})`, phone: () => 'phone', dateRange: () => 'dateRange', futureDate: () => 'futureDate()', minAge: (v) => `minAge(${v})`, passport: () => 'passport', postalCode: () => 'postalCode',
};
const CUSTOM = new Set(['phone', 'dateRange', 'futureDate', 'minAge', 'passport', 'postalCode']);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\{\{/g, '{{ "{{" }}').replace(/@/g, '&#64;').replace(/\{/g, '&#123;').replace(/\}/g, '&#125;');
const attrSafe = (s) => typeof s === 'string' && !/["\n{}@]/.test(s);

export function scaffold(spec) {
  const slug = spec.page;
  const Cls = `${pascal(slug)}Page`;
  const dir = join(PLAYGROUND, slug);
  mkdirSync(dir, { recursive: true });
  const imports = new Set();
  const typeImports = new Set();
  const fields = [];
  const methods = [];
  const css = [];
  const forms = new Map((spec.forms || []).map((f) => [f.id, f]));
  const validatorImports = new Set();
  const handlers = new Set();

  /* ---- literal input values become typed class fields ---- */
  function literalField(el, key, value) {
    const c = component(el.component);
    const input = c.angular.inputs.find((i) => i.name === key);
    const name = `${camel(el.id)}${pascal(key)}`;
    let type = input?.type || '';
    if (/\bT\b|=>|^$/.test(type)) type = '';
    for (const t of type.match(/\bAr[A-Z]\w*/g) || []) typeImports.add(t);
    fields.push(`  protected readonly ${name}${type ? `: ${type}` : ''} = ${JSON.stringify(value, null, 2).replace(/\n/g, '\n  ')};`);
    return name;
  }

  /* ---- template ---- */
  // Inside an `each` element, paths starting with "item" refer to the current list item.
  const bindExpr = (p) => (/^item(\.|\[|$)/.test(p) ? p : `data.${p}`);

  function renderEl(el, section, depth) {
    if (!el.each) return renderOne(el, section, depth);
    const pad = '  '.repeat(depth);
    const data = (spec.data || []).find((d) => d.name === String(el.each).split(/[.[]/)[0]);
    const empty = el.empty || data?.states?.empty || 'Nothing here yet.';
    return `${pad}@for (item of data.${el.each}; track $index) {\n${renderOne(el, section, depth + 1)}\n${pad}} @empty {\n${pad}  <p class="pg-empty pg-el-${el.id}">${esc(empty)}</p>\n${pad}}`;
  }

  function renderOne(el, section, depth) {
    const pad = '  '.repeat(depth);
    if (el.component === 'html') {
      const kids = (el.children || []).map((k) => renderEl(k, section, depth + 1)).join('\n');
      const cls = [el.class, `pg-el-${el.id}`].filter(Boolean).join(' ');
      if (el.tag === 'hr' || el.tag === 'img') return `${pad}<${el.tag} class="${cls}"${el.tag === 'img' ? ` src="${el.src || ''}" alt="${esc(el.alt || '')}"` : ''} />`;
      const href = el.tag === 'a' && el.href ? ` href="${el.href}"` : '';
      const slot = el.slot ? ` ${el.slot}` : '';
      return `${pad}<${el.tag}${slot} class="${cls}"${href}>${el.text ? esc(el.text) : ''}${kids ? `${el.text ? ' ' : ''}\n${kids}\n${pad}` : ''}</${el.tag}>`;
    }
    if (el.component === 'GAP') return `${pad}<!-- GAP ${el.id}: see gaps in the spec. Placeholder until the component exists. -->\n${pad}<div class="pg-gap pg-el-${el.id}">${esc(el.text || el.id)}</div>`;
    const c = component(el.component);
    imports.add(c.angular.className);
    const { tag, attr } = angularHost(c);
    const parts = [];
    if (attr) parts.push(attr);
    if (el.slot) parts.push(el.slot);
    parts.push(`class="pg-el-${el.id}"`);
    // Field-level inputs (keyboard, autofill) apply to every element that places the field; element inputs win.
    const fd = el.field ? (forms.get(section.form)?.fields || []).find((x) => x.name === el.field) : null;
    const inputs = { ...(fd?.inputs || {}), ...(el.inputs || {}) };
    if (fd?.label && inputs.label === undefined && c.angular.inputs.some((i) => i.name === 'label')) inputs.label = fd.label;
    for (const [k, v] of Object.entries(inputs)) {
      if (/^(aria-|data-|role$|title$|href$|target$|rel$|type$)/.test(k) && attrSafe(String(v))) { parts.push(`${k}="${v}"`); continue; }
      if (attrSafe(v)) parts.push(`${k}="${v}"`);
      else if (typeof v === 'number' || typeof v === 'boolean' || v === null) parts.push(`[${k}]="${v}"`);
      else parts.push(`[${k}]="${literalField(el, k, v)}"`);
    }
    for (const [k, p] of Object.entries(el.bind || {})) parts.push(`[${k}]="${bindExpr(p)}"`);
    if (el.field) {
      parts.push(`formControlName="${el.field}"`);
      if (c.angular.inputs.some((i) => i.name === 'error')) parts.push(`[error]="${camel(section.form)}Form.error('${el.field}')"`);
    }
    for (const [out, handler] of Object.entries(el.events || {})) {
      const h = camel(handler);
      handlers.add(h);
      parts.push(`(${out})="${h}($event)"`);
    }
    if (el.submit) {
      parts.push('type="submit"');
      if (c.angular.inputs.some((i) => i.name === 'loading')) parts.push(`[loading]="${camel(section.form)}Form.pending()"`);
    }
    const kids = (el.children || []).map((k) => renderEl(k, section, depth + 1)).join('\n');
    const inner = `${el.text ? esc(el.text) : ''}${kids ? `\n${kids}\n${pad}` : ''}`;
    const open = `${pad}<${tag} ${parts.join(' ')}`;
    const tagLine = open.length > 120 ? `${pad}<${tag}\n${parts.map((p) => `${pad}  ${p}`).join('\n')}\n${pad}` : `${open}`;
    const errorLine = el.field && !c.angular.inputs.some((i) => i.name === 'error')
      ? `\n${pad}@if (${camel(section.form)}Form.error('${el.field}'); as message) {\n${pad}  <p class="pg-error" role="alert">{{ message }}</p>\n${pad}}` : '';
    return (inner ? `${tagLine}>${inner}</${tag}>` : `${tagLine}${tagLine.endsWith('\n' + pad) ? '' : ' '}${/^(button|a)$/.test(tag) ? `></${tag}>` : '/>'}`) + errorLine;
  }

  const sectionsHtml = (spec.sections || []).map((s) => {
    const body = (s.elements || []).map((el) => renderEl(el, s, s.form ? 4 : 3)).join('\n');
    const heading = s.title && s.heading !== false ? `    <h2 class="pg-h m-title-2" id="pg-h-${s.id}">${esc(s.title)}</h2>\n` : '';
    const intro = s.intro ? `    <p class="pg-intro body">${esc(s.intro)}</p>\n` : '';
    const grid = s.form
      ? `    <form class="pg-g" [formGroup]="${camel(s.form)}" (ngSubmit)="submit${pascal(s.form)}()" novalidate>\n${body}\n    </form>`
      : `    <div class="pg-g">\n${body}\n    </div>`;
    return `  <section class="pg-s pg-s--${s.id}"${heading ? ` aria-labelledby="pg-h-${s.id}"` : s.title ? ` aria-label="${esc(s.title)}"` : ''}>\n${heading}${intro}${grid}\n  </section>`;
  }).join('\n\n');

  /* ---- forms ---- */
  const formDecls = [];
  for (const f of spec.forms || []) {
    const ctrls = (f.fields || []).map((fd) => {
      const vs = (fd.validators || []).map((v) => { if (CUSTOM.has(v.type)) validatorImports.add(v.type); return VALIDATOR_CODE[v.type](v.value); });
      const def = fd.default === undefined ? (fd.component === 'Checkbox' || fd.component === 'Switch' ? false : null) : fd.default;
      return `    ${fd.name}: [${JSON.stringify(def)}${def === null ? ' as unknown' : ''}, [${vs.join(', ')}]],`;
    }).join('\n');
    const msgs = Object.fromEntries((f.fields || []).map((fd) => [fd.name, Object.fromEntries(Object.entries(fd.messages || {}).map(([k, v]) => [errorKey(k) === k ? k : errorKey(k), v]))]));
    formDecls.push(`  protected readonly ${camel(f.id)} = this.fb.group({\n${ctrls}\n  });\n  protected readonly ${camel(f.id)}Form = pageForm(this.${camel(f.id)}, ${JSON.stringify(msgs, null, 2).replace(/\n/g, '\n  ')});`);
    const succ = f.submit?.success || {};
    let onValid = `      // ${f.submit?.action || 'Send the value to the server'}.${f.submit?.failure ? ` On failure: ${f.submit.failure}` : ''}\n      console.info('${f.id} submit', value);`;
    if (succ.kind === 'burst') { imports.add('ArDialog'); imports.add('ArSuccessBurst'); imports.add('ArButton'); fields.push(`  protected readonly ${camel(f.id)}Done = signal(false);`); onValid += `\n      this.${camel(f.id)}Done.set(true);`; }
    if (succ.kind === 'toast') { imports.add('ArToast'); fields.push(`  protected readonly ${camel(f.id)}Done = signal(false);`); onValid += `\n      this.${camel(f.id)}Done.set(true);`; }
    if (succ.kind === 'navigate') { fields.push('  private readonly router = inject(Router);'); onValid += `\n      void this.router.navigateByUrl(${JSON.stringify(succ.to || '/')});`; }
    methods.push(`  protected submit${pascal(f.id)}(): void {\n    this.${camel(f.id)}Form.submit((value) => {\n${onValid}\n    });\n  }`);
  }
  const successHtml = (spec.forms || []).map((f) => {
    const s = f.submit?.success || {};
    if (s.kind === 'burst') return `\n<ar-dialog [(open)]="${camel(f.id)}Done" [icon]="false" title="${esc(s.dialogTitle || s.title || 'Done')}">\n  <ar-success-burst title="${esc(s.title || 'Done')}">${esc(s.text || '')}</ar-success-burst>\n  <button arButton arFooter variant="primary" type="button" (click)="${camel(f.id)}Done.set(false)">${esc(s.action || 'Done')}</button>\n</ar-dialog>`;
    if (s.kind === 'toast') return `\n@if (${camel(f.id)}Done()) {\n  <div class="pg-toast"><ar-toast tone="success" title="${esc(s.title || 'Done')}" (closed)="${camel(f.id)}Done.set(false)">${esc(s.text || '')}</ar-toast></div>\n}`;
    return '';
  }).join('');

  /* ---- data ---- */
  // Type aliases, not interfaces: aliases are assignable to index-signature inputs such as DataTable rows.
  const typesTs = Object.entries(spec.types || {}).map(([n, fs]) => `export type ${n} = {\n${Object.entries(fs).map(([k, t]) => `  ${k}${/\?$/.test(t) ? '?' : ''}: ${String(t).replace(/\?$/, '').replace(/\bISODate\b/g, 'string')};`).join('\n')}\n};`).join('\n\n');
  const dataTs = `// Types and sample data for the ${spec.title} page. Generated from docs/pages/${slug}/page.spec.json.\n// Sources: ${(spec.data || []).map((d) => `${d.name} <- ${d.source || 'unspecified'}`).join('; ') || 'none'}.\n\n${typesTs}\n\nexport interface ${Cls}Data {\n${(spec.data || []).map((d) => `  ${d.name}: ${d.type};`).join('\n')}\n}\n\nexport const ${camel(slug).toUpperCase().replace(/-/g, '_')}_SAMPLE: ${Cls}Data = ${JSON.stringify(Object.fromEntries((spec.data || []).map((d) => [d.name, d.sample])), null, 2)};\n`;
  const sampleName = `${camel(slug).toUpperCase().replace(/-/g, '_')}_SAMPLE`;

  /* ---- styles: mobile first ---- */
  css.push(`/* ${spec.title}: generated from docs/pages/${slug}/page.spec.json. Mobile first: base is 390px, then 768 and 1280. */`);
  css.push(':host { display: block; }');
  css.push('.pg { --m-gutter: 16px; display: grid; gap: 28px; max-width: 1200px; margin: 0 auto; padding: 16px 16px 40px; }');
  css.push('.pg-s { min-width: 0; display: grid; gap: 12px; align-content: start; }');
  css.push('.pg-h { margin: 0; }');
  css.push('.pg-intro { color: var(--ink-muted); max-width: 65ch; }');
  css.push('.pg-g { min-width: 0; gap: 16px; }');
  css.push('.pg-g > * { min-width: 0; }');
  // Listing cards cap their width for standalone use; in a page grid they fill their cell. A custom property,
  // because it inherits through component encapsulation where a selector would not reach.
  css.push('.pg-g { --ar-card-max: none; }');
  css.push('.pg :is(h1, h2, h3, h4, p, ul, ol, figure) { margin: 0; }');
  css.push('.pg img { display: block; max-width: 100%; height: auto; }');
  css.push('.pg-error { margin: -8px 0 0; font: 500 13px/18px var(--font-sans); color: var(--danger); }');
  css.push('.pg-empty { margin: 0; padding: 16px; border-radius: 16px; background: var(--surface-sunken); color: var(--ink-muted); }');
  css.push('.pg-gap { padding: 16px; border-radius: 16px; border: 1.5px dashed var(--line-strong); color: var(--ink-subtle); font: 500 13px/18px var(--font-mono); }');
  css.push('.pg-link { font: 600 14px/20px var(--font-sans); color: var(--blue-700); text-decoration: none; justify-self: start; padding: 12px 0; }');
  css.push('.pg-link:hover { text-decoration: underline; }');
  css.push('.pg-divider { display: flex; align-items: center; gap: 12px; margin: 0; font: 500 13px/18px var(--font-sans); color: var(--ink-subtle); }');
  css.push('.pg-divider::before, .pg-divider::after { content: ""; flex: 1; height: 1px; background: var(--line); }');
  css.push('.pg-muted { color: var(--ink-muted); }');
  css.push('.pg-figure { display: grid; gap: 8px; align-content: start; }');
  css.push('.pg-photo { width: 100%; aspect-ratio: 16 / 10; object-fit: cover; border-radius: 24px; background: var(--surface-sunken); }');
  css.push('.pg-card { padding: 20px; border-radius: 28px; background: var(--surface); box-shadow: var(--shadow-float); }');
  css.push('.pg-sr-only { position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }');
  // canvas "full": the page draws its own frame edge to edge (an auth shell, a full-screen app view).
  if (spec.canvas === 'full') css.push('.pg { max-width: none; padding: 0; gap: 0; }', '.pg-s, .pg-g { gap: 0; }');
  css.push('.pg-toast { position: fixed; z-index: 60; left: 16px; right: 16px; top: calc(16px + env(safe-area-inset-top, 0px)); display: flex; justify-content: center; }');

  // Per-breakpoint values cascade upward (base -> md -> lg). RANGES are exclusive, so a value set at one breakpoint
  // and changed at the next never leaks into the other.
  const RANGES = { base: '(max-width: 767.98px)', md: '(min-width: 768px) and (max-width: 1279.98px)', lg: '(min-width: 1280px)' };
  const cascade = (obj, def) => { let v = def; return BPS.map(([bp]) => { if (obj && obj[bp] !== undefined) v = obj[bp]; return [bp, v]; }); };
  const byRange = { base: [], md: [], lg: [] };
  for (const s of spec.sections || []) {
    const sel = `.pg-s--${s.id}`;
    for (const [bp, shown] of cascade(s.show, true)) if (shown === false) byRange[bp].push(`${sel} { display: none !important; }`);
    const sticky = cascade(s.sticky, 'none');
    if (sticky.some(([, v]) => v !== 'none')) {
      // Components such as StickyActionBar position themselves for a phone frame; in a page the section does it,
      // so the bar has real height (the covered-content check can see it) and "none" really puts it back in the flow.
      css.push(`${sel} > .pg-g > * { position: relative; inset: auto; }`);
      for (const [bp, v] of sticky) {
        if (v === 'bottom') byRange[bp].push(`${sel} { position: fixed; z-index: 30; left: 0; right: 0; bottom: 0; }`, '.pg { padding-bottom: calc(132px + env(safe-area-inset-bottom, 0px)); }');
        if (v === 'top') byRange[bp].push(`${sel} { position: sticky; z-index: 20; top: env(safe-area-inset-top, 0px); }`);
      }
    }
  }
  for (const { el } of walkElements(spec)) for (const [bp, shown] of cascade(el.show, true)) if (shown === false) byRange[bp].push(`.pg-el-${el.id} { display: none !important; }`);

  const asides = (spec.sections || []).filter((s) => s.area?.lg === 'aside');
  for (const [bp, min] of BPS) {
    const rules = [];
    for (const s of spec.sections || []) {
      const sel = `.pg-s--${s.id}`;
      const lay = s.layout?.[bp];
      if (lay) rules.push(`${sel} > .pg-g { ${LAYOUT_CSS[lay]} }`);
      if (lay === 'scroll-x') rules.push(`${sel} > .pg-g > * { scroll-snap-align: start; }`);
      else if (s.layout?.[bp] && bp !== 'base' && s.layout.base === 'scroll-x') rules.push(`${sel} > .pg-g { overflow: visible; margin-inline: 0; padding-inline: 0; scroll-snap-type: none; }`);
      if (s.bleed?.[bp] === true) rules.push(`${sel} { margin-inline: ${bp === 'base' ? '-16px' : bp === 'md' ? '-24px' : '0'}; }`);
      if (s.bleed?.[bp] === false) rules.push(`${sel} { margin-inline: 0; }`);
    }
    for (const { el, section, parent } of walkElements(spec)) {
      const own = el.component === 'html' && el.layout?.[bp];
      if (own) rules.push(`.pg-el-${el.id} { ${LAYOUT_CSS[own]} gap: 16px; align-content: start; }`, `.pg-el-${el.id} > * { min-width: 0; }`);
      if (own === 'scroll-x' || own === 'carousel') rules.push(`.pg-el-${el.id} > * { scroll-snap-align: start; }`);
      // A span cascades upward like everything else, but in a one-column stack "span 2" would invent a second
      // column; there it means the full row.
      const span = cascade(el.span, null).find(([b]) => b === bp)[1];
      const container = parent?.component === 'html' && parent.layout ? parent.layout : section.layout;
      const isStack = cascade(container, 'stack').find(([b]) => b === bp)[1] === 'stack';
      if (span && isStack && (el.span?.[bp] !== undefined || container?.[bp] !== undefined)) rules.push(`.pg-el-${el.id} { grid-column: 1 / -1; }`);
      else if (span && el.span?.[bp] !== undefined) rules.push(`.pg-el-${el.id} { grid-column: ${span === 'full' ? '1 / -1' : `span ${span}`}; }`);
    }
    if (bp === 'md') rules.unshift('.pg { --m-gutter: 24px; padding-inline: 24px; gap: 32px; }');
    if (bp === 'lg') {
      rules.unshift('.pg { --m-gutter: 32px; padding-inline: 32px; padding-top: 32px; gap: 36px; }');
      if (asides.length) {
        // Rows at desktop: "full" sections span both columns and split the page into blocks; inside a block the
        // main sections stack in column 1 and the block's aside sits beside them in column 2, sticky.
        rules.push('.pg { grid-template-columns: minmax(0, 1fr) minmax(320px, 400px); column-gap: 40px; align-items: start; }');
        let row = 1, block = { start: 1, mains: 0, asides: [] };
        const close = () => {
          // Several asides in one block stack down column 2, one row each; the last takes the remaining rows and is
          // the sticky one (two sticky items in one column would slide over each other).
          const n = block.asides.length;
          block.asides.forEach((s, i) => {
            const last = i === n - 1;
            const span = last ? Math.max(1, block.mains - i) : 1;
            rules.push(`.pg > .pg-s--${s.id} { grid-column: 2; grid-row: ${block.start + i} / span ${span};${last ? ' position: sticky; top: 24px;' : ''} }`);
          });
        };
        for (const s of (spec.sections || []).filter((x) => cascade(x.show, true)[2][1] !== false)) {
          const area = s.area?.lg || 'main';
          if (area === 'full') { close(); if (block.mains === 0 && block.asides.length) row++; rules.push(`.pg > .pg-s--${s.id} { grid-column: 1 / -1; grid-row: ${row}; }`); row++; block = { start: row, mains: 0, asides: [] }; }
          else if (area === 'aside') block.asides.push(s);
          else { rules.push(`.pg > .pg-s--${s.id} { grid-column: 1; grid-row: ${row}; }`); row++; block.mains++; }
        }
        close();
      }
    }
    if (!rules.length) continue;
    css.push(min ? `@media (min-width: ${min}px) {\n  ${rules.join('\n  ')}\n}` : rules.join('\n'));
  }
  if (spec.canvas === 'full') css.push('@media (min-width: 768px) {\n  .pg { padding: 0; gap: 0; }\n}');
  for (const [bp, rules] of Object.entries(byRange)) if (rules.length) css.push(`@media ${RANGES[bp]} {\n  ${[...new Set(rules)].join('\n  ')}\n}`);

  /* ---- component ---- */
  const usesForms = (spec.forms || []).length > 0;
  const coreImports = ['ChangeDetectionStrategy', 'Component', ...(usesForms ? ['inject'] : []), ...((spec.forms || []).some((f) => ['burst', 'toast'].includes(f.submit?.success?.kind)) ? ['signal'] : [])];
  if ((spec.forms || []).some((f) => f.submit?.success?.kind === 'navigate') && !coreImports.includes('inject')) coreImports.push('inject');
  const handlerMethods = [...handlers].map((h) => {
    const notes = [...walkElements(spec)].filter(({ el }) => Object.values(el.events || {}).some((x) => camel(x) === h)).map(({ el }) => el.notes || el.why).filter(Boolean);
    return `  protected ${h}(event: unknown): void {\n    // ${notes[0] || 'Wire this to the app.'}\n    console.info('${h}', event);\n  }`;
  });
  const ts = `// @page ${slug} ${Cls} ${JSON.stringify(spec.title)}
// Generated by \`node tools/page/airiona.mjs scaffold ${slug}\` from docs/pages/${slug}/page.spec.json.
// Change the spec and regenerate; copy this folder into the product app once the page is signed off.
import { ${coreImports.join(', ')} } from '@angular/core';
${usesForms ? "import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';\n" : ''}${(spec.forms || []).some((f) => f.submit?.success?.kind === 'navigate') ? "import { Router } from '@angular/router';\n" : ''}import { ${[...imports].sort().join(', ')}${typeImports.size ? `, ${[...typeImports].filter((t) => !imports.has(t)).sort().map((t) => `type ${t}`).join(', ')}` : ''} } from '@airiona/ui';
${usesForms ? "import { pageForm } from '../../shared/page-form';\n" : ''}${validatorImports.size ? `import { ${[...validatorImports].sort().join(', ')} } from '../../shared/validators';\n` : ''}import { ${sampleName} } from './${slug}.data';

/** ${spec.title}. ${spec.primaryAction ? `Primary action: ${spec.primaryAction}.` : ''} */
@Component({
  selector: 'pg-${slug}',
  imports: [${usesForms ? 'ReactiveFormsModule, ' : ''}${[...imports].sort().join(', ')}],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './${slug}.page.html',
  styleUrl: './${slug}.page.css',
})
export class ${Cls} {
${usesForms ? '  private readonly fb = inject(FormBuilder);\n' : ''}  protected readonly data = ${sampleName};
${formDecls.join('\n')}
${fields.join('\n')}
${[...methods, ...handlerMethods].join('\n\n')}
}
`.replace(/\n{3,}/g, '\n\n');
  // Validators is only referenced when a field uses a built-in validator.
  const tsFinal = /Validators\./.test(ts) ? ts : ts.replace(', Validators }', ' }');
  const html = `<!-- ${spec.title}: generated from docs/pages/${slug}/page.spec.json -->\n<main class="ar pg">\n${sectionsHtml}\n</main>\n${successHtml}\n`;

  writeFileSync(join(dir, `${slug}.page.ts`), tsFinal);
  writeFileSync(join(dir, `${slug}.page.html`), html);
  writeFileSync(join(dir, `${slug}.page.css`), css.join('\n') + '\n');
  writeFileSync(join(dir, `${slug}.data.ts`), dataTs);
  writeRoutes();
  return { dir, files: [`${slug}.page.ts`, `${slug}.page.html`, `${slug}.page.css`, `${slug}.data.ts`] };
}

/** Rebuilds pages.routes.ts from every generated page folder. */
export function writeRoutes() {
  const pages = [];
  for (const d of readdirSync(PLAYGROUND, { withFileTypes: true }).filter((x) => x.isDirectory())) {
    const f = join(PLAYGROUND, d.name, `${d.name}.page.ts`);
    if (!existsSync(f)) continue;
    const m = /^\/\/ @page (\S+) (\w+) (".*")$/m.exec(readFileSync(f, 'utf8'));
    if (m) pages.push({ slug: m[1], cls: m[2], title: JSON.parse(m[3]) });
  }
  const routes = pages.map((p) => `  { path: '${p.slug}', title: ${JSON.stringify(p.title)}, loadComponent: () => import('./${p.slug}/${p.slug}.page').then((m) => m.${p.cls}) },`).join('\n');
  writeFileSync(join(PLAYGROUND, 'pages.routes.ts'), `// Generated by \`node tools/page/airiona.mjs scaffold <page>\`. Do not edit by hand.\nimport { Routes } from '@angular/router';\n\nexport const PAGE_ROUTES: Routes = [${routes ? `\n${routes}\n` : ''}];\n`);
}
