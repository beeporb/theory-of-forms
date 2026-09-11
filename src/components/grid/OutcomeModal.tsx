import type { Outcome } from '../../game/types/outcome';
import { CONDITION_LABEL } from '../../game/types/condition';
import { WEIRDNESS_LABEL } from '../../game/types/weirdness';
import { getItemForm } from '../../game/content/items';
import { getVersion } from '../../game/content/versions';
import { itemQualityFilter } from '../../game/logic/itemStyle';
import { Icon } from '../common/Icon';

interface OutcomeModalProps {
  outcome: Outcome;
  onDismiss: () => void;
}

function OutcomeBody({ outcome }: { outcome: Outcome }) {
  switch (outcome.kind) {
    case 'loot': {
      const version = getVersion(outcome.versionId);
      const form = getItemForm(version.formId);
      return (
        <>
          <div className="outcome-modal__icon">
            <Icon name={form.icon} filter={itemQualityFilter(outcome.condition, outcome.weirdness)} />
          </div>
          <p>
            You found a {version.name}!
          </p>
          <p className="outcome-modal__badges">
            <span className="badge">{CONDITION_LABEL[outcome.condition]}</span>
            <span className="badge">{WEIRDNESS_LABEL[outcome.weirdness]}</span>
          </p>
        </>
      );
    }
    case 'hazard':
      return (
        <>
          <div className="outcome-modal__icon">
            <Icon name="bomb" tone="bad" />
          </div>
          <p>{outcome.message}</p>
          <p className="outcome-modal__stat outcome-modal__stat--bad">-{outcome.damage} HP</p>
          {outcome.stealsItem && <p className="outcome-modal__stat outcome-modal__stat--bad">An item was stolen from you!</p>}
        </>
      );
    case 'positive':
      return (
        <>
          <div className="outcome-modal__icon">
            <Icon name="sparkles" tone="good" />
          </div>
          <p>{outcome.message}</p>
          <p className="outcome-modal__stat outcome-modal__stat--good">+{outcome.heal} HP</p>
        </>
      );
    case 'empty':
      return (
        <>
          <div className="outcome-modal__icon">·</div>
          <p>{outcome.message}</p>
        </>
      );
  }
}

export function OutcomeModal({ outcome, onDismiss }: OutcomeModalProps) {
  return (
    <div className="outcome-modal-backdrop" onClick={onDismiss}>
      <div className="outcome-modal" onClick={(e) => e.stopPropagation()}>
        <OutcomeBody outcome={outcome} />
        <button type="button" className="outcome-modal__dismiss" onClick={onDismiss}>
          Continue
        </button>
      </div>
    </div>
  );
}
