export interface ChangelogEntry {
  version: string;
  date: string;
  changes: string[];
}

// Keep this in sync with CHANGELOG.md — this is the same history, structured
// for in-app display instead of markdown.
export const CHANGELOG: ChangelogEntry[] = [
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
