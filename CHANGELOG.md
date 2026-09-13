# Changelog

All notable changes to Theory of Forms are documented here. This project uses
[Semantic Versioning](https://semver.org/).

## [1.8.0] - 2026-09-13

### Added

- Ten new mid-run events (up from two), covering a much wider spread of
  good, bad, and weird: a vending machine worth risking a hit, something
  asleep in a corner best left alone, a leaning shelf, a fridge that's
  stayed cold too long, a wall of shaky handwriting, an unattended
  toolbox, a radio catching something almost like a voice, a choice
  between two unmarked doors, a careful-vs-quick search with no purely
  safe option, and food that might be a trap. Every event still leaves at
  least one choice completely risk-free.

## [1.7.0] - 2026-09-13

### Added

- Six new items, two exclusive to each pocket dimension: Forklift Fork and
  Inventory Clipboard only turn up in The Old Warehouse, Carbon-Copy
  Ledger and Engraved Cufflink only in The Records Office, and Seam
  Crystal and Drill Bit Core only in The Deep Vein.

## [1.6.0] - 2026-09-13

### Added

- Roaming actors now have a chance to pick up an unclaimed loot or gear
  cell as they wander past it, leaving it opened and empty by the time
  you get there. Dawdling — or backtracking through ground actors have
  had time to cross — now has a real cost.

## [1.5.0] - 2026-09-13

### Added

- Pocket dimension threat levels: every run now rolls one of five threat
  tiers (Safe, Low, Medium, High, Danger Zone), shown before you commit
  and for the rest of the run. Higher tiers mean more roaming ferals,
  hazards that crop up more often, and better loot quality — but healing
  gets scarcer (none at all in a Danger Zone) and extraction gets harder,
  with a Danger Zone run forcing a single, far-flung extraction point and
  more moves required to reach it. The same dimension can come up calm
  one run and brutal the next.
- Past run history now records and shows which threat level a run was.

## [1.4.0] - 2026-09-13

### Added

- Equipment now has real mechanical effects instead of being purely
  cosmetic/collectible: weapons cut incoming hazard damage, armor cuts the
  chance a hazard steals an item and adds max health, and tools skew loot
  odds, healing, and (for the Geiger Counter) how weird what you find gets.
  A piece's effect scales with its current condition, so a wrecked weapon
  or tool pulls noticeably less weight than a pristine one.
- Gear cards and their detail view now show what a piece actually does.

## [1.3.0] - 2026-09-12

### Added

- A second, harder "Pristine Set" milestone per collector — the base
  Master Set only asks for one of each required version at any quality,
  which could read as "done" from a pile of low-quality donations.
  Pristine Set only completes once every required version is donated at
  pristine condition, shown as its own progress bar and badge.

### Changed

- Condition badges in the collector detail checklist are now color-coded
  like everywhere else they appear.

## [1.2.2] - 2026-09-12

### Fixed

- Equipment condition badges are now color-coded (red/amber/green) so gear
  at risk of breaking stands out at a glance instead of needing to be read.

## [1.2.1] - 2026-09-12

### Fixed

- A collector's name is now clearly clickable (a chevron affordance) — it
  previously only changed color on hover, which touch devices never show.

## [1.2.0] - 2026-09-12

### Added

- Two more collectors (The Clerk, The Widow) for the item sets that had
  none, and fixed The Archivist's "wants one of everything" requirement
  going stale as the item roster grew.
- Opening a collector now shows the full checklist of what they want, what
  you've already donated, and any quests they're offering.
- Quests from collectors that pay out a new "widgets" currency, crafting
  materials, or gear.
- A crafting system: spend materials (and sometimes widgets) on recipes
  for gear, including keys, or break down stash items you don't need into
  materials.
- Item condition and rarity are now shown when choosing what to drop from
  a full pack, not just the item's name.

### Fixed

- Large dimension grids (e.g. The Deep Vein's up to 9×9 layout) no longer
  overflow the screen — cells shrink to fit instead of forcing horizontal
  scroll.

## [1.1.0] - 2026-09-12

### Added

- Six more gear pieces (two per weapon/armor/tool slot) found in pocket
  dimensions instead of owned from the start.
- Gear condition that degrades a tier after a run it was equipped for, shown
  on loadout cards the same way item condition already is.
- A key slot and two keycards/keys that guarantee the risky choice on a
  matching event succeeds, when equipped.
- A small chance for a 'loot' cell to yield gear instead of an item, rolling
  its initial condition the same way items do.

## [1.0.0] - 2026-09-12

Baseline release — everything shipped up to this point, treated as the v1
starting line.

### Added

- Discord login and a persistent player profile.
- Pocket dimension runs: grid exploration, fog of war, extraction points,
  and a run log.
- Items with forms/versions, condition and rarity (weirdness) tiers, and
  flavor text, shown as collectible cards you can open up for detail.
- Gear and loadouts, shown with the same card treatment and rarity styling
  as items.
- Character progression: attributes, tag skills, traits, and leveling.
- Collectors and master sets you donate items toward.
- Roaming actors — adversaries, traders, and collectors — that move around
  the grid and trigger encounters.
- Carry capacity limits that force a choice about what to keep mid-run.
- Danger that escalates the farther you push from a run's entry point.
- Two additional pocket dimensions (The Records Office, The Deep Vein),
  each with its own unlock condition.
- Random events mid-run with player choices that trade off risk and
  reward.
