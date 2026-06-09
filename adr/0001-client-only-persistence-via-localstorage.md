# ADR-0001: Client-only persistence via localStorage

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-09 |
| **Deciders** | Grace Gettert |
| **Related** | [Product Spec](../feature/save-share-card/product-spec.md), [Tech Spec](../feature/save-share-card/tech-spec.md) |

---

## Context

The Save & Share feature requires card state (buzzwords layout, marked squares, player name) to survive a page refresh on the same device. The app is a teaching sandbox with no accounts, no backend data layer, and an explicit constraint to keep dependencies minimal.

## Decision

All game state is persisted **client-side only** using a single `localStorage` key (`aiconbingo:v1`). The server is never involved in save/restore. A versioned JSON schema (`{version, card, marked, name}`) with strict validation on read (`deserialize()` returns `null` on any malformed entry) ensures corrupt or stale data never crashes the page — it simply triggers a fresh card fetch.

## Options considered

| Option | Summary | Why not chosen |
|--------|---------|----------------|
| **localStorage (chosen)** | Per-origin, per-device; zero backend; immediate reads/writes | — |
| Server-side storage + token | Enables cross-device resume | Requires auth, backend data model, and a network round-trip on every load — contradicts product constraints |
| URL-encoded state | Card embedded in the URL; sharable | URL length limits; ugly UX; state lost when user navigates away; share goal is an image, not a link |
| sessionStorage | Survives tab reload but not re-open | Doesn't cover the "phone locks and reopens browser" scenario |

## Consequences

### Positive

- Zero new server code, zero new dependencies.
- Save/restore works offline (conference wifi resilience).
- Simple to reason about; no sync conflicts possible.

### Negative / trade-offs

- **Per-device only** — resuming on a second phone is impossible without re-implementing with a server. This is an explicit product out-of-scope item, not an oversight.
- Private/incognito mode silently degrades to in-memory (no error). Players must be aware cards won't persist in those modes.
- Clearing browser data wipes the saved card.

### Neutral / follow-ups

- If cross-device sync is ever added, this decision should be revisited and `aiconbingo:v1` key version bumped to v2.

## Compliance & verification

- `deserialize()` in `public/cardState.js` must return `null` for any non-v1 or malformed payload.
- All `localStorage` access must be wrapped in `try/catch` for private-mode safety.
- Covered by 37 unit tests in `test/cardState.test.js`.

## References

- [Product Spec §Decisions](../feature/save-share-card/product-spec.md#decisions) — "Save = survive refresh on the same device"
