# Tech Spec — BINGO-INT: End-to-end integration test for the app

**AIDLC phase:** Design → Build
**Grounding:** Integration-test exercise for the V1 agentic-fleet POC. Smallest
*test-only* diff that drives the full coder → reviewer → merge_gate → merge loop
while adding real, previously-missing end-to-end coverage of the wired app.

---

## ⚠️ Provenance note (read first)

The `/build` ticket referenced a Tech Spec at **`specs/BINGO-INT.md`**, which
**does not exist** in the repo — there is no `specs/` directory, no
`feature/BINGO-INT/` folder, no `BINGO-INT` Product Spec, and no `BINGO-INT`
tracking issue. This is the **same situation BINGO-SMOKE hit** (see
[`feature/BINGO-SMOKE/tech-spec.md`](../BINGO-SMOKE/tech-spec.md), which records
that `specs/BINGO-SMOKE.md` likewise did not exist). Following that established
fleet precedent, the coder interprets the ticket name **literally** — `INT` =
**integration test** — and ships the smallest *safe, additive, test-only* diff.

**Scope here is inferred, not human-approved through a Design gate.** The `/review`
pass and the human merge gate are the intended control points to accept or
redirect this interpretation. If a real `BINGO-INT` spec exists elsewhere,
point the coder at it and this can be re-cut.

---

## Overview

| Field | Value |
|-------|-------|
| **Unit / scope** | Add an integration test that boots the Express app and verifies end-to-end module wiring: static asset serving (`express.static` → `public/`), the card-generation pipeline (route → `generateCard` → `BUZZWORDS`), cross-endpoint data consistency, and default 404 handling. **No production-code change.** |
| **Feature** | `feature/BINGO-INT/` |
| **Product Spec** | n/a — POC-grade integration exercise; this Tech Spec stands alone. |
| **Status** | Draft (scope inferred) → for human/review acceptance |
| **Author** | Fleet coder (BINGO-INT) |
| **Created** | 2026-06-15 |
| **Last updated** | 2026-06-15 |

## Context

### Summary

`src/server.js` wires three things together that no test currently exercises
**through the HTTP layer end to end**: `express.static` serving `public/`, the
`GET /api/card` route delegating to `generateCard()` in `src/bingo.js`, and that
function drawing from the `BUZZWORDS` data array. Existing tests cover the *pure
functions* (`test/bingo.test.js`, `test/cardState.test.js`); the unmerged
BINGO-SMOKE PR adds a *smoke* test that asserts the two API endpoints merely
respond. This Unit adds the missing **integration** layer: it asserts the wired
pieces produce correct, internally-consistent results across modules.

### How this differs from BINGO-SMOKE (no duplication)

