// Copies the public API contract from anima-core into this repo.
// Usage: node scripts/sync-public-api.mjs [path-to-anima-core]
// Default: ../anima-core (sibling checkout). Never edit public-api/* by hand.
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const src = resolve(process.argv[2] ?? '../anima-core', 'docs/public-api');
const dst = resolve('public-api');
if (!existsSync(src)) { console.error(`anima-core public-api not found at ${src}`); process.exit(1); }
mkdirSync(dst, { recursive: true });
for (const f of ['openapi.json', 'FACTS.md', 'EXCLUDED.md', 'STATUS.json', 'MIGRATION.md']) {
  const from = join(src, f);
  if (existsSync(from)) { copyFileSync(from, join(dst, f)); console.log('synced', f); }
  else console.log('not in anima-core yet:', f);
}
