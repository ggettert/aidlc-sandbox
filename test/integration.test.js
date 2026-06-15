import { test, after, describe } from 'node:test';
import assert from 'node:assert';

// Integration test for the wired Express app (src/server.js).
//
// Where the BINGO-SMOKE smoke test asserts that the two API endpoints merely
// respond, this integration test exercises the *end-to-end wiring across
// modules* through the real HTTP layer:
//   - express.static  ->  files in public/      (static asset serving)
//   - server route     ->  generateCard()       (card-generation pipeline)
//   - generateCard()   ->  BUZZWORDS            (data-source consistency)
//   - unknown route    ->  404                  (default error handling)
//
// Set NODE_ENV=test BEFORE importing so the module's own app.listen() does not
// fire; then start our own server on an ephemeral port. The dynamic import runs
// after the env var is set (static ESM imports would evaluate first). Mirrors
// the booting convention established by test/smoke.test.js. No new dependency:
// uses Node's built-in global fetch.
process.env.NODE_ENV = 'test';
const { default: app } = await import('../src/server.js');
const { BUZZWORDS } = await import('../src/bingo.js');

const server = app.listen(0, '127.0.0.1');
await new Promise((resolve) => server.once('listening', resolve));
const { port } = server.address();
const base = `http://127.0.0.1:${port}`;

after(() => new Promise((resolve) => server.close(resolve)));

describe('static asset serving (express.static -> public/)', () => {
  test('GET / serves the index.html shell', async () => {
    const res = await fetch(`${base}/`);
    assert.strictEqual(res.status, 200);
    assert.match(res.headers.get('content-type') ?? '', /text\/html/);
    const body = await res.text();
    assert.match(body, /<!DOCTYPE html>/i);
  });

  test('GET /cardState.js serves the client module', async () => {
    const res = await fetch(`${base}/cardState.js`);
    assert.strictEqual(res.status, 200);
    assert.match(res.headers.get('content-type') ?? '', /javascript/);
  });
});

describe('card-generation pipeline (route -> generateCard -> BUZZWORDS)', () => {
  test('GET /api/card returns a structurally valid 5x5 card', async () => {
    const res = await fetch(`${base}/api/card`);
    assert.strictEqual(res.status, 200);
    assert.match(res.headers.get('content-type') ?? '', /application\/json/);

    const { card } = await res.json();
    assert.ok(Array.isArray(card), 'card should be an array');
    assert.strictEqual(card.length, 25, 'card is a 5x5 grid');
    assert.strictEqual(card[12], 'FREE', 'center square is FREE');
  });

  test('every non-FREE square is a unique buzzword drawn from BUZZWORDS', async () => {
    const res = await fetch(`${base}/api/card`);
    const { card } = await res.json();

    const playable = card.filter((_, i) => i !== 12);
    assert.strictEqual(playable.length, 24, '24 playable squares');

    for (const word of playable) {
      assert.ok(
        BUZZWORDS.includes(word),
        `card square "${word}" should come from BUZZWORDS`,
      );
    }
    assert.strictEqual(
      new Set(playable).size,
      24,
      'no buzzword repeats on a single card',
    );
  });
});

describe('cross-endpoint data consistency', () => {
  test('GET /api/card buzzwords payload matches the BUZZWORDS source', async () => {
    const res = await fetch(`${base}/api/card`);
    const { buzzwords } = await res.json();
    assert.deepStrictEqual(buzzwords, BUZZWORDS);
  });
});

describe('default error handling', () => {
  test('GET an unknown route returns 404', async () => {
    const res = await fetch(`${base}/api/does-not-exist`);
    assert.strictEqual(res.status, 404);
  });
});
