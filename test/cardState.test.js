// Tech Spec §Testing approach — unit tests for public/cardState.js pure functions.
// All browser/DOM/localStorage concerns are absent here by design.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  STORAGE_KEY,
  NAME_MAX,
  buildState,
  serialize,
  deserialize,
  normalizeName,
} from '../public/cardState.js';

// ── constants ────────────────────────────────────────────────────────────────

test('STORAGE_KEY is versioned aiconbingo:v1', () => {
  assert.equal(STORAGE_KEY, 'aiconbingo:v1');
});

test('NAME_MAX is 40', () => {
  assert.equal(NAME_MAX, 40);
});

// ── normalizeName ────────────────────────────────────────────────────────────

test('normalizeName trims whitespace', () => {
  assert.equal(normalizeName('  hello  '), 'hello');
});

test('normalizeName caps at 40 chars', () => {
  const long = 'a'.repeat(50);
  assert.equal(normalizeName(long).length, 40);
});

test('normalizeName returns empty string for empty input', () => {
  assert.equal(normalizeName(''), '');
});

test('normalizeName handles unicode (emoji, multibyte)', () => {
  const result = normalizeName('  🎉🎉🎉  ');
  assert.equal(result, '🎉🎉🎉');
});

test('normalizeName coerces non-string to empty string', () => {
  assert.equal(normalizeName(null), '');
  assert.equal(normalizeName(undefined), '');
  assert.equal(normalizeName(42), '');
});

// ── buildState ───────────────────────────────────────────────────────────────

const SAMPLE_CARD = Array.from({ length: 25 }, (_, i) =>
  i === 12 ? 'FREE' : `word${i}`
);

test('buildState returns version 1', () => {
  const s = buildState(SAMPLE_CARD);
  assert.equal(s.version, 1);
});

test('buildState card has 25 cells', () => {
  const s = buildState(SAMPLE_CARD);
  assert.equal(s.card.length, 25);
});

test('buildState card[12] is FREE', () => {
  const s = buildState(SAMPLE_CARD);
  assert.equal(s.card[12], 'FREE');
});

test('buildState marked has 25 cells', () => {
  const s = buildState(SAMPLE_CARD);
  assert.equal(s.marked.length, 25);
});

test('buildState marked[12] is true (free space)', () => {
  const s = buildState(SAMPLE_CARD);
  assert.equal(s.marked[12], true);
});

test('buildState all other marked cells start false', () => {
  const s = buildState(SAMPLE_CARD);
  s.marked.forEach((v, i) => {
    if (i !== 12) assert.equal(v, false, `marked[${i}] should be false`);
  });
});

test('buildState name defaults to empty string', () => {
  const s = buildState(SAMPLE_CARD);
  assert.equal(s.name, '');
});

test('buildState normalizes a name longer than 40 chars', () => {
  const s = buildState(SAMPLE_CARD, 'x'.repeat(50));
  assert.equal(s.name.length, 40);
});

test('buildState trims the name', () => {
  const s = buildState(SAMPLE_CARD, '  Alice  ');
  assert.equal(s.name, 'Alice');
});

// ── serialize / deserialize round-trip ───────────────────────────────────────

test('serialize returns a JSON string', () => {
  const s = buildState(SAMPLE_CARD, 'Alice');
  const raw = serialize(s);
  assert.equal(typeof raw, 'string');
  assert.doesNotThrow(() => JSON.parse(raw));
});

test('deserialize round-trips a valid state', () => {
  const original = buildState(SAMPLE_CARD, 'Alice');
  original.marked[0] = true;
  const restored = deserialize(serialize(original));
  assert.deepEqual(restored, original);
});

// ── deserialize — null cases ─────────────────────────────────────────────────

test('deserialize returns null for null input', () => {
  assert.equal(deserialize(null), null);
});

test('deserialize returns null for undefined input', () => {
  assert.equal(deserialize(undefined), null);
});

test('deserialize returns null for empty string', () => {
  assert.equal(deserialize(''), null);
});

test('deserialize returns null for invalid JSON', () => {
  assert.equal(deserialize('{not valid json'), null);
});

test('deserialize returns null when version !== 1', () => {
  const s = buildState(SAMPLE_CARD);
  const raw = JSON.stringify({ ...s, version: 2 });
  assert.equal(deserialize(raw), null);
});

test('deserialize returns null when version is missing', () => {
  const { version: _v, ...noVersion } = buildState(SAMPLE_CARD);
  assert.equal(deserialize(JSON.stringify(noVersion)), null);
});

test('deserialize returns null when card is not an array', () => {
  const s = { ...buildState(SAMPLE_CARD), card: 'oops' };
  assert.equal(deserialize(JSON.stringify(s)), null);
});

test('deserialize returns null when card length !== 25', () => {
  const s = { ...buildState(SAMPLE_CARD), card: ['a', 'b'] };
  assert.equal(deserialize(JSON.stringify(s)), null);
});

test('deserialize returns null when card contains non-strings', () => {
  const badCard = [...SAMPLE_CARD];
  badCard[0] = 42;
  const s = { ...buildState(SAMPLE_CARD), card: badCard };
  assert.equal(deserialize(JSON.stringify(s)), null);
});

test('deserialize returns null when marked is not an array', () => {
  const s = { ...buildState(SAMPLE_CARD), marked: 'oops' };
  assert.equal(deserialize(JSON.stringify(s)), null);
});

test('deserialize returns null when marked length !== 25', () => {
  const s = { ...buildState(SAMPLE_CARD), marked: [true, false] };
  assert.equal(deserialize(JSON.stringify(s)), null);
});

test('deserialize returns null when marked contains non-booleans', () => {
  const badMarked = Array(25).fill(false);
  badMarked[12] = true;
  badMarked[0] = 1; // number, not boolean
  const s = { ...buildState(SAMPLE_CARD), marked: badMarked };
  assert.equal(deserialize(JSON.stringify(s)), null);
});

test('deserialize returns null when marked[12] is false (tampered free space)', () => {
  const s = buildState(SAMPLE_CARD);
  const badMarked = [...s.marked];
  badMarked[12] = false;
  assert.equal(deserialize(JSON.stringify({ ...s, marked: badMarked })), null);
});

test('deserialize returns null when name is not a string', () => {
  const s = { ...buildState(SAMPLE_CARD), name: 123 };
  assert.equal(deserialize(JSON.stringify(s)), null);
});
