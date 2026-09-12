import type { IconName } from '../../game/types/icon';
import type { Condition } from '../../game/types/condition';
import type { Weirdness } from '../../game/types/weirdness';
import { CONDITION_LABEL } from '../../game/types/condition';
import { WEIRDNESS_LABEL } from '../../game/types/weirdness';
import { itemQualityFilter, rarityFilter } from '../../game/logic/itemStyle';
import { Icon } from '../common/Icon';

interface ItemCardProps {
  icon: IconName;
  name: string;
  flavorText: string;
  weirdness: Weirdness;
  condition?: Condition;
  count?: number;
  selected?: boolean;
  onClick?: () => void;
}

export function ItemCard({
  icon,
  name,
  flavorText,
  weirdness,
  condition,
  count,
  selected,
  onClick,
}: ItemCardProps) {
  const filter = condition ? itemQualityFilter(condition, weirdness) : rarityFilter(weirdness);

  return (
    <button
      type="button"
      className={`item-card item-card--${weirdness}${selected ? ' item-card--selected' : ''}`}
      onClick={onClick}
      disabled={!onClick}
    >
      {selected && <span className="item-card__tag">Equipped</span>}
      {count !== undefined && count > 1 && <span className="item-card__count">×{count}</span>}
      <span className="item-card__icon">
        <Icon name={icon} filter={filter} />
      </span>
      <span className="item-card__name">{name}</span>
      <span className="item-card__badges">
        {condition && <span className="badge">{CONDITION_LABEL[condition]}</span>}
        <span className="badge">{WEIRDNESS_LABEL[weirdness]}</span>
      </span>
      <span className="item-card__flavor">{flavorText}</span>
    </button>
  );
}
