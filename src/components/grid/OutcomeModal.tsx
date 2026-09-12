import type { Outcome } from '../../game/types/outcome';
import { getItemForm } from '../../game/content/items';
import { getVersion } from '../../game/content/versions';
import { ItemCard } from '../inventory/ItemCard';
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
          <p className="outcome-modal__lead">You found something!</p>
          <ItemCard
            icon={form.icon}
            name={version.name}
            flavorText={form.flavorText}
            condition={outcome.condition}
            weirdness={outcome.weirdness}
          />
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
