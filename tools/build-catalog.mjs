// Builds the Airiona Catalog into dist/catalog: the catalog app, one React page per component,
// the Angular showcase (solo mode) under ng/, shared assets and the manifest.
//   node tools/build-catalog.mjs            build
//   node tools/build-catalog.mjs --thumbs   also capture card thumbnails with Playwright
//   node tools/build-catalog.mjs --skip-ng  reuse the last Angular build (faster when only React or the catalog changed)
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync, execSync } from 'node:child_process';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'dist/catalog');
const DS = join(ROOT, 'design-system');
const args = process.argv.slice(2);
const node = (script, extra = []) => execFileSync(process.execPath, [join(ROOT, script), ...extra], { stdio: 'inherit', cwd: ROOT });

node('tools/sync-design-system.mjs');
node('tools/gen-manifest.mjs');
const manifest = JSON.parse(readFileSync(join(ROOT, 'catalog/data/manifest.json'), 'utf8'));

const ngTmp = join(ROOT, 'dist/catalog-ng');
if (!args.includes('--skip-ng') || !existsSync(join(ngTmp, 'browser'))) {
  console.log('building the Angular showcase for the catalog…');
  execSync(`npx ng build showcase --base-href ./ --output-path dist/catalog-ng`, { stdio: 'inherit', cwd: ROOT });
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(join(OUT, 'react'), { recursive: true });
mkdirSync(join(OUT, 'data'), { recursive: true });

// Catalog app. The source index.html is a page fragment (the artifact host wraps it); give it a full document here.
const page = readFileSync(join(ROOT, 'catalog/src/index.html'), 'utf8');
writeFileSync(join(OUT, 'index.html'), `<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n</head>\n<body>\n${page}\n</body>\n</html>\n`);
for (const f of ['catalog.css', 'catalog.js', 'embed.js']) cpSync(join(ROOT, 'catalog/src', f), join(OUT, f));
cpSync(join(ROOT, 'catalog/data/manifest.json'), join(OUT, 'data/manifest.json'));
cpSync(join(DS, 'assets'), join(OUT, 'assets'), { recursive: true });
if (existsSync(join(ROOT, 'dist/catalog-thumbs'))) cpSync(join(ROOT, 'dist/catalog-thumbs'), join(OUT, 'thumbs'), { recursive: true });

// React: one page per component, rendered by the reference bundle.
cpSync(join(DS, 'components/bundle.js'), join(OUT, 'react/bundle.js'));
cpSync(join(DS, 'components/bundle.css'), join(OUT, 'react/bundle.css'));
cpSync(join(ROOT, 'packages/react/styles/tokens.css'), join(OUT, 'react/tokens.css'));
const head = [
  '<meta name="viewport" content="width=device-width, initial-scale=1">',
  '<link rel="stylesheet" href="tokens.css"><link rel="stylesheet" href="bundle.css">',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js"></script>',
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js"></script>',
  '<script src="bundle.js"></script><script src="../embed.js"></script>',
].join('\n');
let pages = 0;
for (const c of manifest.components) {
  const src = readFileSync(join(DS, 'components', c.name, 'preview.html'), 'utf8');
  const html = src
    .replace(/^<!--[^>]*-->\s*/, '')
    .replace('<html lang="en">', '<html lang="en" data-theme="light">')
    .replace('<head>', `<head>\n${head}`)
    .replaceAll('../../assets/', '../assets/');
  writeFileSync(join(OUT, 'react', `${c.name}.html`), html);
  pages++;
}

// Angular: the showcase build, with the same embed script.
cpSync(join(ngTmp, 'browser'), join(OUT, 'ng'), { recursive: true });
const ngIndex = join(OUT, 'ng/index.html');
writeFileSync(ngIndex, readFileSync(ngIndex, 'utf8').replace('</body>', '<script src="../embed.js"></script>\n</body>'));

console.log(`catalog: ${manifest.components.length} components, ${pages} React pages, Angular build in ng/ -> ${OUT}`);

if (args.includes('--thumbs')) node('tools/shoot.mjs', ['thumbs']);
