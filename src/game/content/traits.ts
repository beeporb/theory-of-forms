import type { TraitDefinition } from '../types/character';

export const TRAIT_CATALOG: TraitDefinition[] = [
  {
    id: 'iron-stomach',
    name: 'Iron Stomach',
    description: 'Positive encounters restore 50% more health.',
    icon: 'flask',
    requiredLevel: 1,
    effect: { positiveHealMultiplierBonus: 0.5 },
  },
  {
    id: 'quick-reflexes',
    name: 'Quick Reflexes',
    description: 'Hazards deal 20% less damage.',
    icon: 'bomb',
    requiredLevel: 1,
    effect: { hazardDamageMultiplierBonus: -0.2 },
  },
  {
    id: 'steady-hands',
    name: 'Steady Hands',
    description: 'Hazards are 25% less likely to steal an item from you.',
    icon: 'wrench',
    requiredLevel: 2,
    effect: { hazardStealChanceMultiplierBonus: -0.25 },
  },
  {
    id: 'road-worn',
    name: 'Road-Worn',
    description: '+15 max health.',
    icon: 'shield',
    requiredLevel: 2,
    effect: { maxHealthBonus: 15 },
  },
  {
    id: 'scavengers-eye',
    name: "Scavenger's Eye",
    description: 'Finds skew harder toward loot over hazards and empty pulls.',
    icon: 'gem',
    requiredLevel: 4,
    effect: { lootWeightBonus: 15 },
  },
  {
    id: 'keen-eye',
    name: 'Keen Eye',
    description: 'An eye for the well-kept and the uncanny alike: finds skew one tier better on both axes.',
    icon: 'search',
    requiredLevel: 4,
    effect: { conditionTierBias: 1, weirdnessTierBias: 1 },
  },
];

export function getTrait(id: string): TraitDefinition {
  const trait = TRAIT_CATALOG.find((t) => t.id === id);
  if (!trait) throw new Error(`Unknown trait: ${id}`);
  return trait;
}
