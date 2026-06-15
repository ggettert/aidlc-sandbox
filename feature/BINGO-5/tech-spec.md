# Tech Spec — BINGO-5: Add `HCP` ("Human Context Protocol") to BUZZWORDS

**AIDLC phase:** Design (single **Unit** — one deployable slice)
**Grounding:** Implements the approved Product Spec
[`feature/BINGO-5/product-spec.md`](./product-spec.md). Mirrors the shape of the
BINGO-1 / BINGO-2 / BINGO-3 / BINGO-4 Tech Specs (N entries + N discrete tests)
so the V1 agentic-fleet POC exercises a same-shape, trivially-reviewable diff.
The real payload of BINGO-5 is the **second streaming-consumer smoke**
(subagent → stream → Slack thread → HITL gate → resume → merge) — proving the
BINGO-4 success was repeatable, not a one-shot fluke — not the buzzword itself.

---

## Overview

| Field | Value |
|-------|-------|
| **Unit / scope** | Add one new buzzword (`HCP`) to the `BUZZWORDS` array in `src/bingo.js`, placed immediately **after `MCP`** so the acronym cluster stays visually grouped; add one discrete `node:test` assertion in `test/bingo.test.js`. |
| **Feature** | `feature/BINGO-5/` — V1 fleet POC ticket BINGO-5 (tracking issue carries `AIDLC feature folder: feature/BINGO-5/` per `AGENTS.md`) |
| **Product Spec** | [`feature/BINGO-5/product-spec.md`](./product-spec.md) — **approved** by Grace via Slack |
| **Status** | Draft → for human approval before `/build` |
| **Author** | `/design` worker (V1 fleet POC), on behalf of Grace + Kit |
| **Created** | 2026-06-15 |
| **Last updated** | 2026-06-15 |

## Context

### Summary

Insert one string literal (`'HCP'`) into the `BUZZWORDS` array in
`src/bingo.js`, immediately after the existing `'MCP'` entry, and add one
discrete unit test in `test/bingo.test.js` asserting the new entry is present.
`HCP` is the satirical short-form for *Human Context Protocol* — the pattern of
treating humans as a context-window-stuffing layer ("paste-and-pray" prompting
dressed up as protocol, AI Con USA 2026). Encoding it as the short-form `HCP`
lets it sit alongside the existing acronym soup (`MCP` / `RAG` / `HITL`) and
read at-a-glance on the 5×5 grid. It is a pure data + pure unit-test change — no
behavioral, API, UI, or geometry change.

### Existing system & documentation

- **Repo layout / services:** Node 20+ / Express 4 app, ES modules, no build
  step (see [`README.md`](../../README.md), [`AGENTS.md`](../../AGENTS.md)).
  `src/bingo.js` exports the `BUZZWORDS` array consumed by `generateCard()` and
  re-exported by `src/server.js` (`GET /api/card` returns `{ card, buzzwords }`).
  `test/bingo.test.js` uses `node:test` (no vitest/jest). The client
  (`public/index.html`) renders each cell via `cell.textContent = word`; the
  share image draws cells with canvas `fillText` (`wrapText`).
- **Relevant ADRs:** none touched.
  [`adr/0001`](../../adr/0001-client-only-persistence-via-localstorage.md),
  [`0002`](../../adr/0002-pure-client-module-in-public-dir.md), and
  [`0003`](../../adr/0003-canvas-png-for-share-image.md) cover persistence,
  client-module placement, and the share-image — none are in scope. This change
  is too small to warrant a new ADR.
- **Prior art in repo:** BINGO-1 (`policy theater`), BINGO-2 (3 T7
  anti-patterns), BINGO-3 (K1 Sarkar maturity triad), and BINGO-4
  (`evidence > enthusiasm`) are the exact precedents — string entries added
  contiguously to `BUZZWORDS` plus discrete `assert.ok(BUZZWORDS.includes(...))`
  tests. This Unit repeats that pattern for a single entry. See
  [`feature/BINGO-4/tech-spec.md`](../BINGO-4/tech-spec.md).

### Out of scope for this Unit

- The long-form `Human Context Protocol` as a separate entry (the short-form
  `HCP` earns the square; the long-form is framing in the spec only).
- Renaming, reordering, or removing any existing buzzword.
- Changing `generateCard`, `isWinningCard`, `hash`, or card geometry/scoring.
- UI / rendering / `public/index.html` changes, README, or marketing copy.
- A parametrized/loop test — the Product Spec wants one discrete assert to keep
  the PR diff trivially reviewable.
- Adding any entry beyond the one approved string.
- Any change to the graph, workers, interrupt mechanism, or langgraph dev
  logging on the POC fleet side (explicitly deferred per the 2026-06-15
  architecture decision — BINGO-5 *exercises* the streaming consumer, it does
  not modify it).

