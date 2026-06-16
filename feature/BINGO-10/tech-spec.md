# Tech Spec — BINGO-10: Add "shadow IT for agents" to BUZZWORDS

**AIDLC phase:** Design
**Grounding:** Validation run for openclaw-langgraph-bridge v0.10.0 (Phase 5 — resume opens SSE subscriber).

---

## Overview

| Field | Value |
|-------|-------|
| **Unit / scope** | Add one new buzzword (`"shadow IT for agents"`) to `BUZZWORDS` array + one new test pinning it. |
| **Feature** | `feature/BINGO-10/` |
| **Status** | Approved for build |
| **Author** | Grace Gettert + Kit |
| **Created** | 2026-06-16 |

## Context

### Summary

Add the string `"shadow IT for agents"` to the `BUZZWORDS` array in `src/bingo.js`
and add one unit test in `test/bingo.test.js` that asserts the entry exists.
One-line code change + one test — same pattern as BINGO-1 through BINGO-9.

### Existing system

- `src/bingo.js` exports the `BUZZWORDS` array.
- `test/bingo.test.js` uses `node:test`.
- Pattern: lowercase string, comma-separated.

### Out of scope

Same as BINGO-1 — no architectural change, pure data + test.

## Implementation

1. `src/bingo.js`: append `"shadow IT for agents"` to `BUZZWORDS`.
2. `test/bingo.test.js`: add `assert.ok(BUZZWORDS.includes("shadow IT for agents"))`.

That's it.
