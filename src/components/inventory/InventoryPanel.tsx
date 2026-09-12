import { useState } from 'react';
import type { ItemInstance } from '../../game/types/item';
import { getItemForm } from '../../game/content/items';
import { getVersion } from '../../game/content/versions';
import { SET_LABEL } from '../../game/content/sets';
import { ItemCard } from './ItemCard';
import { ItemDetailModal } from './ItemDetailModal';

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
  const [openKey, setOpenKey] = useState<string | null>(null);
  const openEntry = grouped.find((entry) => entry.key === openKey) ?? null;

  return (
    <section className="panel">
      <h3 className="panel__title">{title}</h3>
      {grouped.length === 0 ? (
        <p className="panel__empty">{emptyMessage}</p>
      ) : (
        <div className="item-card-grid">
          {grouped.map((entry) => {
            const version = getVersion(entry.versionId);
            const form = getItemForm(version.formId);
            return (
              <ItemCard
                key={entry.key}
                icon={form.icon}
                name={version.name}
                flavorText={form.flavorText}
                condition={entry.condition}
                weirdness={entry.weirdness}
                count={entry.count}
                onClick={() => setOpenKey(entry.key)}
              />
            );
          })}
        </div>
      )}
      {openEntry &&
        (() => {
          const version = getVersion(openEntry.versionId);
          const form = getItemForm(version.formId);
          return (
            <ItemDetailModal
              icon={form.icon}
              name={version.name}
              flavorText={form.flavorText}
              metaLabel={SET_LABEL[form.setId] ?? form.setId}
              condition={openEntry.condition}
              weirdness={openEntry.weirdness}
              count={openEntry.count}
              onDismiss={() => setOpenKey(null)}
            />
          );
        })()}
    </section>
  );
}
