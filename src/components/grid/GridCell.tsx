import type { Cell } from '../../game/types/grid';
import type { ActorInstance } from '../../game/types/actor';
import { getItemForm } from '../../game/content/items';
import { getVersion } from '../../game/content/versions';
import { getActorDefinition } from '../../game/content/actors';
import { itemQualityFilter } from '../../game/logic/itemStyle';
import { Icon } from '../common/Icon';

interface GridCellProps {
  cell: Cell;
  isCurrent: boolean;
  isReachable: boolean;
  isExtractionPoint: boolean;
  actor?: ActorInstance;
  onMoveTo: () => void;
}

function CellIcon({ cell }: { cell: Cell }) {
  if (cell.status === 'unopened') return <>?</>;
  const outcome = cell.outcome;
  if (!outcome) return null;
  switch (outcome.kind) {
    case 'loot': {
      const version = getVersion(outcome.versionId);
      const form = getItemForm(version.formId);
      return <Icon name={form.icon} filter={itemQualityFilter(outcome.condition, outcome.weirdness)} />;
    }
    case 'hazard':
      return <Icon name="bomb" tone="bad" />;
    case 'positive':
      return <Icon name="sparkles" tone="good" />;
    case 'empty':
      return <>·</>;
  }
}

export function GridCell({ cell, isCurrent, isReachable, isExtractionPoint, actor, onMoveTo }: GridCellProps) {
  if (!cell.exists) {
    return <div className="grid-cell grid-cell--void" aria-hidden="true" />;
  }

  const isFog = cell.status === 'unopened' && !isReachable;
  const clickable = isReachable && !isCurrent;
  const visibleActor = actor && !isFog ? getActorDefinition(actor.definitionId) : null;

  const classes = ['grid-cell', `grid-cell--${cell.status}`];
  if (isFog) classes.push('grid-cell--fog');
  if (isCurrent) classes.push('grid-cell--current');
  if (isExtractionPoint) classes.push('grid-cell--extraction');
  if (visibleActor) classes.push(`grid-cell--actor-${visibleActor.kind}`);

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
      {!isFog && (visibleActor ? <Icon name={visibleActor.icon} tone={visibleActor.kind === 'adversary' ? 'bad' : undefined} /> : <CellIcon cell={cell} />)}
      {isExtractionPoint && (
        <span className="grid-cell__badge" aria-hidden="true">
          <Icon name="door" />
        </span>
      )}
    </button>
  );
}
