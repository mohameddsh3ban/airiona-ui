// Builds the component manifest: one record per component with its React and Angular API, usage notes,
// motion, and copy-ready code for both frameworks. Feeds the catalog and the page-conversion skill.
//   node tools/gen-manifest.mjs   -> catalog/data/manifest.json + docs/components/INDEX.md
import { mkdirSync, readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DS = join(ROOT, 'design-system/components');
const LIB = join(ROOT, 'projects/airiona-ui/src/lib');
const DEMOS = join(ROOT, 'projects/showcase/src/app/demos');

const read = (p) => readFileSync(p, 'utf8').replace(/\r\n/g, '\n');
const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? walk(join(dir, d.name)) : [join(dir, d.name)]));
const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([A-Z])([A-Z][a-z])/g, '$1-$2').toLowerCase();

/* ---------- balanced scanning helpers ---------- */
const OPEN = { '{': '}', '(': ')', '[': ']', '<': '>' };
/** Index just past the bracket that closes the one at `start`. Skips strings and template literals. */
function closeIndex(src, start) {
  const stack = [OPEN[src[start]]];
  for (let i = start + 1; i < src.length; i++) {
    const c = src[i];
    if (c === "'" || c === '"' || c === '`') {
      for (i++; i < src.length && src[i] !== c; i++) if (src[i] === '\\') i++;
      continue;
    }
    if (c === '=' && src[i + 1] === '>') { i++; continue; }
    if (OPEN[c]) stack.push(OPEN[c]);
    else if (c === stack[stack.length - 1]) { stack.pop(); if (!stack.length) return i + 1; }
  }
  return src.length;
}
/** Splits `src` on `sep` at bracket depth 0. */
function splitTop(src, sep) {
  const out = []; let depth = 0; let cur = '';
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (c === "'" || c === '"' || c === '`') {
      let j = i + 1; for (; j < src.length && src[j] !== c; j++) if (src[j] === '\\') j++;
      cur += src.slice(i, j + 1); i = j; continue;
    }
    if (c === '=' && src[i + 1] === '>') { cur += '=>'; i++; continue; }
    if ('{([<'.includes(c)) depth++;
    else if ('})]>'.includes(c)) depth--;
    if (c === sep && depth === 0) { out.push(cur); cur = ''; } else cur += c;
  }
  if (cur.trim()) out.push(cur);
  return out;
}
const cleanDoc = (d) => (d || '').replace(/^\/\*\*|\*\/$/g, '').split('\n').map((l) => l.replace(/^\s*\*\s?/, '')).join(' ').replace(/\s+/g, ' ').trim();

/* ---------- design-system previews and READMEs ---------- */
function readmeParts(md) {
  const lines = md.split('\n');
  const summary = (md.split(/\n\n/)[1] || '').trim();
  const provides = (/\*\*Consumer provides:\*\*\s*([^\n]+)/.exec(md) || [])[1] || '';
  const notes = lines.filter((l) => /^- /.test(l)).map((l) => l.slice(2).trim());
  const motion = [];
  const mi = md.indexOf('## Motion');
  if (mi >= 0) for (const l of md.slice(mi).split('\n')) {
    const m = /^\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|$/.exec(l);
    if (m && !/^-+$/.test(m[1]) && m[1] !== 'Moment') motion.push({ moment: m[1], behaviour: m[2] });
  }
  return { summary, provides, notes, motion };
}

