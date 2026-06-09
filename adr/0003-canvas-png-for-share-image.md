# ADR-0003: Share image generated client-side via Canvas API

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-09 |
| **Deciders** | Grace Gettert |
| **Related** | [Product Spec §Decisions](../feature/save-share-card/product-spec.md), [Tech Spec §UI/client](../feature/save-share-card/tech-spec.md), [ADR-0001](0001-client-only-persistence-via-localstorage.md) |

---

## Context

The product requires players to share a visual representation of their completed bingo card (buzzwords, marks, BINGO state, optional name). The share artifact needed to be rich enough to be a "brag" — more than a URL — while keeping the backend untouched.

## Decision

Share images are rendered **entirely client-side** using the browser's `<canvas>` API. The canvas is drawn off-screen, exported to a PNG blob via `canvas.toBlob()`, then shared via the **Web Share API** (`navigator.share({files})`) when available, with a direct download fallback for browsers that don't support file sharing. No server, no third-party library.

## Options considered

| Option | Summary | Why not chosen |
|--------|---------|----------------|
| **Canvas + Web Share API (chosen)** | Client-only; no deps; OS native share sheet on mobile | Requires custom canvas layout code; limited visual fidelity vs DOM |
| `html2canvas` (DOM snapshot library) | Higher visual fidelity; snaps the live DOM | Adds a dependency; contradicts AGENTS.md minimal-deps rule; requires loading external JS |
| Server-rendered PNG (Puppeteer/headless) | Highest fidelity; no client rendering code | Requires server changes; backend image pipeline; contradicts client-only architecture |
| Clickable read-only link | Lightweight; no image generation | Would require server storage to hold state; contradicts ADR-0001 client-only decision |

## Consequences

### Positive

- Zero new dependencies.
- No server changes; the share feature is entirely self-contained.
- On supported mobile browsers (iOS Safari ≥15.1, Chrome/Edge), the OS native share sheet appears, enabling direct post/send.
- Canvas rendering is fully synchronous up to `toBlob`; predictable and debuggable.

### Negative / trade-offs

- **`canvas.toBlob()` is async** — share/download logic must live inside the callback, not after it. This is a non-obvious ordering constraint that caused a design review finding and must be maintained.
- Canvas text layout requires manual measurement (`ctx.measureText`) and wrapping. Long buzzwords or names require explicit clipping.
- Web Share file support requires Safari 15.1+ or Chromium; older clients exercise the download fallback, which is less seamless.
- Canvas rendering doesn't automatically reflect CSS changes — visual drift possible if the page's palette changes without updating `drawCanvas`.

### Neutral / follow-ups

- If the palette or layout changes, `drawCanvas()` in `index.html` must be updated to match.
- A future improvement could extract `drawCanvas` to a separate testable module (`public/cardRenderer.js`) if canvas rendering becomes complex enough to warrant unit tests.

## Compliance & verification

- `toBlob` callback must always contain the share/download dispatch — never invoke `navigator.share` outside the callback.
- `AbortError` from `navigator.share` (user cancel) must be swallowed; other errors fall through to the download fallback.
- `URL.createObjectURL` blobs must be revoked after use (memory leak prevention).
- Verified via E2E live UI validation in Review phase.

## References

- [Tech Spec §UI/client](../feature/save-share-card/tech-spec.md) — async toBlob + share control flow pseudocode
- [Product Spec §Decisions](../feature/save-share-card/product-spec.md) — "Share artifact = an image"
