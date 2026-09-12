import { describe, expect, it } from 'vitest';
import { canExtract } from '../src/game/logic/extraction';
import type { RunState } from '../src/game/types/player';

function makeRun(overrides: Partial<RunState> = {}): RunState {
  return {
    dimension: {
      definitionId: 'warehouse',
      cells: [],
      entry: { x: 0, y: 0 },
      extractionPoints: [{ x: 3, y: 3 }],
      minMovesToExtract: 4,
      actors: [],
    },
    health: 100,
    maxHealth: 100,
    loadout: [],
    inventory: [],
    carryCapacity: 10,
    status: 'active',
    log: [],
    position: { x: 0, y: 0 },
    moveCount: 0,
    ...overrides,
  };
}

describe('canExtract', () => {
  it('is false away from an extraction point even with enough moves', () => {
    const run = makeRun({ position: { x: 1, y: 1 }, moveCount: 10 });
    expect(canExtract(run)).toBe(false);
  });

  it('is false on an extraction point without enough moves', () => {
    const run = makeRun({ position: { x: 3, y: 3 }, moveCount: 3 });
    expect(canExtract(run)).toBe(false);
  });

  it('is true on an extraction point with enough moves', () => {
    const run = makeRun({ position: { x: 3, y: 3 }, moveCount: 4 });
    expect(canExtract(run)).toBe(true);
  });
});
