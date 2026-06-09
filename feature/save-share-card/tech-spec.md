# Tech Spec — Save & Share Your Bingo Card

**AIDLC phase:** Design (one **Unit** — single deployable client-side slice + a CI workflow; not split)
**Grounding:** Implements the approved **Product Spec** (`product-spec.md`). No org-wide ADRs exist in this repo yet; none are re-derived here.

---

## Overview

| Field | Value |
|-------|-------|
| **Unit / scope** | Client-side save/restore of the bingo card, optional display name, and share-as-image; plus a minimal test-CI workflow. |
| **Feature** | [`feature/save-share-card/`](./) — [issue #1](https://github.com/ggettert/aidlc-sandbox/issues/1) |
| **Product Spec** | [`product-spec.md`](./product-spec.md) — **Approved** 2026-06-09 |
| **Status** | Approved for build |
| **Author** | Grace Gettert |
| **Created** | 2026-06-09 |
| **Last updated** | 2026-06-09 |

## Context

### Summary

Add browser-local persistence and sharing to the existing AI Con Bingo page. On load the page restores the player's card, marked squares, and optional display name from `localStorage`; every change is saved automatically. The player can produce a PNG of their current card (rendered client-side on a `<canvas>`) and share it via the device's native share sheet, with a download fallback. "New Card" clears the saved state. **No server, API, or data-model changes** — the only backend-adjacent change is adding a CI workflow that runs the existing test suite.

### Existing system & documentation

- **Repo layout:** Node 20 + ES modules, Express 4, vanilla HTML/CSS/JS, no build step (`AGENTS.md`). Static files served from `public/`; pure game logic in `src/bingo.js`; tests via `node --test` in `test/`.
- **Prior art / patterns to follow:**
  - Pure, framework-free logic lives in importable ES modules and is unit-tested (`src/bingo.js` ↔ `test/bingo.test.js`). New pure logic follows the same pattern.
  - All client behavior is currently inline in `public/index.html` (`marked` array, `loadCard`, `toggle`, `checkWin`). The win-detection line set is duplicated there from `src/bingo.js` — this Unit does not change that.
- **Relevant ADRs:** none in repo.

### Out of scope for this Unit

- Server-side/cross-device persistence, accounts, or login (Product Spec out-of-scope).
- Challenge-a-friend / same-card play links; history/gallery; leaderboards.
- Refactoring the inline win-check to import `isWinningCard` (nice-to-have, not required here).

## Architecture

### High-level design

Everything runs in the browser; the server is untouched.

```
public/index.html  ── on load ──▶ try restore from localStorage
      │                              │ hit  ─▶ render saved card + marks + name
      │                              │ miss ─▶ GET /api/card ─▶ render ─▶ save
      │ toggle / name change ─▶ save(state)        (debounced not needed; cheap)
      │ "New Card"            ─▶ clear() ─▶ GET /api/card ─▶ render ─▶ save
      │ "Share"               ─▶ drawCanvas(state) ─▶ PNG blob
      │                              ─▶ navigator.share({files}) if canShare
      │                              ─▶ else download via object URL
      ▼
public/cardState.js  (NEW, pure ES module — no DOM)
      serialize / deserialize / validate the versioned state object
      imported BOTH by index.html (browser) and test/ (node:test)
```

- **New module `public/cardState.js`** holds the *pure* persistence logic (build/serialize/parse/validate the state object). It has no DOM or `localStorage` dependency so it is unit-testable under `node --test`. It lives in `public/` because only `public/` is served statically and the browser must `import` it as an ES module; there is no build step to bundle from `src/`. This is a deliberate, documented deviation from the "tests mirror `src/`" convention for client-only code. **Import path:** `index.html` and `cardState.js` are siblings at the static root (Express serves `public/` as `/`), so the browser imports it as `import { ... } from './cardState.js'` (served at `/cardState.js`, MIME `application/javascript`); tests import it as `../public/cardState.js`.
- **`localStorage` and `<canvas>`/share glue stay in `index.html`** (DOM-bound, validated via UI validation in Review, not unit tests).
- **Win detection in the renderer:** the canvas "🎉 BINGO!" banner reuses the **win-line set already inline in `index.html`** (`checkWin`). It does **not** import `isWinningCard` from `src/bingo.js` — that file is not served over HTTP (only `public/` is), and cross-dir browser import would 404. No *new* duplication is introduced beyond the pre-existing inline copy.

### Integration points

| System | Contract | Notes |
|--------|----------|-------|
| `GET /api/card` | Unchanged: returns `{ card: string[25], buzzwords }` | Called only on first load or "New Card". `buzzwords` remains unused client-side. |
| `localStorage` | key `aiconbingo:v1` → JSON state | Wrapped in try/catch; absence or failure degrades to current in-memory behavior. |
| Web Share API | `navigator.canShare({files})` / `navigator.share({files})` | Feature-detected; download fallback when unsupported (most desktops, some browsers). |

## Data

No server data or schema. **Client-only persisted state**, one `localStorage` key:

- **Key:** `aiconbingo:v1` (version embedded in the key *and* the payload).
- **Value (JSON):**

```json
{ "version": 1, "card": ["agentic", "...", "FREE", "..."], "marked": [false, "...", true, "..."], "name": "" }
```

- `card`: 25 strings, `"FREE"` at index 12 (matches `generateCard`).
- `marked`: 25 booleans, `marked[12]` always `true` (free space).
- `name`: trimmed string, capped at **40 chars**; `""` means no name.
- **Validation on read** (`cardState.deserialize`): JSON parses; `version === 1`; `card`/`marked` are length-25 arrays of the right primitive types; `name` is a string. **Any failure → return `null`** so the caller starts fresh (never throws, never renders a corrupt card).
- **No PII:** `name` is optional, user-supplied, need not be real (Product Spec constraint).

## APIs & contracts

No new or changed HTTP endpoints. New client module surface (`public/cardState.js`):

```js
export const STORAGE_KEY = 'aiconbingo:v1';
export const NAME_MAX = 40;
// Build a fresh, valid state object from a card array (+ optional name).
export function buildState(card, name = '');          // → {version,card,marked,name}
// Serialize state → string for localStorage. Throws only on non-serializable input.
export function serialize(state);                      // → string
// Parse + validate a stored string. Returns a valid state or null.
export function deserialize(raw);                      // → state | null
// Normalize a name (trim, cap to NAME_MAX).
export function normalizeName(name);                   // → string
```

`index.html` owns the impure wrappers: `save(state)`/`load()`/`clear()` around `localStorage`, the canvas renderer, and the share/download logic. Required control flow:

```js
// Load: restore-or-fetch. deserialize() null (missing/corrupt/wrong version) ⇒ treat as miss.
async function loadCard() {
  const state = deserialize(safeGet(STORAGE_KEY));   // safeGet: try/catch around localStorage
  if (state) { render(state); return; }
  const { card } = await (await fetch('/api/card')).json();
  const fresh = buildState(card, currentName());
  render(fresh); save(fresh);
}
// Share: toBlob is async — share/download happens INSIDE the callback, never before.
function share(state) {
  drawCanvas(state).toBlob(async (blob) => {
    const file = new File([blob], 'ai-con-bingo.png', { type: 'image/png' });
    if (navigator.canShare?.({ files: [file] })) {
      try { await navigator.share({ files: [file] }); }
      catch (e) { if (e.name !== 'AbortError') downloadBlob(blob); }  // ignore user-cancel
    } else { downloadBlob(blob); }
  }, 'image/png');
}
```

## UI / client

- **Name field:** a single optional text input above or beside the grid (`maxlength=40`), pre-filled from saved state; on input, normalize + persist. Empty shows no name on card/image.
- **Persistence:** `loadCard()` becomes restore-or-fetch; `toggle()` persists after each mark; "New Card" calls `clear()` then fetches.
- **Share button:** new button near "New Card". On click: render current state to an offscreen `<canvas>` (5×5 grid, marked cells highlighted in the existing palette, `FREE` styled, a "🎉 BINGO!" banner when the inline win-check passes, the name if set, and an "AI Con Bingo" footer), then export + share/download per the `share()` flow above. Use a **fixed canvas size** (e.g. 600×720 backing store, optionally 2× device-pixel scale for crisp PNGs); clip/ellipsize long buzzwords and the (≤40-char) name so text never overflows a cell.
- **Accessibility / feel:** keep the existing mobile-first layout and color palette; the name input has an associated `<label for>`; the share button is a real `<button>` (keyboard-reachable, labeled); saving is invisible/automatic (Product Spec "zero friction"). Canvas text uses system fonts (no external font load). Name is rendered into the DOM via `textContent` (never `innerHTML`).

## Security & privacy

- No auth (by Product decision). No secrets. No network egress beyond the existing same-origin `GET /api/card`.
- `name` is rendered into the canvas as text only (no `innerHTML`); when shown in the DOM it is set via `textContent`, so no XSS sink is introduced.
- `localStorage` is per-origin/per-device; clearing browser data removes it. No tracking, no third parties.

## Acceptance criteria (for Review)

- [ ] Marking squares then reloading the **same browser** restores the identical card layout and marks (Product SC#1).
- [ ] Optional display name persists, renders on the card and in the shared image, and is capped at 40 chars; blank is graceful (SC#2).
- [ ] "Share" produces a PNG reflecting current buzzwords, marked squares, BINGO state, and name; uses Web Share when available, download fallback otherwise (SC#3).
- [ ] No login; a second browser/incognito starts fresh (SC#4).
- [ ] "New Card" clears saved state so a later reload restores the **new** card, not the old one (SC#5).
- [ ] `localStorage` unavailable/disabled (e.g. private mode) or a corrupt/`null`-deserializing entry degrades gracefully: the page fetches a fresh card and never throws.
- [ ] Cancelling the native share sheet (AbortError) does not error or spuriously download.
- [ ] No new runtime dependencies added; no build step introduced (`AGENTS.md`).
- [ ] `public/cardState.js` pure functions are unit-tested; `package.json` test script is `node --test`; `npm test` green.
- [ ] CI workflow runs `npm ci && npm test` on PRs to `main` and is green on the PR.

## Testing approach

| Layer | What we prove | Notes |
|-------|----------------|-------|
| Unit | `cardState.js`: `buildState` shape (len-25, FREE@12, marked[12]=true; normalizes a >40-char name); `serialize`/`deserialize` round-trip; `deserialize` returns `null` on bad JSON, wrong version, wrong shape, **wrong array length (≠25)**, wrong types, **and tampered `marked[12] !== true`**; `normalizeName` trims, caps at 40, handles unicode/empty. Existing `bingo.js` win logic already covered. | `node --test`, new `test/cardState.test.js` importing `../public/cardState.js`. No DOM needed. |
| Integration | *(optional, nice-to-have)* `GET /api/card` still returns a 25-cell card with `FREE` center (guards against accidental server change). | Lightweight test on the exported Express `app`; **no new deps** — set `NODE_ENV=test` (existing guard skips auto-listen), `const srv = app.listen(0)`, `fetch` its assigned port, `srv.close()` in teardown. Not required for the Review gate; `generateCard` is already covered by `bingo.test.js`. |
| E2E / manual | Reload-restore, name render, BINGO banner, share→Web Share vs download fallback, private-mode degradation. | **Chrome DevTools MCP UI validation** in Review per `docs/INTERACTIVE-UI-VALIDATION.md`. Canvas/share/localStorage are browser APIs not exercisable in `node --test`. Note: Web Share *with files* needs Chrome/Edge or iOS Safari ≥15.1; older browsers exercise the download fallback. |

**Test runner change (in this Unit):** update `package.json` `test` script from `node --test test/**/*.test.js` to **`node --test`** (Node 20 auto-discovers `*.test.js`). The glob form depends on shell globstar and silently matches nothing under `sh`, which would make CI falsely "green." This is the one `package.json` change in this Unit.

## Rollout & operations

### Rollout plan
Additive static-client change plus one CI workflow. No migration, no feature flag, no backwards-compat concern (new `localStorage` key; absence handled). Deploy = publish static files + server (unchanged).

**Operational action (human, one-time):** adding `.github/workflows/ci.yml` does **not** by itself make CI a *required* check. After it merges, configure branch protection on `main` (Settings → Branches, or API `required_status_checks`) to require the test job — otherwise `/build`'s "green CI" gate is advisory only and won't block a red PR. The new workflow triggers on `pull_request`/`push` to `main` and does not conflict with `aidlc-launch.yml` (which triggers on issues/comments/dispatch).

### Monitoring & observability
None required (no backend behavior change). Existing `GET /api/healthz` unchanged.

### Rollback
Revert the PR. Stale `aiconbingo:v1` entries left in users' browsers are harmless and self-heal: an older client simply ignores the key; "New Card" overwrites it.

## Risks & open technical questions

| Risk / question | Mitigation or owner |
|-----------------|---------------------|
| Web Share file support varies (desktop, some iOS/Safari versions). | Feature-detect `navigator.canShare({files})`; download fallback always available. |
| `localStorage` disabled or quota error (private mode). | All access wrapped in try/catch; degrade to today's in-memory behavior; never crash. |
| Long buzzwords/names overflow canvas cells. | Cap name at 40 chars; size/wrap/clip text in the renderer; pick a fixed canvas size. |
| Saved schema drift over time. | `version` in key + payload; `deserialize` discards anything not v1. |
| CI workflow + submodule checkout (skills are a submodule). | Test job does **not** need the submodule; use `actions/checkout` without `submodules` and `npm ci` against committed `package-lock.json`. |
| Win-check logic duplicated in `index.html` vs `bingo.js`. | Pre-existing; out of scope. Renderer reuses the same line set; no new duplication of substance. |

## Change history

| Date | Author | Changes |
|------|--------|---------|
| 2026-06-09 | Grace Gettert | Initial draft. |
| 2026-06-09 | Grace Gettert | Folded in 5 review passes (architecture, frontend, backend, testing, CI): pinned module import path; renderer reuses inline win-check (no cross-dir import); restore-or-fetch + async `toBlob` + share-cancel control flow; switched test script to `node --test`; added deserialize edge cases; documented branch-protection action. |
