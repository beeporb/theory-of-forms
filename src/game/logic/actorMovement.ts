import type { Cell, GridPoint } from '../types/grid';
import type { ActorInstance } from '../types/actor';
import { ACTOR_ITEM_PICKUP_CHANCE, ACTOR_PICKUP_MESSAGES } from '../content/encounterTable';
import { pickOne, randomInt } from '../utils/rng';

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
  /** Unchanged unless at least one actor picked a cell clean this turn. */
  cells: Cell[][];
  /** The actor that ended its move on the player's cell, if any. */
  encounteredInstanceId: string | null;
  /** Cells an actor picked clean this turn, in step order, for the run log. */
  pickedUpAt: GridPoint[];
}

/**
 * Steps every actor one square along a random walk. An actor that lands on
 * an unopened loot/gear cell has a chance to pick it up first, leaving it
 * opened and empty for the player — see ACTOR_ITEM_PICKUP_CHANCE. Reports
 * whether any actor ended up on the player's new position (an ambush, from
 * the player's perspective).
 */
export function advanceActors(cells: Cell[][], actors: ActorInstance[], playerPosition: GridPoint): AdvanceActorsResult {
  let encounteredInstanceId: string | null = null;
  const pickedUpAt: GridPoint[] = [];
  let nextCells = cells;

  const nextActors = actors.map((actor) => {
    const options = neighborsOf(actor.position).filter((p) => cells[p.y]?.[p.x]?.exists);
    const position = options.length > 0 ? options[randomInt(0, options.length - 1)] : actor.position;

    const targetCell = nextCells[position.y]?.[position.x];
    const isItemCell = targetCell?.status === 'unopened' && (targetCell.outcome?.kind === 'loot' || targetCell.outcome?.kind === 'gear');
    if (isItemCell && Math.random() < ACTOR_ITEM_PICKUP_CHANCE) {
      if (nextCells === cells) nextCells = cells.map((row) => row.map((c) => ({ ...c })));
      nextCells[position.y][position.x] = {
        ...nextCells[position.y][position.x],
        status: 'opened',
        outcome: { kind: 'empty', message: pickOne(ACTOR_PICKUP_MESSAGES) },
      };
      pickedUpAt.push(position);
    }

    if (!encounteredInstanceId && position.x === playerPosition.x && position.y === playerPosition.y) {
      encounteredInstanceId = actor.instanceId;
    }

    return { ...actor, position };
  });

  return { actors: nextActors, cells: nextCells, encounteredInstanceId, pickedUpAt };
}
