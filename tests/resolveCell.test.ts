import { describe, expect, it } from 'vitest';
import { resolveCell } from '../src/game/logic/resolveCell';
import type { RunState } from '../src/game/types/player';
import type { Outcome } from '../src/game/types/outcome';
import type { Cell } from '../src/game/types/grid';

function makeRun(outcome: Outcome, overrides: Partial<RunState> = {}): RunState {
  const cell: Cell = { x: 0, y: 0, exists: true, status: 'unopened', outcome };
  return {
    dimension: {
      definitionId: 'test',
      cells: [[cell]],
      entry: { x: 0, y: 0 },
      extractionPoints: [],
      minMovesToExtract: 0,
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

describe('resolveCell', () => {
  it('adds a loot item to inventory and marks the cell opened', () => {
    const run = makeRun({ kind: 'loot', versionId: 'iron-ore-standard', condition: 'worn', weirdness: 'mundane' });
    const { run: next, outcome } = resolveCell(run, 0, 0);

    expect(outcome.kind).toBe('loot');
    expect(next.inventory).toHaveLength(1);
    expect(next.inventory[0].versionId).toBe('iron-ore-standard');
    expect(next.inventory[0].condition).toBe('worn');
    expect(next.inventory[0].weirdness).toBe('mundane');
    expect(next.dimension.cells[0][0].status).toBe('opened');
  });

  it('applies hazard damage and can steal an item', () => {
    const run = makeRun(
      { kind: 'hazard', damage: 20, stealsItem: true, message: 'ouch' },
      { inventory: [{ instanceId: '1', versionId: 'iron-ore-standard', condition: 'worn', weirdness: 'mundane' }] },
    );
    const { run: next } = resolveCell(run, 0, 0);

    expect(next.health).toBe(80);
    expect(next.inventory).toHaveLength(0);
  });

  it('does not steal when inventory is empty', () => {
    const run = makeRun({ kind: 'hazard', damage: 20, stealsItem: true, message: 'ouch' });
    const { run: next } = resolveCell(run, 0, 0);

    expect(next.health).toBe(80);
    expect(next.inventory).toHaveLength(0);
  });

  it('heals but does not exceed maxHealth', () => {
    const run = makeRun({ kind: 'positive', heal: 30, message: 'nice' }, { health: 90 });
    const { run: next } = resolveCell(run, 0, 0);

    expect(next.health).toBe(100);
  });

  it('sets status to died when health hits zero', () => {
    const run = makeRun(
      { kind: 'hazard', damage: 50, stealsItem: false, message: 'ouch' },
      { health: 30 },
    );
    const { run: next } = resolveCell(run, 0, 0);

    expect(next.health).toBe(0);
    expect(next.status).toBe('died');
  });

  it('opens and logs an event cell without applying any effect yet', () => {
    const event: Outcome = {
      kind: 'event',
      eventId: 'locked-door',
      icon: 'lock',
      prompt: 'A door has been welded shut.',
      choices: [
        {
          id: 'force-it',
          label: 'Force it open',
          description: 'Risk it.',
          outcome: { kind: 'hazard', damage: 20, stealsItem: false, message: 'ouch' },
        },
        {
          id: 'leave-it',
          label: 'Leave it be',
          description: 'Play it safe.',
          outcome: { kind: 'empty', message: 'nothing' },
        },
      ],
    };
    const run = makeRun(event);
    const { run: next, outcome } = resolveCell(run, 0, 0);

    expect(outcome).toBe(event);
    expect(next.health).toBe(100);
    expect(next.inventory).toHaveLength(0);
    expect(next.dimension.cells[0][0].status).toBe('opened');
    expect(next.log).toHaveLength(1);
  });

  it('appends an entry to the run log', () => {
    const outcome: Outcome = { kind: 'empty', message: 'nothing' };
    const run = makeRun(outcome);
    const { run: next } = resolveCell(run, 0, 0);

    expect(next.log).toHaveLength(1);
    expect(next.log[0]).toEqual({ x: 0, y: 0, outcome });
  });

  it('throws when opening an already-opened cell', () => {
    const run = makeRun({ kind: 'empty', message: 'nothing' });
    const { run: opened } = resolveCell(run, 0, 0);
    expect(() => resolveCell(opened, 0, 0)).toThrow();
  });

  it('throws when opening a cell that does not exist', () => {
    const run = makeRun({ kind: 'empty', message: 'nothing' });
    run.dimension.cells[0][0].exists = false;
    expect(() => resolveCell(run, 0, 0)).toThrow();
  });
});
