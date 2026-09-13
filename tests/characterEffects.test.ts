import { describe, expect, it } from 'vitest';
import { computeRunModifiers } from '../src/game/logic/characterEffects';
import { createInitialCharacter } from '../src/game/logic/leveling';
import { getGear } from '../src/game/content/gear';

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

  it('applies equipped gear stat effects at full strength when sound', () => {
    const character = createInitialCharacter();
    const crowbar = getGear('rusty-crowbar'); // hazardDamageMultiplierBonus: -0.05
    const modifiers = computeRunModifiers(character, [crowbar], { 'rusty-crowbar': 'sound' });
    expect(modifiers.hazardDamageMultiplier).toBeCloseTo(0.95);
  });

  it('scales gear effects down when the gear is in worse condition', () => {
    const character = createInitialCharacter();
    const crowbar = getGear('rusty-crowbar');
    const wrecked = computeRunModifiers(character, [crowbar], { 'rusty-crowbar': 'wrecked' });
    const pristine = computeRunModifiers(character, [crowbar], { 'rusty-crowbar': 'pristine' });
    expect(wrecked.hazardDamageMultiplier).toBeCloseTo(1 - 0.05 * 0.5);
    expect(pristine.hazardDamageMultiplier).toBeCloseTo(1 - 0.05 * 1.25);
  });

  it('defaults unequipped gear condition to sound and stacks multiple pieces', () => {
    const character = createInitialCharacter();
    const jacket = getGear('patched-jacket'); // hazardStealChanceMultiplierBonus: -0.05
    const lamp = getGear('hand-lamp'); // lootWeightBonus: 3
    const modifiers = computeRunModifiers(character, [jacket, lamp], {});
    expect(modifiers.hazardStealChanceMultiplier).toBeCloseTo(0.95);
    expect(modifiers.lootWeightBonus).toBe(3);
  });

  it('ignores gear with no stat effect, like keys', () => {
    const character = createInitialCharacter();
    const key = getGear('warehouse-keycard');
    const modifiers = computeRunModifiers(character, [key], {});
    expect(modifiers).toEqual(computeRunModifiers(character));
  });
});
