// Tech Spec BINGO-darkmode §Design — pure client state module for the
// light/dark theme toggle (no DOM). Mirrors the shape/style of cardState.js:
// lives in public/ so the browser imports it as a static ES module, and the
// caller passes `storage` in so tests can use a Map-backed stub.

export const THEME_KEY = 'aiconbingo:theme:v1';
export const VALID_THEMES = ['light', 'dark'];
export const DEFAULT_THEME = 'dark';

function isValidTheme(theme) {
  return VALID_THEMES.includes(theme);
}

// Returns 'light' | 'dark'. Falls back to DEFAULT_THEME for an empty,
// unknown, or unreadable value (e.g. localStorage disabled in private mode).
export function readTheme(storage) {
  let raw = null;
  try {
    raw = storage.getItem(THEME_KEY);
  } catch {
    return DEFAULT_THEME;
  }
  return isValidTheme(raw) ? raw : DEFAULT_THEME;
}

// Persists a valid theme and returns it. Throws on invalid input so callers
// never silently write garbage into storage.
export function writeTheme(storage, theme) {
  if (!isValidTheme(theme)) {
    throw new Error(`invalid theme: ${theme}`);
  }
  storage.setItem(THEME_KEY, theme);
  return theme;
}

// Returns the opposite theme. Any non-'light' input resolves to 'light' so a
// corrupted current value can never yield an invalid result.
export function toggleTheme(current) {
  return current === 'light' ? 'dark' : 'light';
}
