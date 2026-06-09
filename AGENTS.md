# AGENTS.md — aidlc-sandbox

This repo is a sandbox for the [AI-DLC](https://github.com/queen-of-code/AI-DLC) phase-orchestrator skills.

## App
AI Con Bingo — small Node/Express app, 5×5 buzzword bingo card for AI Con USA 2026.

## Stack
- Node 20+, ES modules
- Express 4
- Vanilla HTML/CSS/JS frontend (no build step)
- `node --test` for tests

## Process
See [`docs/AIDLC.md`](docs/AIDLC.md). Phases: Plan → Design → Build → Review → Ship → Learn.

## Issue tracker
GitHub Issues (this repo). Tracking issues should include:

```
AIDLC feature folder: `feature/<kebab-slug>/`
```

## Skills
Vendored at `.claude/deps/ai-dlc` (submodule). `.claude/skills` is a symlink.

To update AI-DLC:
```
cd .claude/deps/ai-dlc && git fetch origin && git checkout main && git pull
cd ../../.. && git add .claude/deps/ai-dlc && git commit -m "chore: bump ai-dlc submodule"
```

## Conventions
- Default branch: `main`
- PRs reference the tracking issue via `Closes #N` / `Fixes #N` / `Relates to #N`
- Tests live under `test/`, mirror `src/` layout
- Keep app dependencies minimal — this is a teaching sandbox
