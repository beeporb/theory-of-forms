import type { RunLogEntry } from '../../game/types/runLog';
import { describeOutcome } from '../../game/logic/describeOutcome';
import { Icon } from '../common/Icon';

interface RunLogListProps {
  log: RunLogEntry[];
  emptyMessage: string;
}

export function RunLogList({ log, emptyMessage }: RunLogListProps) {
  const entries = [...log].reverse();

  if (entries.length === 0) {
    return <p className="run-log-modal__empty">{emptyMessage}</p>;
  }

  return (
    <ul className="run-log-modal__list">
      {entries.map((entry, i) => {
        const { icon, filter, tone, text } = describeOutcome(entry.outcome);
        return (
          <li key={i} className="run-log-modal__entry">
            <span className="run-log-modal__icon">
              {icon ? <Icon name={icon} filter={filter} tone={tone} /> : '·'}
            </span>
            <span className="run-log-modal__text">
              <span className="run-log-modal__coords">
                ({entry.x}, {entry.y})
              </span>{' '}
              {text}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
