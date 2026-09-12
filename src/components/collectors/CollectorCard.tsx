import { useState } from 'react';
import type { CollectorDefinition, CollectorProgress } from '../../game/types/collector';
import type { ItemInstance } from '../../game/types/item';
import { CONDITION_LABEL } from '../../game/types/condition';
import { WEIRDNESS_LABEL } from '../../game/types/weirdness';
import { getItemForm } from '../../game/content/items';
import { getVersion } from '../../game/content/versions';
import { getRequiredVersionIds, isMasterSetComplete, masterSetPercent } from '../../game/logic/masterSet';
import { qualityScore } from '../../game/logic/quality';
import { itemQualityFilter } from '../../game/logic/itemStyle';
import { Icon } from '../common/Icon';
import { CollectorDetailModal } from './CollectorDetailModal';

interface CollectorCardProps {
  definition: CollectorDefinition;
  progress: CollectorProgress;
  stash: ItemInstance[];
  onDonate: (instanceId: string) => void;
}

export function CollectorCard({ definition, progress, stash, onDonate }: CollectorCardProps) {
  const complete = isMasterSetComplete(definition, progress);
  const percent = Math.round(masterSetPercent(definition, progress) * 100);
  const requiredVersionIds = getRequiredVersionIds(definition);
  const [showDetail, setShowDetail] = useState(false);

  const donatable = stash.filter((item) => {
    if (!requiredVersionIds.includes(item.versionId)) return false;
    const held = progress.donated[item.versionId];
    if (!held) return true;
    return qualityScore(item.condition, item.weirdness) > qualityScore(held.condition, held.weirdness);
  });

  return (
    <section className="panel collector-card">
      <h3 className="panel__title collector-card__title">
        <button type="button" className="collector-card__title-button" onClick={() => setShowDetail(true)}>
          <span className="collector-card__icon">
            <Icon name={definition.icon} />
          </span>
          {definition.name}
        </button>
        {complete && <span className="collector-card__badge">Master Set Complete</span>}
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
              const version = getVersion(item.versionId);
              const form = getItemForm(version.formId);
              return (
                <li key={item.instanceId} className="item-list__row">
                  <span className="item-list__icon">
                    <Icon name={form.icon} filter={itemQualityFilter(item.condition, item.weirdness)} />
                  </span>
                  <span className="item-list__name">{version.name}</span>
                  <span className="item-list__badges">
                    <span className="badge">{CONDITION_LABEL[item.condition]}</span>
                    <span className="badge">{WEIRDNESS_LABEL[item.weirdness]}</span>
                  </span>
                  <button type="button" onClick={() => onDonate(item.instanceId)}>
                    Donate
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {showDetail && (
        <CollectorDetailModal definition={definition} progress={progress} onDismiss={() => setShowDetail(false)} />
      )}
    </section>
  );
}
