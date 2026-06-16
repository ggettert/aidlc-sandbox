# Tech Spec — BINGO-13: add three buzzwords to the bingo card pool

**AIDLC phase:** Design
**Feature folder:** `feature/BINGO-13/`
**Status:** Draft — pending approval
**Author:** Grace Gettert + DevOps Bot
**Created:** 2026-06-16

## Overview

| Field | Value |
|-------|-------|
| Unit / scope | Append three entries to `BUZZWORDS` in `src/bingo.js` + matching tests in `test/bingo.test.js`. |
| Feature | `feature/BINGO-13/` |

## Context

### Summary
Add three new buzzwords — `context window`, `caveman`, `magic` — to the
`BUZZWORDS` pool that `generateCard()` draws from. Purely a content
addition; no logic, API, or UI changes.

### Existing system
- `src/bingo.js` exports `BUZZWORDS` (a flat string array) and
  `generateCard(seed)`, which shuffles `BUZZWORDS` and lays out a 25-cell
  card with `FREE` at index 12.
- `test/bingo.test.js` asserts membership of specific buzzwords with
  `assert.ok(BUZZWORDS.includes('<word>'))`, and guards against duplicates
  with `new Set(BUZZWORDS).size === BUZZWORDS.length`.
- All three new words are net-new — none already present, so no duplicate
  collision.

### Out of scope
- No change to `generateCard`, win-line logic, API, or frontend.
- No removal/renaming of existing buzzwords.

## Implementation
1. `src/bingo.js`: append `'context window'`, `'caveman'`, `'magic'` to the
   `BUZZWORDS` array. Keep existing entries and order unchanged; add the new
   ones at the end.
2. `test/bingo.test.js`: add three membership tests mirroring the existing
   style:
   - `BUZZWORDS includes "context window"`
   - `BUZZWORDS includes "caveman"`
   - `BUZZWORDS includes "magic"`
   The existing no-duplicates test must still pass.

## Acceptance
- `npm test` passes, including the three new tests.
- `BUZZWORDS` contains `context window`, `caveman`, and `magic`.
- No existing buzzword removed or reordered; no duplicates.
