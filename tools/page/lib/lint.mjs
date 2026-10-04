// `lint`: checks a page spec against the real component APIs and the mobile-first, forms and states rules.
// Errors block scaffolding; warnings are review items the handoff must answer.
import { LAYOUTS, VALIDATORS, VALIDATOR_ARG, errorKey, angularInputs, angularOutputs, component, manifest, nearestNames, reactProps, walkElements } from './core.mjs';

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const ID = /^[a-z][a-zA-Z0-9-]*$/;
const HTML_TAGS = new Set(['h1', 'h2', 'h3', 'h4', 'p', 'span', 'div', 'small', 'strong', 'a', 'ul', 'ol', 'li', 'img', 'hr', 'section', 'figure', 'figcaption', 'address', 'time']);
const NATIVE_ATTRS = /^(class|style|id|role|tabindex|title|href|target|rel|type|aria-[a-z-]+|data-[a-z-]+)$/;
const BP = ['base', 'md', 'lg'];
const TS_PRIMS = /^(string|number|boolean|null|unknown|Date|ISODate)(\[\])?$/;
const SOURCE_KINDS = ['screenshot', 'figma', 'url', 'html', 'brief'];
const SUCCESS_KINDS = ['burst', 'toast', 'navigate'];
const STICKY = ['top', 'bottom', 'none'];
/** `'a' | 'b' | null` -> ['a', 'b'] (null/undefined dropped); anything else -> null. */
const literalUnion = (t) => {
  const parts = String(t || '').split('|').map((x) => x.trim()).filter((x) => x && x !== 'null' && x !== 'undefined');
  return parts.length && parts.every((x) => /^'[^']*'$/.test(x)) ? parts.map((x) => x.slice(1, -1)) : null;
};

