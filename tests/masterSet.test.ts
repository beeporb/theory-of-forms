import { describe, expect, it } from 'vitest';
import { isMasterSetComplete, masterSetPercent } from '../src/game/logic/masterSet';
import type { CollectorDefinition, CollectorProgress } from '../src/game/types/collector';

const def: CollectorDefinition = {
  id: 'the-miner',
  name: 'The Miner',
  flavorText: '',
  requiredFormIds: ['a', 'b', 'c'],
};

describe('masterSet', () => {
  it('is not complete with no progress', () => {
    const progress: CollectorProgress = { collectorId: def.id, turnedInFormIds: [] };
    expect(isMasterSetComplete(def, progress)).toBe(false);
    expect(masterSetPercent(def, progress)).toBe(0);
  });

  it('reports partial percent', () => {
    const progress: CollectorProgress = { collectorId: def.id, turnedInFormIds: ['a'] };
    expect(masterSetPercent(def, progress)).toBeCloseTo(1 / 3);
    expect(isMasterSetComplete(def, progress)).toBe(false);
  });

  it('is complete once every required form is turned in', () => {
    const progress: CollectorProgress = { collectorId: def.id, turnedInFormIds: ['a', 'b', 'c'] };
    expect(isMasterSetComplete(def, progress)).toBe(true);
    expect(masterSetPercent(def, progress)).toBe(1);
  });

  it('ignores extra turned-in forms outside the required set', () => {
    const progress: CollectorProgress = {
      collectorId: def.id,
      turnedInFormIds: ['a', 'b', 'c', 'unrelated-form'],
    };
    expect(masterSetPercent(def, progress)).toBe(1);
  });
});
