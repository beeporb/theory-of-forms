import type { AttributeDefinition } from '../../game/types/character';
import { Icon } from '../common/Icon';

interface AttributeRowProps {
  definition: AttributeDefinition;
  value: number;
  canAllocate: boolean;
  onAllocate: () => void;
}

export function AttributeRow({ definition, value, canAllocate, onAllocate }: AttributeRowProps) {
  return (
    <div className="stat-row">
      <span className="stat-row__icon">
        <Icon name={definition.icon} />
      </span>
      <div className="stat-row__body">
        <div className="stat-row__header">
          <span className="stat-row__name">{definition.name}</span>
          <span className="stat-row__value">{value}</span>
        </div>
        <p className="stat-row__description">{definition.description}</p>
      </div>
      {canAllocate && (
        <button type="button" className="stat-row__allocate" onClick={onAllocate} title={`Raise ${definition.name}`}>
          +
        </button>
      )}
    </div>
  );
}