export function lint(spec, { target = spec.target || 'angular' } = {}) {
  const errors = [], warnings = [];
  const E = (path, msg) => errors.push(`${path}: ${msg}`);
  const W = (path, msg) => warnings.push(`${path}: ${msg}`);

  // page
  if (!SLUG.test(spec.page || '')) E('page', 'must be a kebab-case slug, e.g. "checkout"');
  for (const k of ['title', 'audience', 'primaryAction']) if (!spec[k]) E(k, 'required: say who the page is for and the one thing it must get done');
  if (!SOURCE_KINDS.includes(spec.source?.kind)) E('source.kind', `required, one of: ${SOURCE_KINDS.join(' | ')}`);
  if (spec.target && !['angular', 'react'].includes(spec.target)) E('target', 'angular or react');
  if (!Array.isArray(spec.sections) || !spec.sections.length) E('sections', 'at least one section');

  // data
  const types = spec.types || {};
  const data = new Map((spec.data || []).map((d) => [d.name, d]));
  for (const [tn, fields] of Object.entries(types)) for (const [f, t] of Object.entries(fields)) {
    const base = String(t).replace(/\[\]$/, '').replace(/ \| null$/, '').replace(/\?$/, '');
    if (!TS_PRIMS.test(base) && !types[base] && !/^'.*'( \| '.*')*$/.test(base)) E(`types.${tn}.${f}`, `unknown type "${t}" (use a primitive, a string union like 'a' | 'b', or a name from types)`);
  }
  for (const d of spec.data || []) {
    const path = `data.${d.name}`;
    if (!d.name || !/^[a-z][a-zA-Z0-9]*$/.test(d.name)) E(path, 'name must be camelCase');
    if (!d.type) E(path, 'type required (a key of types, optionally with [])');
    const tn = String(d.type || '').replace(/\[\]$/, '');
    if (d.type && !types[tn]) E(path, `type "${tn}" is not defined in types`);
    if (!d.source) W(path, 'say where the data comes from (endpoint, store, route param)');
    if (d.sample === undefined) E(path, 'sample required: realistic data the scaffold renders');
    else if (types[tn]) {
      const rows = Array.isArray(d.sample) ? d.sample : [d.sample];
      if (/\[\]$/.test(d.type) !== Array.isArray(d.sample)) E(`${path}.sample`, `type is ${d.type} but sample is ${Array.isArray(d.sample) ? 'an array' : 'an object'}`);
      rows.forEach((row, i) => {
        for (const f of Object.keys(types[tn])) if (!(f in (row || {})) && !/\?$/.test(types[tn][f]) && !/\| null$/.test(types[tn][f])) E(`${path}.sample${Array.isArray(d.sample) ? `[${i}]` : ''}`, `missing field "${f}"`);
        for (const f of Object.keys(row || {})) if (!(f in types[tn])) W(`${path}.sample`, `field "${f}" is not in type ${tn}`);
      });
    }
    for (const st of ['loading', 'error']) if (!d.states?.[st]) W(`${path}.states.${st}`, `say what the page shows while ${st === 'loading' ? 'it loads' : 'it fails'}`);
    if (Array.isArray(d.sample) && !d.states?.empty) W(`${path}.states.empty`, 'a list needs an empty state');
  }

  // forms
  const forms = new Map((spec.forms || []).map((f) => [f.id, f]));
  for (const f of spec.forms || []) {
    const path = `forms.${f.id}`;
    if (!f.id || !ID.test(f.id)) E(path, 'id must be camelCase or kebab-case');
    if (!f.submit?.label) E(`${path}.submit.label`, 'the submit button needs a verb label ("Pay $1,280", "Search flights")');
    if (!f.submit?.action) W(`${path}.submit.action`, 'say what submitting calls');
    if (!SUCCESS_KINDS.includes(f.submit?.success?.kind)) E(`${path}.submit.success.kind`, `say what success looks like: ${SUCCESS_KINDS.join(' | ')}`);
    if (f.submit?.success?.kind === 'navigate' && !f.submit.success.to) E(`${path}.submit.success.to`, 'navigate needs "to" (the next route)');
    if (!f.submit?.failure) W(`${path}.submit.failure`, 'say what happens when the server rejects it');
    const names = new Set();
    for (const fd of f.fields || []) {
      const fp = `${path}.fields.${fd.name}`;
      if (!fd.name || !/^[a-z][a-zA-Z0-9]*$/.test(fd.name)) E(fp, 'name must be camelCase (it becomes the form control name)');
      if (names.has(fd.name)) E(fp, 'duplicate field name');
      names.add(fd.name);
      const fieldComponents = Array.isArray(fd.component) ? fd.component : [fd.component];
      const controls = manifest().components.filter((x) => x.angular?.formControl).map((x) => x.name);
      for (const name of fieldComponents) {
        const fc = component(name);
        if (!fc) E(fp, `unknown component "${name}"${name ? `; did you mean ${nearestNames(String(name)).join(', ')}?` : ''}`);
        else if (target === 'angular' && !fc.angular?.formControl) E(fp, `${name} is not a form control; use one of: ${controls.join(', ')}`);
      }
      const c = component(fieldComponents[0]);
      if (!fd.label) E(fp, 'label required (visible label, not only a placeholder)');
      for (const v of fd.validators || []) {
        if (!VALIDATORS.includes(v.type)) E(`${fp}.validators`, `unknown validator "${v.type}" (use ${VALIDATORS.join(', ')})`);
        if (VALIDATOR_ARG[v.type] && typeof v.value !== VALIDATOR_ARG[v.type]) E(`${fp}.validators.${v.type}`, `needs "value" (${VALIDATOR_ARG[v.type]})`);
        if (!fd.messages?.[errorKey(v.type)]) E(`${fp}.messages`, `no message for "${v.type}" (key: "${errorKey(v.type)}")`);
      }
      const isText = fieldComponents.includes('TextField');
      const ins = fd.inputs || {};
      if (isText && !ins.autocomplete) W(`${fp}.inputs.autocomplete`, 'set autocomplete (name, email, tel, given-name, address-line1, cc-… is never ours: payments go to the provider)');
      if (isText && /mail/i.test(fd.name) && ins.type !== 'email') W(`${fp}.inputs.type`, 'email fields: type "email" for the right keyboard');
      if (isText && /phone|tel|mobile/i.test(fd.name) && !['tel'].includes(ins.type) && ins.inputMode !== 'tel') W(`${fp}.inputs`, 'phone fields: type "tel" or inputMode "tel"');
      if (/card|cvc|cvv|iban|ssn/i.test(fd.name)) E(fp, 'card and bank numbers never go in our forms: hand off to the payment provider (Stripe Elements, Adyen Drop-in)');
      if (target === 'angular') for (const name of fieldComponents) {
        const fc = component(name);
        if (!fc?.angular) continue;
        const ok = angularInputs(fc);
        for (const k of Object.keys(ins)) if (!ok.has(k) && !NATIVE_ATTRS.test(k)) E(`${fp}.inputs.${k}`, `${fc.name} has no input "${k}" (has: ${[...ok].join(', ')})`);
      }
    }
    if (!(f.fields || []).length) E(path, 'a form needs fields');
  }

  // sections and elements
  const ids = new Set();
  const placedFields = new Map();
  if (spec.canvas !== undefined && !['page', 'full'].includes(spec.canvas)) E('canvas', '"page" (default: centred, padded) or "full" (edge to edge, for an AuthShell or a full-screen view)');
  let stickyBottom = false;
  for (const s of spec.sections || []) {
    const sp = `sections.${s.id}`;
    if (!s.id || !ID.test(s.id)) E(sp, 'id must be camelCase or kebab-case');
    if (ids.has(s.id)) E(sp, 'duplicate id');
    ids.add(s.id);
    if (!s.purpose) W(sp, 'purpose: one line on why this section exists');
    if (!s.layout?.base) E(`${sp}.layout.base`, `mobile layout first: ${LAYOUTS.join(' | ')}`);
    for (const bp of BP) if (s.layout?.[bp] && !LAYOUTS.includes(s.layout[bp])) E(`${sp}.layout.${bp}`, `unknown layout "${s.layout[bp]}" (${LAYOUTS.join(', ')})`);
    if (['grid-3', 'grid-4'].includes(s.layout?.base)) W(`${sp}.layout.base`, `${s.layout.base} at 390px leaves columns under 110px wide; use stack, grid-2 or scroll-x on phones`);
    if (s.sticky?.base === 'bottom') stickyBottom = true;
    for (const [bp, v] of Object.entries(s.sticky || {})) { if (!BP.includes(bp)) E(`${sp}.sticky`, `unknown breakpoint "${bp}" (base, md, lg)`); if (!STICKY.includes(v)) E(`${sp}.sticky.${bp}`, `"${v}" is not one of ${STICKY.join(', ')}`); }
    for (const key of ['show', 'bleed']) for (const [bp, v] of Object.entries(s[key] || {})) { if (!BP.includes(bp)) E(`${sp}.${key}`, `unknown breakpoint "${bp}"`); if (typeof v !== 'boolean') E(`${sp}.${key}.${bp}`, 'true or false'); }
    for (const [bp] of Object.entries(s.layout || {})) if (!BP.includes(bp)) E(`${sp}.layout`, `unknown breakpoint "${bp}"`);
    if (s.form && !forms.has(s.form)) E(`${sp}.form`, `no form "${s.form}" in forms`);
    if (s.area && Object.values(s.area).some((a) => !['main', 'aside', 'full'].includes(a))) E(`${sp}.area`, 'main, aside or full');
    if (s.area && Object.keys(s.area).some((k) => k !== 'lg')) E(`${sp}.area`, 'areas apply at lg only: { "lg": "aside" }');
    if (!(s.elements || []).length) E(sp, 'a section needs elements');
  }

  /* Resolves a data path through the spec's types and samples: "hotels[2].rating", or "item.name" inside an `each`.
     Returns { type, value } or { error }. */
  const typeOf = (t) => String(t || '').replace(/\?$/, '').replace(/ \| null$/, '');
  function resolvePath(path, item) {
    const tokens = String(path).match(/[^.[\]]+|\[\d+\]/g) || [];
    let type, value;
    const head = tokens.shift();
    if (head === 'item') {
      if (!item) return { error: '"item" is only defined inside an element with "each"' };
      ({ type, value } = item);
    } else {
      const d = data.get(head);
      if (!d) return { error: `"${path}" does not start with a data name (${[...data.keys()].join(', ') || 'none declared'})` };
      type = d.type; value = d.sample;
    }
    for (const tk of tokens) {
      if (/^\[\d+\]$/.test(tk)) {
        const i = +tk.slice(1, -1);
        if (!/\[\]$/.test(typeOf(type))) return { error: `"${path}": ${tk} indexes a ${type}, not a list` };
        if (Array.isArray(value) && i >= value.length) return { error: `"${path}": index ${i} but the sample has ${value.length} item(s)` };
        type = typeOf(type).replace(/\[\]$/, ''); value = Array.isArray(value) ? value[i] : undefined;
      } else {
        const def = types[typeOf(type)];
        if (!def) return { error: `"${path}": ${type} has no fields (it is not one of the types)` };
        if (!(tk in def)) return { error: `"${path}": ${typeOf(type)} has no field "${tk}" (has: ${Object.keys(def).join(', ')})` };
        type = def[tk]; value = value && typeof value === 'object' ? value[tk] : undefined;
      }
    }
    return { type: typeOf(type), value };
  }

  const visit = (els, section, parent, item) => {
    for (const el of els || []) {
      const ep = `sections.${section.id}.${el.id || '?'}`;
      if (!el.id || !ID.test(el.id)) E(ep, 'element id required (camelCase or kebab-case)');
      else if (ids.has(el.id)) E(ep, 'duplicate id'); else ids.add(el.id);

      // each: repeat this element for every item of a list
      let ownItem = item;
      if (el.each !== undefined) {
        const r = resolvePath(el.each, item);
        if (r.error) E(`${ep}.each`, r.error);
        else if (!/\[\]$/.test(r.type)) E(`${ep}.each`, `"${el.each}" is a ${r.type}, not a list`);
        else ownItem = { type: r.type.replace(/\[\]$/, ''), value: Array.isArray(r.value) ? r.value[0] : undefined };
        if (el.field) E(`${ep}.each`, 'a repeated element cannot place a form field');
      }

      for (const [k, v] of Object.entries(el.show || {})) { if (!BP.includes(k)) E(`${ep}.show`, `unknown breakpoint "${k}"`); if (typeof v !== 'boolean') E(`${ep}.show.${k}`, 'true or false'); }

      if (el.component === 'html') {
        if (!HTML_TAGS.has(el.tag)) E(`${ep}.tag`, `html elements need a tag from: ${[...HTML_TAGS].join(', ')}`);
        if (/^(button|input|select|textarea|nav)$/.test(el.tag || '')) E(`${ep}.tag`, 'use the Airiona component, not a raw control');
        if (el.tag === 'a' && !el.href) E(`${ep}.href`, 'a link needs href (or it is not reachable by keyboard)');
        if (el.tag === 'img' && el.alt === undefined) E(`${ep}.alt`, 'images need alt text ("" for decorative)');
        for (const k of ['bind', 'events', 'inputs', 'field', 'submit']) if (el[k] !== undefined) E(`${ep}.${k}`, `html elements ignore "${k}"; use an Airiona component (a Button for actions, a TextField for input)`);
        // A container element can lay its children out like a section does (a search card docked in a hero).
        for (const [bp, v] of Object.entries(el.layout || {})) { if (!BP.includes(bp)) E(`${ep}.layout`, `unknown breakpoint "${bp}"`); else if (!LAYOUTS.includes(v)) E(`${ep}.layout.${bp}`, `unknown layout "${v}" (${LAYOUTS.join(', ')})`); }
        if (el.layout && !(el.children || []).length) W(`${ep}.layout`, 'layout arranges children; this element has none');
        visit(el.children, section, el, ownItem);
        continue;
      }
      if (el.component === 'GAP') {
        if (!(spec.gaps || []).some((g) => g.element === el.id)) E(ep, 'GAP elements need an entry in gaps[] with element, need, nearest and proposal');
        continue;
      }
      const c = component(el.component);
      if (!c) { E(`${ep}.component`, `unknown component "${el.component}"; did you mean ${nearestNames(el.component || '').join(', ')}? (component: "html" for plain text, "GAP" when nothing fits)`); continue; }
      if (!el.why) W(`${ep}.why`, `why ${c.name} here (and not its neighbours)?`);
      if (target === 'angular') {
        if (!c.angular) { E(ep, `${c.name} has no Angular implementation`); continue; }
        const ok = angularInputs(c);
        for (const k of [...Object.keys(el.inputs || {}), ...Object.keys(el.bind || {})]) if (!ok.has(k) && !NATIVE_ATTRS.test(k)) E(`${ep}.${k}`, `${c.name} has no input "${k}" (has: ${[...ok].join(', ') || 'none'})`);
        // Literal values for inputs typed as a string union must be one of its members.
        for (const [k, v] of Object.entries(el.inputs || {})) {
          const u = literalUnion(c.angular.inputs.find((i) => i.name === k)?.type);
          if (u && typeof v === 'string' && !u.includes(v)) E(`${ep}.inputs.${k}`, `"${v}" is not one of ${u.map((x) => `'${x}'`).join(' | ')}`);
        }
        const outs = angularOutputs(c);
        for (const k of Object.keys(el.events || {})) if (!outs.has(k) && !['click', 'keydown'].includes(k)) E(`${ep}.events.${k}`, `${c.name} has no output "${k}" (has: ${[...outs].join(', ') || 'none'})`);
        if (el.slot && parent) {
          const pc = component(parent.component);
          const slots = pc?.angular?.slots || [];
          if (pc && !slots.includes(`[${el.slot}]`)) E(`${ep}.slot`, `${pc.name} has no slot [${el.slot}] (has: ${slots.join(', ') || 'none'})`);
        }
        if ((el.children || []).length && !(c.angular.slots || []).length) E(`${ep}.children`, `${c.name} does not take projected content`);
      } else {
        const ok = reactProps(c);
        for (const k of [...Object.keys(el.inputs || {}), ...Object.keys(el.bind || {})]) if (!ok.has(k) && !NATIVE_ATTRS.test(k)) E(`${ep}.${k}`, `${c.name} has no prop "${k}"`);
      }
      // Bound paths must exist in the types and samples, and fit the input's type.
      for (const [k, p] of Object.entries(el.bind || {})) {
        const r = resolvePath(p, ownItem);
        if (r.error) { E(`${ep}.bind.${k}`, r.error); continue; }
        const u = literalUnion(c.angular?.inputs.find((i) => i.name === k)?.type);
        if (u && target === 'angular') {
          const bound = literalUnion(r.type);
          if (!bound) E(`${ep}.bind.${k}`, `${c.name}.${k} takes ${u.map((x) => `'${x}'`).join(' | ')}; type the field "${p}" with that union instead of ${r.type}`);
          else if (bound.some((x) => !u.includes(x))) E(`${ep}.bind.${k}`, `"${p}" can be ${bound.filter((x) => !u.includes(x)).map((x) => `'${x}'`).join(', ')}, which ${c.name}.${k} does not accept`);
        }
      }
      if (el.bind && Object.keys(el.bind).length && !el.states) {
        const root = String(Object.values(el.bind)[0]).split(/[.[]/)[0];
        const d = data.get(root === 'item' ? String(el.each || '').split(/[.[]/)[0] : root);
        if (root !== 'item' && !d?.states) W(`${ep}.states`, 'bound element without loading/empty/error states');
      }
      if (el.field) {
        const f = forms.get(section.form);
        if (!f) E(`${ep}.field`, `section "${section.id}" has no form; set sections[].form`);
        else {
          const fd = (f.fields || []).find((x) => x.name === el.field);
          const allowed = fd ? (Array.isArray(fd.component) ? fd.component : [fd.component]) : [];
          if (!fd) E(`${ep}.field`, `form "${f.id}" has no field "${el.field}"`);
          else if (!allowed.includes(el.component)) E(`${ep}.field`, `field "${el.field}" is a ${allowed.join(' or ')}, element is a ${el.component} (list both in the field's component to swap per breakpoint)`);
          placedFields.set(`${f.id}.${el.field}`, true);
        }
      }
      if (el.submit && !section.form) E(`${ep}.submit`, 'submit buttons must sit in a section with a form');
      visit(el.children, section, el, ownItem);
    }
  };
  for (const s of spec.sections || []) visit(s.elements, s, null, null);

  for (const f of spec.forms || []) {
    for (const fd of f.fields || []) if (!placedFields.has(`${f.id}.${fd.name}`)) E(`forms.${f.id}.fields.${fd.name}`, 'not placed on the page: add an element with "field" in a section that has "form"');
    const hasSubmit = [...walkElements(spec)].some(({ el, section }) => el.submit && section.form === f.id);
    if (!hasSubmit) E(`forms.${f.id}`, 'no submit element: give the primary button "submit": true');
  }
  if (!stickyBottom && (spec.forms || []).length) W('sections', 'a page with a form usually keeps its primary action reachable on phones: a section with sticky.base "bottom" (StickyActionBar)');
  for (const g of spec.gaps || []) {
    if (!g.need || !g.nearest || !g.proposal) E('gaps', 'each gap needs need, nearest and proposal');
    if (g.element && !ids.has(g.element)) E(`gaps.${g.element}`, 'no element with this id on the page');
  }
  if (!(spec.motion || []).length) W('motion', 'name the motion (RouteTransition variant, ScreenStack, SuccessBurst) or say "none"');

  return { errors, warnings };
}
