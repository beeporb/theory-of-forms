import type { Condition } from '../types/condition';
import type { ItemInstance } from '../types/item';
import { getItemForm } from '../content/items';
import { getVersion } from '../content/versions';

// One material per set, not per form — keeps this mapping small as more
// forms get added. See src/game/content/sets.ts for the set list.
export const BREAKDOWN_MATERIAL_BY_SET: Record<string, string> = {
  minerals: 'scrap-metal',
  'mining-equipment': 'machine-parts',
  'office-relics': 'salvaged-circuitry',
  'personal-effects': 'worn-leather',
};

// Better condition breaks down into more material — a pristine find is worth
// keeping around, a wrecked one barely worth the trouble.
const BREAKDOWN_YIELD_BY_CONDITION: Record<Condition, number> = {
  wrecked: 1,
  worn: 1,
  sound: 2,
  pristine: 3,
};

export function breakdownMaterialId(setId: string): string | undefined {
  return BREAKDOWN_MATERIAL_BY_SET[setId];
}

export function breakdownYield(condition: Condition): number {
  return BREAKDOWN_YIELD_BY_CONDITION[condition];
}

/** Converts one stash item into materials; a no-op if its set has no mapping. */
export function applyBreakdown(item: ItemInstance, materials: Record<string, number>): Record<string, number> {
  const form = getItemForm(getVersion(item.versionId).formId);
  const materialId = breakdownMaterialId(form.setId);
  if (!materialId) return materials;

  const amount = breakdownYield(item.condition);
  return { ...materials, [materialId]: (materials[materialId] ?? 0) + amount };
}
