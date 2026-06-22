// Tech Spec BINGO-darkmode §Design — pure client state module for the
// light/dark theme toggle (no DOM access). Lives in public/ so the browser can
// import it as a static ES module; tests import it from ../public/themeState.js
// via node:test. Mirrors the shape and testing style of cardState.js.
//
// `storage` is passed in (rather than referencing the global `localStorage`) so
// tests can substitute a Map-backed stub — same convention cardState uses.

export const THEME_KEY = 'aiconbingo:theme:v1';
export const VALID_THEMES = ['light', 'dark'];
export const DEFAULT_THEME = 'dark';

// Read the persisted theme, falling back to DEFAULT_THEME when storage is
// empty, holds an invalid value, or is unavailable (e.g. private-mode throws).
export function readTheme(storage) {
  let raw;
  try {
    raw = storage.getItem(THEME_KEY);
  } catch {
    return DEFAULT_THEME;
  }
  return VALID_THEMES.includes(raw) ? raw : DEFAULT_THEME;
}

// Persist a theme. Throws on anything outside VALID_THEMES so callers can't
// silently write garbage that readTheme would later discard.
export function writeTheme(storage, theme) {
  if (!VALID_THEMES.includes(theme)) {
    throw new Error(`invalid theme: ${String(theme)}`);
  }
  storage.setItem(THEME_KEY, theme);
}

// Return the opposite theme. 'dark' -> 'light', anything else -> 'dark'.
export function toggleTheme(current) {
  return current === 'dark' ? 'light' : 'dark';
}
