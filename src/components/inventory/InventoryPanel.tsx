import type { ItemInstance } from '../../game/types/item';
import { CONDITION_LABEL } from '../../game/types/condition';
import { WEIRDNESS_LABEL } from '../../game/types/weirdness';
import { getItemForm } from '../../game/content/items';
import { getVersion } from '../../game/content/versions';
import { itemQualityFilter } from '../../game/logic/itemStyle';
import { Icon } from '../common/Icon';

interface InventoryPanelProps {
  title: string;
  items: ItemInstance[];
  emptyMessage?: string;
}

interface GroupedEntry {
  key: string;
  versionId: string;
  condition: ItemInstance['condition'];
  weirdness: ItemInstance['weirdness'];
  count: number;
}

function groupItems(items: ItemInstance[]): GroupedEntry[] {
  const groups = new Map<string, GroupedEntry>();
  for (const item of items) {
    const key = `${item.versionId}:${item.condition}:${item.weirdness}`;
    const existing = groups.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      groups.set(key, {
        key,
        versionId: item.versionId,
        condition: item.condition,
        weirdness: item.weirdness,
        count: 1,
      });
    }
  }
  return [...groups.values()];
}

export function InventoryPanel({ title, items, emptyMessage = 'Nothing here yet.' }: InventoryPanelProps) {
  const grouped = groupItems(items);

  return (
    <section className="panel">
      <h3 className="panel__title">{title}</h3>
      {grouped.length === 0 ? (
        <p className="panel__empty">{emptyMessage}</p>
      ) : (
        <ul className="item-list">
          {grouped.map((entry) => {
            const version = getVersion(entry.versionId);
            const form = getItemForm(version.formId);
            return (
              <li key={entry.key} className="item-list__row">
                <span className="item-list__icon">
                  <Icon name={form.icon} filter={itemQualityFilter(entry.condition, entry.weirdness)} />
                </span>
                <span className="item-list__name">{version.name}</span>
                <span className="item-list__badges">
                  <span className="badge">{CONDITION_LABEL[entry.condition]}</span>
                  <span className="badge">{WEIRDNESS_LABEL[entry.weirdness]}</span>
                </span>
                <span className="item-list__count">×{entry.count}</span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
