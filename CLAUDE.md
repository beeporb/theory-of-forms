# CLAUDE.md

Guidance for Claude Code (and any agent it spawns) working in this repo. See
`README.md` for the project pitch and stack.

## Every user-facing change ships with a version bump and changelog entry

This is not optional. If a change is visible to a player (a new feature,
a balance change, a bug fix, a UI tweak), the same PR must also:

1. Bump `package.json`'s `version` (semver: patch for fixes, minor for new
   features/content, major for anything that breaks a saved game or the
   persisted data shape).
2. Add a matching entry to `CHANGELOG.md` (Keep a Changelog style — see the
   existing `[1.0.0]` entry for the format).
3. Add the same entry to `src/game/content/changelog.ts` (`CHANGELOG`
   array) — this is what the in-app "What's New" modal reads from
   (`src/components/hub/ChangelogModal.tsx`). It must stay in sync with
   `CHANGELOG.md`; these are the same history in two formats, not two
   separate logs.

Purely internal changes (refactors with no player-visible effect, test-only
changes, CI/tooling) don't need a version bump or changelog entry.

## Content-file convention

Every game-data domain (items, gear, actors, collectors, quests, recipes,
materials, dimensions, events, ...) follows the same shape:

- A type in `src/game/types/<domain>.ts`.
- A flat array + a `get<Domain>(id)` lookup function that throws on an
  unknown id, in `src/game/content/<domain>.ts`.
- A content-integrity test in `tests/content.test.ts` asserting every
  cross-reference (a `formId`, `gearId`, `materialId`, etc. pointing at
  another domain) actually resolves, plus non-empty flavor text where
  applicable.

Follow this pattern exactly for new content domains rather than inventing a
different shape.

## Architecture

- `src/game/types/` — plain TypeScript types, no logic.
- `src/game/content/` — static game data (see above).
- `src/game/logic/` — pure functions operating on that data and on
  `RunState`/`PlayerMeta`. Keep these pure and unit-tested; UI and stores
  call into them rather than duplicating logic inline.
- `src/state/` — the two zustand stores: `metaStore` (persisted forever —
  stash, collectors, gear, currency, character) and `runStore` (one active
  pocket-dimension run, cleared on extraction/death/abandon). Every mutator
  reads current state via `get()`, computes the next state with a pure
  logic function, and writes it back in a single `set()` call — never
  multiple `set()` calls for one logical action.
- `src/components/` — mirrors the domains above (`grid/`, `run/`,
  `inventory/`, `collectors/`, `hub/`, `common/`).

## Testing and verification

Before considering any change done: `npx tsc -b`, `npm run lint`,
`npm test`, `npm run build` (then remove the `dist/` it produces — it's
gitignored but no need to leave build output lying around). For new or
changed UI, actually render it — a static HTML file against the real
`src/styles/global.css`, screenshotted in headless Chromium — rather than
trusting the CSS by inspection alone.

## Git workflow

- Branch off the latest `main` per change (`git fetch origin main` then
  branch from `origin/main`, not a possibly-stale local `main`).
- Before pushing, confirm `git diff origin/main...HEAD --stat` shows only
  the intended change. If unrelated already-merged commits show up, the
  local base was stale — `git rebase origin/main` and re-push
  (`--force-with-lease`) rather than opening a PR with a noisy diff.
- One PR per issue/change. Squash merge.
