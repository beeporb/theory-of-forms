import { useState } from 'react';
import type { ItemInstance } from '../../game/types/item';
import { getItemForm } from '../../game/content/items';
import { getVersion } from '../../game/content/versions';
import { getMaterial } from '../../game/content/materials';
import { SET_LABEL } from '../../game/content/sets';
import { breakdownMaterialId, breakdownYield } from '../../game/logic/breakdown';
import { ItemCard } from './ItemCard';
import { ItemDetailModal } from './ItemDetailModal';

interface InventoryPanelProps {
  title: string;
  items: ItemInstance[];
  emptyMessage?: string;
  /** Only meaningful for the persisted stash — omitted for run-local/lost inventory views. */
  onBreakDown?: (instanceId: string) => void;
}

interface GroupedEntry {
  key: string;
  versionId: string;
  condition: ItemInstance['condition'];
  weirdness: ItemInstance['weirdness'];
  count: number;
  instanceIds: string[];
}

function groupItems(items: ItemInstance[]): GroupedEntry[] {
  const groups = new Map<string, GroupedEntry>();
  for (const item of items) {
    const key = `${item.versionId}:${item.condition}:${item.weirdness}`;
    const existing = groups.get(key);
    if (existing) {
      existing.count += 1;
      existing.instanceIds.push(item.instanceId);
    } else {
      groups.set(key, {
        key,
        versionId: item.versionId,
        condition: item.condition,
        weirdness: item.weirdness,
        count: 1,
        instanceIds: [item.instanceId],
      });
    }
  }
  return [...groups.values()];
}

export function InventoryPanel({ title, items, emptyMessage = 'Nothing here yet.', onBreakDown }: InventoryPanelProps) {
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
          const materialId = breakdownMaterialId(form.setId);
          const yieldAmount = breakdownYield(openEntry.condition);
          return (
            <ItemDetailModal
              icon={form.icon}
              name={version.name}
              flavorText={form.flavorText}
              metaLabel={SET_LABEL[form.setId] ?? form.setId}
              condition={openEntry.condition}
              weirdness={openEntry.weirdness}
              count={openEntry.count}
              breakDownLabel={materialId ? `+${yieldAmount} ${getMaterial(materialId).name}` : undefined}
              onBreakDown={
                onBreakDown && materialId ? () => onBreakDown(openEntry.instanceIds[0]) : undefined
              }
              onDismiss={() => setOpenKey(null)}
            />
          );
        })()}
    </section>
  );
}
