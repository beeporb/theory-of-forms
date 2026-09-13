/**
 * A bundle of numeric bonuses applied on top of RunModifiers. Shared shape
 * for trait effects (character.ts) and gear stat effects (gear.ts) — both
 * are folded into computeRunModifiers the same way.
 */
export interface StatEffect {
  lootWeightBonus?: number;
  conditionTierBias?: number;
  weirdnessTierBias?: number;
  hazardDamageMultiplierBonus?: number;
  hazardStealChanceMultiplierBonus?: number;
  positiveHealMultiplierBonus?: number;
  maxHealthBonus?: number;
}
