# aidlc-sandbox 🎰

Sandbox repo to exercise [AI-DLC](https://github.com/queen-of-code/AI-DLC) phase-orchestrator skills (`/plan`, `/design`, `/build`, `/review`, `/ship`) against a real app.

App: **AI Con Bingo** — buzzword bingo for AI Con USA 2026.

## Setup

```bash
git clone --recurse-submodules https://github.com/ggettert/aidlc-sandbox.git
cd aidlc-sandbox
npm install
npm start          # http://localhost:3000
```

If you forgot `--recurse-submodules`:
```bash
git submodule update --init --recursive
```

## AI-DLC skills

- AI-DLC vendored as submodule at `.claude/deps/ai-dlc` (branch `main`).
- `.claude/skills` symlinks to `deps/ai-dlc/skills` — Claude Code resolves the standard skills path.
- Process narrative: [`docs/AIDLC.md`](docs/AIDLC.md).
- Skills index: <https://github.com/queen-of-code/AI-DLC/blob/main/docs/SKILLS.md>.

In Claude Code: `/plan`, `/design`, `/build`, `/review`, `/ship`, `/learn`.

## Headless agent runs (GitHub Actions)

`anthropics/claude-code-action@v1` triggers on `issues.labeled` with `aidlc_work:unstarted`. See `.github/workflows/aidlc-launch.yml`.

Bootstrap:
```bash
claude /install-github-app
```
This installs the GitHub App and writes the `CLAUDE_CODE_OAUTH_TOKEN` secret.

## Features

- 5×5 buzzword bingo card, randomised each session
- **Auto-save** — card and marked squares survive a page refresh (same browser/device, no login)
- **Optional display name** — shown on the card and on the shared image
- **Share as image** — generates a PNG of your current card; uses the native share sheet on mobile, download fallback on desktop

## Architecture decisions

Significant decisions are recorded in [`adr/`](adr/):

| ADR | Decision |
|-----|----------|
| [0001](adr/0001-client-only-persistence-via-localstorage.md) | Client-only persistence via `localStorage` |
| [0002](adr/0002-pure-client-module-in-public-dir.md) | Pure client modules live in `public/` (no build step) |
| [0003](adr/0003-canvas-png-for-share-image.md) | Share image via Canvas API + Web Share |

## Tests

```bash
npm test
```
