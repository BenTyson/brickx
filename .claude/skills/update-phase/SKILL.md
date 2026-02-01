---
name: update-phase
description: Updates project documentation in /docs after completing a session or phase. Keeps docs accurate and concise so future agents can pick up the project immediately.
argument-hint: "[completed-phase e.g. '1B']"
allowed-tools: Read, Glob, Grep, Edit, Write, Bash
---

# Update Phase Documentation

You just finished a phase of work. Update the docs in `/docs` so the next agent session starts with accurate context. Be surgical — change only what's stale, add only what's new, remove nothing unless it's wrong.

## What was completed

The completed phase is: **$ARGUMENTS**

## Steps

### 1. Gather current project state

Before touching any docs, understand what actually exists now:

- Read every file in `docs/` to know current doc state
- Run `!`find src scripts supabase -type f -name '_.ts' -o -name '_.tsx' -o -name '\*.sql' | grep -v node_modules | grep -v .next | sort`` to see all source files
- Check `package.json` for current scripts and dependencies
- Look at `supabase/migrations/` for current schema state
- Check git status to see what's changed recently: `!`git log --oneline -10 2>/dev/null``

### 2. Update `docs/session-start.md`

This is the **first file any agent reads**. It must be:

- Accurate about which sessions are complete vs pending
- Clear about what to work on next (the immediate next session)
- Linking to all other docs

Update the status table and "What to Work on Next" section. Nothing else unless something is wrong.

### 3. Update `docs/sessions.md`

Mark the completed session(s) with **Complete** status. If any deliverables changed from the original plan (files renamed, extra files added, files dropped), update the deliverables list to match reality.

Do NOT update future sessions unless their prerequisites changed.

### 4. Update `docs/schema.md` (only if schema changed)

If new migrations were added or existing ones modified:

- Add/update table definitions
- Update enum definitions
- Update relationships, indexes, RLS sections
- Keep the format identical to existing entries

If no schema changes, skip entirely.

### 5. Update `docs/architecture.md` (only if structure changed)

If new directories, new patterns, or new conventions were introduced:

- Update directory tree
- Add new conventions
- Update tech stack table if new major deps added

If the project structure is unchanged, skip entirely.

### 6. Update `docs/api-integrations.md` (only if API usage changed)

If new endpoints are being used, rate limit info was discovered, or auth details changed:

- Update the relevant API section
- Keep the same table format

If no API changes, skip entirely.

### 7. Verify doc accuracy

After all updates, read each modified file back and confirm:

- No stale references to files that don't exist
- No missing references to files that do exist
- Status fields match reality
- Links between docs are valid

## Rules

- **Be concise.** Docs are for agent briefing, not human prose. Tables > paragraphs. Bullets > sentences.
- **Be accurate.** Every file path, table name, and status must match reality. Verify by reading actual files.
- **Be minimal.** If a doc section is already correct, don't touch it. Fewer changes = fewer merge conflicts.
- **No aspirational content.** Only document what exists now or what the next session will build. Don't add wishlist items.
- **Preserve formatting.** Match existing markdown style exactly — same table alignment, same heading levels, same link format.
