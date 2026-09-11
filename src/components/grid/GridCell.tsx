import type { Cell } from '../../game/types/grid';
import { getItemForm } from '../../game/content/items';

interface GridCellProps {
  cell: Cell;
  onOpen: () => void;
}

function cellIcon(cell: Cell): string {
  if (cell.status === 'unopened') return '?';
  const outcome = cell.outcome;
  if (!outcome) return '';
  switch (outcome.kind) {
    case 'loot':
      return getItemForm(outcome.formId).icon;
    case 'hazard':
      return '💥';
    case 'positive':
      return '✨';
    case 'empty':
      return '·';
  }
}

export function GridCell({ cell, onOpen }: GridCellProps) {
  if (!cell.exists) {
    return <div className="grid-cell grid-cell--void" aria-hidden="true" />;
  }

  return (
    <button
      type="button"
      className={`grid-cell grid-cell--${cell.status}`}
      onClick={onOpen}
      disabled={cell.status === 'opened'}
      aria-label={cell.status === 'unopened' ? `Search cell ${cell.x}, ${cell.y}` : undefined}
    >
      {cellIcon(cell)}
    </button>
  );
}
