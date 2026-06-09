# Learn Notes — Save & Share Your Bingo Card

**AIDLC phase:** Learn
**Validate:** PASS 5/5 (2026-06-09)
**Merged:** PR #2 → `main` (`99fe56af`)
**Feature:** [Save & Share Your Bingo Card](./product-spec.md)

---

## ADRs captured

Three architectural decisions from this cycle are now recorded:

| ADR | Decision |
|-----|----------|
| [ADR-0001](../../adr/0001-client-only-persistence-via-localstorage.md) | Client-only persistence via `localStorage` (no server, per-device) |
| [ADR-0002](../../adr/0002-pure-client-module-in-public-dir.md) | Pure client module lives in `public/` not `src/` (no-build-step constraint) |
| [ADR-0003](../../adr/0003-canvas-png-for-share-image.md) | Share image generated client-side via Canvas API + Web Share |

---

## Retrospective

### What differed from plan

| Item | What was planned | What happened | Why |
|------|-----------------|---------------|-----|
| Test script | Switch to `node --test` (no args) | Changed to `node --test test/*.test.js` | `node --test` without args recursively follows the `.claude/skills` symlink (submodule absent in CI) and errors. Single-`*` glob is POSIX-safe and scopes discovery to `test/`. |
| `isWinningCard` in canvas renderer | Unresolved at design time | Reused the inline win-line set already in `index.html` | `src/bingo.js` is not served over HTTP (only `public/` is), so a browser import would 404. No new duplication introduced — the pre-existing inline copy was reused. |
| `toBlob` async ordering | Noted as a risk in Design | Pinned as explicit pseudocode in Tech Spec; implemented correctly first time | Catching it in Design review meant it was never a Build problem. |

### What went well

- **Design reviews caught real issues before Build.** The five-pass Design review (architecture, frontend, backend, testing, CI) surfaced the `isWinningCard` import constraint, the `toBlob` async ordering, and the test glob fragility — all before any code was written. Build had no rework surprises.
- **Pure-module boundary paid off.** Isolating `cardState.js` as a DOM-free pure module made unit testing straightforward and kept `index.html` glue easy to reason about.
- **TDD was clean.** Writing 37 tests before implementing `cardState.js` caught nothing surprising — the spec was clear enough that tests and implementation aligned on the first pass.
- **AIDLC as teaching artifact.** The full Plan → Design → Build → Review → Ship → Learn cycle ran on a real, small feature without shortcuts. All phase outputs are in `feature/save-share-card/`.

### Process friction

- The Design phase generated the most artifacts and back-and-forth — five review passes is a lot for a single-Unit client-only feature. For future features of similar scope, a lighter design review (architecture + testing only) may be more proportionate.
- Branch protection needed manual configuration after the CI workflow merged — this is expected but is easy to forget. Consider adding it to `AGENTS.md` as a repo setup checklist item.

---

## Documentation updates

- `README.md` — added `## Features` section documenting the shipped persistence/share/name capabilities and a link to `adr/`.
- `adr/` directory created with 3 ADRs (see above).
- Tech Spec change history updated with retrospective note.

---

## What future agents should know

- **`public/*.js` is the home for client-only pure modules** (ADR-0002) — do not put browser-imported modules in `src/`.
- **`localStorage` key is `aiconbingo:v1`** — bump the version in the key AND the schema if the data shape changes (ADR-0001).
- **The `test/` glob is `test/*.test.js`** — single star, not `**`, to avoid the `.claude/skills` symlink.
- **`canvas.toBlob` is async** — all downstream logic (share/download) must live inside the callback (ADR-0003).
