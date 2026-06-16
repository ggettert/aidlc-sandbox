// Tech Spec BINGO-12 §API contract / §Implementation 3 — GET /api/status.
import { test, before, after } from 'node:test';
import assert from 'node:assert';

// server.js only auto-listens when NODE_ENV !== 'test' (see src/server.js).
// Set it before importing so the module doesn't bind the default port; the
// test owns the listener on an ephemeral port instead.
process.env.NODE_ENV = 'test';

let app;
let server;
let base;

before(async () => {
  ({ default: app } = await import('../src/server.js'));
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      base = `http://127.0.0.1:${server.address().port}`;
      resolve();
    });
  });
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

// Build a `marked` CSV (25 values) with `1`s at the given indices.
// Index 12 (free space) is always included to satisfy the invariant.
function csv(indices) {
  const arr = Array(25).fill(0);
  arr[12] = 1;
  indices.forEach((i) => { arr[i] = 1; });
  return arr.join(',');
}

async function getStatus(query) {
  const res = await fetch(`${base}/api/status${query}`);
  const body = await res.json();
  return { status: res.status, body };
}

test('happy path: 7 marks → { marked: 7, total: 25, won: false }', async () => {
  // 6 scattered marks + the free space = 7, no full line.
  const { status, body } = await getStatus(`?marked=${csv([0, 1, 5, 17, 20, 23])}`);
  assert.strictEqual(status, 200);
  assert.deepStrictEqual(body, { marked: 7, total: 25, won: false });
});

test('winning row → won: true', async () => {
  // Row 2 (indices 10..14) includes the free space; mark it fully.
  const { status, body } = await getStatus(`?marked=${csv([10, 11, 13, 14])}`);
  assert.strictEqual(status, 200);
  assert.strictEqual(body.won, true);
  assert.strictEqual(body.marked, 5);
  assert.strictEqual(body.total, 25);
});

test('missing param → 400', async () => {
  const { status, body } = await getStatus('');
  assert.strictEqual(status, 400);
  assert.ok(body.error);
});

test('wrong length → 400', async () => {
  const { status, body } = await getStatus('?marked=1,0,1,0'); // only 4 values
  assert.strictEqual(status, 400);
  assert.ok(body.error);
});

test('non-binary value → 400', async () => {
  const arr = Array(25).fill(0);
  arr[12] = 1;
  arr[3] = 2; // invalid
  const { status, body } = await getStatus(`?marked=${arr.join(',')}`);
  assert.strictEqual(status, 400);
  assert.ok(body.error);
});

test('free space (idx 12) unmarked → 400', async () => {
  const arr = Array(25).fill(0); // index 12 left at 0
  arr[0] = 1;
  const { status, body } = await getStatus(`?marked=${arr.join(',')}`);
  assert.strictEqual(status, 400);
  assert.ok(body.error);
});
