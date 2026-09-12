import type { TraitDefinition } from '../../game/types/character';
import { Icon } from '../common/Icon';

interface TraitCardProps {
  definition: TraitDefinition;
  owned: boolean;
  canTake: boolean;
  characterLevel: number;
  onTake: () => void;
}

export function TraitCard({ definition, owned, canTake, characterLevel, onTake }: TraitCardProps) {
  const locked = !owned && characterLevel < definition.requiredLevel;

  return (
    <div className={`trait-card${owned ? ' trait-card--owned' : ''}${locked ? ' trait-card--locked' : ''}`}>
      <div className="trait-card__title">
        <span className="trait-card__icon">
          <Icon name={definition.icon} />
        </span>
        <span className="trait-card__name">{definition.name}</span>
        {owned && <span className="badge trait-card__badge">Taken</span>}
      </div>
      <p className="trait-card__description">{definition.description}</p>
      {!owned && (
        <button type="button" className="trait-card__take" onClick={onTake} disabled={!canTake}>
          {locked ? `Requires level ${definition.requiredLevel}` : 'Take trait'}
        </button>
      )}
    </div>
  );
}
