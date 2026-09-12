import type { CollectorDefinition, CollectorProgress } from '../../game/types/collector';
import { CONDITION_LABEL } from '../../game/types/condition';
import { WEIRDNESS_LABEL } from '../../game/types/weirdness';
import { getItemForm } from '../../game/content/items';
import { getVersion } from '../../game/content/versions';
import { getRequiredVersionIds } from '../../game/logic/masterSet';
import { Icon } from '../common/Icon';

interface CollectorDetailModalProps {
  definition: CollectorDefinition;
  progress: CollectorProgress;
  onDismiss: () => void;
}

export function CollectorDetailModal({ definition, progress, onDismiss }: CollectorDetailModalProps) {
  const requiredVersionIds = getRequiredVersionIds(definition);

  return (
    <div className="outcome-modal-backdrop" onClick={onDismiss}>
      <div className="run-log-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="run-log-modal__title collector-detail-modal__title">
          <span className="collector-card__icon">
            <Icon name={definition.icon} />
          </span>
          {definition.name}
        </h2>
        <p className="collector-card__flavor">{definition.flavorText}</p>

        <ul className="collector-detail-modal__list">
          {requiredVersionIds.map((versionId) => {
            const version = getVersion(versionId);
            const form = getItemForm(version.formId);
            const held = progress.donated[versionId];
            return (
              <li
                key={versionId}
                className={`collector-detail-modal__row${held ? ' collector-detail-modal__row--done' : ''}`}
              >
                <span className="item-list__icon">
                  <Icon name={form.icon} />
                </span>
                <span className="item-list__name">{version.name}</span>
                {held ? (
                  <span className="item-list__badges">
                    <span className="badge">{CONDITION_LABEL[held.condition]}</span>
                    <span className="badge">{WEIRDNESS_LABEL[held.weirdness]}</span>
                  </span>
                ) : (
                  <span className="collector-detail-modal__missing">Still needed</span>
                )}
              </li>
            );
          })}
        </ul>

        <button type="button" className="outcome-modal__dismiss" onClick={onDismiss}>
          Close
        </button>
      </div>
    </div>
  );
}
