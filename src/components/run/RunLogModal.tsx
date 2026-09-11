import type { RunLogEntry } from '../../game/types/runLog';
import { RunLogList } from './RunLogList';

interface RunLogModalProps {
  log: RunLogEntry[];
  onDismiss: () => void;
}

export function RunLogModal({ log, onDismiss }: RunLogModalProps) {
  return (
    <div className="outcome-modal-backdrop" onClick={onDismiss}>
      <div className="run-log-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="run-log-modal__title">Run Log</h2>
        <RunLogList log={log} emptyMessage="Nothing has happened yet." />
        <button type="button" className="outcome-modal__dismiss" onClick={onDismiss}>
          Close
        </button>
      </div>
    </div>
  );
}
