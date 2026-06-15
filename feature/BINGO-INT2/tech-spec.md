# Tech Spec — BINGO-INT2: Add `agent washing` to BUZZWORDS

**AIDLC phase:** Design (single **Unit** — one deployable slice)
**Grounding:** Implements the approved Product Spec
[`feature/BINGO-INT2/product-spec.md`](./product-spec.md). Mirrors the shape of
the BINGO-1…BINGO-5 Tech Specs (one entry + one discrete test) so the V1
agentic-fleet POC exercises a same-shape, trivially-reviewable diff. The real
payload of BINGO-INT2 is the **second integration smoke** (subagent → stream →
HITL gate → resume → merge), proving the pipeline is repeatable — not the
buzzword itself.

---

## Overview

| Field | Value |
|-------|-------|
| **Unit / scope** | Add one new buzzword (`agent washing`) to the `BUZZWORDS` array in `src/bingo.js`, placed inside the existing satirical anti-pattern cluster (immediately after `'evidence > enthusiasm'`) so the satire stays visually grouped; add one discrete `node:test` assertion in `test/bingo.test.js`. |
| **Feature** | `feature/BINGO-INT2/` — V1 fleet POC integration-smoke ticket |
| **Product Spec** | [`feature/BINGO-INT2/product-spec.md`](./product-spec.md) |
| **Status** | Draft → built autonomously per fleet-POC precedent (see Product Spec note) |
| **Author** | `/build` worker (V1 fleet POC) |
| **Created** | 2026-06-15 |

## Context

### Summary

Insert one string literal (`'agent washing'`) into the `BUZZWORDS` array in
`src/bingo.js`, immediately after the existing `'evidence > enthusiasm'` entry,
and add one discrete unit test in `test/bingo.test.js` asserting the new entry
is present. `agent washing` is the satirical term for rebranding any product or
workflow as "agentic" without substance (AI Con USA 2026), and sits naturally in
the existing satirical anti-pattern cluster (`policy theater`,
`human-in-the-loop cosplay`, `speed worship`, `governance after dark`,
`evidence > enthusiasm`). It is a pure data + pure unit-test change — no
behavioral, API, UI, or geometry change.

### Existing system & documentation

- **Repo layout:** Node 20+ / Express 4 app, ES modules, no build step (see
  [`README.md`](../../README.md), [`AGENTS.md`](../../AGENTS.md)). `src/bingo.js`
  exports `BUZZWORDS`, consumed by `generateCard()` and re-exported by
  `src/server.js` (`GET /api/card` → `{ card, buzzwords }`).
  `test/bingo.test.js` uses `node:test` (no vitest/jest). The client
  (`public/index.html`) renders each cell via `cell.textContent = word`.
- **Relevant ADRs:** none touched ([`0001`](../../adr/0001-client-only-persistence-via-localstorage.md),
  [`0002`](../../adr/0002-pure-client-module-in-public-dir.md),
  [`0003`](../../adr/0003-canvas-png-for-share-image.md) cover persistence,
  client-module placement, share-image — none in scope). Too small for a new ADR.
- **Prior art:** BINGO-1…5 are the exact precedents — string entries added
  contiguously to `BUZZWORDS` plus discrete `assert.ok(BUZZWORDS.includes(...))`
  tests. This Unit repeats that pattern. See
  [`feature/BINGO-5/tech-spec.md`](../BINGO-5/tech-spec.md).

### Out of scope for this Unit

- Renaming, reordering, or removing any existing buzzword.
- Changing `generateCard`, `isWinningCard`, `hash`, or card geometry/scoring.
- UI / rendering / `public/index.html` changes, README, or marketing copy.
- A parametrized/loop test — one discrete assert keeps the diff trivially
  reviewable.
- Any change to the fleet graph, workers, interrupt mechanism, or streaming
  consumer (BINGO-INT2 *exercises* the streaming consumer; it does not modify it).

## Architecture

No architectural change. `BUZZWORDS` is a static, internal `const` string array;
growing it by one entry is a data edit. All consumers (`generateCard` →
shuffle/slice; `server.js` → JSON passthrough; client → `textContent`) already
handle arbitrary-length arrays and arbitrary string content, so no boundary,
contract, or data-flow change is introduced.

```
src/bingo.js  BUZZWORDS (44 → 45 entries)
                 │
                 ├─► generateCard()  (shuffles, slices 24 — unchanged)
                 └─► server.js GET /api/card → { card, buzzwords } (passthrough)
                                                   │
                                                   └─► public/index.html
                                                       cell.textContent = word
                                                       (HTML-safe; no escaping)
```

