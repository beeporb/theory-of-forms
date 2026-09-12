import { describe, expect, it } from 'vitest';
import { isCollectorRevealed } from '../src/game/logic/discovery';
import { getCollector } from '../src/game/content/collectors';
import { getRequiredVersionIds } from '../src/game/logic/masterSet';
import { createInitialCharacter } from '../src/game/logic/leveling';
import type { PlayerMeta } from '../src/game/types/player';

function emptyMeta(): PlayerMeta {
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
  };
}

describe('isCollectorRevealed', () => {
  it('is always revealed for a non-secret collector', () => {
    const miner = getCollector('the-miner');
    expect(isCollectorRevealed(miner, emptyMeta())).toBe(true);
  });

  it('hides a secret collector until its reveal condition is met', () => {
    const archivist = getCollector('the-archivist');
    expect(isCollectorRevealed(archivist, emptyMeta())).toBe(false);
  });

  it('reveals a secret collector once another collector completes their master set', () => {
    const miner = getCollector('the-miner');
    const archivist = getCollector('the-archivist');
    const meta = emptyMeta();
    meta.collectors[miner.id] = {
      collectorId: miner.id,
      donated: Object.fromEntries(
        getRequiredVersionIds(miner).map((id) => [id, { condition: 'sound' as const, weirdness: 'mundane' as const }]),
      ),
    };
    expect(isCollectorRevealed(archivist, meta)).toBe(true);
  });
});
