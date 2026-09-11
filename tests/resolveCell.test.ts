import { describe, expect, it } from 'vitest';
import { resolveCell } from '../src/game/logic/resolveCell';
import type { RunState } from '../src/game/types/player';
import type { Outcome } from '../src/game/types/outcome';
import type { Cell } from '../src/game/types/grid';

function makeRun(outcome: Outcome, overrides: Partial<RunState> = {}): RunState {
  const cell: Cell = { x: 0, y: 0, exists: true, status: 'unopened', outcome };
  return {
    dimension: { definitionId: 'test', cells: [[cell]] },
    health: 100,
    maxHealth: 100,
    loadout: [],
    inventory: [],
    status: 'active',
    ...overrides,
  };
}

describe('resolveCell', () => {
  it('adds a loot item to inventory and marks the cell opened', () => {
    const run = makeRun({ kind: 'loot', formId: 'iron-ore', rarity: 'broken' });
    const { run: next, outcome } = resolveCell(run, 0, 0);

    expect(outcome.kind).toBe('loot');
    expect(next.inventory).toHaveLength(1);
    expect(next.inventory[0].formId).toBe('iron-ore');
    expect(next.dimension.cells[0][0].status).toBe('opened');
  });

  it('applies hazard damage and can steal an item', () => {
    const run = makeRun(
      { kind: 'hazard', damage: 20, stealsItem: true, message: 'ouch' },
      { inventory: [{ instanceId: '1', formId: 'iron-ore', rarity: 'broken' }] },
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
