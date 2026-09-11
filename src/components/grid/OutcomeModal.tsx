import type { Outcome } from '../../game/types/outcome';
import { getItemForm } from '../../game/content/items';
import { RARITY_LABEL } from '../../game/types/rarity';

interface OutcomeModalProps {
  outcome: Outcome;
  onDismiss: () => void;
}

function OutcomeBody({ outcome }: { outcome: Outcome }) {
  switch (outcome.kind) {
    case 'loot': {
      const form = getItemForm(outcome.formId);
      return (
        <>
          <div className="outcome-modal__icon">{form.icon}</div>
          <p>
            You found a <strong>{RARITY_LABEL[outcome.rarity]}</strong> {form.name}!
          </p>
        </>
      );
    }
    case 'hazard':
      return (
        <>
          <div className="outcome-modal__icon">💥</div>
          <p>{outcome.message}</p>
          <p className="outcome-modal__stat outcome-modal__stat--bad">-{outcome.damage} HP</p>
          {outcome.stealsItem && <p className="outcome-modal__stat outcome-modal__stat--bad">An item was stolen from you!</p>}
        </>
      );
    case 'positive':
      return (
        <>
          <div className="outcome-modal__icon">✨</div>
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
