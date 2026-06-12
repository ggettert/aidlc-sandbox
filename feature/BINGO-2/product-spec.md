# Product Spec — BINGO-2: T7 Mosley anti-patterns as bingo squares

**AIDLC phase:** Plan
**Audience:** Grace + Kit (POC dogfood). Product language only.

---

## Overview

| Field | Value |
|-------|-------|
| **Feature** | BINGO-2 — add 3 remaining T7 Mosley anti-patterns as bingo squares |
| **Status** | Awaiting approval |
| **Author** | Grace Gettert + Kit |
| **Created** | 2026-06-12 |
| **Last updated** | 2026-06-12 |
| **Related Tech Spec** | `feature/BINGO-2/tech-spec.md` (to be produced by `/design`) |

## Problem & audience

### Problem statement

The AI Con Bingo card uses agentic/AI buzzwords as squares (`BUZZWORDS`
array in `src/bingo.js`). BINGO-1 added `policy theater` — one of four
anti-patterns Jessica Mosley named in T7 ("Ways to Lose the Plot",
AI Con USA 2026 Day 3). The other three are missing.

Making the set complete:
- Closes the lineage from BINGO-1 (the anti-pattern joke only lands
  when the full set is on the card)
- Exercises the V1 fleet POC on a slightly-larger-scope diff (3 entries
  + 3 tests vs. BINGO-1's 1 entry + 1 test) — verifies the loop scales
  past trivial size

### Who it's for

- Grace + Kit, dogfooding the V1 fleet POC
- AI Con USA 2026 attendees who get a bingo card and want the anti-pattern
  punchlines to land

### Current experience (baseline)

`BUZZWORDS` has 36 entries today including `policy theater` (BINGO-1).
The other three anti-patterns are absent, so a player familiar with the
T7 deck sees an incomplete reference.

## Outcomes & business impact

### Desired outcomes

- `BUZZWORDS` includes all four T7 anti-patterns as a complete set
- A player who recognizes one anti-pattern square recognizes all four
- BINGO-2 PR ships through the V1 fleet (planner → /design → /build → /review → merge_gate → merge) without manual intervention

### Success criteria (for Validate)

| # | Criterion | How we'll verify |
|---|-----------|------------------|
| 1 | `BUZZWORDS` contains `human-in-the-loop cosplay` | One `node:test` assertion |
| 2 | `BUZZWORDS` contains `speed worship` | One `node:test` assertion |
| 3 | `BUZZWORDS` contains `governance after dark` | One `node:test` assertion |
| 4 | All 4 anti-patterns are grouped contiguously after `governance` | Visual inspection in PR diff |
| 5 | All 36 pre-existing buzzwords are unchanged | Diff size + existing tests pass |
| 6 | Existing test suite (38/38 as of BINGO-1) still green | CI |
| 7 | PR opened, reviewed, approved, and merged via the V1 fleet | Watch the run end-to-end |

### Business impact

POC-grade. Real impact is on the fleet itself — proves the loop handles
a slightly bigger spec without coder-bot scope creep, and exercises the
new graph pieces (planner-by-conversation + /design worker + design_gate
+ block_revise outcome) on a real ticket.

## Scope

### In scope

- Add exactly three new strings to `BUZZWORDS` in `src/bingo.js`:
  - `human-in-the-loop cosplay`
  - `speed worship`
  - `governance after dark`
- Group them contiguously with `policy theater` (BINGO-1) so all four
  anti-patterns sit together, right after `governance`
- Add three discrete `node:test` assertions in `test/bingo.test.js`,
  one per new entry, matching BINGO-1's test shape

### Out of scope

- Renaming, reordering, or removing any existing buzzwords (including
  `policy theater` from BINGO-1)
- Changing `generateCard`, `isWinningCard`, or `hash`
- Card geometry, scoring, or rendering changes
- UI updates, README updates, or marketing copy
- Adding any other entries that aren't on this list
- A parametrized test (we explicitly want three discrete asserts to
  mirror BINGO-1; keeps the read in the PR diff dead simple)

## Stakeholders

- *Author:* Grace Gettert
- *Planner:* Kit (this DM)
- *Designer:* `/design` skill in aidlc-sandbox (V1 fleet POC)
- *Coder:* `/build` skill (V1 fleet POC)
- *Reviewer:* `/review` skill (V1 fleet POC)
- *Merge approver:* Grace (HITL at `merge_gate`)

## Approval

This Product Spec is approved by Grace via DM. Kit commits this file
to `feature/BINGO-2/product-spec.md` on the `feature/BINGO-2` branch,
then triggers the V1 fleet graph which will read it and produce
`feature/BINGO-2/tech-spec.md` via the `/design` worker.
