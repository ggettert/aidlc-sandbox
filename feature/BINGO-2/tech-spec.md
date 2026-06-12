# Tech Spec — BINGO-2: Add 3 remaining T7 Mosley anti-patterns to BUZZWORDS

**AIDLC phase:** Design (single **Unit** — one deployable slice)
**Grounding:** Implements the approved Product Spec
[`feature/BINGO-2/product-spec.md`](./product-spec.md). Mirrors the shape of
the BINGO-1 Tech Spec (`feat(BINGO-1): add "policy theater"`) so the V1
agentic-fleet POC exercises a slightly-larger-but-same-shape diff
(3 entries + 3 tests vs. BINGO-1's 1 + 1).

---

## Overview

| Field | Value |
|-------|-------|
| **Unit / scope** | Add three new buzzwords (`human-in-the-loop cosplay`, `speed worship`, `governance after dark`) to the `BUZZWORDS` array in `src/bingo.js`, grouped contiguously with `policy theater` right after `governance`; add three discrete `node:test` assertions in `test/bingo.test.js`, one per entry. |
| **Feature** | `feature/BINGO-2/` — V1 fleet POC ticket BINGO-2 |
| **Product Spec** | [`feature/BINGO-2/product-spec.md`](./product-spec.md) — **approved** by Grace via DM |
| **Status** | Draft → for human approval before `/build` |
| **Author** | `/design` worker (V1 fleet POC), on behalf of Grace + Kit |
| **Created** | 2026-06-12 |
| **Last updated** | 2026-06-12 |

## Context

### Summary

Append three string literals to the `BUZZWORDS` array in `src/bingo.js` and
add three discrete unit tests in `test/bingo.test.js`, each asserting one new
entry is present. This completes the set of four T7 Mosley anti-patterns
(`policy theater` shipped in BINGO-1; this Unit adds the other three). It is a
pure data + pure unit-test change — no behavioral, API, UI, or geometry change.

### Existing system & documentation

- **Repo layout / services:** Node 20+ / Express 4 app, ES modules, no build
  step (see [`README.md`](../../README.md), [`AGENTS.md`](../../AGENTS.md)).
  `src/bingo.js` exports the `BUZZWORDS` array consumed by `generateCard()`
  and re-exported verbatim by `src/server.js` (`GET /api/card` returns
  `{ card, buzzwords }`). `test/bingo.test.js` uses `node:test` (no
  vitest/jest).
- **Relevant ADRs:** none. [`adr/0001`](../../adr/0001-client-only-persistence-via-localstorage.md),
  [`0002`](../../adr/0002-pure-client-module-in-public-dir.md), and
  [`0003`](../../adr/0003-canvas-png-for-share-image.md) cover persistence,
  client-module placement, and share-image — none are touched. This change is
  too small to warrant a new ADR.
- **Prior art in repo:** BINGO-1 (`feat(BINGO-1): add "policy theater"`,
  commit `7fb1c7d`) is the exact precedent — one lowercase string entry next
  to `governance` plus one `assert.ok(BUZZWORDS.includes(...))` test. This
  Unit repeats that pattern three times.

### Out of scope for this Unit

- Renaming, reordering, or removing any existing buzzword (including
  `policy theater` from BINGO-1).
- Changing `generateCard`, `isWinningCard`, `hash`, or card geometry/scoring.
- UI / rendering / `public/index.html` changes, README, or marketing copy.
- A parametrized/loop test — the Product Spec explicitly wants three discrete
  asserts to keep the PR diff trivially reviewable.
- Adding any entry not on the approved list of three.

## Architecture

No architectural change. `BUZZWORDS` is a static, internal `const` string
array; growing it by three entries is a data edit. All consumers
(`generateCard` → shuffle/slice; `server.js` → JSON passthrough) already
handle arbitrary-length arrays, so no boundary, contract, or data-flow change
is introduced.

```
src/bingo.js  BUZZWORDS (36 → 39 entries)
                 │
                 ├─► generateCard()  (shuffles, slices 24 — unchanged)
                 └─► server.js GET /api/card → { card, buzzwords } (passthrough)
```

### Integration points

| System | Contract | Notes |
|--------|----------|-------|
| `generateCard()` | Consumes `BUZZWORDS` (any length ≥ 24) | Unchanged; new entries simply become eligible draws |
| `GET /api/card` (`server.js`) | Returns `{ card, buzzwords }` | `buzzwords` array grows 36 → 39; shape unchanged |
| `public/index.html` client | Renders `card` cells | No change required; renders whatever cells it receives |

## Data

`BUZZWORDS` grows from 36 to 39 string entries. The three additions are placed
**contiguously after `policy theater`** (which already sits immediately after
`governance`), so all four T7 anti-patterns form one visually-grouped block:

```js
'observability', 'MCP', 'fleet', 'orchestration', 'governance',
'policy theater',
'human-in-the-loop cosplay', 'speed worship', 'governance after dark',
'hallucination', 'eval', ...
```

No schema, persistence, migration, or PII concern. Each entry is a lowercase
short phrase matching the existing style. Uniqueness is guaranteed (none of the
three collide with existing entries) and is pinned by the pre-existing
"no duplicate entries" test.

## APIs & contracts

No API or contract change. `BUZZWORDS` is internal; the only external surface
(`GET /api/card`) returns the array verbatim and its consumers already treat
it as opaque/arbitrary-length.

## UI / client (if applicable)

No UI change. The new buzzwords become eligible to appear on a generated card
the next time `generateCard()` runs; rendering in `public/index.html` is
data-driven and needs no update. Per the Product Spec, no marketing/README copy
changes either.

## Security & privacy

n/a. No auth, no secrets, no user input, no new dependencies. Static
developer-authored string constants only.

## Acceptance criteria (for Review)

- [ ] `'human-in-the-loop cosplay'` is a string entry in `BUZZWORDS` in `src/bingo.js`.
- [ ] `'speed worship'` is a string entry in `BUZZWORDS` in `src/bingo.js`.
- [ ] `'governance after dark'` is a string entry in `BUZZWORDS` in `src/bingo.js`.
- [ ] All four anti-patterns (`policy theater`, `human-in-the-loop cosplay`,
      `speed worship`, `governance after dark`) sit contiguously, immediately
      after `governance`, with no existing entry interleaved.
- [ ] The 36 pre-existing buzzwords are unchanged (no rename/reorder/removal);
      the diff to `src/bingo.js` adds exactly three entries.
- [ ] Three new discrete tests exist in `test/bingo.test.js`, one per entry,
      each of the shape `assert.ok(BUZZWORDS.includes('<entry>'))` (no
      parametrized/loop form).
- [ ] All pre-existing tests still pass; the "no duplicate entries" test stays
      green (entries are unique).
- [ ] CI (`.github/workflows/ci.yml` → `npm ci && npm test`) is green on the PR.
- [ ] No files other than `src/bingo.js` and `test/bingo.test.js` are modified.
- [ ] Commit messages follow `feat(BINGO-2): …` style; PR references the
      tracking issue (`Closes #N` / `Relates to #N`).

## Testing approach

| Layer | What we prove | Notes |
|-------|----------------|-------|
| Unit (new) | Each of the three new buzzwords exists in `BUZZWORDS` | Three discrete `assert.ok(BUZZWORDS.includes(...))` tests, mirroring BINGO-1's `policy theater` test |
| Unit (regression) | No duplicates introduced; existing entries intact | Pre-existing "no duplicate entries" test plus "cells drawn from BUZZWORDS" test cover this |
| Unit (regression) | `generateCard` / `isWinningCard` behavior unchanged | Pre-existing tests pass unchanged — these functions are not touched |
| Integration / E2E | n/a | No UI or API behavior change; `GET /api/card` shape is unchanged |

Run locally with `npm test` (`node --test test/*.test.js`). Current baseline:
**39/39 passing** before this change → **42/42** expected after.

## Rollout & operations

### Rollout plan

PR opened on `feature/BINGO-2`, merged to `main` on approval via the V1 fleet
(planner → `/design` → `/build` → `/review` → `merge_gate` → merge). There is
no deploy target in the POC — **the merge is the shipment** for this exercise.
No feature flag; backwards-compatible (additive data only).

### Monitoring & observability

n/a beyond CI. The single signal that matters is the green `test` workflow on
the PR.

### Rollback

Trivial: revert the single commit (or the three array lines + three tests).
No data migration or state to unwind.

## Risks & open technical questions

| Risk / question | Mitigation or owner |
|-----------------|---------------------|
| Typo / casing drift in a new entry vs. the Product Spec wording | The three tests assert the exact strings from the Product Spec; CI fails on any mismatch |
| Accidental reorder/removal of existing entries (scope creep) | Review checks diff is additive-only (exactly +3 entries); "no duplicate entries" + "cells drawn from BUZZWORDS" tests guard integrity |
| Contiguity is a visual-only criterion (no automated test) | Acceptance criterion + PR-diff visual inspection per Product Spec Success Criterion #4; intentionally not over-engineered into a positional test |
| Larger diff than BINGO-1 tempts coder-bot scope creep | Out-of-scope list is explicit; Review enforces "only two files touched" |

## Change history

| Date | Author | Changes |
|------|--------|---------|
| 2026-06-12 | `/design` worker | Initial draft from approved Product Spec; 5 review passes merged (see Appendix) |

---

## Appendix — Design review passes

Per `/design`, five review passes were run against this Tech Spec. Findings are
merged into the body above; this appendix records the pass outcomes.

| Pass | Skill / source | Outcome |
|------|----------------|---------|
| Architecture / boundaries | `architecture` | **No issues.** Pure data edit; no new boundaries, coupling, or data-flow. Confirmed all consumers handle arbitrary-length `BUZZWORDS`. Confirmed no ADR is needed (no org-wide decision changes). |
| Frontend | `frontend-web` | **No issues / no action.** Rendering is data-driven (`public/index.html` consumes `card` cells opaquely). New entries are short lowercase phrases consistent with existing cell text; longest new entry (`human-in-the-loop cosplay`, 25 chars) is comparable to existing multi-word entries (`context engineering`, `foundation model`) so no layout/overflow concern. No accessibility impact. |
| Backend / API | `backend-saas` | **No issues.** `GET /api/card` returns `{ card, buzzwords }`; `buzzwords` grows 36 → 39 with identical shape. No versioning, multi-tenancy, auth, or contract change. No new dependency. |
| Testing strategy | `testing` | **Confirmed.** Three discrete assertions (per Product Spec, no parametrization) pin each new string exactly; the exact-string asserts catch typos/casing. Existing "no duplicate entries", "cells drawn from BUZZWORDS", and geometry tests provide regression coverage at no extra cost. Acceptance criteria are testable and mirrored in the PR checklist. Contiguity is intentionally left to visual review (not a positional test) to avoid brittleness — recorded as a known, accepted gap. |
| CI / Docker / deploy | `architecture` + `.github/workflows/` | **No issues.** No Dockerfile/`docker-compose` in repo (none needed). `ci.yml` runs `npm ci && npm test` on PRs to `main` on Node 20 — the new tests run under the existing workflow with no CI change required. No deploy target (merge is the shipment). |
