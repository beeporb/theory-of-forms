import { useState } from 'react';
import { DIMENSIONS } from '../../game/content/dimensions';
import { buildLoadoutFromEquipped } from '../../game/logic/loadout';
import { useMetaStore } from '../../state/metaStore';
import { useRunStore } from '../../state/runStore';
import { LoadoutManager } from '../inventory/LoadoutManager';
import { LoadoutPanel } from '../inventory/LoadoutPanel';
import { Icon } from '../common/Icon';
import { StepIndicator } from './StepIndicator';

type Step = 'destination' | 'loadout' | 'confirm';
const STEPS: Step[] = ['destination', 'loadout', 'confirm'];
const STEP_LABELS = ['Destination', 'Loadout', 'Confirm'];

function formatRange(min: number, max: number): string {
  return min === max ? `${min}` : `${min}–${max}`;
}

export function RunLauncher() {
  const unlockedDimensionIds = useMetaStore((s) => s.meta.unlockedDimensionIds);
  const equippedGearIds = useMetaStore((s) => s.meta.equippedGearIds);
  const gearCondition = useMetaStore((s) => s.meta.gearCondition);
  const startRun = useRunStore((s) => s.startRun);

  const destinations = DIMENSIONS.filter((d) => unlockedDimensionIds.includes(d.id));
  const [selectedId, setSelectedId] = useState<string | null>(destinations[0]?.id ?? null);
  const selected = destinations.find((d) => d.id === selectedId) ?? null;
  const [step, setStep] = useState<Step>('destination');
  const stepIndex = STEPS.indexOf(step);

  const goNext = () => setStep(STEPS[Math.min(STEPS.length - 1, stepIndex + 1)]);
  const goBack = () => setStep(STEPS[Math.max(0, stepIndex - 1)]);

  return (
    <div className="run-launcher">
      <StepIndicator labels={STEP_LABELS} activeIndex={stepIndex} />

      {step === 'destination' && (
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
      )}

      {step === 'loadout' && <LoadoutManager />}

      {step === 'confirm' && (
        <>
          <section className="panel">
            <h3 className="panel__title">Destination</h3>
            <p className="run-launcher__confirm-destination">{selected?.name ?? 'No destination selected'}</p>
          </section>
          <LoadoutPanel loadout={buildLoadoutFromEquipped(equippedGearIds)} gearCondition={gearCondition} />
        </>
      )}

      <div className="run-launcher__nav">
        {stepIndex > 0 && (
          <button type="button" className="run-launcher__back" onClick={goBack}>
            Back
          </button>
        )}
        {step !== 'confirm' ? (
          <button
            type="button"
            className="primary-button"
            disabled={step === 'destination' && !selected}
            onClick={goNext}
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            className="primary-button"
            disabled={!selected}
            onClick={() => selected && startRun(selected.id)}
          >
            {selected ? `Enter ${selected.name}` : 'Enter Dimension'}
          </button>
        )}
      </div>
    </div>
  );
}
