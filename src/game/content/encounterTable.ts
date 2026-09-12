export type LeafOutcomeKind = 'loot' | 'hazard' | 'positive' | 'empty';
export type OutcomeKind = LeafOutcomeKind | 'event';

export const OUTCOME_KIND_WEIGHTS: { weight: number; value: OutcomeKind }[] = [
  { weight: 40, value: 'loot' },
  { weight: 22, value: 'hazard' },
  { weight: 13, value: 'positive' },
  { weight: 15, value: 'empty' },
  { weight: 10, value: 'event' },
];

// A 'loot' cell rolls a gear piece instead of an item this often, when the
// dimension has a gearPool at all — kept low so loot is still mostly items.
export const GEAR_DROP_CHANCE = 0.12;

export const HAZARD_DAMAGE_RANGE: [min: number, max: number] = [10, 30];
export const HAZARD_STEAL_CHANCE = 0.35;
export const POSITIVE_HEAL_RANGE: [min: number, max: number] = [10, 25];

// Danger escalates with distance from the entry: a cell at the far edge of
// the floor plan (depthFactor 1) rolls hazards both more often and harder
// than one right by the entry (depthFactor 0), so pushing deeper for more
// loot is a real risk/reward trade-off instead of a flat cell-by-cell roll.
export const HAZARD_DEPTH_WEIGHT_BONUS = 20;
export const HAZARD_DEPTH_DAMAGE_MULTIPLIER_BONUS = 0.5;

export const HAZARD_MESSAGES = [
  'A shelving unit collapses as you brush past it.',
  'Something skitters out of the dark and takes a bite.',
  'You trip a rusted tripwire left over from before.',
];

export const POSITIVE_MESSAGES = [
  'A half-intact medkit, somehow still good.',
  'A quiet corner to catch your breath.',
  'Clean water, dripping from a cracked pipe.',
];

export const EMPTY_MESSAGES = [
  "Nothing here but dust and old shelving.",
  'Just an empty crate.',
  'A dead end. Nothing worth taking.',
];
