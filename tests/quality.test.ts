import { describe, expect, it } from 'vitest';
import { qualityScore } from '../src/game/logic/quality';

describe('qualityScore', () => {
  it('ranks a strictly better condition and weirdness higher', () => {
    expect(qualityScore('pristine', 'forbidden')).toBeGreaterThan(qualityScore('wrecked', 'mundane'));
  });

  it('treats a maxed-out condition and a maxed-out weirdness as equally weighted', () => {
    // Each axis is normalised to its own 0-1 range, so being at the top of
    // one axis counts the same as being at the top of the other, regardless
    // of how many tiers either axis has.
    expect(qualityScore('pristine', 'mundane')).toBe(qualityScore('wrecked', 'forbidden'));
  });

  it('is monotonic in condition alone', () => {
    expect(qualityScore('worn', 'mundane')).toBeGreaterThan(qualityScore('wrecked', 'mundane'));
  });

  it('is monotonic in weirdness alone', () => {
    expect(qualityScore('wrecked', 'odd')).toBeGreaterThan(qualityScore('wrecked', 'mundane'));
  });
});
