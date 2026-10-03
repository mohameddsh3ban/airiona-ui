// Copies the shared styles from design-system/ (the React reference, single source of truth)
// into the Angular library and the React package. Run after editing design-system/.
//   node tools/sync-design-system.mjs          write the copies
//   node tools/sync-design-system.mjs --check  exit 1 if any copy is stale
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DS = join(ROOT, 'design-system');
const check = process.argv.includes('--check');

/** tokens.json -> tokens.css, the same shape the design-system page compiles. */
export function tokensCss(tokens) {
  let css = '/* Airiona tokens: generated from tokens.json. Light theme only. */\n:root {\n';
  tokens.color.tokens.forEach((t) => (css += `  --${t.name}: ${t.value};\n`));
  tokens.shadow.tokens.forEach((t) => (css += `  --${t.name}: ${t.value};\n`));
  for (const f of ['spacing', 'radius', 'duration', 'easing', 'zIndex', 'touch']) tokens[f].tokens.forEach((t) => (css += `  --${t.name}: ${t.value};\n`));
  for (const [k, v] of Object.entries(tokens.type.families)) css += `  --font-${k}: ${v};\n`;
  css += '}\n\n';
  tokens.type.groups.forEach((g) =>
    g.styles.forEach((s) => {
      css += `.${s.name} { font-family: var(--font-${s.family || g.family}); font-size: ${s.fontSize}; line-height: ${s.lineHeight}; font-weight: ${s.fontWeight};${s.letterSpacing ? ` letter-spacing: ${s.letterSpacing};` : ''} }\n`;
    }),
  );
  return css;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();

function main() {
  const norm = (s) => s.replace(/\r\n/g, '\n');
  const tokens = JSON.parse(readFileSync(join(DS, 'tokens.json'), 'utf8'));
  const outputs = [
    [join(ROOT, 'projects/airiona-ui/src/styles/tokens.css'), tokensCss(tokens)],
    [join(ROOT, 'projects/airiona-ui/src/styles/components.css'), readFileSync(join(DS, 'components/bundle.css'), 'utf8')],
    [join(ROOT, 'packages/react/styles/tokens.css'), tokensCss(tokens)],
    [join(ROOT, 'packages/react/styles/components.css'), readFileSync(join(DS, 'components/bundle.css'), 'utf8')],
  ];

  let stale = 0;
  for (const [file, content] of outputs) {
    const same = existsSync(file) && norm(readFileSync(file, 'utf8')) === norm(content);
    if (same) continue;
    stale++;
    if (check) console.error(`stale: ${file.slice(ROOT.length + 1)}`);
    else {
      mkdirSync(dirname(file), { recursive: true });
      writeFileSync(file, norm(content));
      console.log(`wrote ${file.slice(ROOT.length + 1)}`);
    }
  }
  if (check && stale) process.exitCode = 1;
  if (!stale) console.log('design-system copies are up to date');
}
