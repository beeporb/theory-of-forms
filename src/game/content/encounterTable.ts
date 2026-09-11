export type OutcomeKind = 'loot' | 'hazard' | 'positive' | 'empty';

export const OUTCOME_KIND_WEIGHTS: { weight: number; value: OutcomeKind }[] = [
  { weight: 45, value: 'loot' },
  { weight: 25, value: 'hazard' },
  { weight: 15, value: 'positive' },
  { weight: 15, value: 'empty' },
];

export const HAZARD_DAMAGE_RANGE: [min: number, max: number] = [10, 30];
export const HAZARD_STEAL_CHANCE = 0.35;
export const POSITIVE_HEAL_RANGE: [min: number, max: number] = [10, 25];

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
