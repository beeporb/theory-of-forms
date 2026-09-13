import type { PastRunRecord } from '../../game/types/pastRun';
import { THREAT_LEVEL_LABEL } from '../../game/types/threat';
import { getDimensionDefinition } from '../../game/content/dimensions';
import { RUN_OUTCOME_LABEL } from '../../game/logic/pastRun';
import { InventoryPanel } from '../inventory/InventoryPanel';
import { LoadoutPanel } from '../inventory/LoadoutPanel';
import { RunLogList } from './RunLogList';

interface PastRunDetailModalProps {
  run: PastRunRecord;
  onDismiss: () => void;
}

export function PastRunDetailModal({ run, onDismiss }: PastRunDetailModalProps) {
  const definition = getDimensionDefinition(run.dimensionId);
  const extracted = run.outcome === 'extracted';

  return (
    <div className="outcome-modal-backdrop" onClick={onDismiss}>
      <div className="run-log-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="run-log-modal__title">{definition.name}</h2>
        <p className={`run-history-card__outcome run-history-card__outcome--${run.outcome}`}>
          {RUN_OUTCOME_LABEL[run.outcome]}
        </p>
        {run.threatLevel && (
          <p>
            <span className={`badge badge--threat-${run.threatLevel}`}>{THREAT_LEVEL_LABEL[run.threatLevel]}</span>
          </p>
        )}

        <LoadoutPanel loadout={run.loadout} />
        {!extracted && run.loadout.length > 0 && (
          <p className="run-log-modal__empty">All equipped gear was lost.</p>
        )}

        <InventoryPanel
          title={extracted ? 'Items Kept' : 'Items Lost'}
          items={run.items}
          emptyMessage="Nothing found."
        />

        <RunLogList log={run.log} emptyMessage="Nothing happened." />

        <button type="button" className="outcome-modal__dismiss" onClick={onDismiss}>
          Close
        </button>
      </div>
    </div>
  );
}
