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

## Tests

```bash
npm test
```
