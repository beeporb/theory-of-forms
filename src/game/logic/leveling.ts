import type { CharacterProgress, TagSkillId } from '../types/character';
import type { PastRunRecord } from '../types/pastRun';
import { qualityScore } from './quality';

export const ATTRIBUTE_IDS = ['grit', 'perception', 'luck', 'finesse'] as const;
export const TAG_SKILL_IDS: TagSkillId[] = ['weapon', 'armor', 'tool'];

const TRAIT_POINT_LEVEL_INTERVAL = 2;
export const TAG_SKILL_XP_PER_LEVEL = 100;
export const MAX_TAG_SKILL_LEVEL = 10;

export function createInitialCharacter(): CharacterProgress {
  return {
    level: 1,
    xp: 0,
    attributePoints: 0,
    attributes: { grit: 0, perception: 0, luck: 0, finesse: 0 },
    traitPoints: 0,
    traitIds: [],
    tagSkillXp: { weapon: 0, armor: 0, tool: 0 },
  };
}

/** XP required to go from `level` to `level + 1`. */
export function xpForLevel(level: number): number {
  return 100 + (level - 1) * 60;
}

export function tagSkillLevel(xp: number): number {
  return Math.min(MAX_TAG_SKILL_LEVEL, Math.floor(xp / TAG_SKILL_XP_PER_LEVEL));
}

/** Only successful extractions grant character XP. */
export function xpGainForExtraction(record: PastRunRecord): number {
  const itemXp = record.items.reduce(
    (sum, item) => sum + 8 + qualityScore(item.condition, item.weirdness) * 3,
    0,
  );
  const explorationXp = record.moveCount * 2;
  return itemXp + explorationXp;
}

/** Gear carried into a run builds its slot's tag skill regardless of outcome, just less on a loss. */
export function tagSkillXpGainForRun(record: PastRunRecord): Partial<Record<TagSkillId, number>> {
  const multiplier = record.outcome === 'extracted' ? 1 : 0.5;
  const amount = Math.max(1, Math.round(record.moveCount * multiplier));

  const gains: Partial<Record<TagSkillId, number>> = {};
  for (const gear of record.loadout) {
    if (gear.slot === 'key') continue;
    gains[gear.slot] = (gains[gear.slot] ?? 0) + amount;
  }
  return gains;
}

export function applyCharacterXp(character: CharacterProgress, xpGain: number): CharacterProgress {
  if (xpGain <= 0) return character;

  let level = character.level;
  let xp = character.xp + xpGain;
  let attributePoints = character.attributePoints;
  let traitPoints = character.traitPoints;

  while (xp >= xpForLevel(level)) {
    xp -= xpForLevel(level);
    level += 1;
    attributePoints += 1;
    if (level % TRAIT_POINT_LEVEL_INTERVAL === 0) traitPoints += 1;
  }

  return { ...character, level, xp, attributePoints, traitPoints };
}

export function applyTagSkillXp(character: CharacterProgress, record: PastRunRecord): CharacterProgress {
  const gains = tagSkillXpGainForRun(record);
  if (Object.keys(gains).length === 0) return character;

  const tagSkillXp = { ...character.tagSkillXp };
  for (const slot of TAG_SKILL_IDS) {
    const gain = gains[slot];
    if (gain) tagSkillXp[slot] += gain;
  }
  return { ...character, tagSkillXp };
}
