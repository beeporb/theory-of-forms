import { describe, expect, it } from 'vitest';
import { computeRunModifiers } from '../src/game/logic/characterEffects';
import { createInitialCharacter } from '../src/game/logic/leveling';

describe('computeRunModifiers', () => {
  it('is a no-op for a fresh character', () => {
    const modifiers = computeRunModifiers(createInitialCharacter());
    expect(modifiers.lootWeightBonus).toBe(0);
    expect(modifiers.conditionTierBias).toBe(0);
    expect(modifiers.weirdnessTierBias).toBe(0);
    expect(modifiers.hazardDamageMultiplier).toBe(1);
    expect(modifiers.hazardStealChanceMultiplier).toBe(1);
    expect(modifiers.positiveHealMultiplier).toBe(1);
    expect(modifiers.maxHealthBonus).toBe(0);
  });

  it('raises max health with grit', () => {
    const character = createInitialCharacter();
    character.attributes.grit = 4;
    expect(computeRunModifiers(character).maxHealthBonus).toBe(20);
  });

  it('skews loot and its quality with luck', () => {
    const character = createInitialCharacter();
    character.attributes.luck = 8;
    const modifiers = computeRunModifiers(character);
    expect(modifiers.lootWeightBonus).toBe(24);
    expect(modifiers.conditionTierBias).toBe(2);
    expect(modifiers.weirdnessTierBias).toBe(1);
  });

  it('reduces hazard damage with finesse and weapon skill together', () => {
    const character = createInitialCharacter();
    character.attributes.finesse = 5;
    character.tagSkillXp.weapon = 300; // skill level 3
    const modifiers = computeRunModifiers(character);
    expect(modifiers.hazardDamageMultiplier).toBeCloseTo((1 - 5 * 0.03) * (1 - 3 * 0.03));
  });

  it('applies taken traits on top of attributes and skills', () => {
    const character = createInitialCharacter();
    character.traitIds = ['quick-reflexes', 'road-worn'];
    const modifiers = computeRunModifiers(character);
    expect(modifiers.hazardDamageMultiplier).toBeCloseTo(0.8);
    expect(modifiers.maxHealthBonus).toBe(15);
  });

  it('never lets hazard multipliers go negative', () => {
    const character = createInitialCharacter();
    character.attributes.perception = 100;
    character.tagSkillXp.armor = 100_000;
    expect(computeRunModifiers(character).hazardStealChanceMultiplier).toBe(0);
  });
});
