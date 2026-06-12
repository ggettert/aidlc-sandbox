# Tech Spec — BINGO-3: Add K1 Sarkar maturity triad to BUZZWORDS

**AIDLC phase:** Design (single **Unit** — one deployable slice)
**Grounding:** Implements the approved Product Spec
[`feature/BINGO-3/product-spec.md`](./product-spec.md). Mirrors the shape of
the BINGO-1 / BINGO-2 Tech Specs (1 entry + 1 test / 3 entries + 3 tests) so the
V1 agentic-fleet POC exercises a same-shape, trivially-reviewable diff. The
real payload of BINGO-3 is **fleet validation** (watcher-subagent milestone
push + per-phase timing), not the buzzwords themselves.

---

## Overview

| Field | Value |
|-------|-------|
| **Unit / scope** | Add three new buzzwords (`off the rack`, `tailored`, `couture`) to the `BUZZWORDS` array in `src/bingo.js`, grouped contiguously in **triad order** immediately after `autonomous` in the agent-capability cluster; add three discrete `node:test` assertions in `test/bingo.test.js`, one per entry. |
| **Feature** | `feature/BINGO-3/` — V1 fleet POC ticket BINGO-3 |
| **Product Spec** | [`feature/BINGO-3/product-spec.md`](./product-spec.md) — **approved** by Grace via DM |
| **Status** | Draft → for human approval before `/build` |
| **Author** | `/design` worker (V1 fleet POC), on behalf of Grace + Kit |
| **Created** | 2026-06-12 |
| **Last updated** | 2026-06-12 |

## Context

### Summary

Append three string literals (`'off the rack'`, `'tailored'`, `'couture'`) to
the `BUZZWORDS` array in `src/bingo.js` and add three discrete unit tests in
`test/bingo.test.js`, each asserting one new entry is present. This adds Dona
Sarkar's K1 agent-maturity triad ("Will The Real Autonomous Agent Please Stand
Up", AI Con USA 2026 Day 2) to the card vocabulary, completing the
agent-maturity framing that recurs across keynotes (K1 Sarkar, K4 Norlander).
It is a pure data + pure unit-test change — no behavioral, API, UI, or geometry
change.

### Existing system & documentation

- **Repo layout / services:** Node 20+ / Express 4 app, ES modules, no build
  step (see [`README.md`](../../README.md), [`AGENTS.md`](../../AGENTS.md)).
  `src/bingo.js` exports the `BUZZWORDS` array consumed by `generateCard()`
  and re-exported by `src/server.js` (`GET /api/card` returns
  `{ card, buzzwords }`). `test/bingo.test.js` uses `node:test` (no
  vitest/jest).
- **Relevant ADRs:** none touched. [`adr/0001`](../../adr/0001-client-only-persistence-via-localstorage.md),
  [`0002`](../../adr/0002-pure-client-module-in-public-dir.md), and
  [`0003`](../../adr/0003-canvas-png-for-share-image.md) cover persistence,
  client-module placement, and share-image — none are in scope. This change is
  too small to warrant a new ADR.
- **Prior art in repo:** BINGO-1 (`feat(BINGO-1): add "policy theater"`) and
  BINGO-2 (`feat(BINGO-2): add 3 T7 anti-patterns`) are the exact precedents —
  lowercase string entries added contiguously to `BUZZWORDS` plus discrete
  `assert.ok(BUZZWORDS.includes(...))` tests. This Unit repeats that pattern
  for a three-entry triad. See [`feature/BINGO-2/tech-spec.md`](../BINGO-2/tech-spec.md).

### Out of scope for this Unit

- Renaming, reordering, or removing any existing buzzword (including the four
  T7 anti-patterns from BINGO-1/BINGO-2).
- Changing `generateCard`, `isWinningCard`, `hash`, or card geometry/scoring.
- UI / rendering / `public/index.html` changes, README, or marketing copy.
- A parametrized/loop test — the Product Spec explicitly wants three discrete
  asserts to keep the PR diff trivially reviewable.
- Adding any entry not on the approved list of three.
- Any change to the watcher-subagent behavior (fixed at build time in commit
  `98680d4`; BINGO-3 only *exercises* the corrected `parent_session_key`
  routing — it is a fleet-runtime concern, not a code change in this repo).

## Architecture

No architectural change. `BUZZWORDS` is a static, internal `const` string
array; growing it by three entries is a data edit. All consumers
(`generateCard` → shuffle/slice; `server.js` → JSON passthrough) already
handle arbitrary-length arrays, so no boundary, contract, or data-flow change
is introduced.

