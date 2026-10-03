#!/usr/bin/env node
// Airiona page pipeline CLI. Used by the airiona-page-convert skill and by people.
//
//   node tools/page/airiona.mjs suggest "<what the element does>" [--limit 6]
//   node tools/page/airiona.mjs describe <Component> [--react]
//   node tools/page/airiona.mjs new <page> [--title "Checkout"] [--source path-or-url]
//   node tools/page/airiona.mjs lint <page> [--json]
//   node tools/page/airiona.mjs render <page>
//   node tools/page/airiona.mjs scaffold <page>
//   node tools/page/airiona.mjs shoot <page> [--no-build]
//   node tools/page/airiona.mjs check <page>        lint -> scaffold -> build + shoot -> render
//   node tools/page/airiona.mjs list
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { PAGES, loadSpec, specPath } from './lib/core.mjs';
import { describe, suggest } from './lib/lookup.mjs';
import { lint } from './lib/lint.mjs';
import { render } from './lib/render.mjs';
import { scaffold } from './lib/scaffold.mjs';
import { shoot } from './lib/shoot.mjs';

const [cmd, ...rest] = process.argv.slice(2);
const flag = (n) => rest.includes(`--${n}`);
const opt = (n, d) => (rest.includes(`--${n}`) ? rest[rest.indexOf(`--${n}`) + 1] : d);
const arg = rest.find((a, i) => !a.startsWith('--') && !(i > 0 && rest[i - 1].startsWith('--') && !['--json', '--react', '--no-build'].includes(rest[i - 1])));

function printLint(slug, res) {
  for (const e of res.errors) console.log(`  ✗ ${e}`);
  for (const w of res.warnings) console.log(`  ! ${w}`);
  console.log(`${slug}: ${res.errors.length} errors, ${res.warnings.length} warnings`);
}

async function main() {
  switch (cmd) {
    case 'suggest': {
      if (!arg) throw new Error('usage: suggest "<what the element does>"');
      const res = suggest(arg, +opt('limit', 6));
      if (!res.length) console.log('No match. Describe what the element does for the user, e.g. "pick travel dates", "sticky pay button".');
      for (const r of res) console.log(`${String(r.score).padStart(3)}  ${r.name.padEnd(20)} ${(r.selector || '').padEnd(26)} ${r.formControl ? '[form] ' : ''}${r.summary.slice(0, 110)}${r.why.length ? `  (${r.why.join(', ')})` : ''}`);
      return;
    }
    case 'describe': {
      if (!arg) throw new Error('usage: describe <Component>');
      console.log(describe(arg, flag('react') ? 'react' : 'angular'));
      return;
    }
    case 'list': {
      if (!existsSync(PAGES)) return console.log('No pages yet.');
      for (const d of readdirSync(PAGES)) if (existsSync(specPath(d))) console.log(d);
      return;
    }
    case 'new': {
      if (!arg || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(arg)) throw new Error('usage: new <page-slug> (kebab-case)');
      const p = specPath(arg);
      if (existsSync(p)) throw new Error(`${p} already exists`);
      mkdirSync(join(PAGES, arg), { recursive: true });
      const spec = {
        page: arg, title: opt('title', arg.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase())), route: arg, target: 'angular',
        source: { kind: opt('source', '').startsWith('http') ? 'url' : opt('source') ? 'screenshot' : 'brief', ref: opt('source', ''), notes: '' },
        audience: '', primaryAction: '',
        types: {}, data: [], sections: [], forms: [], motion: [], a11y: [], gaps: [], notes: [],
      };
      writeFileSync(p, JSON.stringify(spec, null, 2) + '\n');
      console.log(`created docs/pages/${arg}/page.spec.json. Fill it in, then: node tools/page/airiona.mjs lint ${arg}`);
      return;
    }
    case 'lint': {
      const spec = loadSpec(arg);
      const res = lint(spec);
      if (flag('json')) console.log(JSON.stringify(res, null, 1)); else printLint(arg, res);
      if (res.errors.length) process.exitCode = 1;
      return;
    }
    case 'render': {
      const spec = loadSpec(arg);
      console.log(`wrote ${render(spec, lint(spec))}`);
      return;
    }
    case 'scaffold': {
      const spec = loadSpec(arg);
      const res = lint(spec);
      if (res.errors.length) { printLint(arg, res); throw new Error('fix the spec errors before scaffolding'); }
      const out = scaffold(spec);
      console.log(`wrote ${out.files.join(', ')} in ${out.dir}`);
      return;
    }
    case 'shoot': {
      const spec = loadSpec(arg);
      const r = await shoot(spec, { build: !flag('no-build') });
      for (const e of r.errors) console.log(`  ✗ ${e}`);
      for (const w of r.warnings) console.log(`  ! ${w}`);
      console.log(`${arg}: screenshots in docs/pages/${arg}/shots (390, 768, 1280); ${r.errors.length} errors, ${r.warnings.length} warnings`);
      if (r.errors.length) process.exitCode = 1;
      return;
    }
    case 'check': {
      const spec = loadSpec(arg);
      const res = lint(spec);
      printLint(arg, res);
      if (res.errors.length) { render(spec, res); throw new Error('spec has errors; fix them and run check again'); }
      const out = scaffold(spec);
      console.log(`scaffolded ${out.dir}`);
      const r = await shoot(spec, { build: true });
      for (const e of r.errors) console.log(`  ✗ ${e}`);
      for (const w of r.warnings) console.log(`  ! ${w}`);
      console.log(`wrote ${render(spec, res)}`);
      console.log(`${arg}: ${r.errors.length ? 'FAILED' : 'passed'}: page checks ${r.errors.length} errors, ${r.warnings.length} warnings; spec ${res.warnings.length} warnings. Screens: docs/pages/${arg}/shots/`);
      if (r.errors.length) process.exitCode = 1;
      return;
    }
    default:
      console.log('commands: suggest, describe, new, lint, render, scaffold, shoot, check, list (see the header of tools/page/airiona.mjs)');
      if (cmd) process.exitCode = 1;
  }
}

main().catch((e) => { console.error(`error: ${e.message}`); process.exit(1); });
