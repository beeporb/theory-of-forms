import type { CollectorDefinition, CollectorProgress } from '../../game/types/collector';
import type { ItemInstance } from '../../game/types/item';
import { getItemForm } from '../../game/content/items';
import { isMasterSetComplete, masterSetPercent } from '../../game/logic/masterSet';

interface CollectorCardProps {
  definition: CollectorDefinition;
  progress: CollectorProgress;
  stash: ItemInstance[];
  onDonate: (instanceId: string) => void;
}

export function CollectorCard({ definition, progress, stash, onDonate }: CollectorCardProps) {
  const complete = isMasterSetComplete(definition, progress);
  const percent = Math.round(masterSetPercent(definition, progress) * 100);

  const donatable = stash.filter(
    (item) =>
      definition.requiredFormIds.includes(item.formId) &&
      !progress.turnedInFormIds.includes(item.formId),
  );

  return (
    <section className="panel collector-card">
      <h3 className="panel__title">
        {definition.name} {complete && <span className="collector-card__badge">Master Set Complete</span>}
      </h3>
      <p className="collector-card__flavor">{definition.flavorText}</p>
      <div className="collector-card__progress-track">
        <div className="collector-card__progress-fill" style={{ width: `${percent}%` }} />
      </div>
      <p className="collector-card__progress-label">{percent}% complete</p>

      {donatable.length > 0 && (
        <div className="collector-card__donate">
          <p className="panel__subtitle">Donate from your stash:</p>
          <ul className="item-list">
            {donatable.map((item) => {
              const form = getItemForm(item.formId);
              return (
                <li key={item.instanceId} className="item-list__row">
                  <span className="item-list__icon">{form.icon}</span>
                  <span className="item-list__name">{form.name}</span>
                  <button type="button" onClick={() => onDonate(item.instanceId)}>
                    Donate
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}
