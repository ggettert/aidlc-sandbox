# Product Spec — Add "context window" buzzword to bingo pool

**AIDLC phase:** Plan
**Audience:** Product, engineering leads, stakeholders — product language only.

---

## Overview

| Field | Value |
|-------|-------|
| **Feature** | Add "context window" to the AI Con Bingo buzzword pool (BINGO-13) |
| **Status** | Approved |
| **Author** | DevOps Bot (on behalf of Grace Gettert) |
| **Created** | 2026-06-16 |
| **Last updated** | 2026-06-16 |
| **Related Tech Spec** | _Created in `/design` after approval_ |

## Problem & audience

### Problem statement

The AI Con USA 2026 buzzword bingo card draws from a fixed pool of conference
terms. "context window" is one of the most-used phrases on the conference floor
but is currently missing from the pool, so it can never appear on a card. Players
expect the canonical AI vocabulary to be representable on their cards; a missing
high-frequency term makes the game feel incomplete.

### Who it's for

Conference attendees playing AI Con Bingo during AI Con USA 2026 — the people
generating and marking cards.

### Current experience (baseline)

The pool contains adjacent terms ("context engineering", "context rot") but not
"context window" itself. A player who hears "context window" said on stage has no
square to mark for it. The term simply cannot surface on any generated card.

## Outcomes & business impact

### Desired outcomes

- "context window" is part of the buzzword pool and can appear on generated cards.
- The term is spelled and cased exactly as `context window` (lowercase, matching
  the surrounding pool style).
- No existing term is removed, duplicated, or altered; the only change is one
  addition.
- Existing card generation, marking, win detection, and share behavior are
  unaffected.

### Success criteria (for Validate)

| # | Criterion | How we'll verify |
|---|-----------|------------------|
| 1 | "context window" is present in the buzzword pool | Inspect the pool / automated test asserting membership |
| 2 | "context window" can be drawn onto a generated card | Generate cards across seeds; the term is eligible to appear |
| 3 | No other buzzword was removed or renamed | Pool diff shows exactly one addition; pre-existing membership tests still pass |
| 4 | No duplicate entries in the pool | Automated check that the pool has no repeated values |
| 5 | Card behavior unchanged (still 25 cells, FREE center, win detection works) | Existing test suite passes green |

### Business impact

None beyond baseline — this is a content/completeness improvement to the game's
term pool. Keeps the bingo card credible against the live conference vocabulary.

## User experience & scenarios

### Key scenarios

1. **Term appears on a card** — Given a player generates a bingo card, when the
   draw includes "context window", then it renders as a normal markable square
   like any other buzzword.
2. **Term is markable and counts toward a win** — Given "context window" is on a
   player's card, when they mark it, then it behaves identically to any other
   square for win-line detection.

### Experience principles

- The new term should look and behave indistinguishably from existing pool terms
  (same casing convention, same square rendering, same marking behavior).

## Scope

### In scope

- Adding the single term "context window" to the buzzword pool.

### Out of scope

- Adding any other new buzzwords.
- Removing, renaming, or re-ordering existing buzzwords.
- Any change to card layout, win logic, sharing, or styling.
- Configurable/runtime-editable word lists or an admin UI for managing terms.

### Dependencies on other teams or features

- None.

## Constraints

- Keep the app dependency-free and vanilla per `AGENTS.md` (no new packages).
- Single-Unit feature — small enough for one Build/Test cycle.

## Decisions

- **Exact term & casing:** `context window`, lowercase — matches pool convention
  and the adjacent `context engineering` / `context rot` entries. _(Approved by
  Grace Gettert, 2026-06-16.)_
- **Approval:** Product Spec approved by Grace Gettert in #team-devops-internal,
  2026-06-16.
