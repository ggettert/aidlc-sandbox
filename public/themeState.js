// Tech Spec BINGO-darkmode §Design — pure client state module for the
// light/dark theme toggle (no DOM). Mirrors the shape/style of cardState.js.
// `storage` is injected (localStorage in the browser, a stub in tests) so the
// module stays free of global side effects.

export const THEME_KEY = 'aiconbingo:theme:v1';
export const VALID_THEMES = ['light', 'dark'];
export const DEFAULT_THEME = 'dark';

// Resolve the persisted theme. Returns DEFAULT_THEME when storage is empty,
// unreadable, or holds anything outside VALID_THEMES (e.g. 'blue', '', garbage).
export function readTheme(storage) {
  try {
    const value = storage.getItem(THEME_KEY);
    return VALID_THEMES.includes(value) ? value : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

// Persist a valid theme. Throws on anything outside VALID_THEMES rather than
// silently writing junk that readTheme would later discard.
export function writeTheme(storage, theme) {
  if (!VALID_THEMES.includes(theme)) {
    throw new Error(`Invalid theme: ${String(theme)}`);
  }
  storage.setItem(THEME_KEY, theme);
}

// Flip to the other theme. 'dark' -> 'light', anything else -> 'dark'.
export function toggleTheme(current) {
  return current === 'dark' ? 'light' : 'dark';
}
