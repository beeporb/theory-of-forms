import { useState } from 'react';
import { DIMENSIONS } from '../../game/content/dimensions';
import { useMetaStore } from '../../state/metaStore';
import { useRunStore } from '../../state/runStore';
import { LoadoutManager } from '../inventory/LoadoutManager';
import { Icon } from '../common/Icon';

function formatRange(min: number, max: number): string {
  return min === max ? `${min}` : `${min}–${max}`;
}

export function RunLauncher() {
  const unlockedDimensionIds = useMetaStore((s) => s.meta.unlockedDimensionIds);
  const startRun = useRunStore((s) => s.startRun);

  const destinations = DIMENSIONS.filter((d) => unlockedDimensionIds.includes(d.id));
  const [selectedId, setSelectedId] = useState<string | null>(destinations[0]?.id ?? null);
  const selected = destinations.find((d) => d.id === selectedId) ?? null;

  return (
    <div className="run-launcher">
      <section className="panel">
        <h3 className="panel__title">Destination</h3>
        {destinations.length === 0 ? (
          <p className="panel__empty">No destinations unlocked yet.</p>
        ) : (
          <div className="destination-list">
            {destinations.map((d) => (
              <button
                key={d.id}
                type="button"
                className={`destination-card${d.id === selectedId ? ' destination-card--selected' : ''}`}
                onClick={() => setSelectedId(d.id)}
              >
                <span className="destination-card__icon">
                  <Icon name="door" />
                </span>
                <span className="destination-card__body">
                  <span className="destination-card__name">{d.name}</span>
                  <span className="destination-card__meta">
                    {formatRange(d.minRows, d.maxRows)}×{formatRange(d.minCols, d.maxCols)} grid ·{' '}
                    {formatRange(...d.minMovesToExtractRange)}+ moves to extract
                  </span>
                </span>
              </button>
            ))}
          </div>
        )}
      </section>

      <LoadoutManager />

      <button
        type="button"
        className="primary-button"
        disabled={!selected}
        onClick={() => selected && startRun(selected.id)}
      >
        {selected ? `Enter ${selected.name}` : 'Enter Dimension'}
      </button>
    </div>
  );
}
