// Tech Spec BINGO-23 §Testing approach / §Exact change inventory — enforce the
// pink+teal palette across BOTH render paths in public/index.html (the <style>
// DOM theme and the drawCanvas PNG renderer). Reads the file as text and asserts
// every new color is present and every retired color is gone. This is the AC1
// guardrail: it fails if a swap is missed in either the CSS or the canvas.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'url';
import path from 'path';

const html = readFileSync(
  path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'index.html'),
  'utf8'
);

// New pink+teal palette (Tech Spec §The palette).
const NEW = ['#0d2b2b', '#123c3c', '#1c5757', '#1f5e5e', '#2ec4b6', '#ff5da2', '#ff8cc6'];
// Retired navy/amber/red literals. `#eaeaea`, `#aaa`, `#555` are intentionally
// retained neutrals and are NOT listed here.
const OLD = ['#1a1a2e', '#ffd166', '#e94560', '#16213e', '#0f3460', '#233a5e', 'rgba(26,26,46'];

test('new pink+teal palette is present', () => {
  for (const c of NEW) assert.ok(html.includes(c), `missing new color ${c}`);
});

test('no navy/amber/red palette remains', () => {
  for (const c of OLD) assert.ok(!html.includes(c), `leftover old color ${c}`);
});
