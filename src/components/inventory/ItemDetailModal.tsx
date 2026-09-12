import type { ItemForm } from '../../game/types/item';
import type { ItemVersion } from '../../game/types/version';
import type { Condition } from '../../game/types/condition';
import type { Weirdness } from '../../game/types/weirdness';
import { CONDITION_LABEL } from '../../game/types/condition';
import { WEIRDNESS_LABEL } from '../../game/types/weirdness';
import { SET_LABEL } from '../../game/content/sets';
import { itemQualityFilter } from '../../game/logic/itemStyle';
import { Icon } from '../common/Icon';

interface ItemDetailModalProps {
  version: ItemVersion;
  form: ItemForm;
  condition: Condition;
  weirdness: Weirdness;
  count?: number;
  onDismiss: () => void;
}

export function ItemDetailModal({
  version,
  form,
  condition,
  weirdness,
  count,
  onDismiss,
}: ItemDetailModalProps) {
  return (
    <div className="outcome-modal-backdrop" onClick={onDismiss}>
      <div
        className={`item-detail-modal item-card item-card--${weirdness}`}
        onClick={(e) => e.stopPropagation()}
      >
        {count !== undefined && count > 1 && <span className="item-card__count">×{count}</span>}
        <span className="item-card__icon item-card__icon--large">
          <Icon name={form.icon} filter={itemQualityFilter(condition, weirdness)} />
        </span>
        <span className="item-card__name item-card__name--large">{version.name}</span>
        <span className="item-detail-modal__set">{SET_LABEL[form.setId] ?? form.setId}</span>
        <span className="item-card__badges">
          <span className="badge">{CONDITION_LABEL[condition]}</span>
          <span className="badge">{WEIRDNESS_LABEL[weirdness]}</span>
        </span>
        <p className="item-card__flavor item-card__flavor--large">{form.flavorText}</p>
        <button type="button" className="outcome-modal__dismiss" onClick={onDismiss}>
          Close
        </button>
      </div>
    </div>
  );
}
