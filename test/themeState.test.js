// Tech Spec BINGO-darkmode §Tests — unit tests for public/themeState.js pure
// functions. Mirrors the cardState test style: no DOM, no real localStorage;
// a Map-backed stub stands in for the Storage interface.
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

// Map-backed Storage stub (matches the cardState testing style).
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

test('VALID_THEMES is exactly light and dark', () => {
  assert.deepEqual(VALID_THEMES, ['light', 'dark']);
});

test('DEFAULT_THEME is dark (preserves the current look)', () => {
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

test('readTheme falls back to DEFAULT_THEME when getItem throws (private mode)', () => {
  const throwingStorage = {
    getItem: () => {
      throw new Error('SecurityError');
    },
    setItem: () => {},
  };
  assert.equal(readTheme(throwingStorage), DEFAULT_THEME);
});

// ── writeTheme ───────────────────────────────────────────────────────────────

test('writeTheme persists a valid "light" value', () => {
  const s = fakeStorage();
  writeTheme(s, 'light');
  assert.equal(s.getItem(THEME_KEY), 'light');
});

test('writeTheme persists a valid "dark" value', () => {
  const s = fakeStorage();
  writeTheme(s, 'dark');
  assert.equal(s.getItem(THEME_KEY), 'dark');
});

test('writeTheme throws on an unknown theme', () => {
  const s = fakeStorage();
  assert.throws(() => writeTheme(s, 'blue'));
});

test('writeTheme throws on an empty string', () => {
  const s = fakeStorage();
  assert.throws(() => writeTheme(s, ''));
});

test('writeTheme throws on a non-string input', () => {
  const s = fakeStorage();
  assert.throws(() => writeTheme(s, null));
  assert.throws(() => writeTheme(s, 42));
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

test('toggleTheme round-trips back to the original', () => {
  assert.equal(toggleTheme(toggleTheme('dark')), 'dark');
  assert.equal(toggleTheme(toggleTheme('light')), 'light');
});
