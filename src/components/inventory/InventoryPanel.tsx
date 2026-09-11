import type { ItemInstance } from '../../game/types/item';
import { getItemForm } from '../../game/content/items';
import { RARITY_LABEL } from '../../game/types/rarity';

interface InventoryPanelProps {
  title: string;
  items: ItemInstance[];
  emptyMessage?: string;
}

interface GroupedEntry {
  key: string;
  formId: string;
  rarity: ItemInstance['rarity'];
  count: number;
}

function groupItems(items: ItemInstance[]): GroupedEntry[] {
  const groups = new Map<string, GroupedEntry>();
  for (const item of items) {
    const key = `${item.formId}:${item.rarity}`;
    const existing = groups.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      groups.set(key, { key, formId: item.formId, rarity: item.rarity, count: 1 });
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
            const form = getItemForm(entry.formId);
            return (
              <li key={entry.key} className="item-list__row">
                <span className="item-list__icon">{form.icon}</span>
                <span className="item-list__name">{form.name}</span>
                <span className="item-list__rarity">{RARITY_LABEL[entry.rarity]}</span>
                <span className="item-list__count">×{entry.count}</span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
