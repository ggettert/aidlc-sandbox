# ADR-0002: Pure client module lives in `public/` not `src/`

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-09 |
| **Deciders** | Grace Gettert |
| **Related** | [Tech Spec §Architecture](../feature/save-share-card/tech-spec.md), [ADR-0001](0001-client-only-persistence-via-localstorage.md) |

---

## Context

The app has a deliberate **no-build-step** constraint (AGENTS.md). Express serves only the `public/` directory as the static root. The new `cardState.js` module contains pure logic (no DOM, no `localStorage`) that needs to be:

1. Imported by the browser as an ES module (`import './cardState.js'` from `index.html`).
2. Imported by `node:test` unit tests (`import '../public/cardState.js'`).

The existing convention is: pure logic lives in `src/`, tests mirror that layout in `test/`.

## Decision

`cardState.js` lives in **`public/`**, not `src/`. This is a **deliberate, documented deviation** from the `src/` convention for client-only pure modules.

The browser can only `import` ES modules via HTTP. Express only serves `public/`, so `src/bingo.js` is not reachable from the browser. Moving purely-client modules to `public/` is the correct home when there is no bundler. Tests import them via relative path (`../public/cardState.js`) — Node's ESM resolver handles cross-directory imports without issue.

## Options considered

| Option | Summary | Why not chosen |
|--------|---------|----------------|
| **`public/cardState.js` (chosen)** | Served statically; imported by browser and tests | Deviates from src/ convention |
| `src/cardState.js` | Consistent with convention | Not reachable from browser without a bundler; would 404 |
| Introduce a build step (Vite/esbuild) | Enables `src/` modules in the browser | Contradicts no-build-step constraint; adds complexity to a teaching sandbox |
| Inline logic in `index.html` | No new file | Not unit-testable; grows the already-large inline script |
| Duplicate file: `src/` for tests, `public/` for browser | One source of truth per env | Dual maintenance; divergence risk worse than the convention deviation |

## Consequences

### Positive

- `cardState.js` is unit-testable under `node:test` without any test framework setup.
- No new tooling introduced.
- Pattern is explicit and documented.

### Negative / trade-offs

- `public/` now contains both static assets **and** application logic — conceptually mixed.
- New contributors may put future client modules in `src/` by reflex and hit the "why won't this import?" failure.

### Neutral / follow-ups

- If a build step is ever introduced (Vite, esbuild), `cardState.js` and any similar modules should migrate to `src/`. The ADR should be updated to Superseded at that point.
- Convention override: **any pure module that must be imported by the browser AND tested goes in `public/`** until a build step exists.

## Compliance & verification

- `public/*.js` files that contain pure logic should have a corresponding `test/*.test.js` file.
- Code review should flag any new `src/` module that `index.html` tries to import — it will 404.

## References

- [Tech Spec §Architecture](../feature/save-share-card/tech-spec.md) — deliberate deviation documented inline
