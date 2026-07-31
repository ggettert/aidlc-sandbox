# Tech Spec — BINGO-SMOKE: App smoke test for the server layer

**AIDLC phase:** Design → Build
**Grounding:** Smoke-test exercise for the V1 agentic-fleet POC
(`ggettert/aidlc-fleet-poc`). Smallest *test-only* diff that drives the full
coder → reviewer → merge_gate → merge loop while adding real, previously
missing coverage.

---

## Overview

| Field | Value |
|-------|-------|
| **Unit / scope** | Add a smoke test that boots the Express app and asserts `/api/healthz` and `/api/card` respond correctly. **No production-code change.** |
| **Feature** | `feature/BINGO-SMOKE/` |
| **Product Spec** | n/a — POC-grade smoke exercise; this Tech Spec stands alone. |
| **Status** | Approved for build |
| **Author** | Fleet coder (BINGO-SMOKE) |
| **Created** | 2026-06-15 |
| **Last updated** | 2026-06-15 |

## Context

### Summary

The referenced `specs/BINGO-SMOKE.md` did not exist in the repo and the
`feature/BINGO-SMOKE` branch was empty. Interpreting "SMOKE" literally, this
ticket ships the smallest *safe* diff that exercises the fleet pipeline:
a **smoke test** of the running app. `src/server.js` currently has **no test
coverage** — every existing test targets the pure functions in `src/bingo.js`
or `public/cardState.js`. This adds a `node:test` integration test that starts
the Express app on an ephemeral port and verifies the two GET endpoints.

### Existing system & documentation

- **Repo layout:** Node/Express app. `src/server.js` exposes
  `GET /api/healthz` → `{ ok: true }` and `GET /api/card` →
  `{ card, buzzwords }`. The module only calls `app.listen` when
  `process.env.NODE_ENV !== 'test'`, and `export default app`.
- **Test runner:** `node --test test/*.test.js` (no vitest/jest, no supertest).
- **Prior art:** `test/bingo.test.js`, `test/cardState.test.js`.

### Out of scope for this Unit

- Any change to `src/`, `public/`, or app behavior.
- New runtime or dev dependencies (use built-in global `fetch`).
- Adding buzzwords or touching `BUZZWORDS` / card logic.
- README / marketing copy.

## Architecture

No architectural change. New test only.

## Data

No data change.

## APIs & contracts

No contract change. The test pins the *existing* contracts of
`/api/healthz` and `/api/card` so future refactors that break them fail CI.

## UI / client

No UI change.

## Security & privacy

n/a. Test binds to `127.0.0.1` on an ephemeral port and closes the server in
a `finally` block / `after` hook.

## Acceptance criteria (for Review)

- [ ] New file `test/smoke.test.js` boots the app via `app.listen(0)` and:
  - asserts `GET /api/healthz` returns HTTP 200 and `{ ok: true }`.
  - asserts `GET /api/card` returns HTTP 200, a 25-cell `card` with
    `card[12] === 'FREE'`, and a non-empty `buzzwords` array.
- [ ] The test sets `NODE_ENV=test` before importing the server (dynamic
      import) so the module's own `app.listen` does not fire.
- [ ] The server is closed after the test (no leaked handle / open port).
- [ ] All existing tests still pass (`node --test test/`).
- [ ] CI is green on the PR (existing `test` workflow).
- [ ] No files other than `feature/BINGO-SMOKE/` and `test/smoke.test.js`
      are modified.
- [ ] Commit messages follow `test(BINGO-SMOKE): …` style.

## Testing approach

| Layer | What we prove | Notes |
|-------|----------------|-------|
| Integration (smoke) | App boots and both GET endpoints respond | `app.listen(0)` + global `fetch` |
| Unit (regression) | Existing suite still green | `src/` and `public/` untouched |

## Rollout & operations

PR merged on approve → no deploy target in the POC. The merge IS the
shipment for this exercise.

## Why a test-only smoke PR

`specs/BINGO-SMOKE.md` was missing and the branch was empty. Rather than
fabricate a product change with no spec, the lowest-risk faithful reading of
"BINGO-SMOKE" is a literal smoke test: prove the app starts and its endpoints
answer, exercising coder → PR → green CI end-to-end while leaving product
behavior untouched and closing a real coverage gap (`src/server.js`).
