import type { Cell, GridPoint } from '../types/grid';
import type { ActorInstance } from '../types/actor';
import { randomInt } from '../utils/rng';

function neighborsOf(p: GridPoint): GridPoint[] {
  return [
    { x: p.x + 1, y: p.y },
    { x: p.x - 1, y: p.y },
    { x: p.x, y: p.y + 1 },
    { x: p.x, y: p.y - 1 },
  ];
}

export interface AdvanceActorsResult {
  actors: ActorInstance[];
  /** The actor that ended its move on the player's cell, if any. */
  encounteredInstanceId: string | null;
}

/**
 * Steps every actor one square along a random walk, then reports whether any
 * of them ended up on the player's new position (an ambush, from the
 * player's perspective).
 */
export function advanceActors(
  cells: Cell[][],
  actors: ActorInstance[],
  playerPosition: GridPoint,
): AdvanceActorsResult {
  let encounteredInstanceId: string | null = null;

  const nextActors = actors.map((actor) => {
    const options = neighborsOf(actor.position).filter((p) => cells[p.y]?.[p.x]?.exists);
    const position = options.length > 0 ? options[randomInt(0, options.length - 1)] : actor.position;

    if (!encounteredInstanceId && position.x === playerPosition.x && position.y === playerPosition.y) {
      encounteredInstanceId = actor.instanceId;
    }

    return { ...actor, position };
  });

  return { actors: nextActors, encounteredInstanceId };
}
