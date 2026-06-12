# Product Spec — BINGO-3: K1 Sarkar maturity triad as bingo squares

**AIDLC phase:** Plan
**Audience:** Grace + Kit (POC dogfood). Product language only.

---

## Overview

| Field | Value |
|-------|-------|
| **Feature** | BINGO-3 — add K1 Sarkar's agent maturity triad as bingo squares |
| **Status** | Awaiting approval |
| **Author** | Grace Gettert + Kit |
| **Created** | 2026-06-12 |
| **Last updated** | 2026-06-12 |
| **Related Tech Spec** | `feature/BINGO-3/tech-spec.md` (to be produced by `/design`) |

## Problem & audience

### Problem statement

The AI Con Bingo card uses agentic/AI buzzwords as squares (`BUZZWORDS`
array in `src/bingo.js`). BINGO-1 + BINGO-2 added the four T7 Mosley
anti-patterns. The agent-maturity framing from K1 (Dona Sarkar,
Microsoft — *"Will The Real Autonomous Agent Please Stand Up"*,
AI Con USA 2026 Day 2 keynote) is the other recurring AI Con vocabulary
the card should reflect. Sarkar's triad:

- *off the rack* — off-the-shelf agent, default everything
- *tailored* — agent customized for the operator
- *couture* — bespoke agent built to fit a single workflow

These showed up in multiple keynotes (K1 Sarkar, K4 Norlander 3-buckets)
as a shared maturity framing — making the set complete on the card.

### Who it's for

- Grace + Kit, dogfooding the V1 fleet POC
- AI Con USA 2026 attendees who get a bingo card and recognize the
  Sarkar / Norlander maturity vocabulary

### Current experience (baseline)

`BUZZWORDS` has 39 entries today including the four T7 anti-patterns
(BINGO-1 + BINGO-2). The Sarkar triad is absent, so a player familiar
with the K1 keynote sees an incomplete reference.

## Outcomes & business impact

### Desired outcomes

- `BUZZWORDS` includes the K1 Sarkar maturity triad as a complete set
- A player who recognizes one triad square recognizes all three (cluster effect)
- BINGO-3 PR ships through the V1 fleet (Kit-as-planner → /design → design_gate → /build → /review → merge_gate → merge) without manual intervention
- Watcher subagent successfully pushes milestone updates back to Kit, who relays each to Grace in DM as the run progresses (first end-to-end test of the corrected `parent_session_key` routing)
- Per-phase timing captured for demo purposes (planner, /design, design_gate hold, /build, /review, merge_gate hold, merge)

### Success criteria (for Validate)

| # | Criterion | How we'll verify |
|---|-----------|------------------|
| 1 | `BUZZWORDS` contains `off the rack` | One `node:test` assertion |
| 2 | `BUZZWORDS` contains `tailored` | One `node:test` assertion |
| 3 | `BUZZWORDS` contains `couture` | One `node:test` assertion |
| 4 | All three triad entries are grouped contiguously in *triad order* (off the rack → tailored → couture) adjacent to `agentic` / `autonomous` (agent-capability cluster) | Visual inspection in PR diff |
| 5 | All 39 pre-existing buzzwords are unchanged | Diff size + existing tests pass |
| 6 | Existing test suite (42/42 as of BINGO-2) still green | CI |
| 7 | PR opened, reviewed, approved, and merged via the V1 fleet | Watch the run end-to-end |
| 8 | Kit receives every milestone DM unprompted (no manual status pulls needed) | DM history during the run |
| 9 | Per-phase timing table produced at run end | Kit posts final summary message |

### Business impact

POC-grade. The real value of BINGO-3 is the *fleet validation*, not the
new buzzwords:

- Proves the watcher-subagent push path actually delivers milestone
  updates unprompted (BINGO-2's watcher was correctly built but the
  `parent_session_key` bug meant Grace never saw a transition DM)
- Captures per-phase timing for the V1 fleet demo
- Third ticket through the fleet — establishes the cadence is repeatable,
  not a one-off lucky run

## Scope

### In scope

- Add exactly three new strings to `BUZZWORDS` in `src/bingo.js`:
  - `off the rack`
  - `tailored`
  - `couture`
- Place them contiguously in *triad order* (off the rack → tailored →
  couture) adjacent to `agentic` / `autonomous` so the agent-capability
  vocabulary cluster forms one visually-grouped block
- Add three discrete `node:test` assertions in `test/bingo.test.js`,
  one per new entry, matching the BINGO-1 / BINGO-2 shape
- Watcher subagent spawned with the correct `parent_session_key`
  (validated at build time after the 2026-06-12 fix)
- Kit relays each milestone DM in real time + posts a per-phase timing
  table at run completion

### Out of scope

- Renaming, reordering, or removing any existing buzzword (including
  the four T7 anti-patterns or anything else)
- Changing `generateCard`, `isWinningCard`, or `hash`
- Card geometry, scoring, or rendering changes
- UI updates, README updates, or marketing copy
- Adding any other entries beyond the three named above
- A parametrized/loop test — explicit choice to mirror BINGO-1/2 with
  three discrete asserts, keeps PR diff trivially reviewable
- Any change to the watcher subagent behavior (it was fixed at build
  time in commit `98680d4`; BINGO-3 just exercises it)

## Stakeholders

- *Author:* Grace Gettert
- *Planner:* Kit (this DM)
- *Designer:* `/design` skill in aidlc-sandbox (V1 fleet POC)
- *Coder:* `/build` skill (V1 fleet POC)
- *Reviewer:* `/review` skill (V1 fleet POC)
- *Merge approver:* Grace (HITL at `merge_gate`)
- *Watcher:* sonnet subagent spawned at trigger time

## Approval

This Product Spec is approved by Grace via DM. Kit commits this file
to `feature/BINGO-3/product-spec.md` on the `feature/BINGO-3` branch,
spawns the watcher subagent with the validated `parent_session_key`,
then triggers the V1 fleet graph which will read it and produce
`feature/BINGO-3/tech-spec.md` via the `/design` worker.
