import { describe, expect, it } from 'vitest';
import { qualityScore } from '../src/game/logic/quality';

describe('qualityScore', () => {
  it('ranks a strictly better condition and weirdness higher', () => {
    expect(qualityScore('pristine', 'impossible')).toBeGreaterThan(qualityScore('wrecked', 'mundane'));
  });

  it('treats condition and weirdness as equally weighted', () => {
    expect(qualityScore('pristine', 'mundane')).toBe(qualityScore('wrecked', 'impossible'));
  });

  it('is monotonic in condition alone', () => {
    expect(qualityScore('worn', 'mundane')).toBeGreaterThan(qualityScore('wrecked', 'mundane'));
  });

  it('is monotonic in weirdness alone', () => {
    expect(qualityScore('wrecked', 'odd')).toBeGreaterThan(qualityScore('wrecked', 'mundane'));
  });
});
