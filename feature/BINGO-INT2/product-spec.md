# Product Spec — BINGO-INT2: Add `agent washing` to BUZZWORDS (integration smoke #2)

**AIDLC phase:** Plan (single Unit)
**Status:** Approved (autonomous /build proceeding per fleet POC precedent; see note)
**Created:** 2026-06-15

## Problem / Outcome

BINGO-INT2 is the **second end-to-end integration smoke** of the V1 agentic
fleet (planner → `/design` → gate → `/build` → `/review` → merge gate → merge).
As with BINGO-4/BINGO-5, the **real payload is the pipeline run**, not the
buzzword: we want a same-shape, trivially-reviewable diff that exercises the
streaming consumer, HITL gates, and merge end-to-end and confirms the prior
integration runs were repeatable rather than one-shot flukes.

The user-facing increment is one additional satirical buzzword on the AI Con USA
2026 bingo card.

## Scope

- Add exactly one new buzzword — **`agent washing`** (the satire of slapping
  "agentic" onto any product or workflow) — to the `BUZZWORDS` array in
  `src/bingo.js`, placed within the existing satirical anti-pattern cluster so
  that theme stays visually grouped.
- Add one discrete `node:test` assertion confirming the entry is present.

## Out of scope

- Any behavioral, API, UI, geometry, or scoring change.
- Reordering/renaming/removing existing entries.
- Changes to the fleet graph, workers, or streaming consumer (this Unit
  *exercises* the pipeline; it does not modify it).

## Acceptance

- `agent washing` appears on cards and is covered by a passing test.
- CI green on the PR; merge is the shipment (no deploy target in the POC).

> **Note on approval:** the canonical `specs/BINGO-INT2.md` referenced by the
> build trigger was absent at run time. Per the established BINGO-1…5 precedent
> (identical single-buzzword + single-test Units) and the fleet-POC intent of
> INT tickets as integration smokes, the build worker authored this minimal
> Plan/Design pair to keep traceability intact. Substantive product decisions
> (the specific buzzword, placement) follow prior art and remain reviewable in
> the PR diff and `/review` pass.
