import { describe, expect, it } from 'vitest';
import { advanceActors } from '../src/game/logic/actorMovement';
import type { Cell } from '../src/game/types/grid';
import type { ActorInstance } from '../src/game/types/actor';

function makeCells(shape: boolean[][]): Cell[][] {
  return shape.map((row, y) => row.map((exists, x) => ({ x, y, exists, status: 'unopened', outcome: null })));
}

function makeActor(x: number, y: number, instanceId = 'a1'): ActorInstance {
  return { instanceId, definitionId: 'feral-scavenger', position: { x, y } };
}

describe('advanceActors', () => {
  it('only moves an actor onto an existing, adjacent cell', () => {
    // A 1-wide corridor: the actor at (0,0) can only step to (0,1).
    const cells = makeCells([[true], [true]]);
    const { actors } = advanceActors(cells, [makeActor(0, 0)], { x: 5, y: 5 });

    expect(actors[0].position).toEqual({ x: 0, y: 1 });
  });

  it('stays put when there are no reachable neighbors', () => {
    const cells = makeCells([[true]]);
    const { actors } = advanceActors(cells, [makeActor(0, 0)], { x: 5, y: 5 });

    expect(actors[0].position).toEqual({ x: 0, y: 0 });
  });

  it('reports an encounter when an actor ends its move on the player', () => {
    const cells = makeCells([[true], [true]]);
    const { encounteredInstanceId } = advanceActors(cells, [makeActor(0, 0)], { x: 0, y: 1 });

    expect(encounteredInstanceId).toBe('a1');
  });

  it('reports no encounter when no actor lands on the player', () => {
    const cells = makeCells([
      [true, true],
      [true, true],
    ]);
    const { encounteredInstanceId } = advanceActors(cells, [makeActor(0, 0)], { x: 5, y: 5 });

    expect(encounteredInstanceId).toBeNull();
  });

  it('moves every actor independently', () => {
    const cells = makeCells([[true], [true], [true]]);
    const actors = [makeActor(0, 0, 'a1'), makeActor(0, 2, 'a2')];
    const { actors: next } = advanceActors(cells, actors, { x: 5, y: 5 });

    expect(next).toHaveLength(2);
    expect(next.find((a) => a.instanceId === 'a1')?.position).toEqual({ x: 0, y: 1 });
    expect(next.find((a) => a.instanceId === 'a2')?.position).toEqual({ x: 0, y: 1 });
  });
});
