# Product Spec — BINGO-23: Pink & teal color scheme

**AIDLC phase:** Plan
**Audience:** Product, engineering leads, stakeholders — product language only.
**Feature folder:** `feature/BINGO-23/`

---

## Overview

| Field | Value |
|-------|-------|
| **Feature** | Recolor AI Con Bingo to a pink & teal theme (BINGO-23) |
| **Status** | Awaiting approval |
| **Author** | Grace Gettert + DevOps Bot |
| **Created** | 2026-06-17 |
| **Last updated** | 2026-06-17 |
| **Related Tech Spec** | To be produced by the AIDLC Design phase (fleet designer agent) |

## Problem & audience

### Problem statement
The AI Con Bingo card currently uses a dark navy theme with amber-yellow and
red accents. We want a fresh, on-brand look for AI Con USA 2026: a **pink and
teal** color scheme. This is a purely cosmetic refresh — no behavior changes.

### Who it's for
Attendees of AI Con USA 2026 who play the buzzword bingo card, and the Carpe
team demoing it.

### Current experience (baseline)
- Dark navy background (`#1a1a2e`).
- Amber-yellow (`#ffd166`) for the title, buttons, the FREE space, marked-cell
  borders, and the winner banner.
- Red (`#e94560`) for marked cells.
- Same palette is mirrored in the downloadable/share canvas card.

## Outcomes & business impact

### Desired outcomes
- The bingo card presents in a cohesive **pink + teal** palette across both the
  live web UI and the generated share-card image.
- The theme stays **dark** (dark teal surfaces), retaining good contrast and
  readability.
- No functional regression: card generation, marking, win detection, name
  entry, status endpoint, and share-card export all work exactly as before.

### Success criteria (for Validate)

| # | Criterion | How we'll verify |
|---|-----------|------------------|
| 1 | Live UI renders with pink + teal, dark themed | Load the page; background is dark teal, accents are teal/pink, no leftover navy/amber/red |
| 2 | Share-card image matches the new theme | Generate/download the share card; colors match the live UI |
| 3 | No behavior change | Existing tests pass; marking, winning, and FREE space behave identically |
| 4 | Readable contrast | Text and cells remain legible on the new dark-teal background |

### Business impact
None beyond a refreshed, on-brand look for the event. No revenue/compliance
impact.

## User experience & scenarios

### Key scenarios
1. **Open the card** — A player loads the page and sees a dark teal board with
   teal headings/buttons and pink active accents.
2. **Mark a cell** — Tapping a buzzword highlights it in pink (was red), clearly
   distinct from unmarked teal cells.
3. **Win** — On a completed line, the winner banner reads in the accent color and
   is clearly celebratory against the dark teal.
4. **Share** — The downloaded share-card image uses the same pink + teal theme as
   the on-screen card.

### Experience principles
- **Dark themed** — keep the dark background; this is a recolor, not a light-mode
  redesign.
- **Legible** — maintain strong contrast between text, unmarked cells, and marked
  cells.
- **Consistent** — the live UI and the exported share-card image must share one
  palette.

## Scope

### In scope
- Recolor the live bingo UI (background, headings, cells, marked/free/winner
  states, buttons, name-entry input).
- Recolor the generated share-card canvas image to match.

### Out of scope
- No change to buzzword content, card generation logic, win detection, layout,
  or the status API.
- No light-mode / theme-toggle feature.
- No font or layout/structure changes beyond color.

### Dependencies on other teams or features
- None.

## Decisions (resolved in chat, 2026-06-17)
- **Theme stays dark** for now (Grace).
- **Pink + teal** confirmed; **DevOps Bot picks the exact hex values** (Grace),
  to be specified in the Tech Spec / Design phase. Proposed direction: deep teal
  surfaces (e.g. `#0d2b2b` background, `#123c3c` cells, `#1c5757` borders),
  bright teal primary accent (e.g. `#2ec4b6` for headings/buttons), and pink for
  active/marked/winner/free states (e.g. `#ff5da2`, with a lighter `#ff8cc6` for
  hover). Final values land in Design.
