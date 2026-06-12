# Tech Spec — BINGO-1: Add "policy theater" to BUZZWORDS

**AIDLC phase:** Design
**Grounding:** First end-to-end exercise for the V1 agentic-fleet POC
(`ggettert/aidlc-fleet-poc`). Smallest diff that covers the full
coder → reviewer → merge_gate → merge loop.

---

## Overview

| Field | Value |
|-------|-------|
| **Unit / scope** | Add one new buzzword (`"policy theater"`) to `BUZZWORDS` array + one new test pinning it. |
| **Feature** | `feature/BINGO-1/` |
| **Product Spec** | n/a — POC-grade; this Tech Spec stands alone for the exercise. |
| **Status** | Approved for build |
| **Author** | Grace Gettert + Kit |
| **Created** | 2026-06-12 |
| **Last updated** | 2026-06-12 |

## Context

### Summary

Add the string `"policy theater"` to the `BUZZWORDS` array in `src/bingo.js`
and add one new unit test in `test/bingo.test.js` that asserts the entry
exists. This is a one-line code change + one test — the simplest possible
exercise of the V1 fleet pipeline.

### Existing system & documentation

- **Repo layout:** Node/Express app. `src/bingo.js` exports the `BUZZWORDS`
  array used by `generateCard()` and `isWinningCard()`. `test/bingo.test.js`
  uses `node:test` (no vitest/jest).
- **Relevant ADRs:** none (this change is too small to need an ADR).
- **Prior art:** any existing entry in `BUZZWORDS` shows the pattern —
  lowercase string, comma-separated, single-word or short phrase.

### Out of scope for this Unit

- Renaming or reorganizing existing buzzwords.
- Changing card geometry, scoring, or winning logic.
- Updating the README or marketing copy.
- Adding multiple new entries (one PR = one square).
- Touching `generateCard`, `isWinningCard`, or `hash`.

## Architecture

No architectural change. Pure data + pure unit test.

## Data

`BUZZWORDS` is a static `const` array of strings exported from
`src/bingo.js`. Adding one entry grows the array length by 1; no schema
or migration concerns.

## APIs & contracts

No API or contract change. `BUZZWORDS` is internal; external callers go
through `generateCard()` which already handles arbitrary-length arrays.

## UI / client

No UI change. New buzzword can appear on a generated card the next time
`generateCard()` runs; no rendering update needed.

## Security & privacy

n/a.

## Acceptance criteria (for Review)

- [ ] `'policy theater'` appears as a string entry in the `BUZZWORDS`
      array in `src/bingo.js`. Placed grouped with other governance-flavored
      entries (next to `'governance'` is the natural spot, but reviewer
      should not block on position alone).
- [ ] One new test in `test/bingo.test.js` of approximately the shape:
      ```js
      test('BUZZWORDS includes "policy theater"', () => {
        assert.ok(BUZZWORDS.includes('policy theater'));
      });
      ```
- [ ] All existing tests still pass. Run `node --test test/` locally.
- [ ] CI is green on the PR (existing `test` workflow).
- [ ] No other files modified.
- [ ] Commit messages follow `feat(BINGO-1): …` style.

## Testing approach

| Layer | What we prove | Notes |
|-------|----------------|-------|
| Unit | New buzzword exists in `BUZZWORDS` | Single `node:test` assertion |
| Unit (regression) | Existing tests still pass | `generateCard`, `isWinningCard` unchanged |
| Integration / E2E | n/a | No UI or API change |

## Rollout & operations

PR merged on approve → no deploy target in the POC. The merge IS the
shipment for the purposes of this exercise.

## Why "policy theater" and not something else

T7 Mosley (AI Con 2026 Day 3) named four anti-patterns the V1 reviewer-bot
must avoid *becoming*:

- **Policy Theater** ("Very official. Very unused.") ← this PR
- Human-in-the-Loop Cosplay
- Speed Worship
- Governance After Dark

Filing "policy theater" as a buzzword serves two purposes: it ships a real
diff through the fleet (BINGO-1's actual purpose), and it makes future PRs
that add the other three squares trivially obvious follow-up tickets
(BINGO-2 / BINGO-3 / BINGO-4).
