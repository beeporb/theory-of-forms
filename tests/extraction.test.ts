import { describe, expect, it } from 'vitest';
import { canExtract } from '../src/game/logic/extraction';
import { getDimensionDefinition } from '../src/game/content/dimensions';
import type { RunState } from '../src/game/types/player';

function makeRun(overrides: Partial<RunState> = {}): RunState {
  return {
    dimension: { definitionId: 'warehouse', cells: [] },
    health: 100,
    maxHealth: 100,
    loadout: [],
    inventory: [],
    status: 'active',
    log: [],
    position: { x: 0, y: 0 },
    moveCount: 0,
    ...overrides,
  };
}

describe('canExtract', () => {
  const definition = getDimensionDefinition('warehouse');

  it('is false away from an extraction point even with enough moves', () => {
    const run = makeRun({ position: { x: 1, y: 1 }, moveCount: 10 });
    expect(canExtract(run)).toBe(false);
  });

  it('is false on an extraction point without enough moves', () => {
    const point = definition.extractionPoints[0];
    const run = makeRun({ position: point, moveCount: definition.minMovesToExtract - 1 });
    expect(canExtract(run)).toBe(false);
  });

  it('is true on an extraction point with enough moves', () => {
    const point = definition.extractionPoints[0];
    const run = makeRun({ position: point, moveCount: definition.minMovesToExtract });
    expect(canExtract(run)).toBe(true);
  });
});