```
src/bingo.js  BUZZWORDS (39 → 42 entries)
                 │
                 ├─► generateCard()  (shuffles, slices 24 — unchanged)
                 └─► server.js GET /api/card → { card, buzzwords } (passthrough)
```

### Integration points

| System | Contract | Notes |
|--------|----------|-------|
| `generateCard()` | Consumes `BUZZWORDS` (any length ≥ 24) | Unchanged; new entries simply become eligible draws |
| `GET /api/card` (`server.js`) | Returns `{ card, buzzwords }` | `buzzwords` array grows 39 → 42; shape unchanged |
| `public/index.html` client | Renders `card` cells | No change required; renders whatever cells it receives |

## Data

`BUZZWORDS` grows from 39 to 42 string entries. The three additions are placed
**contiguously in triad order** (`off the rack` → `tailored` → `couture`),
immediately after `autonomous` in the agent-capability cluster
(`multi-agent`, `autonomous`, `reasoning`, `tool use`, `memory`), so the triad
forms one visually-grouped block adjacent to the `agentic` / `autonomous`
vocabulary per Product Spec Success Criterion #4:

```js
'multi-agent', 'autonomous', 'off the rack', 'tailored', 'couture',
'reasoning', 'tool use', 'memory',
```

Triad order is **semantically meaningful** (off-the-shelf → customized →
bespoke = increasing agent maturity) and is therefore part of the acceptance
criteria, not incidental. No schema, persistence, migration, or PII concern.
Each entry is a lowercase short phrase matching the existing style. Uniqueness
holds (none of the three collide with existing entries) and is pinned by the
pre-existing "no duplicate entries" test.

## APIs & contracts

No API or contract change. `BUZZWORDS` is internal; the only external surface
(`GET /api/card`) returns the array verbatim and its consumers already treat
it as opaque/arbitrary-length.

## UI / client (if applicable)

No UI change. The new buzzwords become eligible to appear on a generated card
the next time `generateCard()` runs; rendering in `public/index.html` is
data-driven and needs no update. The longest new entry (`off the rack`,
12 chars) is shorter than existing multi-word cells (`context engineering`,
`human-in-the-loop cosplay`), so there is no layout/overflow risk. Per the
Product Spec, no marketing/README copy changes either.

## Security & privacy

n/a. No auth, no secrets, no user input, no new dependencies. Static
developer-authored string constants only.

## Acceptance criteria (for Review)

