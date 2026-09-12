import type { ItemForm } from '../../game/types/item';
import type { ItemVersion } from '../../game/types/version';
import type { Condition } from '../../game/types/condition';
import type { Weirdness } from '../../game/types/weirdness';
import { CONDITION_LABEL } from '../../game/types/condition';
import { WEIRDNESS_LABEL } from '../../game/types/weirdness';
import { itemQualityFilter } from '../../game/logic/itemStyle';
import { Icon } from '../common/Icon';

interface ItemCardProps {
  version: ItemVersion;
  form: ItemForm;
  condition: Condition;
  weirdness: Weirdness;
  count?: number;
  onClick?: () => void;
}

export function ItemCard({ version, form, condition, weirdness, count, onClick }: ItemCardProps) {
  return (
    <button
      type="button"
      className={`item-card item-card--${weirdness}`}
      onClick={onClick}
      disabled={!onClick}
    >
      {count !== undefined && count > 1 && <span className="item-card__count">×{count}</span>}
      <span className="item-card__icon">
        <Icon name={form.icon} filter={itemQualityFilter(condition, weirdness)} />
      </span>
      <span className="item-card__name">{version.name}</span>
      <span className="item-card__badges">
        <span className="badge">{CONDITION_LABEL[condition]}</span>
        <span className="badge">{WEIRDNESS_LABEL[weirdness]}</span>
      </span>
      <span className="item-card__flavor">{form.flavorText}</span>
    </button>
  );
}
