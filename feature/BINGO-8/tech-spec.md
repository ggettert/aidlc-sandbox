# Tech Spec — BINGO-8: Add "agentic debt" to BUZZWORDS

**AIDLC phase:** Design
**Grounding:** Milestone smoke test for the openclaw-langgraph-bridge plugin (v0.7.0).
Exercises the full fleet pipeline with native `_emit()` event translation.

---

## Overview

| Field | Value |
|-------|-------|
| **Unit / scope** | Add one new buzzword (`"agentic debt"`) to `BUZZWORDS` array + one new test pinning it. |
| **Feature** | `feature/BINGO-8/` |
| **Status** | Approved for build |
| **Author** | Grace Gettert + Kit |
| **Created** | 2026-06-15 |

## Context

### Summary

Add the string `"agentic debt"` to the `BUZZWORDS` array in `src/bingo.js`
and add one unit test in `test/bingo.test.js` that asserts the entry exists.
One-line code change + one test — same pattern as BINGO-1 through BINGO-7.

### Existing system

- `src/bingo.js` exports the `BUZZWORDS` array.
- `test/bingo.test.js` uses `node:test`.
- Pattern: lowercase string, comma-separated.

### Out of scope

Same as BINGO-1 — no architectural change, pure data + test.

## Implementation

1. `src/bingo.js`: append `"agentic debt"` to `BUZZWORDS`.
2. `test/bingo.test.js`: add `assert.ok(BUZZWORDS.includes("agentic debt"))`.

That's it.
