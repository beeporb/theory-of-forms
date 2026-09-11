import type { Cell } from '../../game/types/grid';
import { getItemForm } from '../../game/content/items';
import { getVersion } from '../../game/content/versions';

interface GridCellProps {
  cell: Cell;
  isCurrent: boolean;
  isReachable: boolean;
  isExtractionPoint: boolean;
  onMoveTo: () => void;
}

function cellIcon(cell: Cell): string {
  if (cell.status === 'unopened') return '?';
  const outcome = cell.outcome;
  if (!outcome) return '';
  switch (outcome.kind) {
    case 'loot':
      return getItemForm(getVersion(outcome.versionId).formId).icon;
    case 'hazard':
      return '💥';
    case 'positive':
      return '✨';
    case 'empty':
      return '·';
  }
}

export function GridCell({ cell, isCurrent, isReachable, isExtractionPoint, onMoveTo }: GridCellProps) {
  if (!cell.exists) {
    return <div className="grid-cell grid-cell--void" aria-hidden="true" />;
  }

  const isFog = cell.status === 'unopened' && !isReachable;
  const clickable = isReachable && !isCurrent;

  const classes = ['grid-cell', `grid-cell--${cell.status}`];
  if (isFog) classes.push('grid-cell--fog');
  if (isCurrent) classes.push('grid-cell--current');
  if (isExtractionPoint) classes.push('grid-cell--extraction');

  const label = isFog
    ? 'Unexplored'
    : isCurrent
      ? 'Your current location'
      : cell.status === 'unopened'
        ? `Move to cell ${cell.x}, ${cell.y}`
        : undefined;

  return (
    <button
      type="button"
      className={classes.join(' ')}
      onClick={onMoveTo}
      disabled={!clickable}
      aria-label={label}
    >
      {!isFog && cellIcon(cell)}
      {isExtractionPoint && (
        <span className="grid-cell__badge" aria-hidden="true">
          🚪
        </span>
      )}
    </button>
  );
}
