// Tech Spec BINGO-darkmode §Tests — unit tests for public/themeState.js pure
// functions. Mirrors the cardState test style: no DOM, no real localStorage.
// `storage` is a Map-backed stub so reads/writes are deterministic.
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

// Map-backed storage stub (matches the shape used in cardState tests).
const fakeStorage = () => {
  const m = new Map();
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, v),
  };
};

// ── constants ────────────────────────────────────────────────────────────────

test('THEME_KEY is the versioned aiconbingo:theme:v1', () => {
  assert.equal(THEME_KEY, 'aiconbingo:theme:v1');
});

test('VALID_THEMES is exactly light + dark', () => {
  assert.deepEqual(VALID_THEMES, ['light', 'dark']);
});

test('DEFAULT_THEME is dark (preserves current look)', () => {
  assert.equal(DEFAULT_THEME, 'dark');
});

// ── readTheme ────────────────────────────────────────────────────────────────

test('readTheme returns DEFAULT_THEME when storage is empty', () => {
  assert.equal(readTheme(fakeStorage()), DEFAULT_THEME);
});

test('readTheme returns the persisted value when it is "light"', () => {
  const s = fakeStorage();
  s.setItem(THEME_KEY, 'light');
  assert.equal(readTheme(s), 'light');
});

test('readTheme returns the persisted value when it is "dark"', () => {
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

test('readTheme degrades to DEFAULT_THEME when storage.getItem throws', () => {
  const throwingStorage = {
    getItem() {
      throw new Error('SecurityError: localStorage is disabled');
    },
    setItem() {},
  };
  assert.equal(readTheme(throwingStorage), DEFAULT_THEME);
});

test('readTheme degrades to DEFAULT_THEME when storage is null', () => {
  assert.equal(readTheme(null), DEFAULT_THEME);
});

// ── writeTheme ───────────────────────────────────────────────────────────────

test('writeTheme persists "light"', () => {
  const s = fakeStorage();
  writeTheme(s, 'light');
  assert.equal(s.getItem(THEME_KEY), 'light');
});

test('writeTheme persists "dark"', () => {
  const s = fakeStorage();
  writeTheme(s, 'dark');
  assert.equal(s.getItem(THEME_KEY), 'dark');
});

test('writeTheme returns the value it persisted', () => {
  const s = fakeStorage();
  assert.equal(writeTheme(s, 'light'), 'light');
});

test('writeTheme throws on an unknown theme', () => {
  const s = fakeStorage();
  assert.throws(() => writeTheme(s, 'blue'), /invalid theme/i);
});

test('writeTheme throws on an empty string', () => {
  const s = fakeStorage();
  assert.throws(() => writeTheme(s, ''), /invalid theme/i);
});

test('writeTheme throws on a non-string value', () => {
  const s = fakeStorage();
  assert.throws(() => writeTheme(s, null), /invalid theme/i);
  assert.throws(() => writeTheme(s, 1), /invalid theme/i);
});

test('writeTheme does not persist when the value is invalid', () => {
  const s = fakeStorage();
  try {
    writeTheme(s, 'blue');
  } catch {
    /* expected */
  }
  assert.equal(s.getItem(THEME_KEY), null);
});

// ── toggleTheme ──────────────────────────────────────────────────────────────

test('toggleTheme("dark") returns "light"', () => {
  assert.equal(toggleTheme('dark'), 'light');
});

test('toggleTheme("light") returns "dark"', () => {
  assert.equal(toggleTheme('light'), 'dark');
});

test('toggleTheme treats any non-light value as dark → light', () => {
  // Defensive: an unexpected current value should resolve to a valid theme,
  // never produce "theme-undefined".
  assert.equal(toggleTheme('blue'), 'light');
  assert.equal(toggleTheme(undefined), 'light');
});
