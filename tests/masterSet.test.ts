import { describe, expect, it } from 'vitest';
import { getRequiredVersionIds, isMasterSetComplete, masterSetPercent } from '../src/game/logic/masterSet';
import { getCollector } from '../src/game/content/collectors';
import type { CollectorProgress } from '../src/game/types/collector';

const miner = getCollector('the-miner');

function progressWith(versionIds: string[]): CollectorProgress {
  return {
    collectorId: miner.id,
    donated: Object.fromEntries(versionIds.map((id) => [id, { condition: 'sound', weirdness: 'mundane' }])),
  };
}

describe('masterSet', () => {
  it('derives one required version per required form (1:1 for now)', () => {
    expect(getRequiredVersionIds(miner)).toHaveLength(miner.requiredFormIds.length);
  });

  it('is not complete with no progress', () => {
    const progress = progressWith([]);
    expect(isMasterSetComplete(miner, progress)).toBe(false);
    expect(masterSetPercent(miner, progress)).toBe(0);
  });

  it('reports partial percent', () => {
    const [first] = getRequiredVersionIds(miner);
    const progress = progressWith([first]);
    expect(masterSetPercent(miner, progress)).toBeCloseTo(1 / miner.requiredFormIds.length);
    expect(isMasterSetComplete(miner, progress)).toBe(false);
  });

  it('is complete once every required version is donated', () => {
    const progress = progressWith(getRequiredVersionIds(miner));
    expect(isMasterSetComplete(miner, progress)).toBe(true);
    expect(masterSetPercent(miner, progress)).toBe(1);
  });

  it('ignores donated entries outside the required set', () => {
    const progress = progressWith([...getRequiredVersionIds(miner), 'unrelated-version']);
    expect(masterSetPercent(miner, progress)).toBe(1);
  });
});
