import { describe, expect, it } from 'vitest';
import { unlockedDimensionIdsAfter, withDimensionUnlocks } from '../src/game/logic/dimensionUnlocks';
import { getCollector } from '../src/game/content/collectors';
import { getRequiredVersionIds } from '../src/game/logic/masterSet';
import { createInitialCharacter } from '../src/game/logic/leveling';
import type { PlayerMeta } from '../src/game/types/player';

function emptyMeta(overrides: Partial<PlayerMeta> = {}): PlayerMeta {
  return {
    version: 1,
    stash: [],
    collectors: {},
    unlockedDimensionIds: ['warehouse'],
    carryCapacity: 10,
    ownedGearIds: [],
    equippedGearIds: {},
    pastRuns: [],
    character: createInitialCharacter(),
    ...overrides,
  };
}

describe('unlockedDimensionIdsAfter', () => {
  it('never drops an already-unlocked dimension', () => {
    const meta = emptyMeta({ unlockedDimensionIds: ['warehouse', 'records-office'] });
    expect(unlockedDimensionIdsAfter(meta)).toEqual(expect.arrayContaining(['warehouse', 'records-office']));
  });

  it('leaves a level-gated dimension locked below the required level', () => {
    const meta = emptyMeta({ character: { ...createInitialCharacter(), level: 2 } });
    expect(unlockedDimensionIdsAfter(meta)).not.toContain('records-office');
  });

  it('unlocks a level-gated dimension once the level requirement is met', () => {
    const meta = emptyMeta({ character: { ...createInitialCharacter(), level: 3 } });
    expect(unlockedDimensionIdsAfter(meta)).toContain('records-office');
  });

  it('leaves a master-set-gated dimension locked until that collector is complete', () => {
    const meta = emptyMeta();
    expect(unlockedDimensionIdsAfter(meta)).not.toContain('deep-vein');
  });

  it('unlocks a master-set-gated dimension once that collector is complete', () => {
    const miner = getCollector('the-miner');
    const meta = emptyMeta({
      collectors: {
        [miner.id]: {
          collectorId: miner.id,
          donated: Object.fromEntries(
            getRequiredVersionIds(miner).map((id) => [id, { condition: 'sound' as const, weirdness: 'mundane' as const }]),
          ),
        },
      },
    });
    expect(unlockedDimensionIdsAfter(meta)).toContain('deep-vein');
  });
});

describe('withDimensionUnlocks', () => {
  it('folds newly unlocked dimensions back into the returned meta', () => {
    const meta = emptyMeta({ character: { ...createInitialCharacter(), level: 3 } });
    const next = withDimensionUnlocks(meta);
    expect(next.unlockedDimensionIds).toContain('records-office');
    expect(next).not.toBe(meta);
  });
});
