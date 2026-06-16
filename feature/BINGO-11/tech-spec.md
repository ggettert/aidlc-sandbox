# Tech Spec - BINGO-11: Add "huge context window" to BUZZWORDS

**AIDLC phase:** Design
**Grounding:** Direct follow-up after the BINGO-11 LangGraph dispatch failed with missing `ticket_id`.

---

## Overview

| Field | Value |
|-------|-------|
| **Unit / scope** | Add one new buzzword (`"huge context window"`) to `BUZZWORDS` array + one new test pinning it. |
| **Feature** | `feat/add-huge-context-window` |
| **Status** | Approved for build |
| **Author** | Grace Gettert + Kit |
| **Created** | 2026-06-16 |

## Context

Add the string `"huge context window"` to the `BUZZWORDS` array in `src/bingo.js`
and add one unit test in `test/bingo.test.js` that asserts the entry exists.
This follows the BINGO-8 through BINGO-10 pattern: one static data addition and
one exact-string assertion.

## Implementation

1. `src/bingo.js`: add `"huge context window"` near the existing context-related entry.
2. `test/bingo.test.js`: add `assert.ok(BUZZWORDS.includes("huge context window"))`.
