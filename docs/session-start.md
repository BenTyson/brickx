# BrickX — Agent Entry Point

**BrickX** is a LEGO investment platform ("StockX for LEGO") — a portfolio tracker and price guide that treats LEGO sets as an asset class. Built with Next.js 16, Supabase, and Tailwind CSS.

## Worktree Preflight — READ FIRST

Every agent session spawns into its **own git worktree** under `/Users/bentyson/brickx/.claude/worktrees/<name>/` on branch `claude/<name>`. Worktrees are isolated — they do NOT auto-inherit commits from prior sessions. Before doing anything, run:

```bash
pwd && git log --oneline -5 && ls .env.local 2>&1
```

Check three things:

1. **You're in a worktree, not the main repo.** `pwd` should be under `.claude/worktrees/...`.
2. **Prior session commits are present.** If your session depends on a prior one (e.g. D2 depends on D1, F2 depends on F1), look for that commit in `git log`. If missing:
   ```bash
   git branch -a                              # find the branch with the prior work
   git merge --ff-only claude/<prior-branch>  # fast-forward it in
   ```
   The plan file `docs/roadmap.md` is the authority on session dependencies.
3. **`.env.local` exists.** It's gitignored, so fresh worktrees don't have it. Middleware will crash on first request without it:
   ```bash
   cp /Users/bentyson/brickx/.env.local .env.local   # or symlink
   ```

**Dev server gotcha:** Port 5699 can only host one Next.js dev server. If the user has `npm run dev` running from the main repo or another worktree, routes added in *this* worktree will 404. Check with `lsof -i :5699` and restart from this worktree if needed.

**At session end:** commit on the current `claude/<name>` branch. The user merges branches forward between sessions; do not push or merge to `main` unless asked.

## Current Status

| Session                              | Status       |
| ------------------------------------ | ------------ |
| 1A: Project Setup & DB Schema        | **Complete** |
| 1B: Infrastructure & API Services    | **Complete** |
| 1C: Data Seeding & Aggregation       | **Complete** |
| 2: Design System & Landing Page      | **Complete** |
| 3A: Data Access Layer & Primitives   | **Complete** |
| 3B: Catalog Page (`/sets`)           | **Complete** |
| 3C: Detail Page & Price Chart        | **Complete** |
| 4: Auth & Collection Management      | **Complete** |
| 5: Market Intelligence & SEO         | **Complete** |
| D1: Design tokens, type, motion      | **Complete** |
| F1: Notification engine (email)      | **Complete** |
| D2: Core primitives rebuilt          | **Complete** |
| D3: Landing page redo                | **Complete** |
| F2: Historical portfolio snapshots   | **Complete** |
| D4: Catalog + Search + cmd+K         | **Complete** |
| D5: Set detail (flagship) redo       | **Complete** |
| F3: Onboarding + bulk CSV import/export | **Complete** |
| D6: Portfolio + Collections dashboard | **Complete** |
| D7: Market intelligence + named indices | **Complete** |

## What to Work on Next

**Next session: D8** — Motion pass + migration to production. Requires Opus 4.7. Adds Framer Motion page transitions, stagger entrances, count-up numerics, chart reveals, and skeleton→content crossfades across all demo pages, then migrates `/components-v2` → `/components` and deletes `/demo/*` routes. See `docs/roadmap.md` § Session D8 for full scope.

**Prerequisite check:** D8 needs D1–D7 commits in `git log`. D7 commit message: `Session D7: market intelligence + named indices — /demo/market/*`.

## Key References

- → [docs/sessions.md](./sessions.md) — Full session breakdown with deliverables
- → [docs/schema.md](./schema.md) — Database schema reference (10 tables)
- → [docs/architecture.md](./architecture.md) — Tech stack, directory structure, conventions
- → [docs/api-integrations.md](./api-integrations.md) — External API details and rate limits
- → [docs/project/overview.md](./project/overview.md) — Full business context and competitive landscape
