import { useState } from 'react';
import type { EventOutcome } from '../../game/types/outcome';
import { OutcomeBody } from './OutcomeModal';
import { Icon } from '../common/Icon';

interface EventModalProps {
  outcome: EventOutcome;
  onChoose: (choiceIndex: number) => void;
  onDismiss: () => void;
}

export function EventModal({ outcome, onChoose, onDismiss }: EventModalProps) {
  const [chosenIndex, setChosenIndex] = useState<number | null>(null);
  const chosen = chosenIndex !== null ? outcome.choices[chosenIndex] : null;

  const handleChoose = (index: number) => {
    setChosenIndex(index);
    onChoose(index);
  };

  return (
    <div className="outcome-modal-backdrop" onClick={chosen ? onDismiss : undefined}>
      <div className="outcome-modal" onClick={(e) => e.stopPropagation()}>
        <div className="outcome-modal__icon">
          <Icon name={outcome.icon} />
        </div>
        <p>{outcome.prompt}</p>

        {!chosen ? (
          <div className="event-modal__choices">
            {outcome.choices.map((choice, index) => (
              <button
                key={choice.id}
                type="button"
                className="event-modal__choice"
                onClick={() => handleChoose(index)}
              >
                <span className="event-modal__choice-label">{choice.label}</span>
                <span className="event-modal__choice-description">{choice.description}</span>
              </button>
            ))}
          </div>
        ) : (
          <>
            <OutcomeBody outcome={chosen.outcome} />
            <button type="button" className="outcome-modal__dismiss" onClick={onDismiss}>
              Continue
            </button>
          </>
        )}
      </div>
    </div>
  );
}