/* ---------- React props from index.d.ts ---------- */
const dts = read(join(DS, 'index.d.ts'));
const interfaces = {};
for (const m of dts.matchAll(/export interface (\w+)(?:<[^>{]*>)?(?:\s+extends\s+([^{]+))?\s*\{/g)) {
  const open = m.index + m[0].length - 1;
  const body = dts.slice(open + 1, closeIndex(dts, open) - 1);
  const props = [];
  for (let part of splitTop(body.replace(/\n/g, ' \n'), ';')) {
    const docs = [...part.matchAll(/\/\*\*[\s\S]*?\*\//g)].map((d) => cleanDoc(d[0])).join(' ');
    part = part.replace(/\/\*\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '').trim();
    const pm = /^(readonly\s+)?([\w$]+)(\?)?\s*:\s*([\s\S]+)$/.exec(part);
    if (pm) props.push({ name: pm[2], type: pm[4].replace(/\s+/g, ' ').trim(), optional: !!pm[3], doc: docs });
  }
  interfaces[m[1]] = { props, extends: (m[2] || '').split(',').map((s) => s.trim().replace(/<.*$/, '')).filter(Boolean) };
}
function reactProps(name) {
  const seen = new Set(); const out = [];
  const visit = (iface, inherited) => {
    const def = interfaces[iface]; if (!def || seen.has(iface)) return; seen.add(iface);
    for (const p of def.props) if (!out.some((o) => o.name === p.name)) out.push({ ...p, ...(inherited ? { from: iface } : {}) });
    def.extends.forEach((e) => visit(e, true));
  };
  visit(`${name}Props`, false);
  return out;
}

/* ---------- React snippet: run the preview with a JSX-printing React ---------- */
// Load the real bundle once (with a stub React) so previews can read statics such as OnboardingFlow.copy or Icon.additions.
const REAL = (() => {
  const stub = new Proxy({}, { get: () => () => [null, () => {}] });
  const win = { React: stub, matchMedia: () => ({ matches: false }) };
  vm.runInNewContext(read(join(DS, 'bundle.js')), { window: win, document: undefined, console });
  return win.Airiona;
})();
const FRAG = Symbol('Fragment');
function jsxValue(v, ind) {
  if (v && v.__el) return printEl(v, ind);
  if (typeof v === 'function') {
    const s = v.toString().replace(/\s+/g, ' ');
    return s.length > 70 ? '() => {/* … */}' : s.replace(/^function\s*\(([^)]*)\)\s*\{\s*(.*?);?\s*\}$/, '($1) => { $2 }');
  }
  if (Array.isArray(v)) return `[${v.map((x) => jsxValue(x, ind)).join(', ')}]`;
  if (v && typeof v === 'object') return `{ ${Object.entries(v).map(([k, x]) => `${/^[a-zA-Z_$][\w$]*$/.test(k) ? k : JSON.stringify(k)}: ${jsxValue(x, ind)}`).join(', ')} }`;
  return JSON.stringify(v);
}
function printEl(el, ind = '') {
  if (el == null || el === false || el === true) return '';
  if (typeof el === 'string' || typeof el === 'number') return String(el).replace(/[{}<>]/g, (c) => `{'${c}'}`);
  if (Array.isArray(el)) return el.map((e) => printEl(e, ind)).filter(Boolean).join(`\n${ind}`);
  const tag = el.type === FRAG ? '' : el.type;
  const attrs = Object.entries(el.props || {}).filter(([k]) => k !== 'key' && k !== 'children').map(([k, v]) => {
    if (k === 'className') k = 'className';
    if (typeof v === 'string') return `${k}="${v.replace(/"/g, '&quot;')}"`;
    if (v === true) return k;
    return `${k}={${jsxValue(v, ind + '  ')}}`;
  });
  const kids = el.children.flat(Infinity).filter((c) => c != null && c !== false && c !== true && c !== '');
  const open = `<${tag}${attrs.length ? ' ' + attrs.join(' ') : ''}`;
  const oneLine = `${open}${kids.length ? '>' : ' />'}`;
  const longAttrs = oneLine.length + ind.length > 110 && attrs.length > 1;
  const head = longAttrs ? `<${tag}\n${attrs.map((a) => `${ind}  ${a}`).join('\n')}\n${ind}${kids.length ? '>' : '/>'}` : oneLine;
  if (!kids.length) return head;
  const simple = kids.every((k) => typeof k === 'string' || typeof k === 'number');
  if (simple && !longAttrs) return `${head}${kids.map((k) => printEl(k)).join('')}</${tag}>`;
  return `${head}\n${kids.map((k) => ind + '  ' + printEl(k, ind + '  ')).join('\n')}\n${ind}</${tag}>`;
}
function reactSnippet(html) {
  const script = (/<script>([\s\S]*?)<\/script>/.exec(html) || [])[1];
  if (!script) return null;
  let rendered = null; let usesState = false;
  const used = new Set();
  const marker = (name) => {
    const fn = function () {}; fn.__airiona = name;
    return new Proxy(fn, { get: (t, p) => (p === '__airiona' ? name : REAL[name] && p in REAL[name] ? REAL[name][p] : t[p]) });
  };
  const A = new Proxy({}, { get: (_, p) => marker(String(p)) });
  const fakeReact = {
    Fragment: FRAG,
    createElement(type, props, ...children) {
      if (typeof type === 'function' && !type.__airiona) return type({ ...(props || {}), children });
      const name = typeof type === 'function' ? type.__airiona : type;
      if (typeof type === 'function') used.add(name);
      return { __el: true, type: name, props: props || {}, children };
    },
    useState(v) { usesState = true; return [typeof v === 'function' ? v() : v, () => {}]; },
    useEffect() {}, useLayoutEffect() {}, useMemo: (f) => f(), useCallback: (f) => f(), useRef: (v) => ({ current: v ?? null }),
  };
  const ctx = {
    window: { Airiona: A }, React: fakeReact,
    ReactDOM: { createRoot: () => ({ render: (x) => { rendered = x; } }) },
    document: { getElementById: () => ({}) }, console, setTimeout: () => 0, setInterval: () => 0, clearTimeout() {}, clearInterval() {}, Date, Math, JSON,
  };
  try { vm.runInNewContext(script, ctx, { timeout: 2000 }); } catch (e) { return { code: null, error: e.message }; }
  if (!rendered) return null;
  const body = printEl(rendered, '  ').replace(/\.\.\/\.\.\/assets\//g, '/assets/');
  const imports = [...used].sort();
  const code = `import { ${imports.join(', ')} } from '@airiona/react';\n\nexport function Example() {\n${usesState ? '  // State and handlers from the live example are omitted; wire your own.\n' : ''}  return (\n    ${body.split('\n').join('\n  ')}\n  );\n}\n`;
  return { code, uses: imports };
}

/* ---------- Angular API from the library source ---------- */
const angular = {};
for (const file of walk(LIB).filter((f) => f.endsWith('.ts') && !f.endsWith('.spec.ts'))) {
  const src = read(file);
  for (const m of src.matchAll(/@(Component|Directive)\(\{/g)) {
    const decEnd = closeIndex(src, m.index + m[0].length - 1);
    const dec = src.slice(m.index, decEnd);
    const cm = /^\)\s*export class (\w+)(?:<[^{]*>)?(?:\s+extends\s+[^{]+?)?(?:\s+implements\s+[^{]+)?\s*\{/.exec(src.slice(decEnd));
    if (!cm) continue;
    const bodyStart = decEnd + cm[0].length - 1;
    const body = src.slice(bodyStart + 1, closeIndex(src, bodyStart) - 1);
    const docMatch = [...src.slice(0, m.index).matchAll(/\/\*\*([\s\S]*?)\*\/\s*$/g)].pop();
    const selector = (/selector:\s*'([^']+)'/.exec(dec) || [])[1];
    const template = (/template:\s*`([\s\S]*?)`/.exec(dec) || [])[1] || '';
    const inputs = [], outputs = [];
    const lines = body.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const l = lines[i];
      const im = /^\s*readonly (\w+) = (input|model)(\.required)?(<)?/.exec(l);
      const om = /^\s*readonly (\w+) = output<([^>]*(?:<[^>]*>)?[^>]*)>\(/.exec(l);
      let doc = '';
      for (let j = i - 1; j >= 0 && /^\s*(\*|\/\*\*|\*\/)/.test(lines[j]); j--) doc = lines[j] + '\n' + doc;
      if (/^\s*\/\*\*.*\*\/\s*$/.test(lines[i - 1] || '')) doc = lines[i - 1];
      doc = cleanDoc(doc.trim());
      if (im) {
        const rest = body.slice(body.indexOf(l)).slice(l.indexOf(im[2]) + im[2].length + (im[3] ? im[3].length : 0));
        let type = '', after = rest;
        if (rest.startsWith('<')) { const e = closeIndex(rest, 0); type = rest.slice(1, e - 1); after = rest.slice(e); }
        const args = after.startsWith('(') ? splitTop(after.slice(1, closeIndex(after, 0) - 1), ',') : [];
        const def = im[3] ? undefined : (args[0] || '').trim();
        const transform = /transform:\s*(\w+)/.exec(args.join(','));
        inputs.push({ name: im[1], kind: im[2] === 'model' ? 'model' : im[3] ? 'required' : 'input', type: type.replace(/\s+/g, ' ').trim() || (transform && transform[1] === 'booleanAttribute' ? 'boolean' : transform && transform[1] === 'numberAttribute' ? 'number' : ''), default: def || undefined, doc });
      } else if (om) outputs.push({ name: om[1], type: om[2], doc });
    }
    const slots = [...template.matchAll(/<ng-content(?:\s+select="([^"]+)")?\s*\/?>/g)].map((s) => s[1] || '(default)');
    const isNative = selector && /^\w+\[/.test(selector);
    angular[cm[1]] = {
      className: cm[1], kind: m[1].toLowerCase(), selector, file: file.slice(ROOT.length + 1).replace(/\\/g, '/'),
      tag: isNative ? selector.split(',')[0].trim().replace(/\[.*$/, '') : selector && !selector.startsWith('[') ? selector : null,
      attr: isNative || (selector && selector.startsWith('[')) ? (/\[(\w+)/.exec(selector) || [])[1] : null,
      doc: cleanDoc(docMatch ? docMatch[0] : '').replace(/```[\s\S]*?```/g, '').trim(),
      inputs, outputs, slots: [...new Set(slots)],
      formControl: /arValueAccessor/.test(dec),
    };
  }
}

/* ---------- Angular demo snippets from the showcase ---------- */
const IMG_PATHS = (() => {
  const src = read(join(DEMOS, 'demo.ts'));
  const out = {};
  for (const m of src.matchAll(/^\s+(\w+): '([^']+)'/gm)) out[m[1]] = '/assets/' + m[2];
  out.onboarding = [1, 2, 3, 4, 5].map((i) => `/assets/onboarding/onboarding-${i}.webp`);
  return out;
})();
const angularDemo = {};
for (const f of readdirSync(DEMOS).filter((f) => f.endsWith('.demos.ts'))) {
  const src = read(join(DEMOS, f));
  for (const d of src.matchAll(/\{ name: '(\w+)', group: '[^']+', component: (\w+)/g)) {
    const ci = src.search(new RegExp(`\\nclass ${d[2]}\\b`));
    if (ci < 0) continue;
    const decStart = src.lastIndexOf('@Component({', ci);
    const dec = src.slice(decStart, ci);
    const tpl = (/template:\s*`([\s\S]*?)`/.exec(dec) || [])[1] || '';
    const importsList = ((/imports:\s*\[([^\]]*)\]/.exec(dec) || [])[1] || '').split(',').map((s) => s.trim()).filter(Boolean);
    const bodyStart = src.indexOf('{', ci);
    const cls = src.slice(bodyStart + 1, closeIndex(src, bodyStart) - 1).trim();
    const lines = tpl.split('\n').filter((l, i, a) => !(i === 0 && !l.trim()) && !(i === a.length - 1 && !l.trim()));
    const indent = Math.min(...lines.filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length));
    const template = lines.map((l) => l.slice(indent)).join('\n');
    const lib = [...new Set([...importsList.filter((i) => /^Ar[A-Z]/.test(i)), ...[...cls.matchAll(/\b(Ar[A-Z]\w*|AR_[A-Z_]+)\b/g)].map((x) => x[1])])];
    const core = ['ChangeDetectionStrategy', 'Component', ...['signal', 'computed', 'inject', 'effect'].filter((f) => cls.includes(`${f}(`))];
    const ng = importsList.filter((i) => !/^Ar[A-Z]/.test(i));
    const usesImg = /\bIMG\b/.test(cls);
    const imgKeys = [...new Set([...(tpl + cls).matchAll(/(?:img|IMG)\.(\w+)/g)].map((x) => x[1]))];
    const imgConst = usesImg ? `// Asset paths: copy design-system/assets into your app's public folder.\nconst IMG = {\n${imgKeys.map((k) => `  ${k}: ${JSON.stringify(IMG_PATHS[k] ?? '')},`).join('\n')}\n};\n\n` : '';
    const body = cls ? '\n' + cls.split('\n').map((l) => '  ' + l.trim()).join('\n').replace(/^\s*$/gm, '') + '\n' : '';
    const code = [
      `import { ${core.join(', ')} } from '@angular/core';`,
      ng.length ? `// also import: ${ng.join(', ')} (from @angular/forms or @angular/common)` : null,
      `import { ${lib.join(', ')} } from '@airiona/ui';`,
      '',
      `${imgConst}@Component({`,
      `  selector: 'app-example',`,
      `  imports: [${importsList.join(', ')}],`,
      `  changeDetection: ChangeDetectionStrategy.OnPush,`,
      '  template: `',
      template.split('\n').map((l) => '    ' + l).join('\n'),
      '  `,',
      '})',
      `export class Example {${body}}`,
      '',
    ].filter((l) => l !== null).join('\n');
    angularDemo[d[1]] = { code, uses: lib };
  }
}

/* ---------- assemble ---------- */
const GROUP_ORDER = ['Foundations', 'Actions', 'Forms', 'Overlays', 'Navigation', 'Status', 'Identity', 'Booking', 'Data', 'Dashboard', 'Analytics', 'Widgets', 'Workspace', 'Screens', 'Mobile navigation', 'Mobile inputs', 'Mobile content', 'Mobile onboarding', 'Motion'];
const GROUP_KIND = { Motion: 'motion', Screens: 'screen', Foundations: 'foundation' };
const components = [];
for (const name of readdirSync(DS).filter((n) => existsSync(join(DS, n, 'preview.html')) && n !== 'Cover').sort()) {
  const html = read(join(DS, name, 'preview.html'));
  const marker = /@dsCard group="([^"]+)" height=(\d+)/.exec(html);
  const stage = (/<div id="root" class="ar ar-stage" style="([^"]*)"/.exec(html) || [])[1] || '';
  const md = existsSync(join(DS, name, 'README.md')) ? read(join(DS, name, 'README.md')) : `# ${name}\n`;
  const parts = readmeParts(md);
  const ng = angular[`Ar${name}`] || null;
  const helpers = ng ? Object.values(angular).filter((a) => a.file === ng.file && a.className !== ng.className).map((a) => ({ className: a.className, selector: a.selector, inputs: a.inputs })) : [];
  const snippet = reactSnippet(html);
  components.push({
    name, slug: kebab(name), group: marker[1], kind: GROUP_KIND[marker[1]] || 'component', height: +marker[2], stage,
    summary: parts.summary, provides: parts.provides, notes: parts.notes, motion: parts.motion, readme: md,
    react: { import: `import { ${name} } from '@airiona/react';`, props: reactProps(name), code: snippet?.code || null, uses: snippet?.uses || [] },
    angular: ng ? {
      import: `import { ${ng.className} } from '@airiona/ui';`, className: ng.className, selector: ng.selector, tag: ng.tag, attr: ng.attr,
      formControl: ng.formControl, inputs: ng.inputs, outputs: ng.outputs, slots: ng.slots, helpers, file: ng.file, doc: ng.doc,
      code: angularDemo[name]?.code || null, uses: angularDemo[name]?.uses || [],
    } : null,
    keywords: [...new Set([...kebab(name).split('-'), ...marker[1].toLowerCase().split(' '), ...(parts.summary.toLowerCase().match(/[a-z]{4,}/g) || [])])],
  });
}

const tokens = JSON.parse(read(join(ROOT, 'design-system/tokens.json')));
const pkg = JSON.parse(read(join(ROOT, 'projects/airiona-ui/package.json')));
const manifest = {
  name: 'Airiona', version: pkg.version, generated: new Date().toISOString().slice(0, 10),
  packages: { react: '@airiona/react', angular: '@airiona/ui' },
  groups: [...new Set([...GROUP_ORDER.filter((g) => components.some((c) => c.group === g)), ...components.map((c) => c.group)])],
  motionTokens: { duration: tokens.duration.tokens, easing: tokens.easing.tokens },
  tokens: { color: tokens.color.tokens, radius: tokens.radius.tokens, shadow: tokens.shadow.tokens, spacing: tokens.spacing.tokens },
  components,
};

const problems = components.filter((c) => !c.angular || !c.react.code || !c.angular.code).map((c) => `${c.name}: ${!c.angular ? 'no Angular class' : ''} ${!c.react.code ? 'no React code' : ''} ${c.angular && !c.angular.code ? 'no Angular code' : ''}`.trim());
mkdirSync(join(ROOT, 'catalog/data'), { recursive: true });
writeFileSync(join(ROOT, 'catalog/data/manifest.json'), JSON.stringify(manifest, null, 1));

// Compact index for people and agents: one line per component.
let index = `# Airiona component index\n\nGenerated by \`node tools/gen-manifest.mjs\` (v${manifest.version}). ${components.length} components. Look one up in full with \`node tools/page/airiona.mjs describe <Name>\`; search with \`node tools/page/airiona.mjs suggest "<what the element does>"\`.\n\n`;
for (const g of manifest.groups) {
  index += `## ${g}\n\n| Component | Angular | Use it for |\n|---|---|---|\n`;
  for (const c of components.filter((x) => x.group === g)) {
    const sel = c.angular ? (c.angular.attr && c.angular.tag ? `<${c.angular.tag} ${c.angular.attr}>` : c.angular.attr ? `[${c.angular.attr}]` : `<${c.angular.tag}>`) : '—';
    index += `| ${c.name} | \`${sel}\`${c.angular?.formControl ? ' (form control)' : ''} | ${c.summary.replace(/\|/g, '\\|')} |\n`;
  }
  index += '\n';
}
mkdirSync(join(ROOT, 'docs/components'), { recursive: true });
writeFileSync(join(ROOT, 'docs/components/INDEX.md'), index);

console.log(`manifest: ${components.length} components, ${components.filter((c) => c.react.code).length} React snippets, ${components.filter((c) => c.angular?.code).length} Angular snippets`);
if (problems.length) { console.log('gaps:\n  ' + problems.join('\n  ')); process.exitCode = 1; }
