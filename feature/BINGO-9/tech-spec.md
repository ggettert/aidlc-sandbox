# Tech Spec — BINGO-9: Add "vibe coding" to BUZZWORDS

**AIDLC phase:** Design
**Grounding:** Smoke test for the openclaw-langgraph-bridge plugin v0.9.0 (Phase 4 — wake via openclaw agent CLI).

---

## Overview

| Field | Value |
|-------|-------|
| **Unit / scope** | Add one new buzzword (`"vibe coding"`) to `BUZZWORDS` array + one new test pinning it. |
| **Feature** | `feature/BINGO-9/` |
| **Status** | Approved for build |
| **Author** | Grace Gettert + Kit |
| **Created** | 2026-06-16 |

## Context

### Summary

Add the string `"vibe coding"` to the `BUZZWORDS` array in `src/bingo.js`
and add one unit test in `test/bingo.test.js` that asserts the entry exists.
One-line code change + one test — same pattern as BINGO-1 through BINGO-8.

### Existing system

- `src/bingo.js` exports the `BUZZWORDS` array.
- `test/bingo.test.js` uses `node:test`.
- Pattern: lowercase string, comma-separated.

### Out of scope

Same as BINGO-1 — no architectural change, pure data + test.

## Implementation

1. `src/bingo.js`: append `"vibe coding"` to `BUZZWORDS`.
2. `test/bingo.test.js`: add `assert.ok(BUZZWORDS.includes("vibe coding"))`.

That's it.
