import type { CharacterProgress } from '../types/character';
import { getTrait } from '../content/traits';
import { tagSkillLevel } from './leveling';

/** Effective, pre-computed effect of a character's attributes, tag skills, and traits on a run. */
export interface RunModifiers {
  lootWeightBonus: number;
  conditionTierBias: number;
  weirdnessTierBias: number;
  hazardDamageMultiplier: number;
  hazardStealChanceMultiplier: number;
  positiveHealMultiplier: number;
  maxHealthBonus: number;
}

export const BASE_RUN_MODIFIERS: RunModifiers = {
  lootWeightBonus: 0,
  conditionTierBias: 0,
  weirdnessTierBias: 0,
  hazardDamageMultiplier: 1,
  hazardStealChanceMultiplier: 1,
  positiveHealMultiplier: 1,
  maxHealthBonus: 0,
};

export function computeRunModifiers(character: CharacterProgress): RunModifiers {
  const modifiers = { ...BASE_RUN_MODIFIERS };
  const { grit, perception, luck, finesse } = character.attributes;

  modifiers.maxHealthBonus += grit * 5;
  modifiers.hazardStealChanceMultiplier *= 1 - perception * 0.04;
  modifiers.hazardDamageMultiplier *= 1 - finesse * 0.03;
  modifiers.lootWeightBonus += luck * 3;
  modifiers.conditionTierBias += Math.floor(luck / 4);
  modifiers.weirdnessTierBias += Math.floor(luck / 5);

  const weaponLevel = tagSkillLevel(character.tagSkillXp.weapon);
  const armorLevel = tagSkillLevel(character.tagSkillXp.armor);
  const toolLevel = tagSkillLevel(character.tagSkillXp.tool);
  modifiers.hazardDamageMultiplier *= 1 - weaponLevel * 0.03;
  modifiers.hazardStealChanceMultiplier *= 1 - armorLevel * 0.04;
  modifiers.positiveHealMultiplier *= 1 + toolLevel * 0.05;
  modifiers.lootWeightBonus += toolLevel;

  for (const traitId of character.traitIds) {
    const { effect } = getTrait(traitId);
    modifiers.lootWeightBonus += effect.lootWeightBonus ?? 0;
    modifiers.conditionTierBias += effect.conditionTierBias ?? 0;
    modifiers.weirdnessTierBias += effect.weirdnessTierBias ?? 0;
    modifiers.hazardDamageMultiplier *= 1 + (effect.hazardDamageMultiplierBonus ?? 0);
    modifiers.hazardStealChanceMultiplier *= 1 + (effect.hazardStealChanceMultiplierBonus ?? 0);
    modifiers.positiveHealMultiplier *= 1 + (effect.positiveHealMultiplierBonus ?? 0);
    modifiers.maxHealthBonus += effect.maxHealthBonus ?? 0;
  }

  modifiers.hazardDamageMultiplier = Math.max(0.3, modifiers.hazardDamageMultiplier);
  modifiers.hazardStealChanceMultiplier = Math.max(0, modifiers.hazardStealChanceMultiplier);

  return modifiers;
}
