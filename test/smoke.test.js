import { test, after } from 'node:test';
import assert from 'node:assert';

// Smoke test for the running Express app (src/server.js).
// Set NODE_ENV=test BEFORE importing so the module's own app.listen() does
// not fire, then start our own server on an ephemeral port. Dynamic import
// runs after the env var is set (static ESM imports would evaluate first).
process.env.NODE_ENV = 'test';
const { default: app } = await import('../src/server.js');

const server = app.listen(0, '127.0.0.1');
await new Promise((resolve) => server.once('listening', resolve));
const { port } = server.address();
const base = `http://127.0.0.1:${port}`;

after(() => new Promise((resolve) => server.close(resolve)));

test('GET /api/healthz returns 200 and { ok: true }', async () => {
  const res = await fetch(`${base}/api/healthz`);
  assert.strictEqual(res.status, 200);
  const body = await res.json();
  assert.deepStrictEqual(body, { ok: true });
});

test('GET /api/card returns a 25-cell card with FREE center and buzzwords', async () => {
  const res = await fetch(`${base}/api/card`);
  assert.strictEqual(res.status, 200);
  const body = await res.json();
  assert.ok(Array.isArray(body.card), 'card should be an array');
  assert.strictEqual(body.card.length, 25);
  assert.strictEqual(body.card[12], 'FREE');
  assert.ok(Array.isArray(body.buzzwords), 'buzzwords should be an array');
  assert.ok(body.buzzwords.length > 0, 'buzzwords should be non-empty');
});
