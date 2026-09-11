import { useState } from 'react';
import type { PastRunRecord } from '../../game/types/pastRun';
import { getDimensionDefinition } from '../../game/content/dimensions';
import { RUN_OUTCOME_LABEL } from '../../game/logic/pastRun';
import { useMetaStore } from '../../state/metaStore';
import { PastRunDetailModal } from '../run/PastRunDetailModal';

export function RunsView() {
  const pastRuns = useMetaStore((s) => s.meta.pastRuns) ?? [];
  const [selected, setSelected] = useState<PastRunRecord | null>(null);

  return (
    <div className="runs-view">
      <h2 className="view-title">Runs</h2>
      {pastRuns.length === 0 ? (
        <p className="panel__empty">No runs yet. Go find something.</p>
      ) : (
        <ul className="run-history-list">
          {pastRuns.map((run) => {
            const definition = getDimensionDefinition(run.dimensionId);
            return (
              <li key={run.id}>
                <button type="button" className="run-history-card" onClick={() => setSelected(run)}>
                  <span className="run-history-card__dimension">{definition.name}</span>
                  <span className={`run-history-card__outcome run-history-card__outcome--${run.outcome}`}>
                    {RUN_OUTCOME_LABEL[run.outcome]}
                  </span>
                  <span className="run-history-card__meta">
                    {run.moveCount} moves · {run.items.length} item{run.items.length === 1 ? '' : 's'} ·{' '}
                    {new Date(run.endedAt).toLocaleString()}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
      {selected && <PastRunDetailModal run={selected} onDismiss={() => setSelected(null)} />}
    </div>
  );
}
