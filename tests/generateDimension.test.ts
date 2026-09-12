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
  actorPool: ['feral-scavenger', 'wandering-peddler', 'roaming-miner'],
  actorCountRange: [1, 3],
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

  it('spawns actors within the configured count range, on existing cells other than the entry', () => {
    for (let i = 0; i < 50; i++) {
      const instance = generateDimension(definition);
      expect(instance.actors.length).toBeGreaterThanOrEqual(definition.actorCountRange[0]);
      expect(instance.actors.length).toBeLessThanOrEqual(definition.actorCountRange[1]);

      for (const actor of instance.actors) {
        expect(instance.cells[actor.position.y]?.[actor.position.x]?.exists).toBe(true);
        expect(actor.position).not.toEqual(instance.entry);
        expect(definition.actorPool).toContain(actor.definitionId);
      }
    }
  });

  it('never spawns two actors on the same cell', () => {
    for (let i = 0; i < 50; i++) {
      const instance = generateDimension(definition);
      const positions = new Set(instance.actors.map((a) => `${a.position.x},${a.position.y}`));
      expect(positions.size).toBe(instance.actors.length);
    }
  });

  it('spawns no actors when the dimension has no actor pool', () => {
    const instance = generateDimension({ ...definition, actorPool: [], actorCountRange: [1, 3] });
    expect(instance.actors).toHaveLength(0);
  });

  it('makes hazards more frequent and more damaging farther from the entry', () => {
    // The entry is always depth 0; extraction points are drawn from the
    // farther half of the layout (see generateLayout), so comparing outcomes
    // rolled at each across many samples gives a reliable near-vs-far signal.
    let nearHazards = 0;
    let nearTotal = 0;
    let nearDamageSum = 0;
    let farHazards = 0;
    let farTotal = 0;
    let farDamageSum = 0;

    for (let i = 0; i < 300; i++) {
      const instance = generateDimension(definition);

      const nearOutcome = instance.cells[instance.entry.y][instance.entry.x].outcome;
      nearTotal++;
      if (nearOutcome?.kind === 'hazard') {
        nearHazards++;
        nearDamageSum += nearOutcome.damage;
      }

      for (const point of instance.extractionPoints) {
        const farOutcome = instance.cells[point.y][point.x].outcome;
        farTotal++;
        if (farOutcome?.kind === 'hazard') {
          farHazards++;
          farDamageSum += farOutcome.damage;
        }
      }
    }

    expect(farHazards / farTotal).toBeGreaterThan(nearHazards / nearTotal);
    expect(farDamageSum / farHazards).toBeGreaterThan(nearDamageSum / nearHazards);
  });
});
