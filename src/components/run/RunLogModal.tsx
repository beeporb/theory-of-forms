import type { RunLogEntry } from '../../game/types/runLog';
import { describeOutcome } from '../../game/logic/describeOutcome';

interface RunLogModalProps {
  log: RunLogEntry[];
  onDismiss: () => void;
}

export function RunLogModal({ log, onDismiss }: RunLogModalProps) {
  const entries = [...log].reverse();

  return (
    <div className="outcome-modal-backdrop" onClick={onDismiss}>
      <div className="run-log-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="run-log-modal__title">Run Log</h2>
        {entries.length === 0 ? (
          <p className="run-log-modal__empty">Nothing has happened yet.</p>
        ) : (
          <ul className="run-log-modal__list">
            {entries.map((entry, i) => {
              const { icon, text } = describeOutcome(entry.outcome);
              return (
                <li key={i} className="run-log-modal__entry">
                  <span className="run-log-modal__icon">{icon}</span>
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
        )}
        <button type="button" className="outcome-modal__dismiss" onClick={onDismiss}>
          Close
        </button>
      </div>
    </div>
  );
}