## Architecture

No architectural change. `BUZZWORDS` is a static, internal `const` string
array; growing it by one entry is a data edit. All consumers (`generateCard`
→ shuffle/slice; `server.js` → JSON passthrough; client → `textContent`)
already handle arbitrary-length arrays and arbitrary string content, so no
boundary, contract, or data-flow change is introduced.

```
src/bingo.js  BUZZWORDS (43 → 44 entries)
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
| `GET /api/card` (`server.js`) | Returns `{ card, buzzwords }` | `buzzwords` array grows 43 → 44; shape unchanged |
| `public/index.html` client | Renders `card` cells via `textContent` | No change required; `HCP` is plain ASCII, HTML-safe |
| Share image (`wrapText` → canvas `fillText`) | Draws cell text | No change required; 3-char token fits trivially |

## Data

`BUZZWORDS` grows from 43 to 44 string entries. The single addition is placed
**immediately after `'MCP'`** (line 4 area), so the acronym cluster stays one
visually-grouped block per Product Spec scope ("Place it adjacent to `MCP` in
the acronym cluster … so the acronym block stays visually grouped"):

```js
'observability', 'MCP', 'HCP', 'fleet', 'orchestration', 'governance',
```

The entry is the **exact string** `HCP` (uppercase, no surrounding spaces,
matching the casing of the sibling acronyms `MCP` / `RAG` / `HITL`). No schema,
persistence, migration, or PII concern. Uniqueness holds — `HCP` collides with
no existing entry (notably distinct from `MCP`) — and is pinned by the
pre-existing "no duplicate entries" test.

## APIs & contracts

No API or contract change. `BUZZWORDS` is internal; the only external surface
(`GET /api/card`) returns the array verbatim as JSON. `HCP` is plain ASCII with
no JSON metacharacters, so the serialized payload is unaffected in shape and
validity.

## UI / client (if applicable)

No UI change. The new buzzword becomes eligible to appear on a generated card
the next time `generateCard()` runs; rendering is data-driven and needs no
update.

- **Injection safety:** the cell is set via `cell.textContent = word`, so even
  arbitrary entries are inert; `HCP` is plain ASCII with no markup-injection /
  XSS surface and no escaping needed.
- **Layout:** `HCP` is 3 characters — among the shortest entries on the card
  (cf. `RAG`, `MCP`, `POC`, `eval`), well within the grid cell and the canvas
  share image. No layout/overflow concern.

Per the Product Spec, no marketing/README copy changes either.

## Security & privacy

n/a. No auth, no secrets, no user input, no new dependencies. Static
developer-authored 3-letter string constant only.

## Acceptance criteria (for Review)

- [ ] `'HCP'` is a string entry in `BUZZWORDS` in `src/bingo.js`, matching the
      Product Spec wording **exactly** (uppercase `HCP`, no surrounding spaces).
- [ ] The new entry sits **immediately after `'MCP'`**, keeping the acronym
      cluster contiguous and visually grouped (line 4 area) with no existing
      entry interleaved between `MCP` and `HCP`.
- [ ] The 43 pre-existing buzzwords are unchanged (no rename/reorder/removal);
      the diff to `src/bingo.js` adds exactly one entry.
- [ ] One new discrete test exists in `test/bingo.test.js` of the shape
      `assert.ok(BUZZWORDS.includes('HCP'))` (no parametrized/loop form),
      matching the BINGO-1/2/4 test shape.
- [ ] All pre-existing tests still pass; the "no duplicate entries" test stays
      green (entry is unique — `HCP` ≠ `MCP`).
- [ ] CI (`.github/workflows/ci.yml` → `npm ci && npm test`) is green on the PR.
- [ ] No files other than `src/bingo.js` and `test/bingo.test.js` are modified.
- [ ] Commit messages follow `feat(BINGO-5): …` style; PR references the
      tracking issue (`Closes #N` / `Relates to #N`).

## Testing approach

| Layer | What we prove | Notes |
|-------|----------------|-------|
| Unit (new) | `HCP` exists in `BUZZWORDS` | One discrete `assert.ok(BUZZWORDS.includes('HCP'))` test, mirroring BINGO-1/2/4 |
| Unit (regression) | No duplicates introduced; existing entries intact | Pre-existing "no duplicate entries" and "cells drawn from BUZZWORDS" tests cover this |
| Unit (regression) | `generateCard` / `isWinningCard` behavior unchanged | Pre-existing tests pass unchanged — these functions are not touched |
| Integration / E2E | n/a | No UI or API behavior change; `GET /api/card` shape is unchanged |

Run locally with `npm test` (`node --test test/*.test.js`). Current baseline:
**46/46 passing** before this change (across `test/bingo.test.js` and
`test/cardState.test.js`, verified on Node 22) → **47/47** expected after adding
one test.

