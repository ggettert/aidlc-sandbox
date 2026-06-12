# BINGO-1: Add "policy theater" to the buzzword list

## Why

We're using `aidlc-sandbox` as the target for the V1 fleet POC. BINGO-1 is the
first end-to-end exercise — small enough to fit one PR, real enough to cover the
full coder → reviewer → merge_gate → merge loop.

The new square also references T7 Mosley (AI Con 2026 Day 3) — "Ways to Lose
the Plot" anti-pattern #1 — which the V1 reviewer-bot will eventually guard
against. Filing it as a buzzword keeps the joke alive.

## Acceptance criteria

1. **Add `'policy theater'` to the `BUZZWORDS` array** in `src/bingo.js`.
   Place it grouped with the other "anti-pattern" / governance-flavored entries
   (next to `'governance'` is the natural spot).
2. **No other code changes.** Don't touch `generateCard`, `isWinningCard`, or
   `hash`. Don't reformat existing entries.
3. **Add one new test** in `test/bingo.test.js` that pins the new entry:
   ```js
   test('BUZZWORDS includes "policy theater"', () => {
     assert.ok(BUZZWORDS.includes('policy theater'));
   });
   ```
4. **All existing tests must still pass.** Run `node --test test/` locally
   before opening the PR; the GitHub Actions CI must be green.

## Out of scope

- Renaming or reorganizing existing buzzwords
- Changing card geometry, scoring, or winning logic
- Updating the README or marketing copy
- Adding multiple new entries (one PR = one square)

## Definition of done

- PR opened against `main` of `ggettert/aidlc-sandbox`
- CI green (existing `test` workflow)
- Reviewer bot returns `approve` (no MUST FIX)
- HITL gate approved by Grace via Slack DM
- PR merged

## Why "policy theater" and not something else

T7 Mosley's deck names four anti-patterns the V1 reviewer-bot must avoid
*becoming*:
- **Policy Theater** ("Very official. Very unused.")
- Human-in-the-Loop Cosplay
- Speed Worship
- Governance After Dark

Filing "policy theater" as a buzzword serves two purposes: it ships a real
diff through the fleet (BINGO-1's actual purpose), and it makes future PRs
that add the other three squares trivially obvious follow-up tickets.
