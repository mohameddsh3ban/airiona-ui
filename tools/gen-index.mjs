// Regenerates src/lib/<folder>/index.ts barrels and public-api.ts from the component files on disk.
import { readdirSync, writeFileSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const lib = 'projects/airiona-ui/src/lib';
const order = ['core', 'actions', 'forms', 'overlays', 'status', 'booking', 'data', 'navigation', 'dashboard', 'analytics', 'widgets', 'workspace', 'mobile', 'motion'];
const folders = readdirSync(lib).filter((f) => !f.startsWith('_') && statSync(join(lib, f)).isDirectory());
for (const f of folders) {
  if (f === 'core') continue;
  const files = readdirSync(join(lib, f)).filter((n) => n.endsWith('.ts') && n !== 'index.ts' && !n.endsWith('.spec.ts')).sort();
  writeFileSync(join(lib, f, 'index.ts'), files.map((n) => `export * from './${n.replace(/\.ts$/, '')}';`).join('\n') + '\n');
}
const sorted = folders.sort((a, b) => (order.indexOf(a) + 100 * (order.indexOf(a) < 0)) - (order.indexOf(b) + 100 * (order.indexOf(b) < 0)));
const api = ['/*', ' * @airiona/ui — Airiona design system for Angular 20+.', ' */', ...sorted.filter((f) => existsSync(join(lib, f, 'index.ts'))).map((f) => `export * from './lib/${f}/index';`)].join('\n') + '\n';
writeFileSync('projects/airiona-ui/src/public-api.ts', api);
console.log(sorted.join(', '));
