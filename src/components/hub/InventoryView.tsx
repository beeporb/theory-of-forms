import { useState } from 'react';
import { CONDITION_LABEL, CONDITION_ORDER } from '../../game/types/condition';
import { WEIRDNESS_LABEL, WEIRDNESS_ORDER } from '../../game/types/weirdness';
import { ITEM_FORMS, getItemForm } from '../../game/content/items';
import { getVersion } from '../../game/content/versions';
import { SET_LABEL } from '../../game/content/sets';
import { useMetaStore } from '../../state/metaStore';
import { LoadoutManager } from '../inventory/LoadoutManager';
import { InventoryPanel } from '../inventory/InventoryPanel';
import { FilterChipGroup } from '../inventory/FilterChipGroup';

const SET_OPTIONS = [...new Set(ITEM_FORMS.map((f) => f.setId))].map((setId) => ({
  value: setId,
  label: SET_LABEL[setId] ?? setId,
}));

const CONDITION_OPTIONS = CONDITION_ORDER.map((c) => ({ value: c, label: CONDITION_LABEL[c] }));
const WEIRDNESS_OPTIONS = WEIRDNESS_ORDER.map((w) => ({ value: w, label: WEIRDNESS_LABEL[w] }));

function toggle(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export function InventoryView() {
  const stash = useMetaStore((s) => s.meta.stash);
  const [sets, setSets] = useState<string[]>([]);
  const [conditions, setConditions] = useState<string[]>([]);
  const [weirdnesses, setWeirdnesses] = useState<string[]>([]);

  const filtered = stash.filter((item) => {
    if (conditions.length > 0 && !conditions.includes(item.condition)) return false;
    if (weirdnesses.length > 0 && !weirdnesses.includes(item.weirdness)) return false;
    if (sets.length > 0) {
      const form = getItemForm(getVersion(item.versionId).formId);
      if (!sets.includes(form.setId)) return false;
    }
    return true;
  });

  return (
    <div className="inventory-view">
      <h2 className="view-title">Inventory</h2>

      <LoadoutManager />

      <div className="inventory-filters">
        <FilterChipGroup label="Set" options={SET_OPTIONS} selected={sets} onToggle={(v) => setSets(toggle(sets, v))} />
        <FilterChipGroup
          label="Condition"
          options={CONDITION_OPTIONS}
          selected={conditions}
          onToggle={(v) => setConditions(toggle(conditions, v))}
        />
        <FilterChipGroup
          label="Weirdness"
          options={WEIRDNESS_OPTIONS}
          selected={weirdnesses}
          onToggle={(v) => setWeirdnesses(toggle(weirdnesses, v))}
        />
      </div>

      <InventoryPanel
        title="Equipment"
        items={filtered}
        emptyMessage={stash.length === 0 ? 'Your stash is empty. Go find something.' : 'Nothing matches these filters.'}
      />
    </div>
  );
}
