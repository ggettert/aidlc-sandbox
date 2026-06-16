# Tech Spec — BINGO-11: Add "context rot" to BUZZWORDS

**AIDLC phase:** Design
**Grounding:** End-to-end happy-path validation for openclaw-langgraph-bridge thread-bound wake (2026-06-16).

---

## Overview

| Field | Value |
|-------|-------|
| **Unit / scope** | Add one new buzzword (`"context rot"`) to `BUZZWORDS` array + one new test pinning it. |
| **Feature** | `feature/BINGO-11/` |
| **Status** | Approved for build |
| **Author** | Grace Gettert + Kit |
| **Created** | 2026-06-16 |

## Context

### Summary

Add the string `"context rot"` to the `BUZZWORDS` array in `src/bingo.js`
and add one unit test in `test/bingo.test.js` that asserts the entry exists.
One-line code change + one test — same pattern as BINGO-1 through BINGO-10.

### Existing system

- `src/bingo.js` exports the `BUZZWORDS` array.
- `test/bingo.test.js` uses `node:test`.
- Pattern: lowercase string, comma-separated.

### Out of scope

Same as BINGO-1 — no architectural change, pure data + test.

## Implementation

1. `src/bingo.js`: append `"context rot"` to `BUZZWORDS`.
2. `test/bingo.test.js`: add `assert.ok(BUZZWORDS.includes("context rot"))`.

That's it.
