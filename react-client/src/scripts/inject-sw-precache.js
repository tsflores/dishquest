// Post-build script (Phase 6): reads dist/.vite/manifest.json,
// extracts hashed asset URLs, and injects them into public/sw.js PRECACHE_URLS.
// Run via "postbuild" in package.json once the service worker strategy is finalized.
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '../..');

const manifest = JSON.parse(readFileSync(resolve(root, 'dist/.vite/manifest.json'), 'utf8'));
const urls = Object.values(manifest)
  .map((entry) => entry.file)
  .filter(Boolean)
  .map((f) => `/${f}`);

const swPath = resolve(root, 'dist/sw.js');
let sw = readFileSync(swPath, 'utf8');
sw = sw.replace(
  'const PRECACHE_URLS = [];',
  `const PRECACHE_URLS = ${JSON.stringify(urls, null, 2)};`
);
writeFileSync(swPath, sw);
console.log(`Injected ${urls.length} URLs into sw.js`);