- [ ] `'off the rack'` is a string entry in `BUZZWORDS` in `src/bingo.js`.
- [ ] `'tailored'` is a string entry in `BUZZWORDS` in `src/bingo.js`.
- [ ] `'couture'` is a string entry in `BUZZWORDS` in `src/bingo.js`.
- [ ] The three triad entries sit **contiguously, in triad order**
      (`off the rack` → `tailored` → `couture`), immediately after
      `autonomous`, with no existing entry interleaved (Product Spec
      Criterion #4).
- [ ] The 39 pre-existing buzzwords are unchanged (no rename/reorder/removal);
      the diff to `src/bingo.js` adds exactly three entries.
- [ ] Three new discrete tests exist in `test/bingo.test.js`, one per entry,
      each of the shape `assert.ok(BUZZWORDS.includes('<entry>'))` (no
      parametrized/loop form).
- [ ] All pre-existing tests still pass; the "no duplicate entries" test stays
      green (entries are unique).
- [ ] CI (`.github/workflows/ci.yml` → `npm ci && npm test`) is green on the PR.
- [ ] No files other than `src/bingo.js` and `test/bingo.test.js` are modified.
- [ ] Commit messages follow `feat(BINGO-3): …` style; PR references the
      tracking issue (`Closes #N` / `Relates to #N`).

## Testing approach

| Layer | What we prove | Notes |
|-------|----------------|-------|
| Unit (new) | Each of the three new buzzwords exists in `BUZZWORDS` | Three discrete `assert.ok(BUZZWORDS.includes(...))` tests, mirroring BINGO-1/BINGO-2 |
| Unit (regression) | No duplicates introduced; existing entries intact | Pre-existing "no duplicate entries" and "cells drawn from BUZZWORDS" tests cover this |
| Unit (regression) | `generateCard` / `isWinningCard` behavior unchanged | Pre-existing tests pass unchanged — these functions are not touched |
| Integration / E2E | n/a | No UI or API behavior change; `GET /api/card` shape is unchanged |

Run locally with `npm test` (`node --test test/*.test.js`). Current baseline:
**42/42 passing** before this change (across `test/bingo.test.js` and
`test/save-share-card.test.js`) → **45/45** expected after adding three tests.

> **Contiguity / triad order are visual-review criteria**, not automated
> tests. This is an intentional, accepted gap (matching BINGO-2): a positional
> test would be brittle against future legitimate reordering and adds no value
> for a three-line data edit. Review enforces it via the PR diff per Product
> Spec Criterion #4.

## Rollout & operations

### Rollout plan

PR opened on `feature/BINGO-3`, merged to `main` on approval via the V1 fleet
(planner → `/design` → `design_gate` → `/build` → `/review` → `merge_gate` →
merge). There is no deploy target in the POC — **the merge is the shipment**.
No feature flag; backwards-compatible (additive data only).

### Monitoring & observability

n/a beyond CI for the code change. For the **fleet-validation** payload of this
ticket (Product Spec Outcomes), the signals that matter are operational, not
in-app: the watcher subagent must push each milestone DM to Kit unprompted via
the corrected `parent_session_key`, and a per-phase timing table (planner,
`/design`, `design_gate` hold, `/build`, `/review`, `merge_gate` hold, merge)
is produced at run end. These are owned by the fleet runtime / Kit, **outside
this repo's code** — flagged here for traceability, not implemented in this Unit.

### Rollback

Trivial: revert the single commit (or the three array lines + three tests).
No data migration or state to unwind.

## Risks & open technical questions

| Risk / question | Mitigation or owner |
|-----------------|---------------------|
| Typo / casing drift in a new entry vs. the Product Spec wording | The three tests assert the exact strings from the Product Spec; CI fails on any mismatch |
| Accidental reorder/removal of existing entries (scope creep) | Review checks diff is additive-only (exactly +3 entries); "no duplicate entries" + "cells drawn from BUZZWORDS" tests guard integrity |
| Contiguity **and triad order** are visual-only criteria (no automated test) | Acceptance criterion + PR-diff visual inspection per Product Spec Criterion #4; intentionally not over-engineered into a positional test |
| Coder-bot picks a different insertion point (e.g. next to `agentic` at index 0) | Tech Spec pins placement *immediately after `autonomous`*; both satisfy "adjacent to agentic/autonomous", but the cluster anchor is specified to remove ambiguity |
| Watcher-push / timing validation depends on fleet runtime, not this PR | Out of scope for the code Unit; called out under Monitoring so Review/Validate track it separately against the Product Spec outcomes |

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
| Architecture / boundaries | `architecture` | **No issues.** Pure data edit; no new boundaries, coupling, or data-flow. All consumers handle arbitrary-length `BUZZWORDS`. No ADR needed (no org-wide decision changes). Surfaced one ambiguity in the Product Spec's "adjacent to agentic / autonomous" phrasing (two valid anchors: `agentic` @ index 0, or `autonomous` in the capability cluster) → resolved by pinning insertion *immediately after `autonomous`*, keeping the triad inside the agent-capability cluster as one block. |
| Frontend | `frontend-web` | **No issues / no action.** Rendering is data-driven (`public/index.html` consumes `card` cells opaquely). The three new entries are short lowercase phrases; the longest (`off the rack`, 12 chars) is shorter than existing cells like `context engineering` and `human-in-the-loop cosplay`, so no layout/overflow/a11y concern. |
| Backend / API | `backend-saas` | **No issues.** `GET /api/card` returns `{ card, buzzwords }`; `buzzwords` grows 39 → 42 with identical shape. No versioning, multi-tenancy, auth, or contract change. No new dependency. |
| Testing strategy | `testing` | **Confirmed.** Three discrete assertions (per Product Spec, no parametrization) pin each new string exactly; exact-string asserts catch typos/casing. Pre-existing "no duplicate entries", "cells drawn from BUZZWORDS", and geometry tests provide free regression coverage. Baseline verified at **42/42** (`npm test`) → **45/45** expected. Contiguity *and* triad order are intentionally left to visual review (not a positional test) to avoid brittleness — recorded as a known, accepted gap. |
| CI / Docker / deploy | `architecture` + `.github/workflows/` | **No issues.** No Dockerfile/`docker-compose` in repo (none needed). `ci.yml` runs `npm ci && npm test` on PRs to `main` on Node 20 — the new tests run under the existing workflow with no CI change required. `aidlc-launch.yml` is the fleet-launch workflow and is untouched. No deploy target (merge is the shipment). |
