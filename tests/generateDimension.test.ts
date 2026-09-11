import { describe, expect, it } from 'vitest';
import { generateDimension } from '../src/game/logic/generateDimension';
import type { PocketDimensionDefinition } from '../src/game/types/grid';

const definition: PocketDimensionDefinition = {
  id: 'test-dimension',
  name: 'Test Dimension',
  shape: [
    [true, false],
    [true, true],
  ],
  itemPoolFormIds: ['iron-ore', 'quartz-shard'],
};

describe('generateDimension', () => {
  it('mirrors the shape mask onto cell existence', () => {
    const instance = generateDimension(definition);

    expect(instance.cells[0][0].exists).toBe(true);
    expect(instance.cells[0][1].exists).toBe(false);
    expect(instance.cells[1][0].exists).toBe(true);
    expect(instance.cells[1][1].exists).toBe(true);
  });

  it('leaves non-existent cells without a pre-rolled outcome', () => {
    const instance = generateDimension(definition);
    expect(instance.cells[0][1].outcome).toBeNull();
  });

  it('pre-rolls an outcome for every existing cell, all unopened', () => {
    const instance = generateDimension(definition);

    for (const row of instance.cells) {
      for (const cell of row) {
        if (cell.exists) {
          expect(cell.outcome).not.toBeNull();
          expect(cell.status).toBe('unopened');
        }
      }
    }
  });

  it('only rolls loot forms from the dimension item pool', () => {
    // Run many times since outcomes are random; loot forms must always come from the pool.
    for (let i = 0; i < 200; i++) {
      const instance = generateDimension(definition);
      for (const row of instance.cells) {
        for (const cell of row) {
          if (cell.outcome?.kind === 'loot') {
            expect(definition.itemPoolFormIds).toContain(cell.outcome.formId);
          }
        }
      }
    }
  });
});
