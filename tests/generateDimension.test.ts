import { describe, expect, it } from 'vitest';
import { generateDimension } from '../src/game/logic/generateDimension';
import { getVersion } from '../src/game/content/versions';
import { isAdjacent } from '../src/game/logic/adjacency';
import type { PocketDimensionDefinition } from '../src/game/types/grid';

const definition: PocketDimensionDefinition = {
  id: 'test-dimension',
  name: 'Test Dimension',
  itemPoolFormIds: ['iron-ore', 'quartz-shard'],
  minRows: 4,
  maxRows: 6,
  minCols: 4,
  maxCols: 6,
  fillRatioRange: [0.6, 0.8],
  extractionPointCountRange: [2, 3],
  minMovesToExtractRange: [3, 5],
};

describe('generateDimension', () => {
  it('marks every non-existent cell without a pre-rolled outcome, and every existing cell unopened with one', () => {
    const instance = generateDimension(definition);

    for (const row of instance.cells) {
      for (const cell of row) {
        if (cell.exists) {
          expect(cell.outcome).not.toBeNull();
          expect(cell.status).toBe('unopened');
        } else {
          expect(cell.outcome).toBeNull();
        }
      }
    }
  });

  it('only rolls loot versions belonging to a form in the dimension item pool', () => {
    // Run many times since outcomes are random; loot versions must always resolve
    // back to a form that's actually in the pool.
    for (let i = 0; i < 200; i++) {
      const instance = generateDimension(definition);
      for (const row of instance.cells) {
        for (const cell of row) {
          if (cell.outcome?.kind === 'loot') {
            const version = getVersion(cell.outcome.versionId);
            expect(definition.itemPoolFormIds).toContain(version.formId);
          }
        }
      }
    }
  });

  it('produces a random, varied layout across runs', () => {
    const sizes = new Set<string>();
    for (let i = 0; i < 50; i++) {
      const instance = generateDimension(definition);
      sizes.add(`${instance.cells.length}x${instance.cells[0].length}`);
    }
    expect(sizes.size).toBeGreaterThan(1);
  });

  it('always places the entry on an existing, in-bounds cell', () => {
    for (let i = 0; i < 50; i++) {
      const instance = generateDimension(definition);
      const { entry } = instance;
      expect(instance.cells[entry.y]?.[entry.x]?.exists).toBe(true);
    }
  });

  it('places extraction points on existing cells, distinct from the entry', () => {
    for (let i = 0; i < 50; i++) {
      const instance = generateDimension(definition);
      expect(instance.extractionPoints.length).toBeGreaterThan(0);
      for (const point of instance.extractionPoints) {
        expect(instance.cells[point.y]?.[point.x]?.exists).toBe(true);
        expect(point).not.toEqual(instance.entry);
      }
    }
  });

  it('every existing cell is reachable from the entry via 4-directional adjacency', () => {
    for (let i = 0; i < 20; i++) {
      const instance = generateDimension(definition);
      const rows = instance.cells.length;
      const cols = instance.cells[0].length;
      const visited = new Set<string>([`${instance.entry.x},${instance.entry.y}`]);
      const queue = [instance.entry];

      for (let head = 0; head < queue.length; head++) {
        const current = queue[head];
        for (const neighbor of [
          { x: current.x + 1, y: current.y },
          { x: current.x - 1, y: current.y },
          { x: current.x, y: current.y + 1 },
          { x: current.x, y: current.y - 1 },
        ]) {
          if (
            neighbor.x >= 0 &&
            neighbor.x < cols &&
            neighbor.y >= 0 &&
            neighbor.y < rows &&
            instance.cells[neighbor.y][neighbor.x].exists &&
            isAdjacent(current, neighbor) &&
            !visited.has(`${neighbor.x},${neighbor.y}`)
          ) {
            visited.add(`${neighbor.x},${neighbor.y}`);
            queue.push(neighbor);
          }
        }
      }

      const existingCount = instance.cells.flat().filter((c) => c.exists).length;
      expect(visited.size).toBe(existingCount);
    }
  });

  it('rolls minMovesToExtract within the configured range', () => {
    for (let i = 0; i < 50; i++) {
      const instance = generateDimension(definition);
      expect(instance.minMovesToExtract).toBeGreaterThanOrEqual(definition.minMovesToExtractRange[0]);
      expect(instance.minMovesToExtract).toBeLessThanOrEqual(definition.minMovesToExtractRange[1]);
    }
  });
});
