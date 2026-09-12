import type { GearSlot } from './gear';
import type { IconName } from './icon';

/** Latent stats that shape a run without the player directly controlling them. */
export type AttributeId = 'grit' | 'perception' | 'luck' | 'finesse';

export interface AttributeDefinition {
  id: AttributeId;
  name: string;
  description: string;
  icon: IconName;
}

/** Proficiency with a category of equipment, built up by carrying it into runs. */
export type TagSkillId = GearSlot;

export interface TagSkillDefinition {
  id: TagSkillId;
  name: string;
  description: string;
  icon: IconName;
}

export interface TraitEffect {
  lootWeightBonus?: number;
  conditionTierBias?: number;
  weirdnessTierBias?: number;
  hazardDamageMultiplierBonus?: number;
  hazardStealChanceMultiplierBonus?: number;
  positiveHealMultiplierBonus?: number;
  maxHealthBonus?: number;
}

export interface TraitDefinition {
  id: string;
  name: string;
  description: string;
  icon: IconName;
  requiredLevel: number;
  effect: TraitEffect;
}

/** Persisted forever, alongside the rest of PlayerMeta. */
export interface CharacterProgress {
  level: number;
  xp: number;
  attributePoints: number;
  attributes: Record<AttributeId, number>;
  traitPoints: number;
  traitIds: string[];
  tagSkillXp: Record<TagSkillId, number>;
}
