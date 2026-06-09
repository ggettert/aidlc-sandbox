# Product Spec — Save & Share Your Bingo Card

**AIDLC phase:** Plan
**Audience:** Product, engineering leads, stakeholders — **product language only** (no implementation or stack). Unresolved product questions should be **asked in chat** first; this file records **decisions** after they are made.

---

## Overview

| Field | Value |
|-------|-------|
| **Feature** | Save & Share Your Bingo Card |
| **Status** | Approved |
| **Author** | Grace Gettert |
| **Created** | 2026-06-09 |
| **Last updated** | 2026-06-09 |
| **Related Tech Spec** | (created by `/design` → `feature/save-share-card/tech-spec.md`) |

## Problem & audience

### Problem statement

AI Con Bingo is fun in the moment but **completely ephemeral**. A player fills in their card during a talk, hits BINGO — and then has no way to keep that moment or show anyone. Worse, an accidental refresh or a phone locking and reloading the page **wipes all progress**, which is frustrating during a multi-hour session. Two everyday expectations are missing: my progress should still be here when I come back, and when I win I should be able to show it off.

### Who it’s for

Conference attendees playing the bingo card on their **phones** during AI Con USA 2026 talks. They are casual players, not logged-in users, who dip in and out across sessions. Secondarily, this Feature is the **worked example for teaching the AIDLC** end-to-end (Plan → Design → Build → Review → Ship → Learn), so it should stay small, honest, and self-contained.

### Current experience (baseline)

- A card is generated fresh on every page load; marked squares live only in the open tab.
- Refreshing, locking the phone, or revisiting the page **loses the card and all marks**.
- There is no concept of a player name, and **no way to share** a card or a win — the BINGO moment lives and dies in one browser tab.

## Outcomes & business impact

### Desired outcomes

- A player can **leave and come back** (same device/browser) and find their card and marked squares exactly as they left them.
- A player can **put their name on it** (optional) so a shared card is identifiably theirs.
- A player who hits BINGO (or any time they like) can **produce a shareable image of their card** to post or send — bragging rights.
- The Feature reads as a **clean, complete AIDLC example**: small scope, clear success criteria, no over-engineering.

### Success criteria (for Validate)

These tie directly to the **scorecard** in `/ship`. Each should be **testable** or **evidence-based** without reading code.

| # | Criterion | How we’ll verify |
|---|-----------|------------------|
| 1 | After marking squares and **reloading the page in the same browser**, the same card and the same marked squares are restored. | Mark several squares, refresh, confirm card layout and marks are unchanged. |
| 2 | A player can enter an **optional display name**; when set, it appears on their card and on the shared image. Leaving it blank is fine and shows no name. | Enter a name, observe it on the card and in the share output; clear it, confirm graceful blank. |
| 3 | From their current card, a player can **generate a shareable image** that visually reflects the card’s buzzwords, which squares are marked, the BINGO state, and the name (if set). | Tap Share, obtain an image; confirm it matches the on-screen card state. |
| 4 | Save works with **no account and no login**, and is **per-device** (a different browser/device starts fresh). | Open in a second browser/incognito; confirm it does not inherit the first device’s card. |
| 5 | **“New Card”** starts a fresh card and clears the previously saved progress, so a later refresh restores the *new* card, not the old one. | Get a new card, refresh, confirm the new card (not the prior one) is restored. |

### Business impact

None beyond baseline revenue. Value is **engagement and reach** (shared cards advertise the game and the conference) and, primarily, a **high-quality teaching artifact** for the AIDLC. “None beyond baseline” is the honest answer for direct business metrics.

## User experience & scenarios

### Key scenarios

Described from the player’s perspective (not API calls).

1. **Resume after a refresh** — *Given* I’ve marked some squares, *when* my phone reloads the page (lock screen, accidental refresh, returning between talks), *then* my card and marks are still there.
2. **Make it mine** — *Given* I want my shared card to be identifiably mine, *when* I enter a display name, *then* it shows on my card and on anything I share. It’s optional — blank is fine.
3. **Share my BINGO** — *Given* I’ve completed a line (or just want to show my card), *when* I tap Share, *then* I get an image of my card — buzzwords, marked squares, BINGO state, and my name if set — that I can save or post.
4. **Start over** — *Given* I want a fresh card, *when* I tap “New Card,” *then* I get a new card and my old saved progress is cleared (no stale card resurfacing later).

### Experience principles

- **Mobile-first and forgiving.** Players are on phones in a session; nothing should be lost to a stray reload, and saving must be invisible/automatic, not a button to remember.
- **Zero friction.** No sign-up, no permission walls. Naming is optional and skippable.
- **Honest sharing.** The shared image reflects the card as it actually is at share time — no faked wins.
- **Stays a teaching toy.** Keep it minimal; this is also an AIDLC example, so resist scope creep.

## Scope

### In scope

- Automatic **save and restore** of the current card and marked squares for the **same browser/device**, surviving refreshes and revisits.
- An **optional display name** the player can set/clear, shown on the card and in shares.
- **Sharing the current card as an image** (the “brag”), reflecting buzzwords, marks, BINGO state, and name.
- **“New Card”** clears saved progress and starts fresh.

### Out of scope

- **Cross-device / server-side accounts** — picking a card back up on a *different* device. (Save is per-device only.)
- **Logins / authentication** of any kind.
- **Challenge-a-friend / same-card play** — sending someone the *same* card to play head-to-head. (Recipient of a share only *looks*.)
- **History / gallery** of past completed cards.
- **Leaderboards, scoring, or real-time multiplayer.**

### Dependencies on other teams or features

- None. Self-contained within this app.

## Constraints (non-technical where possible)

- **No login or personal-data collection.** A display name is optional, player-supplied, and need not be real.
- **Must work well on mobile browsers** over potentially flaky conference connectivity; save/restore must not depend on a live network round-trip.
- **Keep dependencies minimal** — per `AGENTS.md`, this is a teaching sandbox; favor the simplest thing that satisfies the criteria.

## Decisions

Short log of **resolved** product questions from conversation.

| Date | Decision |
|------|----------|
| 2026-06-09 | **Share = brag/show-off only.** Recipient views a representation of the completed card; they do not play it. |
| 2026-06-09 | **Save = survive refresh on the same device.** No cross-device/server persistence in this Feature. |
| 2026-06-09 | **Identity = optional display name; no accounts/login.** |
| 2026-06-09 | **Context = teaching vehicle for the AIDLC**, used as the worked example; keep scope small and self-contained. |
| 2026-06-09 | **Share artifact = an image** (proposed/recommended). Most social-native brag and needs no backend, consistent with client-only save. *A clickable read-only link is the alternative; confirm at approval if preferred.* |

## Related documents

- Tech Spec: created by `/design` → `feature/save-share-card/tech-spec.md`
- Issues: [#1 — \[Feature\] Save & Share Your Bingo Card](https://github.com/ggettert/aidlc-sandbox/issues/1)
- AIDLC process: [`docs/AIDLC.md`](../../docs/AIDLC.md)
