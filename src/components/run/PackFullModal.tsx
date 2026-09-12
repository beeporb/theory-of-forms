import type { ItemInstance } from '../../game/types/item';
import { CONDITION_LABEL } from '../../game/types/condition';
import { WEIRDNESS_LABEL } from '../../game/types/weirdness';
import { getItemForm } from '../../game/content/items';
import { getVersion } from '../../game/content/versions';
import { itemQualityFilter } from '../../game/logic/itemStyle';
import { Icon } from '../common/Icon';

interface PackFullModalProps {
  inventory: ItemInstance[];
  carryCapacity: number;
  onDrop: (instanceId: string) => void;
}

export function PackFullModal({ inventory, carryCapacity, onDrop }: PackFullModalProps) {
  return (
    <div className="outcome-modal-backdrop">
      <div className="outcome-modal">
        <p>
          Your pack is full ({inventory.length}/{carryCapacity}). Drop something to make room.
        </p>
        <ul className="item-list">
          {inventory.map((item) => {
            const version = getVersion(item.versionId);
            const form = getItemForm(version.formId);
            return (
              <li key={item.instanceId} className="item-list__row">
                <span className="item-list__icon">
                  <Icon name={form.icon} filter={itemQualityFilter(item.condition, item.weirdness)} />
                </span>
                <span className="item-list__name">{version.name}</span>
                <span className="item-list__badges">
                  <span className="badge">{CONDITION_LABEL[item.condition]}</span>
                  <span className="badge">{WEIRDNESS_LABEL[item.weirdness]}</span>
                </span>
                <button type="button" onClick={() => onDrop(item.instanceId)}>
                  Drop
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