| | BINGO-SMOKE (PR #8) | BINGO-INT (this Unit) |
|---|---|---|
| File | `test/smoke.test.js` | `test/integration.test.js` |
| Intent | endpoints *respond* (liveness) | wired modules produce *correct, consistent* output |
| `/api/card` | shape only (length 25, FREE center) | + every playable square ∈ `BUZZWORDS`, all 24 unique, `buzzwords` payload deep-equals the `BUZZWORDS` source |
| Static serving | not covered | `GET /` → `index.html`, `GET /cardState.js` → client module |
| Error handling | not covered | unknown route → 404 |

The two files coexist (distinct names, no overlap); merging either or both
produces no conflict.

### Existing system & documentation

- **Repo layout:** Node 20+/Express 4, ES modules, no build step
  ([`README.md`](../../README.md), [`AGENTS.md`](../../AGENTS.md)).
  `src/server.js` exposes `GET /api/healthz` → `{ ok: true }`, `GET /api/card`
  → `{ card, buzzwords }`, and `express.static('public/')`. The module only
  calls `app.listen` when `process.env.NODE_ENV !== 'test'`, and
  `export default app` — so a test can import the app and listen on its own
  ephemeral port.
- **Test runner:** `node --test test/*.test.js` (no vitest/jest, no supertest).
- **Prior art:** `test/bingo.test.js`, `test/cardState.test.js`, and the
  BINGO-SMOKE booting convention (`NODE_ENV=test` before dynamic import, then
  `app.listen(0)` + global `fetch`).

### Out of scope for this Unit

- Any change to `src/`, `public/`, or app behavior.
- New runtime or dev dependencies (uses built-in global `fetch`).
- Adding/altering buzzwords or card logic.
- README / marketing copy.
- Re-testing what BINGO-SMOKE already covers (pure liveness of the endpoints).

## Architecture

No architectural change. New test file only. The test boots the real exported
`app` on an ephemeral port and drives it over HTTP, so it validates the actual
Express routing + middleware wiring rather than calling functions directly.

## Data

No data change. The test reads `BUZZWORDS` from `src/bingo.js` to assert the
served card and `buzzwords` payload are consistent with the source array.

## APIs & contracts

No contract change. Endpoints exercised (all pre-existing): `GET /`,
`GET /cardState.js` (static), `GET /api/card`, and an arbitrary unknown route
for the 404 assertion.

## UI / client (if applicable)

No UI change. `GET /` and `GET /cardState.js` are asserted only at the
HTTP/static-serving level (status + content-type + DOCTYPE marker), not via a
browser.

## Security & privacy

n/a. No auth, no secrets, no user input, no new dependencies. Test-only code.

## Acceptance criteria (for Review)

- [ ] A new `test/integration.test.js` boots the Express app on an ephemeral
      port (`NODE_ENV=test` set before dynamic import; server closed in `after`).
- [ ] It asserts static serving: `GET /` → 200 `text/html` containing
      `<!DOCTYPE html>`; `GET /cardState.js` → 200 with a `javascript`
      content-type.
- [ ] It asserts the card pipeline: `GET /api/card` → 25-cell card, `FREE` at
      index 12, every playable square ∈ `BUZZWORDS`, all 24 playable squares
      unique, and the `buzzwords` payload deep-equals the `BUZZWORDS` source.
- [ ] It asserts an unknown route returns 404.
- [ ] **No production code** (`src/`, `public/`) is modified; **no new
      dependency** is added.
- [ ] All pre-existing tests still pass; CI (`.github/workflows/ci.yml` →
      `npm ci && npm test` on Node 20) is green on the PR.
- [ ] Commits follow `test(BINGO-INT): …` style; PR documents the missing-spec
      provenance.

## Testing approach

| Layer | What we prove | Notes |
|-------|----------------|-------|
| Integration (new) | Static serving, card-pipeline correctness, cross-endpoint consistency, 404 | New `test/integration.test.js`, boots app over HTTP, global `fetch` |
| Unit (regression) | Pure `bingo.js` / `cardState.js` behavior unchanged | Pre-existing tests pass unchanged |

Run locally with `npm test` (`node --test test/*.test.js`). Baseline before this
change: **47/47** passing (this branch, off `main`; `smoke.test.js` is not on
`main`). Expected after: **53/53** (47 + 6 new integration tests).

## Rollout & operations

### Rollout plan

PR opened on `feature/BINGO-INT`, merged to `main` on approval via the V1 fleet.
No deploy target in the POC — **the merge is the shipment**. Backwards-compatible
(test-only, additive).

### Monitoring & observability

n/a beyond CI for the code change.

### Rollback

Trivial: delete the one new test file (revert the single commit). No data
migration or state to unwind.

## Risks & open technical questions

| Risk / question | Mitigation or owner |
|-----------------|---------------------|
| **No human-approved spec existed** (`specs/BINGO-INT.md` absent) | Scope interpreted literally (`INT` = integration), test-only/additive to stay safe; `/review` + human merge gate accept or redirect. Provenance flagged in PR + this spec. |
| Overlap/duplication with BINGO-SMOKE (PR #8) | Different file + deeper assertions (correctness/consistency, static serving, 404) vs. SMOKE's liveness; no file conflict on merge |
| `.js` content-type varies by mime/express version | Assertion uses a tolerant `/javascript/` match, not an exact string |
| Ephemeral-port boot flakiness | Mirrors the proven BINGO-SMOKE pattern (`app.listen(0)`, await `listening`, close in `after`) |
| Card assertions depend on `generateCard` randomness | Assertions hold for *any* valid card (membership/uniqueness/shape), not a fixed seed — non-flaky |

## Change history

| Date | Author | Changes |
|------|--------|---------|
| 2026-06-15 | Fleet coder (BINGO-INT) | Initial draft; scope inferred from ticket name after `specs/BINGO-INT.md` was found absent (BINGO-SMOKE precedent). |