> **Contiguity / placement is a visual-review criterion**, not an automated
> test (matching BINGO-2/3/4): a positional test would be brittle against future
> legitimate reordering and adds no value for a one-line data edit. Review
> enforces placement via the PR diff. The exact-string assertion does catch
> typos/casing drift in the entry itself (e.g. `hcp` vs `HCP`, or a `MCP` typo).

## Rollout & operations

### Rollout plan

PR opened on `feature/BINGO-5`, merged to `main` on approval via the V1 fleet
(planner → `/design` → `design_gate` → `/build` → `/review` → `merge_gate` →
merge). There is no deploy target in the POC — **the merge is the shipment**.
No feature flag; backwards-compatible (additive data only).

### Monitoring & observability

n/a beyond CI for the code change. For the **second streaming-consumer smoke**
payload of this ticket (Product Spec Outcomes), the signals that matter are
operational, not in-app, and are owned by the fleet runtime / Kit's monitor
subagent **outside this repo's code** — flagged here for traceability, not
implemented in this Unit:

- Every milestone + custom event + HITL prompt arrives at the Slack thread as it
  fires (no polling).
- `design_gate` and `merge_gate` HITL interrupts pause cleanly and resume
  cleanly via the subagent flow.
- **The monitor subagent uses the `message` tool** to relay events — BINGO-4
  surfaced that the monitor improvised with raw Slack API calls instead
  (`wing_kit/followups/message-tool-from-subagent-runtime`); BINGO-5 is the
  second data point on whether the procedure fix landed.

### Rollback

Trivial: revert the single commit (or the one array line + one test).
No data migration or state to unwind.

## Risks & open technical questions

| Risk / question | Mitigation or owner |
|-----------------|---------------------|
| Typo / casing drift vs. the Product Spec wording (`hcp` vs `HCP`) | The new test asserts the exact string `HCP`; CI fails on any mismatch |
| Confusion / collision with the adjacent `MCP` entry | `HCP` ≠ `MCP`; "no duplicate entries" test guards uniqueness; placement-after-`MCP` is pinned to keep them adjacent but distinct |
| Accidental reorder/removal of existing entries (scope creep) | Review checks diff is additive-only (exactly +1 entry); "no duplicate entries" + "cells drawn from BUZZWORDS" tests guard integrity |
| Placement is a visual-only criterion (no automated test) | Acceptance criterion + PR-diff visual inspection; intentionally not over-engineered into a positional test |
| Coder-bot picks a different insertion point | Tech Spec pins placement *immediately after `MCP`* to remove ambiguity within the acronym cluster |
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
| Architecture / boundaries | `architecture` | **No issues.** Pure data edit; no new boundaries, coupling, or data-flow. All consumers handle arbitrary-length `BUZZWORDS` and arbitrary string content. No ADR needed (no org-wide decision changes). The Product Spec's "adjacent to `MCP` in the acronym cluster" was pinned to a single unambiguous anchor — *immediately after `MCP`* — to keep the acronym block contiguous and remove coder-bot insertion-point ambiguity. |
| Frontend | `frontend-web` | **No issues / no action.** Rendering is data-driven and the cell text is set via `cell.textContent = word` (not `innerHTML`), so the entry is inert; `HCP` is plain ASCII with **no markup-injection / XSS surface** and no escaping needed. At 3 chars it is among the shortest cells (cf. `RAG`, `MCP`, `POC`) and fits the grid and canvas share image (`wrapText`) trivially. No a11y/layout/overflow concern. |
| Backend / API | `backend-saas` | **No issues.** `GET /api/card` returns `{ card, buzzwords }`; `buzzwords` grows 43 → 44 with identical shape. `HCP` has no JSON metacharacters, so `JSON.stringify` output is valid and unchanged in shape. No versioning, multi-tenancy, auth, or contract change. No new dependency. |
| Testing strategy | `testing` | **Confirmed.** One discrete assertion (per Product Spec, no parametrization) pins the exact string `HCP` — catching any typo / casing drift. Pre-existing "no duplicate entries" (guards `HCP` ≠ `MCP`), "cells drawn from BUZZWORDS", and geometry tests provide free regression coverage. Baseline verified at **46/46** (`node --test test/*.test.js`, Node 22) → **47/47** expected. Placement/contiguity is intentionally left to visual review (not a positional test) to avoid brittleness — recorded as a known, accepted gap. |
| CI / Docker / deploy | `architecture` + `.github/workflows/` | **No issues.** No Dockerfile/`docker-compose` in repo (none needed). `ci.yml` runs `npm ci && npm test` on PRs to `main` on Node 20 — the new test runs under the existing workflow with no CI change required. `aidlc-launch.yml` is the fleet-launch workflow and is untouched. No deploy target (merge is the shipment). |
