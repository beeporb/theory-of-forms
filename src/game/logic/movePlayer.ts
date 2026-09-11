import type { RunState } from '../types/player';
import type { Outcome } from '../types/outcome';
import { resolveCell } from './resolveCell';
import { isAdjacent } from './adjacency';

export interface MovePlayerResult {
  run: RunState;
  outcome: Outcome | null;
}

export function movePlayer(run: RunState, x: number, y: number): MovePlayerResult {
  const cell = run.dimension.cells[y]?.[x];
  if (!cell || !cell.exists) {
    throw new Error(`Cannot move to cell (${x}, ${y})`);
  }
  if (!isAdjacent(run.position, { x, y })) {
    throw new Error(`Cell (${x}, ${y}) is not adjacent to the current position`);
  }

  if (cell.status === 'unopened') {
    const { run: resolved, outcome } = resolveCell(run, x, y);
    return {
      run: { ...resolved, position: { x, y }, moveCount: resolved.moveCount + 1 },
      outcome,
    };
  }

  return {
    run: { ...run, position: { x, y }, moveCount: run.moveCount + 1 },
    outcome: null,
  };
}
