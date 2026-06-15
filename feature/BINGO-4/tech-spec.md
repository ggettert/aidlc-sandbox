# Tech Spec — BINGO-4: Add T5 Powers "evidence > enthusiasm" to BUZZWORDS

**AIDLC phase:** Design (single **Unit** — one deployable slice)
**Grounding:** Implements the approved Product Spec
[`feature/BINGO-4/product-spec.md`](./product-spec.md). Mirrors the shape of the
BINGO-1 / BINGO-2 / BINGO-3 Tech Specs (N entries + N discrete tests) so the V1
agentic-fleet POC exercises a same-shape, trivially-reviewable diff. The real
payload of BINGO-4 is **streaming-consumer validation** (subagent → stream →
Slack thread → HITL gate → resume → merge), not the buzzword itself.

---

## Overview

| Field | Value |
|-------|-------|
| **Unit / scope** | Add one new buzzword (`evidence > enthusiasm`) to the `BUZZWORDS` array in `src/bingo.js`, placed immediately after `governance after dark` so the rhetoric / anti-pattern cluster forms one contiguous block; add one discrete `node:test` assertion in `test/bingo.test.js`. |
| **Feature** | `feature/BINGO-4/` — V1 fleet POC ticket BINGO-4 |
| **Product Spec** | [`feature/BINGO-4/product-spec.md`](./product-spec.md) — **approved** by Grace via Slack |
| **Status** | Draft → for human approval before `/build` |
| **Author** | `/design` worker (V1 fleet POC), on behalf of Grace + Kit |
| **Created** | 2026-06-15 |
| **Last updated** | 2026-06-15 |

## Context

### Summary

Append one string literal (`'evidence > enthusiasm'`) to the `BUZZWORDS` array
in `src/bingo.js` and add one discrete unit test in `test/bingo.test.js`
asserting the new entry is present. This adds Tim Powers' T5 framing
(*evidence over enthusiasm* — grounding agent-rollout decisions in measurable
outcomes rather than narrative momentum, AI Con USA 2026) to the card
vocabulary, joining the existing rhetoric / anti-pattern cluster. It is a pure
data + pure unit-test change — no behavioral, API, UI, or geometry change.

### Existing system & documentation

- **Repo layout / services:** Node 20+ / Express 4 app, ES modules, no build
  step (see [`README.md`](../../README.md), [`AGENTS.md`](../../AGENTS.md)).
  `src/bingo.js` exports the `BUZZWORDS` array consumed by `generateCard()` and
  re-exported by `src/server.js` (`GET /api/card` returns `{ card, buzzwords }`).
  `test/bingo.test.js` uses `node:test` (no vitest/jest). The client
  (`public/index.html`) renders each cell with `cell.textContent = word`
  (line 79) and the share image draws cells with canvas `fillText`
  (`wrapText`, line 178).
- **Relevant ADRs:** none touched. [`adr/0001`](../../adr/0001-client-only-persistence-via-localstorage.md),
  [`0002`](../../adr/0002-pure-client-module-in-public-dir.md), and
  [`0003`](../../adr/0003-canvas-png-for-share-image.md) cover persistence,
  client-module placement, and share-image — none are in scope. This change is
  too small to warrant a new ADR.
- **Prior art in repo:** BINGO-1 (`feat(BINGO-1): add "policy theater"`),
  BINGO-2 (3 T7 anti-patterns), and BINGO-3 (`feat(BINGO-3): add K1 Sarkar
  maturity triad`) are the exact precedents — lowercase string entries added
  contiguously to `BUZZWORDS` plus discrete `assert.ok(BUZZWORDS.includes(...))`
  tests. This Unit repeats that pattern for a single entry. See
  [`feature/BINGO-3/tech-spec.md`](../BINGO-3/tech-spec.md).

### Out of scope for this Unit

- Renaming, reordering, or removing any existing buzzword.
- Changing `generateCard`, `isWinningCard`, `hash`, or card geometry/scoring.
- UI / rendering / `public/index.html` changes, README, or marketing copy.
- A parametrized/loop test — the Product Spec wants one discrete assert to keep
  the PR diff trivially reviewable.
- Adding any entry beyond the one approved string.
- Any change to the graph, workers, interrupt mechanism, or langgraph dev
  logging on the POC fleet side (explicitly deferred per the 2026-06-15
  architecture decision — BINGO-4 *exercises* the streaming consumer, it does
  not modify it).

## Architecture

No architectural change. `BUZZWORDS` is a static, internal `const` string
array; growing it by one entry is a data edit. All consumers (`generateCard`
→ shuffle/slice; `server.js` → JSON passthrough; client → `textContent`)
already handle arbitrary-length arrays and arbitrary string content, so no
boundary, contract, or data-flow change is introduced.

```
src/bingo.js  BUZZWORDS (42 → 43 entries)
                 │
                 ├─► generateCard()  (shuffles, slices 24 — unchanged)
                 └─► server.js GET /api/card → { card, buzzwords } (passthrough)
                                                   │
                                                   └─► public/index.html
                                                       cell.textContent = word
                                                       (HTML-safe; no escaping needed)
```

