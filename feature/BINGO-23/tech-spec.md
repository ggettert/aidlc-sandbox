# Tech Spec — BINGO-23: Pink & teal color scheme

**AIDLC phase:** Design (one **Unit** — independently buildable cosmetic recolor)
**Grounding:** Implements the approved Product Spec `feature/BINGO-23/product-spec.md`. Aligns with (does not change) ADR-0002 (pure client module) and ADR-0003 (canvas PNG share image).

---

## Overview

| Field | Value |
|-------|-------|
| **Unit / scope** | Recolor the live bingo UI **and** the canvas share-card to a dark pink + teal palette. Single file touched for app code: `public/index.html`. |
| **Feature** | `feature/BINGO-23/` (parent work item per `AGENTS.md` → Issue tracker: tracking issue carries `AIDLC feature folder: feature/BINGO-23/`) |
| **Product Spec** | [`product-spec.md`](./product-spec.md) — approved |
| **Status** | Draft — pending human approval before `/build` |
| **Author** | DevOps Bot (fleet designer) |
| **Created** | 2026-06-17 |
| **Last updated** | 2026-06-17 |

## Context

### Summary

A **purely cosmetic** recolor. AI Con Bingo currently renders in dark navy
(`#1a1a2e`) with amber-yellow (`#ffd166`) and red (`#e94560`) accents. This Unit
swaps the palette to **dark teal surfaces** with a **bright teal** primary accent
(headings/buttons/focus) and **pink** active states (marked cells / FREE space /
winner). The exact hex values are fixed in this spec (DevOps Bot's call, per the
Product Spec decision log) so `/build` is a mechanical, reviewable substitution.

