# Tech Spec — BINGO-12: `/api/status` endpoint returning marked-square count

**AIDLC phase:** Design
**Feature folder:** `feature/BINGO-12/`
**Status:** Draft — pending approval
**Author:** Grace Gettert + Kit
**Created:** 2026-06-16

---

## Overview

| Field | Value |
|-------|-------|
| **Unit / scope** | New Express route `GET /api/status` on `src/server.js` + tests in `test/`. |
| **Feature** | `feature/BINGO-12/` |

## Context

### Summary

Add a `/api/status` endpoint that returns the number of squares currently
marked on the caller's card. Because card/marked state lives client-side
(`public/cardState.js`, persisted to localStorage), the client sends its
`marked` array as a query parameter; the server validates and returns
the count.

### Existing system

- `src/server.js` already exposes `GET /api/card` and `GET /api/healthz`.
- Card state lives in the browser. The `marked` array is 25 booleans; index 12
  (the free space) is always `true`.
- No server-side persistence; this endpoint stays stateless.

### Out of scope

- Server-side persistence of card state.
- Auth / multi-user accounting.
- Frontend UI changes (count is exposed via the API only; no new badge).

## API contract

```
GET /api/status?marked=<csv>
```

- `marked` — comma-separated list of 25 `0`/`1` values, e.g.
  `0,0,1,0,...,1`. Order matches the cell index used in `cardState.js`.
- Response: `200 application/json`
  ```json
  { "marked": 7, "total": 25, "won": false }
  ```
  - `marked` — count of `1`s in the input array.
  - `total` — always `25`.
  - `won` — `true` iff any winning line (row/column/diagonal) is fully marked.
- Errors: `400` with `{ "error": "<reason>" }` when:
  - `marked` query param is missing
  - length ≠ 25
  - any value is not `0` or `1`
  - index 12 is not `1` (free space invariant from `cardState.js`)

## Implementation

1. `src/bingo.js`: export the `LINES` constant (the 12 winning lines already
   defined inline in `public/index.html`) so server can compute `won`.
   If we don't want to touch `bingo.js`, inline the same `LINES` array in
   `server.js` — pick one and stay consistent.
2. `src/server.js`: add `GET /api/status` handler implementing the contract
   above. Parse `marked`, validate, compute count + `won`, respond JSON.
3. `test/server.test.js` (new): cover
   - happy path: 7 marks → `{ marked: 7, total: 25, won: false }`
   - winning row → `won: true`
   - missing param → 400
   - wrong length → 400
   - non-binary value → 400
   - free space (idx 12) unmarked → 400

## Acceptance

- `npm test` passes including the new file.
- `curl 'http://localhost:3000/api/status?marked=0,...'` returns the documented
  shape.
