import { describe, expect, it } from 'vitest';
import { getThreatModifiers, rollThreatLevel, scaleRange } from '../src/game/logic/threat';
import { THREAT_LEVEL_ORDER } from '../src/game/types/threat';

describe('rollThreatLevel', () => {
  it('always returns one of the defined threat levels', () => {
    for (let i = 0; i < 100; i++) {
      expect(THREAT_LEVEL_ORDER).toContain(rollThreatLevel());
    }
  });
});

describe('getThreatModifiers', () => {
  it('is fully neutral at the low tier, matching a dimension’s own authored ranges', () => {
    const modifiers = getThreatModifiers('low');
    expect(modifiers.actorCountMultiplier).toBe(1);
    expect(modifiers.minMovesMultiplier).toBe(1);
    expect(modifiers.hazardWeightBonus).toBe(0);
    expect(modifiers.positiveWeightMultiplier).toBe(1);
    expect(modifiers.conditionTierBias).toBe(0);
    expect(modifiers.weirdnessTierBias).toBe(0);
    expect(modifiers.extractionPointCountOverride).toBeUndefined();
  });

  it('escalates actor density and hazard weight, and eases off healing, as threat rises', () => {
    const tiers = ['safe', 'low', 'medium', 'high', 'danger'] as const;
    for (let i = 1; i < tiers.length; i++) {
      const prev = getThreatModifiers(tiers[i - 1]);
      const next = getThreatModifiers(tiers[i]);
      expect(next.actorCountMultiplier).toBeGreaterThan(prev.actorCountMultiplier);
      expect(next.hazardWeightBonus).toBeGreaterThan(prev.hazardWeightBonus);
      expect(next.positiveWeightMultiplier).toBeLessThan(prev.positiveWeightMultiplier);
    }
  });

  it('forces a single extraction point only at the danger tier', () => {
    for (const tier of ['safe', 'low', 'medium', 'high'] as const) {
      expect(getThreatModifiers(tier).extractionPointCountOverride).toBeUndefined();
    }
    expect(getThreatModifiers('danger').extractionPointCountOverride).toEqual([1, 1]);
  });

  it('cuts healing entirely at the danger tier', () => {
    expect(getThreatModifiers('danger').positiveWeightMultiplier).toBe(0);
  });
});

describe('scaleRange', () => {
  it('scales both ends of the range and rounds', () => {
    expect(scaleRange([2, 4], 1.5)).toEqual([3, 6]);
  });

  it('never lets the scaled max fall below the scaled min', () => {
    expect(scaleRange([1, 1], 0.2)).toEqual([0, 0]);
  });

  it('floors at zero rather than going negative', () => {
    expect(scaleRange([0, 2], 0.1)).toEqual([0, 0]);
  });

  it('is a no-op at multiplier 1', () => {
    expect(scaleRange([3, 5], 1)).toEqual([3, 5]);
  });
});
