// Tech Spec BINGO-darkmode §Tests — unit tests for public/themeState.js pure
// functions. Modeled after test/cardState.test.js: no DOM, no real localStorage;
// a Map-backed stub stands in for the Web Storage API.
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

// Map-backed Web Storage stub (Tech Spec §Tests).
const fakeStorage = () => {
  const m = new Map();
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, v),
    _map: m,
  };
};

// ── constants ────────────────────────────────────────────────────────────────

test('THEME_KEY is versioned aiconbingo:theme:v1', () => {
  assert.equal(THEME_KEY, 'aiconbingo:theme:v1');
});

test('VALID_THEMES is exactly light and dark', () => {
  assert.deepEqual(VALID_THEMES, ['light', 'dark']);
});

test('DEFAULT_THEME is dark', () => {
  assert.equal(DEFAULT_THEME, 'dark');
});

// ── readTheme ────────────────────────────────────────────────────────────────

test('readTheme returns DEFAULT_THEME when storage is empty', () => {
  assert.equal(readTheme(fakeStorage()), 'dark');
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

test('readTheme falls back to DEFAULT_THEME on an unknown value', () => {
  const s = fakeStorage();
  s.setItem(THEME_KEY, 'blue');
  assert.equal(readTheme(s), 'dark');
});

test('readTheme falls back to DEFAULT_THEME on an empty string', () => {
  const s = fakeStorage();
  s.setItem(THEME_KEY, '');
  assert.equal(readTheme(s), 'dark');
});

test('readTheme falls back to DEFAULT_THEME on JSON garbage', () => {
  const s = fakeStorage();
  s.setItem(THEME_KEY, '{"theme":"light"}');
  assert.equal(readTheme(s), 'dark');
});

test('readTheme falls back to DEFAULT_THEME when storage throws', () => {
  const throwing = {
    getItem() {
      throw new Error('localStorage blocked');
    },
    setItem() {},
  };
  assert.equal(readTheme(throwing), 'dark');
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

test('writeTheme throws on an invalid string', () => {
  const s = fakeStorage();
  assert.throws(() => writeTheme(s, 'blue'), /invalid theme/);
  assert.equal(s.getItem(THEME_KEY), null);
});

test('writeTheme throws on undefined', () => {
  const s = fakeStorage();
  assert.throws(() => writeTheme(s, undefined), /invalid theme/);
});

// ── toggleTheme ──────────────────────────────────────────────────────────────

test("toggleTheme('dark') returns 'light'", () => {
  assert.equal(toggleTheme('dark'), 'light');
});

test("toggleTheme('light') returns 'dark'", () => {
  assert.equal(toggleTheme('light'), 'dark');
});
