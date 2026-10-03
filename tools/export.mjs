// One command for every artefact the team needs. Output: exports/
//   node tools/export.mjs [--scale 2] [--skip-png]
//   exports/
//     airiona-ui-<v>.tgz          Angular 20+ package (ng add ./airiona-ui-<v>.tgz)
//     airiona-react-<v>.tgz       React 18/19 package
//     tokens/                     tokens.css, tokens.json, tokens.ts
//     catalog/                    static catalog site (host anywhere)
//     png/{react,angular}/        every component at the chosen device scale
//     skill/airiona-page-convert  the Claude Code page-conversion skill
//     README.md                   what is inside and how to use it
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync, execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { tokensCss } from './sync-design-system.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'exports');
const args = process.argv.slice(2);
const scale = args.includes('--scale') ? args[args.indexOf('--scale') + 1] : '2';
const step = (label) => console.log(`\n== ${label}`);
const sh = (cmd) => execSync(cmd, { stdio: 'inherit', cwd: ROOT });
const node = (script, extra = []) => execFileSync(process.execPath, [join(ROOT, script), ...extra], { stdio: 'inherit', cwd: ROOT });
const version = JSON.parse(readFileSync(join(ROOT, 'projects/airiona-ui/package.json'), 'utf8')).version;

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

step('Angular package');
sh('npm run build:lib');
sh(`npm pack ./dist/airiona-ui --pack-destination exports`);

step('React package');
node('tools/build-react.mjs');
sh(`npm pack ./packages/react --pack-destination exports`);

step('Tokens');
const tokens = JSON.parse(readFileSync(join(ROOT, 'design-system/tokens.json'), 'utf8'));
mkdirSync(join(OUT, 'tokens'), { recursive: true });
writeFileSync(join(OUT, 'tokens/tokens.css'), tokensCss(tokens));
cpSync(join(ROOT, 'design-system/tokens.json'), join(OUT, 'tokens/tokens.json'));
const flat = {};
for (const g of ['color', 'shadow', 'spacing', 'radius', 'duration', 'easing', 'zIndex', 'touch']) flat[g] = Object.fromEntries(tokens[g].tokens.map((t) => [t.name, t.value]));
flat.font = tokens.type.families;
writeFileSync(join(OUT, 'tokens/tokens.ts'), `/* Airiona tokens v${version}. Generated from tokens.json; use CSS variables in markup and these values in code (charts, canvas, native). */\nexport const airionaTokens = ${JSON.stringify(flat, null, 2)} as const;\nexport type AirionaTokens = typeof airionaTokens;\n`);

step('Catalog');
node('tools/build-catalog.mjs', ['--thumbs']);
cpSync(join(ROOT, 'dist/catalog'), join(OUT, 'catalog'), { recursive: true });

if (!args.includes('--skip-png')) {
  step(`PNG @${scale}x, both frameworks`);
  node('tools/shoot.mjs', ['png', '--scale', scale, '--out', 'exports/png']);
}

step('Page-conversion skill');
const skill = join(ROOT, '.claude/skills/airiona-page-convert');
if (existsSync(skill)) cpSync(skill, join(OUT, 'skill/airiona-page-convert'), { recursive: true });

step('Index');
const files = [];
const walk = (d) => readdirSync(d).forEach((f) => { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : files.push(p); });
walk(OUT);
const tgz = files.filter((f) => f.endsWith('.tgz')).map((f) => `| ${f.slice(OUT.length + 1).replace(/\\/g, '/')} | ${(statSync(f).size / 1024).toFixed(0)} KB | \`${createHash('sha256').update(readFileSync(f)).digest('hex').slice(0, 16)}…\` |`);
const count = (dir) => (existsSync(dir) ? readdirSync(dir).length : 0);
writeFileSync(join(OUT, 'README.md'), `# Airiona exports v${version}

Built ${new Date().toISOString().slice(0, 16).replace('T', ' ')} by \`npm run export\`.

| Package | Size | sha256 |
|---|---|---|
${tgz.join('\n')}

## Angular 20, 21, 22

\`\`\`bash
ng add ./airiona-ui-${version}.tgz
\`\`\`

## React 18 and 19

\`\`\`bash
npm install ./airiona-react-${version}.tgz
\`\`\`

\`\`\`tsx
import '@airiona/react/styles/airiona.css';
import { Button } from '@airiona/react';
\`\`\`

## Also here

- \`tokens/\`: tokens.css (CSS variables), tokens.json (source), tokens.ts (typed values).
- \`catalog/\`: the catalog as a static site. Serve the folder (\`npx serve catalog\` or any web server) and open it.
- \`png/react\`, \`png/angular\`: ${count(join(OUT, 'png/react'))} + ${count(join(OUT, 'png/angular'))} component renders at ${scale}× device scale.
- \`skill/airiona-page-convert\`: the Claude Code skill that converts page designs into Airiona pages. Copy it into \`.claude/skills/\` of a repository that contains this workspace, or use it from this repository directly.
`);
console.log(`\nexports ready in ${OUT}`);
