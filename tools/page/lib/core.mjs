// Shared paths and lookups for the page pipeline.
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../../..');
export const PAGES = join(ROOT, 'docs/pages');
export const PLAYGROUND = join(ROOT, 'projects/playground/src/app/pages');
export const MANIFEST = join(ROOT, 'catalog/data/manifest.json');

let cached = null;
/** The component manifest; regenerated when missing. */
export function manifest() {
  if (cached) return cached;
  if (!existsSync(MANIFEST)) execFileSync(process.execPath, [join(ROOT, 'tools/gen-manifest.mjs')], { stdio: 'inherit' });
  cached = JSON.parse(readFileSync(MANIFEST, 'utf8'));
  return cached;
}
export const component = (name) => manifest().components.find((c) => c.name === name) || null;
export const componentNames = () => manifest().components.map((c) => c.name);

/** Closest component names for a typo, for "did you mean". */
export function nearestNames(name, n = 3) {
  const d = (a, b) => {
    a = a.toLowerCase(); b = b.toLowerCase();
    const m = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
    for (let j = 1; j <= b.length; j++) m[0][j] = j;
    for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) m[i][j] = Math.min(m[i - 1][j] + 1, m[i][j - 1] + 1, m[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return m[a.length][b.length];
  };
  return componentNames().map((x) => [x, d(name, x)]).sort((a, b) => a[1] - b[1]).slice(0, n).map((x) => x[0]);
}

/** Angular input names a component accepts, including the ones every form control inherits. */
export function angularInputs(c) {
  if (!c?.angular) return new Set();
  const names = new Set(c.angular.inputs.map((i) => i.name));
  if (c.angular.formControl) names.add('disabled');
  for (const h of c.angular.helpers || []) for (const i of h.inputs || []) names.add(i.name);
  return names;
}
export const angularOutputs = (c) => new Set((c?.angular?.outputs || []).map((o) => o.name));
export const reactProps = (c) => new Set((c?.react?.props || []).map((p) => p.name));

/** Host markup for an Angular component: `{ tag, attr }` (attr is the attribute selector, if any). */
export function angularHost(c) {
  const a = c.angular;
  if (a.tag && a.attr) return { tag: a.tag, attr: a.attr };
  if (a.tag) return { tag: a.tag, attr: null };
  return { tag: 'div', attr: a.attr };
}

export function specPath(slug) { return join(PAGES, slug, 'page.spec.json'); }
export function loadSpec(slug) {
  const p = specPath(slug);
  if (!existsSync(p)) throw new Error(`No spec at docs/pages/${slug}/page.spec.json. Start one with: node tools/page/airiona.mjs new ${slug}`);
  try { return JSON.parse(readFileSync(p, 'utf8')); } catch (e) { throw new Error(`docs/pages/${slug}/page.spec.json is not valid JSON: ${e.message}`); }
}

/** Every element in a spec, depth first, with its section and parent. */
export function* walkElements(spec) {
  for (const s of spec.sections || []) {
    const visit = function* (els, parent) {
      for (const el of els || []) {
        yield { el, section: s, parent };
        yield* visit(el.children, el);
      }
    };
    yield* visit(s.elements, null);
  }
}

export const pascal = (s) => s.replace(/(^|[-_ ]+)([a-z0-9])/gi, (_, __, c) => c.toUpperCase());
export const camel = (s) => { const p = pascal(s); return p[0].toLowerCase() + p.slice(1); };
export const BREAKPOINTS = { base: 0, md: 768, lg: 1280 };
export const LAYOUTS = ['stack', 'row', 'grid-2', 'grid-3', 'grid-4', 'split', 'sidebar', 'scroll-x', 'peek', 'carousel'];
export const VALIDATORS = ['required', 'requiredTrue', 'email', 'minLength', 'maxLength', 'min', 'max', 'pattern', 'phone', 'dateRange', 'futureDate', 'minAge', 'passport', 'postalCode'];
export const VALIDATOR_ARG = { minLength: 'number', maxLength: 'number', min: 'number', max: 'number', pattern: 'string', minAge: 'number' };
/** The error key Angular puts on a control for each validator type (what `messages` must be keyed by). */
export const errorKey = (type) => ({ minLength: 'minlength', maxLength: 'maxlength', requiredTrue: 'required' }[type] || type);
