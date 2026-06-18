// Tech Spec BINGO-darkmode §Design — pure theme-state module (no DOM, no direct
// localStorage). Mirrors the shape/testing style of public/cardState.js: a
// `storage` object (anything with getItem/setItem) is passed in so tests can use
// a Map-backed stub. Lives in public/ so the browser imports it as a static ES
// module; tests import it from ../public/themeState.js via node:test.

export const THEME_KEY = 'aiconbingo:theme:v1';
export const VALID_THEMES = ['light', 'dark'];
export const DEFAULT_THEME = 'dark';

// Returns 'light' | 'dark'. Falls back to DEFAULT_THEME when storage is empty,
// holds an unknown value, or throws (e.g. localStorage blocked in private mode).
export function readTheme(storage) {
  let value = null;
  try {
    value = storage.getItem(THEME_KEY);
  } catch {
    return DEFAULT_THEME;
  }
  return VALID_THEMES.includes(value) ? value : DEFAULT_THEME;
}

// Persists a valid theme. Throws on anything outside VALID_THEMES so callers
// can't silently store garbage.
export function writeTheme(storage, theme) {
  if (!VALID_THEMES.includes(theme)) {
    throw new Error(`invalid theme: ${String(theme)}`);
  }
  storage.setItem(THEME_KEY, theme);
}

// Returns the opposite theme. 'dark' -> 'light', anything else -> 'dark'.
export function toggleTheme(current) {
  return current === 'dark' ? 'light' : 'dark';
}
