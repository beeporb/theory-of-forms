import { describe, expect, it } from 'vitest';
import { applyBreakdown, breakdownMaterialId, breakdownYield } from '../src/game/logic/breakdown';
import { getVersionsForForm } from '../src/game/content/versions';
import type { ItemInstance } from '../src/game/types/item';

const [quartzVersion] = getVersionsForForm('quartz-shard'); // minerals -> scrap-metal
const [rubberStampVersion] = getVersionsForForm('rubber-stamp'); // office-relics -> salvaged-circuitry

function makeItem(versionId: string, condition: ItemInstance['condition']): ItemInstance {
  return { instanceId: 'i1', versionId, condition, weirdness: 'mundane' };
}

describe('breakdownMaterialId', () => {
  it('maps every known set to a material', () => {
    expect(breakdownMaterialId('minerals')).toBe('scrap-metal');
    expect(breakdownMaterialId('mining-equipment')).toBe('machine-parts');
    expect(breakdownMaterialId('office-relics')).toBe('salvaged-circuitry');
    expect(breakdownMaterialId('personal-effects')).toBe('worn-leather');
  });

  it('returns undefined for an unknown set', () => {
    expect(breakdownMaterialId('not-a-set')).toBeUndefined();
  });
});

describe('breakdownYield', () => {
  it('yields more material for better condition', () => {
    expect(breakdownYield('wrecked')).toBe(1);
    expect(breakdownYield('worn')).toBe(1);
    expect(breakdownYield('sound')).toBe(2);
    expect(breakdownYield('pristine')).toBe(3);
  });
});

describe('applyBreakdown', () => {
  it('adds to an existing material count', () => {
    const item = makeItem(quartzVersion.id, 'sound');
    const result = applyBreakdown(item, { 'scrap-metal': 1 });
    expect(result['scrap-metal']).toBe(3);
  });

  it('starts a new material at its yielded amount', () => {
    const item = makeItem(rubberStampVersion.id, 'wrecked');
    const result = applyBreakdown(item, {});
    expect(result['salvaged-circuitry']).toBe(1);
  });

  it('does not mutate the input materials object', () => {
    const materials = { 'scrap-metal': 1 };
    applyBreakdown(makeItem(quartzVersion.id, 'pristine'), materials);
    expect(materials['scrap-metal']).toBe(1);
  });
});
