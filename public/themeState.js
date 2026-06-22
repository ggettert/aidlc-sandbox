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

// The toggle button glyph for a given theme: ☀️ in dark (tap to go light),
// 🌙 in light (tap to go dark). Single source of truth so index.html's wiring
// and the no-flash inline script don't drift.
export function themeIcon(theme) {
  return theme === 'dark' ? '☀️' : '🌙';
}

// Apply the persisted theme to the document: set the <body> class and sync the
// toggle glyph. `doc`/`storage` are injected so this is unit-testable with
// stubs (same DI style as readTheme). Tolerates a missing toggle button.
export function applyTheme(doc, storage) {
  const theme = readTheme(storage);
  doc.body.className = 'theme-' + theme;
  const btn = doc.getElementById('themeToggle');
  if (btn) btn.textContent = themeIcon(theme);
  return theme;
}

// Flip to the opposite theme, persist it (best-effort — private mode may block
// the write), and re-apply to the document. Returns the new theme. The DOM is
// always updated even if persistence fails, so the toggle still works visually.
export function applyToggle(doc, storage) {
  const next = toggleTheme(readTheme(storage));
  try {
    writeTheme(storage, next);
  } catch {
    /* localStorage blocked (private mode): apply visually, just don't persist */
  }
  doc.body.className = 'theme-' + next;
  const btn = doc.getElementById('themeToggle');
  if (btn) btn.textContent = themeIcon(next);
  return next;
}
