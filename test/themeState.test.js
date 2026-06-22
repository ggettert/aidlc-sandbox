// Tech Spec BINGO-darkmode §Tests — unit tests for public/themeState.js pure
// functions. Modeled after cardState.test.js. No DOM/browser concerns: storage
// is a Map-backed stub so persistence can be exercised in node:test.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  THEME_KEY,
  VALID_THEMES,
  DEFAULT_THEME,
  readTheme,
  writeTheme,
  toggleTheme,
} from '../public/themeState.js';

// Map-backed localStorage stub (matches cardState's testing style).
const fakeStorage = () => {
  const m = new Map();
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, v),
  };
};

// ── constants ────────────────────────────────────────────────────────────────

test('THEME_KEY is versioned aiconbingo:theme:v1', () => {
  assert.equal(THEME_KEY, 'aiconbingo:theme:v1');
});

test('VALID_THEMES is exactly light and dark', () => {
  assert.deepEqual(VALID_THEMES, ['light', 'dark']);
});

test('DEFAULT_THEME is dark (preserves current look)', () => {
  assert.equal(DEFAULT_THEME, 'dark');
});

// ── readTheme ────────────────────────────────────────────────────────────────

test('readTheme returns DEFAULT_THEME when storage is empty', () => {
  assert.equal(readTheme(fakeStorage()), DEFAULT_THEME);
});

test('readTheme returns the persisted value when light', () => {
  const s = fakeStorage();
  s.setItem(THEME_KEY, 'light');
  assert.equal(readTheme(s), 'light');
});

test('readTheme returns the persisted value when dark', () => {
  const s = fakeStorage();
  s.setItem(THEME_KEY, 'dark');
  assert.equal(readTheme(s), 'dark');
});

test('readTheme falls back to DEFAULT_THEME for an unknown value', () => {
  const s = fakeStorage();
  s.setItem(THEME_KEY, 'blue');
  assert.equal(readTheme(s), DEFAULT_THEME);
});

test('readTheme falls back to DEFAULT_THEME for an empty string', () => {
  const s = fakeStorage();
  s.setItem(THEME_KEY, '');
  assert.equal(readTheme(s), DEFAULT_THEME);
});

test('readTheme falls back to DEFAULT_THEME for JSON garbage', () => {
  const s = fakeStorage();
  s.setItem(THEME_KEY, '{"theme":"light"}');
  assert.equal(readTheme(s), DEFAULT_THEME);
});

test('readTheme falls back to DEFAULT_THEME when storage throws', () => {
  const throwingStorage = {
    getItem: () => {
      throw new Error('SecurityError: localStorage blocked');
    },
    setItem: () => {},
  };
  assert.equal(readTheme(throwingStorage), DEFAULT_THEME);
});

// ── writeTheme ───────────────────────────────────────────────────────────────

test('writeTheme persists a valid light value', () => {
  const s = fakeStorage();
  writeTheme(s, 'light');
  assert.equal(s.getItem(THEME_KEY), 'light');
});

test('writeTheme persists a valid dark value', () => {
  const s = fakeStorage();
  writeTheme(s, 'dark');
  assert.equal(s.getItem(THEME_KEY), 'dark');
});

test('writeTheme throws on an invalid theme', () => {
  const s = fakeStorage();
  assert.throws(() => writeTheme(s, 'blue'), /Invalid theme/);
});

test('writeTheme throws on undefined', () => {
  const s = fakeStorage();
  assert.throws(() => writeTheme(s, undefined), /Invalid theme/);
});

test('writeTheme does not write when the value is invalid', () => {
  const s = fakeStorage();
  assert.throws(() => writeTheme(s, 'blue'));
  assert.equal(s.getItem(THEME_KEY), null);
});

// ── toggleTheme ──────────────────────────────────────────────────────────────

test("toggleTheme('dark') returns 'light'", () => {
  assert.equal(toggleTheme('dark'), 'light');
});

test("toggleTheme('light') returns 'dark'", () => {
  assert.equal(toggleTheme('light'), 'dark');
});
