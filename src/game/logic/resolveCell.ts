import type { RunState } from '../types/player';
import type { Outcome } from '../types/outcome';
import { applyLeafOutcome } from './applyOutcome';

export interface ResolveCellResult {
  run: RunState;
  outcome: Outcome;
}

export function resolveCell(run: RunState, x: number, y: number): ResolveCellResult {
  const cell = run.dimension.cells[y]?.[x];
  if (!cell || !cell.exists || cell.status === 'opened') {
    throw new Error(`Cannot open cell (${x}, ${y})`);
  }
  const outcome = cell.outcome;
  if (!outcome) {
    throw new Error(`Cell (${x}, ${y}) has no pre-rolled outcome`);
  }

  const cells = run.dimension.cells.map((row) => row.map((c) => ({ ...c })));
  cells[y][x].status = 'opened';

  // Events don't apply any effect on their own — that happens once the
  // player picks a choice, via resolveEventChoice.
  const { health, inventory, foundGear, status } =
    outcome.kind === 'event'
      ? { health: run.health, inventory: run.inventory, foundGear: run.foundGear, status: run.status }
      : applyLeafOutcome(run, outcome);

  const nextRun: RunState = {
    ...run,
    dimension: { ...run.dimension, cells },
    health,
    inventory,
    foundGear,
    status,
    log: [...run.log, { x, y, outcome }],
  };

  return { run: nextRun, outcome };
}
