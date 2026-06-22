# Tech Spec — Light/Dark Mode Toggle

**Ticket:** BINGO-darkmode
**Status:** ready for build
**Author:** Kit (drafted via the Aegra sdlc-feature smoke run, 2026-06-17)

## Goal

Add a user-toggleable light/dark theme to the AI Con Bingo card. The
current UI is dark-only (hardcoded teal/pink palette). Users should be
able to switch between light and dark, with the choice persisted across
reloads.

## Out of scope

- System / OS theme auto-detection (`prefers-color-scheme`). The toggle
  is explicit-user-choice only for V1.
- Per-card themes. The theme is global, not stored alongside `cardState`.
- Animated transitions. Themes swap instantly via class change.

## Requirements

1. *Toggle control* in `public/index.html`. A button labeled "🌙" (when
   in light) or "☀️" (when in dark). Placed in the existing `.controls`
   row, after the existing buttons.
2. *Theme is persisted* in `localStorage` under a new key
   `aiconbingo:theme:v1`. Values: `"light"` | `"dark"`.
3. *Default theme is `"dark"`* (preserves the current look for existing
   users who haven't toggled).
4. *Theme is applied via a CSS class on `<body>`*: `theme-dark` (default,
   current colors) or `theme-light` (new palette).
5. *Light palette* uses high-contrast accessible colors:
    - body bg `#fafafa`, text `#1a1a1a`
    - cell bg `#ffffff`, border `#d0d0d0`
    - cell hover `#f0f0f0`
    - marked cell bg `#e91e63`, text `#ffffff`
    - winner text `#e91e63`
    - button bg `#e91e63`, text `#ffffff`
    - input bg `#ffffff`, border `#d0d0d0`, focused border `#e91e63`
6. *No theme flash on load.* The persisted theme must be applied before
   the body renders (read localStorage in a `<head>` script, set the
   body class before paint).

## Design

### `public/index.html`

- Move the existing color CSS into a `.theme-dark` selector. Add a
  parallel `.theme-light` selector with the light palette above.
- Add `<script>` block in `<head>` that reads `localStorage` under the
  new key and applies the resolved class to `document.body` BEFORE the
  body renders. (Use a `<script>` after the `<body>` open tag if the
  inline-in-head approach is awkward; the constraint is "before paint",
  not "in head specifically.")
- Add a `<button id="themeToggle">` to the `.controls` row.

### `public/themeState.js` (new file)

Pure-state module mirroring the shape of `cardState.js`:

```js
export const THEME_KEY = 'aiconbingo:theme:v1';
export const VALID_THEMES = ['light', 'dark'];
export const DEFAULT_THEME = 'dark';

export function readTheme(storage) { ... }   // returns 'light' | 'dark'
export function writeTheme(storage, theme) { ... }   // throws on invalid
export function toggleTheme(current) { ... }   // returns the other
```

`storage` is passed in so tests can use a stub (matches `cardState`'s
testing style).

### Wiring in `<script type="module">` in `index.html`

```js
import { readTheme, writeTheme, toggleTheme } from './themeState.js';

// Set initial class (also handled inline-in-head; this is a safety net)
document.body.className = 'theme-' + readTheme(localStorage);

document.getElementById('themeToggle').addEventListener('click', () => {
  const current = readTheme(localStorage);
  const next = toggleTheme(current);
  writeTheme(localStorage, next);
  document.body.className = 'theme-' + next;
  document.getElementById('themeToggle').textContent =
    next === 'dark' ? '☀️' : '🌙';
});
```

## Tests (TDD — write first, per /build's discipline)

`test/themeState.test.js`, modeled after the existing `cardState`
tests. Cover:

1. `readTheme` returns `DEFAULT_THEME` when storage is empty.
2. `readTheme` returns the persisted value when it's `'light'` or
   `'dark'`.
3. `readTheme` falls back to `DEFAULT_THEME` when the persisted value
   is invalid (e.g. `'blue'`, empty string, JSON garbage).
4. `writeTheme` persists valid values.
5. `writeTheme` throws on invalid input.
6. `toggleTheme('dark')` returns `'light'` and vice versa.

Storage can be a Map-backed stub:

```js
const fakeStorage = () => {
  const m = new Map();
  return {
    getItem: k => m.has(k) ? m.get(k) : null,
    setItem: (k, v) => m.set(k, v),
  };
};
```

Maintain ≥90% line coverage on `themeState.js`.

## Acceptance

- [ ] Toggle button visible in the `.controls` row
- [ ] Clicking toggle swaps body class between `theme-dark` and
      `theme-light`
- [ ] Reload preserves the chosen theme
- [ ] First load (no localStorage) defaults to dark — current UI is
      unchanged for existing users
- [ ] No theme flash on reload (the persisted theme is applied before
      paint)
- [ ] `npm test` passes; coverage on `themeState.js` ≥ 90%
- [ ] Light palette is readable (eyeball check; no formal a11y audit
      required for V1)

## Non-requirements explicitly

- No backend changes. `server.js` is untouched.
- No changes to `cardState.js`. Theme and card state are independent.
- No `prefers-color-scheme` media query. Explicit toggle only.
