# Changelog

All notable changes to Theory of Forms are documented here. This project uses
[Semantic Versioning](https://semver.org/).

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
