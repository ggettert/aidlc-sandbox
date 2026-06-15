# Product Spec — BINGO-5: "HCP" as a bingo square

**AIDLC phase:** Plan
**Audience:** Grace + Kit (POC dogfood). Product language only.

---

## Overview

| Field | Value |
|-------|-------|
| **Feature** | BINGO-5 — add `HCP` (Human Context Protocol) as a bingo square |
| **Status** | Awaiting approval |
| **Author** | Grace Gettert + Kit |
| **Created** | 2026-06-15 |
| **Last updated** | 2026-06-15 |
| **Related Tech Spec** | `feature/BINGO-5/tech-spec.md` (to be produced by `/design`) |

## Problem & audience

### Problem statement

The AI Con Bingo card uses agentic/AI buzzwords as squares (`BUZZWORDS`
array in `src/bingo.js`). The card already covers the genuine acronym
soup of the moment — `MCP`, `RAG`, `HITL` — but it's missing the
satirical sibling that the 2026 conference circuit has produced: `HCP`,
short for "Human Context Protocol." It names the pattern where humans
are treated as a context-window stuffing layer — paste-and-pray
prompting, dressed up as protocol — and reliably draws a knowing laugh
from the room.

Encoded on the card as the short-form `HCP` to sit alongside `MCP` /
`RAG` / `HITL` and read at-a-glance on the 5x5 grid.

### Who it's for

- Grace + Kit, dogfooding the V1 fleet POC (second smoke run of the
  streaming consumer architecture)
- AI Con USA 2026 attendees who recognize the joke when it lands on
  their card

### Current experience (baseline)

`BUZZWORDS` has 43 entries today (42 from BINGO-2 + the BINGO-3 Sarkar
triad merged + BINGO-4's `evidence > enthusiasm`). `HCP` is absent;
`MCP` is present at the head of the acronym cluster.

## Outcomes & business impact

### Desired outcomes

- `BUZZWORDS` includes `HCP` as a single entry
- A player who's heard the "humans as context window" joke finds it on
  the card
- BINGO-5 PR ships through the V1 fleet end-to-end via the streaming
  consumer architecture — the **second** run, validating that the
  BINGO-4 success wasn't a one-shot fluke
- Per-phase events arrive at the Slack thread as they fire (no polling)
- HITL gates pause cleanly; resume cleanly via the subagent flow
- Subagent monitor uses the `message` tool this time (BINGO-4 surfaced
  that the monitor improvised with raw Slack API calls instead)

### Success criteria (for Validate)

| # | Criterion | How we'll verify |
|---|-----------|------------------|
| 1 | `BUZZWORDS` contains the string `HCP` exactly | One `node:test` assertion |
| 2 | All 43 pre-existing buzzwords are unchanged | Diff size + existing tests pass |
| 3 | Existing test suite is still green | CI |
| 4 | PR opened, reviewed, approved, and merged via the V1 fleet | Watch the run end-to-end in the Slack thread |
| 5 | `design_gate` and `merge_gate` HITL interrupts arrive in the Slack thread and accept resume | Visible during the run |
| 6 | Every milestone + custom event posts to the Slack thread without polling | Visible during the run |

### Business impact

POC-grade. The real value of BINGO-5 is the **second smoke** of the
streaming consumer:

- Confirms BINGO-4 wasn't a one-pass fluke — designer / coder /
  reviewer chain works repeatedly against the same architecture
- Surfaces any flake in the stream consumer that a single run hid
- Gives the `message`-tool-from-subagent followup
  (`wing_kit/followups/message-tool-from-subagent-runtime`) a second
  data point — does it bypass `message` again, or did BINGO-4 land a
  procedure fix?
- Last cheap dogfood ticket before the first real Carpe-side
  application (Minerva / ClaimsX)

## Scope

### In scope

- Add exactly one new string to `BUZZWORDS` in `src/bingo.js`:
  - `HCP`
- Place it adjacent to `MCP` in the acronym cluster (line 4 area), so
  the acronym block stays visually grouped
- Add one discrete `node:test` assertion in `test/bingo.test.js`,
  matching the BINGO-1 / BINGO-2 / BINGO-4 shape
- Subagent-driven stream consumer posts every milestone + custom event
  + HITL prompt to the Slack thread for this ticket, **using the
  `message` tool**

### Out of scope

- Adding the long-form `Human Context Protocol` as a separate entry
  (the short-form earns the square; the long-form is the framing in
  the spec only)
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
to `feature/BINGO-5/product-spec.md` on the `feature/BINGO-5` branch of
`ggettert/aidlc-sandbox`, then triggers the V1 fleet graph via
`~/.openclaw/workspace/fleet/trigger.py` and spawns the monitor subagent
to relay events into this Slack thread.