No HTML structure, JS behavior, card logic, win detection, or API changes. Both
render paths — the CSS-styled DOM and the `drawCanvas()` share image — must change
in lockstep so the on-screen card and the exported PNG share one palette
(Product Spec success criteria #1, #2).

### Existing system & documentation

- **Repo layout:** Node 20 / Express 4, no build step. App code: `src/server.js`
  (routes), `src/bingo.js` (card + win logic), `public/index.html` (UI **and**
  inline canvas renderer), `public/cardState.js` (pure state module).
- **Where the colors live:** **`public/index.html` only.** Two places inside it:
  1. the `<style>` block (lines ~7–20) — live DOM theme;
  2. the `drawCanvas(s)` function (lines ~136–195) — share-card PNG.
  `src/` contains **no** color literals (verified by grep). `cardState.js` is
  colorless.
- **Relevant ADRs:** `adr/0002-pure-client-module-in-public-dir.md`,
  `adr/0003-canvas-png-for-share-image.md`. This recolor changes **fill/stroke
  values only**, not either decision → **no ADR change, no new ADR**.
- **Prior art:** `feature/save-share-card` (introduced the canvas) and the
  existing palette established the colors being replaced.

### Out of scope for this Unit

- Any change to buzzword content, `generateCard`, `LINES`, win detection,
  name entry, `/api/card`, `/api/status`, `/api/healthz`.
- Light mode / theme toggle / theme persistence.
- Font, layout, spacing, or structural CSS changes.
- CSS-variable refactor (see Risks — proposed as a non-blocking follow-up only).

## Architecture

### High-level design

This is a **constant-substitution** change across two render paths that must stay
visually identical:

```
                 public/index.html
                 ┌───────────────────────────────────────┐
   browser DOM ← │ <style> block      ── color literals ──┼─┐
                 │ drawCanvas(s)      ── color literals ──┼─┤  ONE palette,
   PNG export  ← │ (canvas → toBlob → share/download)     │ │  applied twice
                 └───────────────────────────────────────┘ │
                                                            ▼
                                              feature/BINGO-23 token map (below)
```

Boundary discipline: no new modules, no new dependencies, no server touch. The
only acceptable code-shape change beyond literal swaps is the **text-color
selection** for marked cells (one conditional, both render paths) needed to keep
text legible on pink — see "Contrast decisions".

### Integration points

| System | Contract | Notes |
|--------|----------|-------|
| Live DOM theme (`<style>`) | Visual only | No class names or selectors change |
| Canvas share image (`drawCanvas`) | PNG pixels | Must match DOM palette exactly |
| `/api/*` endpoints | Unchanged | No request/response change |
| localStorage state (`aiconbingo:v1`) | Unchanged | Schema/version untouched |

## Data

No data, schema, storage, migration, or PII changes. The localStorage key and
`version: 1` shape in `cardState.js` are untouched.

## APIs & contracts

No API changes. `GET /api/card`, `GET /api/status`, `GET /api/healthz` keep their
exact request/response shapes.

## UI / client

### The palette (final hex values)

| Token / role | Old | **New** |
|---|---|---|
| Page background | `#1a1a2e` (navy) | **`#0d2b2b`** (deep teal) |
| Surface — cell bg (unmarked) | `#16213e` | **`#123c3c`** |
| Surface — name input bg | `#16213e` | **`#123c3c`** |
| Border — cell / input | `#0f3460` | **`#1c5757`** |
| Hover — cell bg | `#233a5e` | **`#1f5e5e`** |
| Primary accent — h1 / button bg / input focus border | `#ffd166` (amber) | **`#2ec4b6`** (bright teal) |
| Text on accent (button/FREE/marked label) | `#1a1a2e` | **`#0d2b2b`** (dark) |
| Active — marked cell bg | `#e94560` (red) | **`#ff5da2`** (pink) |
| Active — marked cell border | `#ffd166` | **`#ff8cc6`** (light pink ring) |
| Active — FREE cell bg | `#ffd166` | **`#ff5da2`** (pink) |
| Active — winner banner text | `#ffd166` | **`#ff5da2`** (pink) |
| Primary text | `#eaeaea` | **`#eaeaea`** (unchanged) |
| Canvas banner overlay | `rgba(26,26,46,0.75)` | **`rgba(13,43,43,0.75)`** (teal-tinted) |
| Neutral — name label `#aaa`, footer `#555` | — | **unchanged** (palette-neutral greys, contrast-OK) |

### Contrast decisions (Product Spec principle: "Legible")

WCAG AA contrast (4.5:1 normal text, 3:1 large) on the new dark-teal surfaces:

| Pair | Ratio | Verdict |
|---|---|---|
| `#eaeaea` text on `#0d2b2b` bg | ~12.4 | ✅ |
| `#eaeaea` cell text on `#123c3c` cell | ~10.0 | ✅ |
| `#2ec4b6` heading on `#0d2b2b` | ~6.9 | ✅ |
| `#0d2b2b` button text on `#2ec4b6` button | ~6.9 | ✅ |
| `#ff5da2` winner text (large) on `#0d2b2b` | ~5.3 | ✅ |
| `#eaeaea` text on `#ff5da2` (pink) | **~2.4** | ❌ fails |
| **`#0d2b2b` text on `#ff5da2` (pink)** | **~5.3** | ✅ |

**Consequence:** pink active surfaces (marked cells, FREE) require **dark** text,
not the light `#eaeaea` used today on red. This is the one place the code shape
changes beyond literal swaps:

- **DOM:** add `color: #0d2b2b;` to the `.cell.marked` rule. `.cell.free` already
  sets a dark text color — just update its value to `#0d2b2b`.
- **Canvas:** the cell-text `fillStyle` ternary at line ~175 currently picks dark
  only for the FREE cell (`i === 12 ? '#1a1a2e' : '#eaeaea'`). Change it to pick
  dark for **FREE or marked** cells: `(i === 12 || s.marked[i]) ? '#0d2b2b' : '#eaeaea'`.

This is a legibility fix, not a behavior change — no marking/win logic is affected.

### Exact change inventory (for `/build`)

`/build` should treat this as the authoritative checklist. **`public/index.html` only.**

**`<style>` block:**
1. `body { background: #1a1a2e }` → `#0d2b2b`
2. `h1 { color: #ffd166 }` → `#2ec4b6`
3. `.name-wrap input { background: #16213e; border: 2px solid #0f3460 }` → `#123c3c` / `#1c5757`
4. `.name-wrap input:focus { border-color: #ffd166 }` → `#2ec4b6`
5. `.cell { background: #16213e; border: 2px solid #0f3460 }` → `#123c3c` / `#1c5757`
6. `.cell:hover { background: #233a5e }` → `#1f5e5e`
7. `.cell.marked { background: #e94560; border-color: #ffd166 }` → `#ff5da2` / `#ff8cc6`; **add** `color: #0d2b2b`
8. `.cell.free { background: #ffd166; color: #1a1a2e }` → `#ff5da2` / `#0d2b2b`
9. `.winner { color: #ffd166 }` → `#ff5da2`
10. `button { background: #ffd166; color: #1a1a2e }` → `#2ec4b6` / `#0d2b2b`

**`drawCanvas(s)`:**
11. bg `fillStyle = '#1a1a2e'` (≈L136) → `#0d2b2b`
12. header `fillStyle = '#ffd166'` (≈L140) → `#2ec4b6`
13. name `fillStyle = '#eaeaea'` (≈L147) → unchanged
14. cell fill (≈L159/161/163): FREE `#ffd166`→`#ff5da2`; marked `#e94560`→`#ff5da2`; unmarked `#16213e`→`#123c3c`
15. border `strokeStyle` (≈L169): marked `#ffd166`→`#ff8cc6`; unmarked `#0f3460`→`#1c5757`
16. cell-text `fillStyle` ternary (≈L175): `i===12 ? '#1a1a2e' : '#eaeaea'` → `(i===12 || s.marked[i]) ? '#0d2b2b' : '#eaeaea'`
17. banner overlay (≈L183) `rgba(26,26,46,0.75)` → `rgba(13,43,43,0.75)`; banner text (≈L185) `#ffd166`→`#ff5da2`
18. footer `fillStyle = '#555'` (≈L192) → unchanged

After this, **no** instance of `#1a1a2e`, `#ffd166`, `#e94560`, `#16213e`,
`#0f3460`, `#233a5e`, or `rgba(26,26,46,...)` should remain in the file.

## Security & privacy

None. No auth, secrets, inputs, or data flows touched. Color literals only.

## Acceptance criteria (for Review)

- [ ] **AC1** — `public/index.html` contains the new palette (`#0d2b2b`,
  `#123c3c`, `#1c5757`, `#1f5e5e`, `#2ec4b6`, `#ff5da2`, `#ff8cc6`) and **none**
  of the retired literals (`#1a1a2e`, `#ffd166`, `#e94560`, `#16213e`, `#0f3460`,
  `#233a5e`, `rgba(26,26,46,...)`). _(Product Spec criterion #1 — "no leftover navy/amber/red".)_
- [ ] **AC2** — Live page: dark-teal background, teal heading/buttons, unmarked
  cells teal, marked cells pink with dark legible text, FREE pink, winner banner
  pink. _(criterion #1, #4)_
- [ ] **AC3** — Downloaded/shared PNG visually matches the live card's palette
  (same seven roles). _(criterion #2)_
- [ ] **AC4** — No behavior change: `npm test` passes unchanged; marking, win
  detection, FREE invariant, name entry, and `/api/status` behave identically.
  _(criterion #3)_
- [ ] **AC5** — Marked-cell and FREE-cell text meet WCAG AA (≥4.5:1) on pink;
  all other text/role pairs remain ≥ their prior contrast. _(criterion #4)_

## Testing approach

The recolor must not regress logic, and the palette swap should be CI-guardable.

| Layer | What we prove | Notes |
|-------|----------------|-------|
| Unit (existing) | No behavior change | `test/bingo.test.js`, `test/cardState.test.js`, `test/server.test.js` are color-agnostic and must pass **unchanged**. This is the "no regression" guarantee (AC4). |
| Unit (new) | Palette applied & old palette fully removed | Add `test/theme.test.js` (`node --test`): read `public/index.html` as text; assert it **contains** each new hex and **does not contain** any retired literal. Cheap, deterministic, directly enforces AC1 and catches a spot missed in either the CSS **or** the canvas. |
| E2E / manual | Visual parity DOM ↔ PNG + contrast | Load page: verify background, heading, unmarked/marked/FREE/winner colors and dark text on pink. Mark a line → winner banner pink. Click **Share** → open the PNG → confirm same palette. Quick contrast spot-check on marked/FREE text (AC5). |

`test/theme.test.js` (proposed — final form decided in `/build`):

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'url';
import path from 'path';

const html = readFileSync(
  path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'index.html'),
  'utf8'
);
const NEW = ['#0d2b2b','#123c3c','#1c5757','#1f5e5e','#2ec4b6','#ff5da2','#ff8cc6'];
const OLD = ['#1a1a2e','#ffd166','#e94560','#16213e','#0f3460','#233a5e','rgba(26,26,46'];

test('new pink+teal palette is present', () => {
  for (const c of NEW) assert.ok(html.includes(c), `missing new color ${c}`);
});
test('no navy/amber/red palette remains', () => {
  for (const c of OLD) assert.ok(!html.includes(c), `leftover old color ${c}`);
});
```

> Note for `/build`: the OLD-color assertion must run **after** all swaps,
> including the canvas. `#eaeaea`, `#aaa`, `#555` are intentionally retained and
> are **not** in the OLD list.

## Rollout & operations

### Rollout plan

Single PR, no flags, no migration. Static asset change served by Express; effective
on deploy. Fully backward compatible — no state, API, or schema change.

### Monitoring & observability

None required. Existing `/api/healthz` unaffected. A cosmetic change has no new
metrics, logs, or alerts.

### Rollback

Revert the PR (git revert). No data or state to unwind; safe and instantaneous.

## Risks & open technical questions

| Risk / question | Mitigation or owner |
|-----------------|---------------------|
| A color spot missed in one render path (DOM vs canvas) → live UI and PNG diverge | `test/theme.test.js` asserts no old literal survives; manual PNG-vs-DOM check in E2E (AC3) |
| Light text left on pink → unreadable marked/FREE cells | Mandated dark-text rule + AC5 contrast check; explicit in change inventory items 7, 8, 16 |
| Two hard-coded copies of the palette invite future drift | **Non-blocking follow-up:** factor into CSS custom properties / a shared JS color map. Deliberately deferred to keep this PR a minimal, low-risk recolor (Out of scope). |
| Final hexes are DevOps Bot's call but never seen on-screen by Product | Values pinned here from the Product Spec's proposed direction; surface the rendered result at the Review/Validate gate for sign-off |

## Appendix A — Tech Spec review passes

Five passes run per the `/design` contract; findings folded into the doc above.

1. **Architecture / boundaries (`architecture`)** — Confirmed single-Unit,
   single-file (`public/index.html`) blast radius; no new modules/deps; ADR-0002
   & ADR-0003 unaffected (fills/strokes only, not the decisions). Flagged the
   two-copies-of-the-palette duplication as a future-drift risk → logged as a
   non-blocking CSS-variable follow-up rather than expanding this PR's scope.
2. **Frontend (`frontend-web`)** — Recolor only; no component/state/structure
   change. Caught the **contrast failure of light text on pink** (`#eaeaea` on
   `#ff5da2` ≈ 2.4:1) → added the mandated dark-text rule for marked/FREE in both
   render paths (inventory items 7, 8, 16) and the AA contrast table. Hover state
   kept visually distinct (`#1f5e5e` lighter than border `#1c5757`).
3. **Backend / API (`backend-saas`)** — No backend surface touched. `src/` has
   no color literals (grep-verified); routes, validation, and the localStorage
   contract are unchanged. Nothing to do.
4. **Testing strategy (`testing`)** — Existing logic tests must pass unchanged
   (regression guarantee). Added a deterministic `theme.test.js` that enforces
   "new present / old absent" across the whole file, closing the gap that the DOM
   and canvas can drift independently. Visual DOM-vs-PNG parity remains a manual
   E2E step (canvas pixels aren't unit-testable here).
5. **CI / Docker / deploy (`architecture` + workflows)** — Reviewed
   `.github/workflows/ci.yml` (`npm ci` + `npm test` on Node 20) and
   `aidlc-launch.yml`. No Dockerfile / `docker-compose` in this repo. The new
   `theme.test.js` is picked up automatically by `node --test test/*.test.js`
   — no CI change needed. Static-asset-only deploy; no rollout machinery.

## Change history

| Date | Author | Changes |
|------|--------|---------|
| 2026-06-17 | DevOps Bot (fleet designer) | Initial draft — pink+teal palette, contrast analysis, change inventory, theme test, 5 review passes |
