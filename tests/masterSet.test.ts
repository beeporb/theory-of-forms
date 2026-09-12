import { describe, expect, it } from 'vitest';
import {
  getRequiredVersionIds,
  isMasterSetComplete,
  isPristineSetComplete,
  masterSetPercent,
  pristineSetPercent,
} from '../src/game/logic/masterSet';
import { getCollector } from '../src/game/content/collectors';
import type { Condition } from '../src/game/types/condition';
import type { CollectorProgress } from '../src/game/types/collector';

const miner = getCollector('the-miner');

function progressWith(versionIds: string[], condition: Condition = 'sound'): CollectorProgress {
  return {
    collectorId: miner.id,
    donated: Object.fromEntries(versionIds.map((id) => [id, { condition, weirdness: 'mundane' }])),
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

describe('pristine set', () => {
  it('is not complete when every version is donated at a non-pristine condition', () => {
    const progress = progressWith(getRequiredVersionIds(miner), 'sound');
    expect(isMasterSetComplete(miner, progress)).toBe(true);
    expect(isPristineSetComplete(miner, progress)).toBe(false);
    expect(pristineSetPercent(miner, progress)).toBe(0);
  });

  it('counts only pristine donations toward pristine percent', () => {
    const required = getRequiredVersionIds(miner);
    const progress = progressWith(required, 'sound');
    progress.donated[required[0]] = { condition: 'pristine', weirdness: 'mundane' };
    expect(pristineSetPercent(miner, progress)).toBeCloseTo(1 / required.length);
    expect(isPristineSetComplete(miner, progress)).toBe(false);
  });

  it('is complete once every required version is donated at pristine condition', () => {
    const progress = progressWith(getRequiredVersionIds(miner), 'pristine');
    expect(isPristineSetComplete(miner, progress)).toBe(true);
    expect(pristineSetPercent(miner, progress)).toBe(1);
  });
});
