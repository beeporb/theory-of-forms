import type { StatEffect } from '../types/effect';

/** Human-readable bullet lines for a gear piece's stat effect (e.g. "-8% hazard damage"). Keys carry no effect and return an empty list. */
export function describeGearEffect(effect: StatEffect | undefined): string[] {
  if (!effect) return [];
  const lines: string[] = [];
  if (effect.hazardDamageMultiplierBonus) lines.push(`${formatPercent(effect.hazardDamageMultiplierBonus)} hazard damage`);
  if (effect.hazardStealChanceMultiplierBonus) lines.push(`${formatPercent(effect.hazardStealChanceMultiplierBonus)} steal chance`);
  if (effect.positiveHealMultiplierBonus) lines.push(`${formatPercent(effect.positiveHealMultiplierBonus)} healing`);
  if (effect.lootWeightBonus) lines.push(`+${effect.lootWeightBonus} loot odds`);
  if (effect.maxHealthBonus) lines.push(`+${effect.maxHealthBonus} max health`);
  if (effect.conditionTierBias) lines.push(`finds skew ${effect.conditionTierBias > 0 ? 'better' : 'worse'} condition`);
  if (effect.weirdnessTierBias) lines.push(`finds skew ${effect.weirdnessTierBias > 0 ? 'weirder' : 'more mundane'}`);
  return lines;
}

function formatPercent(value: number): string {
  const percent = Math.round(value * 100);
  return `${percent > 0 ? '+' : ''}${percent}%`;
}
