export interface ChangelogEntry {
  version: string;
  date: string;
  changes: string[];
}

// Keep this in sync with CHANGELOG.md — this is the same history, structured
// for in-app display instead of markdown.
export const CHANGELOG: ChangelogEntry[] = [
  {
    version: '1.7.0',
    date: '2026-09-13',
    changes: [
      'Six new items, two exclusive to each pocket dimension: Forklift Fork and Inventory Clipboard only turn up in The Old Warehouse, Carbon-Copy Ledger and Engraved Cufflink only in The Records Office, and Seam Crystal and Drill Bit Core only in The Deep Vein.',
    ],
  },
  {
    version: '1.6.0',
    date: '2026-09-13',
    changes: [
      'Roaming actors now have a chance to pick up an unclaimed loot or gear cell as they wander past it, leaving it opened and empty by the time you get there. Dawdling — or backtracking through ground actors have had time to cross — now has a real cost.',
    ],
  },
  {
    version: '1.5.0',
    date: '2026-09-13',
    changes: [
      'Pocket dimension threat levels: every run now rolls one of five threat tiers (Safe, Low, Medium, High, Danger Zone), shown before you commit and for the rest of the run. Higher tiers mean more roaming ferals, hazards that crop up more often, and better loot quality — but healing gets scarcer (none at all in a Danger Zone) and extraction gets harder, with a Danger Zone run forcing a single, far-flung extraction point and more moves required to reach it. The same dimension can come up calm one run and brutal the next.',
      'Past run history now records and shows which threat level a run was.',
    ],
  },
  {
    version: '1.4.0',
    date: '2026-09-13',
    changes: [
      'Equipment now has real mechanical effects instead of being purely cosmetic/collectible: weapons cut incoming hazard damage, armor cuts the chance a hazard steals an item and adds max health, and tools skew loot odds, healing, and (for the Geiger Counter) how weird what you find gets. A piece’s effect scales with its current condition, so a wrecked weapon or tool pulls noticeably less weight than a pristine one.',
      'Gear cards and their detail view now show what a piece actually does.',
    ],
  },
  {
    version: '1.3.0',
    date: '2026-09-12',
    changes: [
      'A second, harder "Pristine Set" milestone per collector — the base Master Set only asks for one of each required version at any quality, which could read as "done" from a pile of low-quality donations. Pristine Set only completes once every required version is donated at pristine condition, shown as its own progress bar and badge.',
      'Condition badges in the collector detail checklist are now color-coded like everywhere else they appear.',
    ],
  },
  {
    version: '1.2.2',
    date: '2026-09-12',
    changes: [
      'Equipment condition badges are now color-coded (red/amber/green) so gear at risk of breaking stands out at a glance instead of needing to be read.',
    ],
  },
  {
    version: '1.2.1',
    date: '2026-09-12',
    changes: [
      "A collector's name is now clearly clickable (a chevron affordance) — it previously only changed color on hover, which touch devices never show.",
    ],
  },
  {
    version: '1.2.0',
    date: '2026-09-12',
    changes: [
      'Two more collectors (The Clerk, The Widow) for the item sets that had none, and fixed The Archivist’s "wants one of everything" requirement going stale as the item roster grew.',
      'Opening a collector now shows the full checklist of what they want, what you’ve already donated, and any quests they’re offering.',
      'Quests from collectors that pay out a new "widgets" currency, crafting materials, or gear.',
      'A crafting system: spend materials (and sometimes widgets) on recipes for gear, including keys, or break down stash items you don’t need into materials.',
      'Item condition and rarity are now shown when choosing what to drop from a full pack, not just the item’s name.',
      'Fixed large dimension grids (e.g. The Deep Vein’s up to 9×9 layout) overflowing the screen instead of shrinking to fit.',
    ],
  },
  {
    version: '1.1.0',
    date: '2026-09-12',
    changes: [
      'Six more gear pieces (two per weapon/armor/tool slot) found in pocket dimensions instead of owned from the start.',
      'Gear condition that degrades a tier after a run it was equipped for, shown on loadout cards like item condition.',
      'A key slot and two keycards/keys that guarantee the risky choice on a matching event succeeds, when equipped.',
      'A small chance for a ‘loot’ cell to yield gear instead of an item, rolling its initial condition like items do.',
    ],
  },
  {
    version: '1.0.0',
    date: '2026-09-12',
    changes: [
      'Discord login and a persistent player profile.',
      'Pocket dimension runs: grid exploration, fog of war, extraction points, and a run log.',
      'Items with forms/versions, condition and rarity tiers, and flavor text, shown as collectible cards.',
      'Gear and loadouts, shown with the same card treatment and rarity styling as items.',
      'Character progression: attributes, tag skills, traits, and leveling.',
      'Collectors and master sets you donate items toward.',
      'Roaming actors — adversaries, traders, and collectors — that move around the grid and trigger encounters.',
      'Carry capacity limits that force a choice about what to keep mid-run.',
      'Danger that escalates the farther you push from a run’s entry point.',
      'Two additional pocket dimensions (The Records Office, The Deep Vein), each with its own unlock condition.',
      'Random events mid-run with player choices that trade off risk and reward.',
    ],
  },
];
