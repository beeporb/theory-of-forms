import type { RunState } from '../types/player';
import type { Outcome } from '../types/outcome';
import type { ActorEncounter } from '../types/actor';
import { resolveCell } from './resolveCell';
import { resolveActorEncounter } from './resolveActorEncounter';
import { advanceActors } from './actorMovement';
import { isAdjacent } from './adjacency';

export interface MovePlayerResult {
  run: RunState;
  outcome: Outcome | null;
  actorEncounter: ActorEncounter | null;
}

export function movePlayer(run: RunState, x: number, y: number): MovePlayerResult {
  const cell = run.dimension.cells[y]?.[x];
  if (!cell || !cell.exists) {
    throw new Error(`Cannot move to cell (${x}, ${y})`);
  }
  if (!isAdjacent(run.position, { x, y })) {
    throw new Error(`Cell (${x}, ${y}) is not adjacent to the current position`);
  }

  let nextRun = run;
  let outcome: Outcome | null = null;
  if (cell.status === 'unopened') {
    const resolved = resolveCell(run, x, y);
    nextRun = resolved.run;
    outcome = resolved.outcome;
  }

  const position = { x, y };
  nextRun = { ...nextRun, position, moveCount: nextRun.moveCount + 1 };

  // Walking straight into an actor's current square is an immediate ambush.
  let encounteredActor = nextRun.dimension.actors.find((a) => a.position.x === x && a.position.y === y) ?? null;

  // The rest of the board takes its turn too, unless the move above already ended the run.
  if (nextRun.status === 'active') {
    const { actors, cells, encounteredInstanceId, pickedUpAt } = advanceActors(
      nextRun.dimension.cells,
      nextRun.dimension.actors,
      position,
    );
    const pickupLog = pickedUpAt.map((p) => ({ x: p.x, y: p.y, outcome: cells[p.y][p.x].outcome! }));
    nextRun = {
      ...nextRun,
      dimension: { ...nextRun.dimension, cells, actors },
      log: [...nextRun.log, ...pickupLog],
    };
    if (!encounteredActor && encounteredInstanceId) {
      encounteredActor = actors.find((a) => a.instanceId === encounteredInstanceId) ?? null;
    }
  }

  let actorEncounter: ActorEncounter | null = null;
  if (encounteredActor && nextRun.status === 'active') {
    const resolved = resolveActorEncounter(nextRun, encounteredActor);
    nextRun = resolved.run;
    actorEncounter = resolved.encounter;
  }

  return { run: nextRun, outcome, actorEncounter };
}
