# Product Spec — BINGO-4: "evidence > enthusiasm" as a bingo square

**AIDLC phase:** Plan
**Audience:** Grace + Kit (POC dogfood). Product language only.

---

## Overview

| Field | Value |
|-------|-------|
| **Feature** | BINGO-4 — add T5 Powers' "evidence > enthusiasm" as a bingo square |
| **Status** | Awaiting approval |
| **Author** | Grace Gettert + Kit |
| **Created** | 2026-06-15 |
| **Last updated** | 2026-06-15 |
| **Related Tech Spec** | `feature/BINGO-4/tech-spec.md` (to be produced by `/design`) |

## Problem & audience

### Problem statement

The AI Con Bingo card uses agentic/AI buzzwords as squares (`BUZZWORDS`
array in `src/bingo.js`). Prior tickets covered T7 Mosley anti-patterns
(BINGO-1, BINGO-2) and the K1 Sarkar maturity triad (BINGO-3). The card
is still missing T5 Powers' recurring framing from AI Con USA 2026:
*evidence over enthusiasm* — the call to ground agent rollout decisions
in measurable outcomes rather than narrative momentum.

Encoded on the card as the pithier `evidence > enthusiasm` to fit the 5x5
grid and read clearly at-a-glance.

### Who it's for

- Grace + Kit, dogfooding the V1 fleet POC
- AI Con USA 2026 attendees who get a bingo card and recognize the
  T5 Powers framing

### Current experience (baseline)

`BUZZWORDS` has 42 entries today (39 from BINGO-2 + the BINGO-3 Sarkar
triad). The Powers framing is absent.

## Outcomes & business impact

### Desired outcomes

- `BUZZWORDS` includes `evidence > enthusiasm` as a single entry
- A player who recognizes the T5 Powers framing finds it on the card
- BINGO-4 PR ships through the V1 fleet end-to-end via the new streaming
  consumer architecture (subagent → stream → Slack thread → HITL gate →
  resume → merge), the first run validating BINGO-4-architecture decisions
  from the 2026-06-15 session
- Per-phase events arrive at the Slack thread as they fire (no polling)
- HITL gates pause cleanly; resume cleanly via the subagent flow

### Success criteria (for Validate)

| # | Criterion | How we'll verify |
|---|-----------|------------------|
| 1 | `BUZZWORDS` contains the string `evidence > enthusiasm` exactly | One `node:test` assertion |
| 2 | All 42 pre-existing buzzwords are unchanged | Diff size + existing tests pass |
| 3 | Existing test suite is still green | CI |
| 4 | PR opened, reviewed, approved, and merged via the V1 fleet | Watch the run end-to-end in the Slack thread |
| 5 | `design_gate` and `merge_gate` HITL interrupts arrive in the Slack thread and accept resume | Visible during the run |
| 6 | Every milestone + custom event posts to the Slack thread without polling | Visible during the run |

### Business impact

POC-grade. The real value of BINGO-4 is the *streaming consumer
validation*:

- First ticket through the new `~/.openclaw/workspace/fleet/`
  consumer (vendored `fleet_runner` + `fleet_monitor_subagent`)
- Proves the subagent-per-stream-segment + Slack-posting pattern works
  end-to-end against the langgraph dev server on the POC EC2
- Establishes the event shapes and cadence we'll calcify into the future
  OpenClaw `fleet` / `langgraph` plugin tool

## Scope

### In scope

- Add exactly one new string to `BUZZWORDS` in `src/bingo.js`:
  - `evidence > enthusiasm`
- Place it adjacent to existing rhetoric/anti-pattern entries
  (`policy theater`, `human-in-the-loop cosplay`, `speed worship`,
  `governance after dark`) so the rhetoric cluster forms one
  visually-grouped block
- Add one discrete `node:test` assertion in `test/bingo.test.js`,
  matching the BINGO-1 / BINGO-2 shape
- Subagent-driven stream consumer posts every milestone + custom event
  + HITL prompt to the Slack thread for this ticket

### Out of scope

- Renaming, reordering, or removing any existing buzzword
- Changing `generateCard`, `isWinningCard`, or `hash`
- Card geometry, scoring, or rendering changes
- UI updates, README updates, or marketing copy
- Adding any other entries beyond the one named above
- Any change to the graph, workers, or interrupt mechanism on the POC side
- Any change to the langgraph dev logging (deferred follow-up; verifying
  streams first, per the 2026-06-15 architecture decision)

## Stakeholders

- *Author:* Grace Gettert
- *Planner:* Kit (this Slack thread)
- *Designer:* `/design` skill in aidlc-sandbox (V1 fleet POC)
- *Coder:* `/build` skill (V1 fleet POC)
- *Reviewer:* `/review` skill (V1 fleet POC)
- *Merge approver:* Grace (HITL at `merge_gate`)
- *Stream consumer:* Kit subagent (per stream segment, on Kit's EC2)

## Approval

This Product Spec is approved by Grace via Slack. Kit commits this file
to `feature/BINGO-4/product-spec.md` on the `feature/BINGO-4` branch of
`ggettert/aidlc-sandbox`, then triggers the V1 fleet graph via
`~/.openclaw/workspace/fleet/trigger.py` and spawns the monitor subagent
to relay events into this Slack thread.