### Integration points

| System | Contract | Notes |
|--------|----------|-------|
| `generateCard()` | Consumes `BUZZWORDS` (any length ≥ 24) | Unchanged; new entry simply becomes eligible to draw |
| `GET /api/card` (`server.js`) | Returns `{ card, buzzwords }` | `buzzwords` array grows 42 → 43; shape unchanged |
| `public/index.html` client | Renders `card` cells via `textContent` | No change required; `>` renders literally and is HTML-safe (not `innerHTML`) |
| Share image (`wrapText` → canvas `fillText`) | Draws cell text | No change required; `>` is drawn as a literal glyph |

## Data

`BUZZWORDS` grows from 42 to 43 string entries. The single addition is placed
**immediately after `governance after dark`**, completing the rhetoric /
anti-pattern cluster (`policy theater`, `human-in-the-loop cosplay`,
`speed worship`, `governance after dark`) as one contiguous, visually-grouped
block per Product Spec scope ("place it adjacent to existing rhetoric/anti-pattern
entries … so the rhetoric cluster forms one visually-grouped block"):

```js
'policy theater',
'human-in-the-loop cosplay', 'speed worship', 'governance after dark',
'evidence > enthusiasm',
```

The entry is the **exact string** `evidence > enthusiasm` (lowercase, single
spaces around the `>`). The `>` is a literal character inside a JavaScript
single-quoted string — no escaping required in source, and it is rendered
HTML-safe by the client (`textContent`, not `innerHTML`). No schema,
persistence, migration, or PII concern. Uniqueness holds (no collision with any
existing entry) and is pinned by the pre-existing "no duplicate entries" test.

## APIs & contracts

No API or contract change. `BUZZWORDS` is internal; the only external surface
(`GET /api/card`) returns the array verbatim as JSON. JSON string encoding has
no issue with `>` (only `"` and `\` require escaping, neither present), so the
serialized payload is unaffected in shape and validity.

## UI / client (if applicable)

No UI change. The new buzzword becomes eligible to appear on a generated card
the next time `generateCard()` runs; rendering is data-driven and needs no
update.

- **Injection safety:** the cell is set via `cell.textContent = word`
  (line 79), so the `>` is treated as text, not markup — no XSS / markup-injection
  surface, no escaping required.
- **Layout:** `evidence > enthusiasm` is 21 characters — comparable to existing
  long cells `human-in-the-loop cosplay` (25) and `context engineering` (19),
  which already render within the grid and the canvas share image (`wrapText`
  wraps long cells at `CELL - 8` px). No layout/overflow regression expected.

Per the Product Spec, no marketing/README copy changes either.

## Security & privacy

n/a. No auth, no secrets, no user input, no new dependencies. Static
developer-authored string constant only. The `>` character is inert: rendered
via `textContent` (client) and `fillText` (canvas), serialized via standard
`JSON.stringify` (server) — none of which give it special meaning.

## Acceptance criteria (for Review)

- [ ] `'evidence > enthusiasm'` is a string entry in `BUZZWORDS` in
      `src/bingo.js`, matching the Product Spec wording **exactly** (lowercase,
      single spaces around `>`).
- [ ] The new entry sits **immediately after `governance after dark`**, so the
      rhetoric / anti-pattern cluster (`policy theater`,
      `human-in-the-loop cosplay`, `speed worship`, `governance after dark`,
      `evidence > enthusiasm`) is one contiguous block with no existing entry
      interleaved.
- [ ] The 42 pre-existing buzzwords are unchanged (no rename/reorder/removal);
      the diff to `src/bingo.js` adds exactly one entry.
- [ ] One new discrete test exists in `test/bingo.test.js` of the shape
      `assert.ok(BUZZWORDS.includes('evidence > enthusiasm'))` (no
      parametrized/loop form).
- [ ] All pre-existing tests still pass; the "no duplicate entries" test stays
      green (entry is unique).
- [ ] CI (`.github/workflows/ci.yml` → `npm ci && npm test`) is green on the PR.
- [ ] No files other than `src/bingo.js` and `test/bingo.test.js` are modified.
- [ ] Commit messages follow `feat(BINGO-4): …` style; PR references the
      tracking issue (`Closes #N` / `Relates to #N`).

## Testing approach

| Layer | What we prove | Notes |
|-------|----------------|-------|
| Unit (new) | `evidence > enthusiasm` exists in `BUZZWORDS` | One discrete `assert.ok(BUZZWORDS.includes('evidence > enthusiasm'))` test, mirroring BINGO-1/2/3 |
| Unit (regression) | No duplicates introduced; existing entries intact | Pre-existing "no duplicate entries" and "cells drawn from BUZZWORDS" tests cover this |
| Unit (regression) | `generateCard` / `isWinningCard` behavior unchanged | Pre-existing tests pass unchanged — these functions are not touched |
| Integration / E2E | n/a | No UI or API behavior change; `GET /api/card` shape is unchanged |

Run locally with `npm test` (`node --test test/*.test.js`). Current baseline:
**45/45 passing** before this change (across `test/bingo.test.js` and
`test/cardState.test.js`) → **46/46** expected after adding one test.

> **Contiguity / placement is a visual-review criterion**, not an automated
> test (matching BINGO-2/BINGO-3): a positional test would be brittle against
> future legitimate reordering and adds no value for a one-line data edit.
> Review enforces placement via the PR diff. The exact-string assertion does
> catch typos/casing/spacing drift in the entry itself.

## Rollout & operations

### Rollout plan

PR opened on `feature/BINGO-4`, merged to `main` on approval via the V1 fleet
(planner → `/design` → `design_gate` → `/build` → `/review` → `merge_gate` →
merge). There is no deploy target in the POC — **the merge is the shipment**.
No feature flag; backwards-compatible (additive data only).

### Monitoring & observability

n/a beyond CI for the code change. For the **streaming-consumer-validation**
payload of this ticket (Product Spec Outcomes), the signals that matter are
operational, not in-app: every milestone + custom event + HITL prompt must
arrive at the Slack thread as it fires (no polling), and the `design_gate` /
`merge_gate` HITL interrupts must pause cleanly and resume cleanly via the
subagent flow. These are owned by the fleet runtime / Kit's monitor subagent,
**outside this repo's code** — flagged here for traceability, not implemented
in this Unit.

### Rollback

Trivial: revert the single commit (or the one array line + one test).
No data migration or state to unwind.

## Risks & open technical questions

| Risk / question | Mitigation or owner |
|-----------------|---------------------|
| Typo / casing / spacing drift vs. the Product Spec wording (esp. spaces around `>`) | The new test asserts the exact string `evidence > enthusiasm`; CI fails on any mismatch |
| `>` character mishandled at some layer (HTML, JSON, canvas) | Verified safe: client uses `textContent` (not `innerHTML`), server uses `JSON.stringify` (`>` not a JSON metachar), canvas uses `fillText` — all render/serialize it literally |
| Accidental reorder/removal of existing entries (scope creep) | Review checks diff is additive-only (exactly +1 entry); "no duplicate entries" + "cells drawn from BUZZWORDS" tests guard integrity |
| Placement is a visual-only criterion (no automated test) | Acceptance criterion + PR-diff visual inspection; intentionally not over-engineered into a positional test |
| Coder-bot picks a different insertion point | Tech Spec pins placement *immediately after `governance after dark`* to remove ambiguity within the named rhetoric cluster |
| Streaming-consumer / HITL-gate validation depends on fleet runtime, not this PR | Out of scope for the code Unit; called out under Monitoring so Review/Validate track it separately against the Product Spec outcomes |

## Change history

| Date | Author | Changes |
|------|--------|---------|
| 2026-06-15 | `/design` worker | Initial draft from approved Product Spec; 5 review passes merged (see Appendix) |

---

## Appendix — Design review passes

Per `/design`, five review passes were run against this Tech Spec. Findings are
merged into the body above; this appendix records the pass outcomes.

| Pass | Skill / source | Outcome |
|------|----------------|---------|
| Architecture / boundaries | `architecture` | **No issues.** Pure data edit; no new boundaries, coupling, or data-flow. All consumers handle arbitrary-length `BUZZWORDS` and arbitrary string content. No ADR needed (no org-wide decision changes). The Product Spec's "adjacent to … the rhetoric cluster" was pinned to a single unambiguous anchor — *immediately after `governance after dark`* — to keep the five rhetoric/anti-pattern entries as one contiguous block and remove coder-bot insertion-point ambiguity. |
| Frontend | `frontend-web` | **No issues / no action.** Rendering is data-driven and the cell text is set via `cell.textContent = word` (not `innerHTML`), so the `>` in `evidence > enthusiasm` is rendered as a literal glyph with **no markup-injection / XSS surface** and no escaping needed. At 21 chars it is shorter than the existing `human-in-the-loop cosplay` (25) and wraps fine in both the grid and the canvas share image (`wrapText`). No a11y/layout/overflow concern. |
| Backend / API | `backend-saas` | **No issues.** `GET /api/card` returns `{ card, buzzwords }`; `buzzwords` grows 42 → 43 with identical shape. `>` is not a JSON metacharacter, so `JSON.stringify` output is valid and unchanged in shape. No versioning, multi-tenancy, auth, or contract change. No new dependency. |
| Testing strategy | `testing` | **Confirmed.** One discrete assertion (per Product Spec, no parametrization) pins the exact string — catching any typo / casing / spacing drift around the `>`. Pre-existing "no duplicate entries", "cells drawn from BUZZWORDS", and geometry tests provide free regression coverage. Baseline verified at **45/45** (`node --test test/*.test.js`) → **46/46** expected. Placement/contiguity is intentionally left to visual review (not a positional test) to avoid brittleness — recorded as a known, accepted gap. |
| CI / Docker / deploy | `architecture` + `.github/workflows/` | **No issues.** No Dockerfile/`docker-compose` in repo (none needed). `ci.yml` runs `npm ci && npm test` on PRs to `main` on Node 20 — the new test runs under the existing workflow with no CI change required. `aidlc-launch.yml` is the fleet-launch workflow and is untouched. No deploy target (merge is the shipment). |
