import { describe, expect, it } from 'vitest';
import { movePlayer } from '../src/game/logic/movePlayer';
import type { RunState } from '../src/game/types/player';
import type { Cell } from '../src/game/types/grid';
import type { Outcome } from '../src/game/types/outcome';
import type { ActorInstance } from '../src/game/types/actor';

function makeCell(x: number, y: number, outcome: Outcome | null = { kind: 'empty', message: 'nothing' }): Cell {
  return { x, y, exists: true, status: 'unopened', outcome };
}

function makeRun(cells: Cell[][], overrides: Partial<RunState> = {}, actors: ActorInstance[] = []): RunState {
  return {
    dimension: { definitionId: 'test', cells, entry: { x: 0, y: 0 }, extractionPoints: [], minMovesToExtract: 0, actors },
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

describe('movePlayer', () => {
  it('resolves the destination cell and updates position and move count', () => {
    const cells = [[makeCell(0, 0), makeCell(1, 0), makeCell(2, 0)]];
    const run = makeRun(cells);

    const { run: next, outcome } = movePlayer(run, 1, 0);

    expect(outcome).not.toBeNull();
    expect(next.position).toEqual({ x: 1, y: 0 });
    expect(next.moveCount).toBe(1);
    expect(next.dimension.cells[0][1].status).toBe('opened');
  });

  it('moves into an already-opened adjacent cell without re-resolving it', () => {
    const cells = [[makeCell(0, 0), { ...makeCell(1, 0), status: 'opened' as const }]];
    const run = makeRun(cells);

    const { run: next, outcome } = movePlayer(run, 1, 0);

    expect(outcome).toBeNull();
    expect(next.position).toEqual({ x: 1, y: 0 });
    expect(next.moveCount).toBe(1);
  });

  it('throws when the target cell is not adjacent to the current position', () => {
    const cells = [[makeCell(0, 0), makeCell(1, 0), makeCell(2, 0)]];
    const run = makeRun(cells);

    expect(() => movePlayer(run, 2, 0)).toThrow();
  });

  it('throws when the target cell does not exist', () => {
    const cells = [[makeCell(0, 0), { ...makeCell(1, 0), exists: false }]];
    const run = makeRun(cells);

    expect(() => movePlayer(run, 1, 0)).toThrow();
  });

  it('reports no actor encounter when there are no actors', () => {
    const cells = [[makeCell(0, 0), makeCell(1, 0)]];
    const run = makeRun(cells);

    const { actorEncounter } = movePlayer(run, 1, 0);

    expect(actorEncounter).toBeNull();
  });

  it('triggers an immediate encounter when walking onto an actor', () => {
    const cells = [[makeCell(0, 0), makeCell(1, 0), makeCell(2, 0)]];
    const actor: ActorInstance = { instanceId: 'a1', definitionId: 'roaming-miner', position: { x: 1, y: 0 } };
    const run = makeRun(cells, {}, [actor]);

    const { run: next, actorEncounter } = movePlayer(run, 1, 0);

    expect(actorEncounter?.kind).toBe('collector');
    // The miner stays put after a grid encounter, whichever cell it ends up on.
    expect(next.dimension.actors).toHaveLength(1);
  });

  it('triggers an encounter when an actor wanders onto the player after they move', () => {
    // A 1-row corridor: after the player steps to (1,0), the actor starting at
    // (2,0) has nowhere else to wander but onto the player.
    const cells = [[makeCell(0, 0), makeCell(1, 0), makeCell(2, 0)]];
    const actor: ActorInstance = { instanceId: 'a1', definitionId: 'feral-scavenger', position: { x: 2, y: 0 } };
    const run = makeRun(cells, {}, [actor]);

    const { actorEncounter } = movePlayer(run, 1, 0);

    expect(actorEncounter?.kind).toBe('adversary');
  });
});