### Integration points

| System | Contract | Notes |
|--------|----------|-------|
| `generateCard()` | Consumes `BUZZWORDS` (any length ≥ 24) | Unchanged; new entry becomes eligible to draw |
| `GET /api/card` (`server.js`) | Returns `{ card, buzzwords }` | `buzzwords` grows 44 → 45; shape unchanged |
| `public/index.html` client | Renders cells via `textContent` | No change; `agent washing` is plain ASCII, HTML-safe |
| Share image (`wrapText` → canvas `fillText`) | Draws cell text | No change; short two-word phrase fits like existing multi-word entries |

## Data

`BUZZWORDS` grows from 44 to 45 string entries. The single addition is placed
**immediately after `'evidence > enthusiasm'`**, keeping the satirical
anti-pattern cluster one visually-grouped block:

```js
'human-in-the-loop cosplay', 'speed worship', 'governance after dark',
'evidence > enthusiasm', 'agent washing',
```

The entry is the **exact string** `agent washing` (lowercase, single space,
matching the casing of sibling satirical phrases). No schema, persistence,
migration, or PII concern. Uniqueness holds — `agent washing` collides with no
existing entry — and is pinned by the pre-existing "no duplicate entries" test.

## APIs & contracts

No API or contract change. `BUZZWORDS` is internal; the only external surface
(`GET /api/card`) returns the array verbatim as JSON. `agent washing` is plain
ASCII with no JSON metacharacters, so the serialized payload is unaffected.

## UI / client (if applicable)

No UI change. The new buzzword becomes eligible the next time `generateCard()`
runs; rendering is data-driven.

- **Injection safety:** the cell is set via `cell.textContent = word`, so entries
  are inert; `agent washing` is plain ASCII with no markup/XSS surface.
- **Layout:** at 13 characters it is comparable to existing multi-word entries
  (`context engineering`, `governance after dark`) and fits the grid cell and the
  canvas share image (`wrapText` handles wrapping). No overflow concern.

## Security & privacy

n/a. No auth, no secrets, no user input, no new dependencies. Static
developer-authored string constant only.

## Acceptance criteria (for Review)

- [ ] `'agent washing'` is a string entry in `BUZZWORDS` in `src/bingo.js`,
      exactly (lowercase, single internal space).
- [ ] The new entry sits **immediately after `'evidence > enthusiasm'`**, keeping
      the satirical anti-pattern cluster contiguous.
- [ ] The 44 pre-existing buzzwords are unchanged (no rename/reorder/removal);
      the diff to `src/bingo.js` adds exactly one entry.
- [ ] One new discrete test exists in `test/bingo.test.js` of the shape
      `assert.ok(BUZZWORDS.includes('agent washing'))`.
- [ ] All pre-existing tests still pass; the "no duplicate entries" test stays
      green.
- [ ] CI (`.github/workflows/ci.yml` → `npm ci && npm test`) is green on the PR.
- [ ] No files other than `src/bingo.js`, `test/bingo.test.js`, and the
      `feature/BINGO-INT2/` specs are modified.
- [ ] Commit messages follow `feat(BINGO-INT2): …` style.

## Testing approach

| Layer | What we prove | Notes |
|-------|----------------|-------|
| Unit (new) | `agent washing` exists in `BUZZWORDS` | One discrete `assert.ok(...)` test, mirroring BINGO-1…5 |
| Unit (regression) | No duplicates; existing entries intact | Pre-existing "no duplicate entries" and "cells drawn from BUZZWORDS" tests cover this |
| Unit (regression) | `generateCard` / `isWinningCard` unchanged | Pre-existing tests pass unchanged — functions untouched |
| Integration / E2E | n/a | No UI or API behavior change; `GET /api/card` shape unchanged |

Baseline before this change: **47/47 passing** (`node --test test/*.test.js`,
Node 22) → **48/48** after adding one test. Verified locally.

> **Contiguity / placement is a visual-review criterion**, not an automated test
> (matching BINGO-2…5): a positional test would be brittle against future
> legitimate reordering. The exact-string assertion catches typos/casing drift.

## Rollout & operations

PR opened on `feature/BINGO-INT2`, merged to `main` on approval via the V1 fleet.
No deploy target in the POC — **the merge is the shipment**. No feature flag;
backwards-compatible (additive data only).

**Rollback:** trivial — revert the single commit (one array line + one test).

## Change history

| Date | Author | Changes |
|------|--------|---------|
| 2026-06-15 | `/build` worker | Authored to restore traceability for the absent `specs/BINGO-INT2.md`; implemented per BINGO-5 precedent. |
