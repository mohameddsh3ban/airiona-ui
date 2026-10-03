// `render`: writes docs/pages/<page>/HANDOFF.md from the spec, so the handoff always matches what lint checked
// and scaffold built.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { PAGES, component, errorKey, walkElements } from './core.mjs';

const cell = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
const val = (v) => (typeof v === 'string' ? v : JSON.stringify(v));

export function render(spec, lintResult) {
  const slug = spec.page;
  const L = [];
  L.push(`# ${spec.title}`, '');
  L.push(`> Generated from \`docs/pages/${slug}/page.spec.json\` by \`node tools/page/airiona.mjs render ${slug}\`. Edit the spec, not this file.`, '');
  L.push(`| | |`, `|---|---|`);
  L.push(`| Audience | ${cell(spec.audience)} |`, `| Primary action | ${cell(spec.primaryAction)} |`, `| Source | ${cell(spec.source?.kind)}${spec.source?.ref ? ` · \`${cell(spec.source.ref)}\`` : ''} |`);
  L.push(`| Route | \`/${cell(spec.route || slug)}\` (playground: \`#/${slug}\`) |`, `| Framework | ${spec.target || 'angular'} |`, '');
  if (spec.source?.notes) L.push(spec.source.notes, '');

  const shots = join(PAGES, slug, 'shots');
  if (existsSync(join(shots, '390.png'))) {
    L.push('## Screens', '', '| 390 px (phone) | 768 px (tablet) | 1280 px (desktop) |', '|---|---|---|', '| ![390](shots/390.png) | ![768](shots/768.png) | ![1280](shots/1280.png) |', '');
    if (existsSync(join(shots, 'report.json'))) {
      const r = JSON.parse(readFileSync(join(shots, 'report.json'), 'utf8'));
      L.push(`Checked ${r.at.slice(0, 16).replace('T', ' ')}: ${r.errors.length} errors, ${r.warnings.length} warnings.`, '');
      for (const e of r.errors) L.push(`- ❌ ${e}`);
      for (const w of r.warnings) L.push(`- ⚠️ ${w}`);
      if (r.errors.length || r.warnings.length) L.push('');
    }
  }

  L.push('## Layout, mobile first', '');
  L.push('| Section | Purpose | 390 | 768 | 1280 | Sticky | Notes |', '|---|---|---|---|---|---|---|');
  for (const s of spec.sections || []) {
    const sticky = Object.entries(s.sticky || {}).map(([bp, v]) => `${bp}: ${v}`).join(', ');
    const hidden = Object.entries(s.show || {}).filter(([, v]) => v === false).map(([bp]) => `hidden at ${bp}`).join(', ');
    L.push(`| **${cell(s.title || s.id)}** \`${s.id}\` | ${cell(s.purpose)} | ${s.layout?.base || ''} | ${s.layout?.md || '↑'} | ${s.layout?.lg || '↑'}${s.area?.lg === 'aside' ? ' (aside)' : ''} | ${sticky} | ${cell([hidden, s.notes].filter(Boolean).join('; '))} |`);
  }
  L.push('');

  L.push('## Components', '');
  for (const s of spec.sections || []) {
    L.push(`### ${s.title || s.id}`, '');
    L.push('| Element | Component | Inputs | Data | Why this one | States |', '|---|---|---|---|---|---|');
    for (const { el, section } of walkElements(spec)) {
      if (section !== s) continue;
      const c = component(el.component);
      const sel = el.component === 'html' ? `\`<${el.tag}>\`` : el.component === 'GAP' ? '**GAP**' : c ? `${c.name} \`${c.angular?.selector || ''}\`` : `⚠️ ${el.component}`;
      const ins = Object.entries(el.inputs || {}).map(([k, v]) => `\`${k}\`=${cell(val(v)).slice(0, 60)}`).join('<br>');
      const bind = Object.entries(el.bind || {}).map(([k, p]) => `\`${k}\` ← \`${p}\``).join('<br>');
      const why = [el.why, ...(el.alternatives || []).map((a) => `Not ${a.component}: ${a.rejected}`)].filter(Boolean).join('<br>');
      const states = Object.entries(el.states || {}).map(([k, v]) => `${k}: ${v}`).join('<br>');
      L.push(`| \`${el.id}\`${el.field ? ` (field \`${el.field}\`)` : ''}${el.slot ? ` [${el.slot}]` : ''} | ${sel} | ${ins} | ${bind} | ${cell(why)} | ${cell(states)} |`);
    }
    L.push('');
  }

  if ((spec.forms || []).length) {
    L.push('## Forms and validation', '');
    for (const f of spec.forms) {
      L.push(`### ${f.id}`, '', `Submit: **${cell(f.submit?.label)}** → ${cell(f.submit?.action)}. Success: ${cell(f.submit?.success?.kind)}${f.submit?.success?.title ? ` (“${cell(f.submit.success.title)}”)` : ''}. Failure: ${cell(f.submit?.failure)}.`, '');
      L.push('Errors show after a field is left or on submit; submit focuses the first invalid field.', '');
      L.push('| Field | Control | Default | Rules | Messages | Keyboard / autofill |', '|---|---|---|---|---|---|');
      for (const fd of f.fields || []) {
        const rules = (fd.validators || []).map((v) => `${v.type}${v.value !== undefined ? `(${val(v.value)})` : ''}`).join(', ');
        const msgs = (fd.validators || []).map((v) => `${v.type}: “${cell(fd.messages?.[errorKey(v.type)])}”`).join('<br>');
        const kb = Object.entries(fd.inputs || {}).filter(([k]) => /type|autocomplete|inputMode|maxLength/.test(k)).map(([k, v]) => `${k}=${v}`).join(', ');
        L.push(`| **${cell(fd.label)}** \`${fd.name}\` | ${fd.component} | ${cell(val(fd.default ?? ''))} | ${rules} | ${msgs} | ${cell(kb)} |`);
      }
      L.push('');
    }
  }

  if ((spec.data || []).length) {
    L.push('## Data', '');
    for (const d of spec.data) {
      L.push(`- **${d.name}**: \`${d.type}\` from ${cell(d.source || 'unspecified')}. Loading: ${cell(d.states?.loading || '—')}. Empty: ${cell(d.states?.empty || '—')}. Error: ${cell(d.states?.error || '—')}.`);
    }
    L.push('', '```ts');
    for (const [n, fs] of Object.entries(spec.types || {})) L.push(`interface ${n} {`, ...Object.entries(fs).map(([k, t]) => `  ${k}: ${t};`), '}');
    L.push('```', '', `Sample data: \`projects/playground/src/app/pages/${slug}/${slug}.data.ts\`.`, '');
  }

  if ((spec.motion || []).length) {
    L.push('## Motion', '', '| Where | Use | Why |', '|---|---|---|');
    for (const m of spec.motion) L.push(`| ${cell(m.where)} | ${cell(m.component || m.use)}${m.variant ? ` (${m.variant})` : ''} | ${cell(m.why)} |`);
    L.push('', 'Everything settles instantly under `prefers-reduced-motion` or `provideAiriona({ motion: \'reduce\' })`.', '');
  }
  if ((spec.a11y || []).length) L.push('## Accessibility', '', ...spec.a11y.map((a) => `- ${a}`), '');
  if ((spec.gaps || []).length) {
    L.push('## Gaps', '', '| Element | Need | Nearest today | Proposal |', '|---|---|---|---|');
    for (const g of spec.gaps) L.push(`| ${cell(g.element)} | ${cell(g.need)} | ${cell(g.nearest)} | ${cell(g.proposal)} |`);
    L.push('');
  }
  if ((spec.notes || []).length) L.push('## Notes', '', ...spec.notes.map((n) => `- ${n}`), '');
  if (lintResult) {
    L.push('## Spec check', '', lintResult.errors.length ? `❌ ${lintResult.errors.length} errors` : '✅ No errors', '');
    for (const w of lintResult.warnings) L.push(`- ⚠️ ${w}`);
    L.push('');
  }
  L.push('## Build it', '', '```bash', `node tools/page/airiona.mjs check ${slug}   # lint, handoff, scaffold, build, screenshots`, 'npx ng serve playground                    # then open http://localhost:4200/#/' + slug, '```', '');
  L.push(`Generated code: \`projects/playground/src/app/pages/${slug}/\`. Copy that folder into the product app with \`shared/page-form.ts\` and \`shared/validators.ts\`, then replace the sample data with the real sources listed above.`, '');
  writeFileSync(join(PAGES, slug, 'HANDOFF.md'), L.join('\n'));
  return join(PAGES, slug, 'HANDOFF.md');
}
