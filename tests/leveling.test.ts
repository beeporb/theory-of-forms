import { describe, expect, it } from 'vitest';
import {
  applyCharacterXp,
  applyTagSkillXp,
  createInitialCharacter,
  tagSkillLevel,
  xpForLevel,
  xpGainForExtraction,
} from '../src/game/logic/leveling';
import type { PastRunRecord } from '../src/game/types/pastRun';

function makeRecord(overrides: Partial<PastRunRecord> = {}): PastRunRecord {
  return {
    id: '1',
    dimensionId: 'warehouse',
    outcome: 'extracted',
    endedAt: Date.now(),
    moveCount: 10,
    loadout: [],
    items: [],
    log: [],
    ...overrides,
  };
}

describe('createInitialCharacter', () => {
  it('starts at level 1 with no points spent', () => {
    const character = createInitialCharacter();
    expect(character.level).toBe(1);
    expect(character.xp).toBe(0);
    expect(character.attributePoints).toBe(0);
    expect(character.traitPoints).toBe(0);
    expect(character.traitIds).toEqual([]);
  });
});

describe('applyCharacterXp', () => {
  it('accumulates xp without leveling up when below the threshold', () => {
    const character = applyCharacterXp(createInitialCharacter(), 50);
    expect(character.level).toBe(1);
    expect(character.xp).toBe(50);
    expect(character.attributePoints).toBe(0);
  });

  it('levels up and carries remaining xp over', () => {
    const threshold = xpForLevel(1);
    const character = applyCharacterXp(createInitialCharacter(), threshold + 20);
    expect(character.level).toBe(2);
    expect(character.xp).toBe(20);
    expect(character.attributePoints).toBe(1);
  });

  it('grants a trait point only on trait-interval levels', () => {
    const oneLevel = applyCharacterXp(createInitialCharacter(), xpForLevel(1));
    expect(oneLevel.level).toBe(2);
    expect(oneLevel.traitPoints).toBe(1);

    const twoLevels = applyCharacterXp(oneLevel, xpForLevel(2));
    expect(twoLevels.level).toBe(3);
    expect(twoLevels.traitPoints).toBe(1);
  });

  it('can cascade through multiple levels from a single large gain', () => {
    const gain = xpForLevel(1) + xpForLevel(2) + xpForLevel(3) + 5;
    const character = applyCharacterXp(createInitialCharacter(), gain);
    expect(character.level).toBe(4);
    expect(character.xp).toBe(5);
    expect(character.attributePoints).toBe(3);
  });
});

describe('xpGainForExtraction', () => {
  it('grants more xp for more moves and better finds', () => {
    const empty = xpGainForExtraction(makeRecord({ moveCount: 0, items: [] }));
    const explored = xpGainForExtraction(makeRecord({ moveCount: 20, items: [] }));
    expect(explored).toBeGreaterThan(empty);

    const withLoot = xpGainForExtraction(
      makeRecord({
        moveCount: 0,
        items: [{ instanceId: '1', versionId: 'iron-ore-standard', condition: 'pristine', weirdness: 'impossible' }],
      }),
    );
    expect(withLoot).toBeGreaterThan(empty);
  });
});

describe('tagSkillLevel', () => {
  it('derives a skill level from accumulated xp', () => {
    expect(tagSkillLevel(0)).toBe(0);
    expect(tagSkillLevel(99)).toBe(0);
    expect(tagSkillLevel(100)).toBe(1);
    expect(tagSkillLevel(250)).toBe(2);
  });

  it('caps at the max level regardless of xp', () => {
    expect(tagSkillLevel(100_000)).toBe(10);
  });
});

describe('applyTagSkillXp', () => {
  it('grants xp to every slot carried into the run', () => {
    const record = makeRecord({
      moveCount: 10,
      loadout: [
        {
          id: 'rusty-crowbar',
          name: 'Rusty Crowbar',
          slot: 'weapon',
          icon: 'sword',
          rarity: 'mundane',
          flavorText: 'Dented, dull, and somehow still swinging. Better than fists.',
        },
        {
          id: 'patched-jacket',
          name: 'Patched Jacket',
          slot: 'armor',
          icon: 'shield',
          rarity: 'mundane',
          flavorText: 'Held together by tape and stubbornness. Keeps most of the cold out.',
        },
      ],
    });
    const character = applyTagSkillXp(createInitialCharacter(), record);
    expect(character.tagSkillXp.weapon).toBeGreaterThan(0);
    expect(character.tagSkillXp.armor).toBeGreaterThan(0);
    expect(character.tagSkillXp.tool).toBe(0);
  });

  it('grants less xp on a run that was not extracted', () => {
    const gear = [
      {
        id: 'rusty-crowbar',
        name: 'Rusty Crowbar',
        slot: 'weapon' as const,
        icon: 'sword' as const,
        rarity: 'mundane' as const,
        flavorText: 'Dented, dull, and somehow still swinging. Better than fists.',
      },
    ];
    const extracted = applyTagSkillXp(
      createInitialCharacter(),
      makeRecord({ outcome: 'extracted', moveCount: 20, loadout: gear }),
    );
    const died = applyTagSkillXp(
      createInitialCharacter(),
      makeRecord({ outcome: 'died', moveCount: 20, loadout: gear }),
    );
    expect(died.tagSkillXp.weapon).toBeLessThan(extracted.tagSkillXp.weapon);
  });
});
