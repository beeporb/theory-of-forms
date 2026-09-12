import { describe, expect, it } from 'vitest';
import { canDonate, applyDonation } from '../src/game/logic/donation';
import { getCollector } from '../src/game/content/collectors';
import { getRequiredVersionIds } from '../src/game/logic/masterSet';
import type { CollectorProgress } from '../src/game/types/collector';
import type { ItemInstance } from '../src/game/types/item';

const miner = getCollector('the-miner');
const [requiredVersionId] = getRequiredVersionIds(miner);

function makeItem(overrides: Partial<ItemInstance> = {}): ItemInstance {
  return {
    instanceId: 'i1',
    versionId: requiredVersionId,
    condition: 'sound',
    weirdness: 'mundane',
    ...overrides,
  };
}

function emptyProgress(): CollectorProgress {
  return { collectorId: miner.id, donated: {} };
}

describe('canDonate', () => {
  it('rejects an item the collector does not want', () => {
    const item = makeItem({ versionId: 'not-a-required-version' });
    expect(canDonate(item, miner, emptyProgress())).toBe(false);
  });

  it('accepts a wanted item the collector has nothing of yet', () => {
    expect(canDonate(makeItem(), miner, emptyProgress())).toBe(true);
  });

  it('rejects a donation no better than what is already held', () => {
    const progress = applyDonation(emptyProgress(), makeItem({ condition: 'pristine', weirdness: 'impossible' }));
    expect(canDonate(makeItem({ condition: 'wrecked', weirdness: 'mundane' }), miner, progress)).toBe(false);
  });

  it('accepts a donation of strictly better quality than what is held', () => {
    const progress = applyDonation(emptyProgress(), makeItem({ condition: 'wrecked', weirdness: 'mundane' }));
    expect(canDonate(makeItem({ condition: 'pristine', weirdness: 'impossible' }), miner, progress)).toBe(true);
  });
});

describe('applyDonation', () => {
  it('records the donated item under its version id', () => {
    const item = makeItem({ condition: 'worn', weirdness: 'odd' });
    const progress = applyDonation(emptyProgress(), item);
    expect(progress.donated[requiredVersionId]).toEqual({ condition: 'worn', weirdness: 'odd' });
  });
});
