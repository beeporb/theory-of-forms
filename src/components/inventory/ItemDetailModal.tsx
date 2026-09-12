import type { IconName } from '../../game/types/icon';
import type { Condition } from '../../game/types/condition';
import type { Weirdness } from '../../game/types/weirdness';
import { CONDITION_LABEL } from '../../game/types/condition';
import { WEIRDNESS_LABEL } from '../../game/types/weirdness';
import { itemQualityFilter, rarityFilter } from '../../game/logic/itemStyle';
import { Icon } from '../common/Icon';

interface ItemDetailModalProps {
  icon: IconName;
  name: string;
  flavorText: string;
  weirdness: Weirdness;
  condition?: Condition;
  count?: number;
  metaLabel?: string;
  breakDownLabel?: string;
  onBreakDown?: () => void;
  onDismiss: () => void;
}

export function ItemDetailModal({
  icon,
  name,
  flavorText,
  weirdness,
  condition,
  count,
  metaLabel,
  breakDownLabel,
  onBreakDown,
  onDismiss,
}: ItemDetailModalProps) {
  const filter = condition ? itemQualityFilter(condition, weirdness) : rarityFilter(weirdness);

  return (
    <div className="outcome-modal-backdrop" onClick={onDismiss}>
      <div
        className={`item-detail-modal item-card item-card--${weirdness}`}
        onClick={(e) => e.stopPropagation()}
      >
        {count !== undefined && count > 1 && <span className="item-card__count">×{count}</span>}
        <span className="item-card__icon item-card__icon--large">
          <Icon name={icon} filter={filter} />
        </span>
        <span className="item-card__name item-card__name--large">{name}</span>
        {metaLabel && <span className="item-detail-modal__set">{metaLabel}</span>}
        <span className="item-card__badges">
          {condition && <span className={`badge badge--condition-${condition}`}>{CONDITION_LABEL[condition]}</span>}
          <span className="badge">{WEIRDNESS_LABEL[weirdness]}</span>
        </span>
        <p className="item-card__flavor item-card__flavor--large">{flavorText}</p>
        <div className="item-detail-modal__actions">
          {onBreakDown && (
            <button type="button" className="item-detail-modal__breakdown" onClick={onBreakDown}>
              Break Down{breakDownLabel ? ` (${breakDownLabel})` : ''}
            </button>
          )}
          <button type="button" className="outcome-modal__dismiss" onClick={onDismiss}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
