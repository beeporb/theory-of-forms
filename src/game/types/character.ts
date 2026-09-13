import type { IconName } from './icon';
import type { StatEffect } from './effect';

/** Latent stats that shape a run without the player directly controlling them. */
export type AttributeId = 'grit' | 'perception' | 'luck' | 'finesse';

export interface AttributeDefinition {
  id: AttributeId;
  name: string;
  description: string;
  icon: IconName;
}

// Deliberately not GearSlot: keys/keycards are situational access items, not
// something a player builds combat/survival proficiency with by carrying.
/** Proficiency with a category of equipment, built up by carrying it into runs. */
export type TagSkillId = 'weapon' | 'armor' | 'tool';

export interface TagSkillDefinition {
  id: TagSkillId;
  name: string;
  description: string;
  icon: IconName;
}

export type TraitEffect = StatEffect;

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
