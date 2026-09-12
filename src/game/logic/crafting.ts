import type { Condition } from '../types/condition';
import type { CraftingRecipe } from '../types/recipe';
import { mergeFoundGear } from './gearCondition';

export function canCraft(recipe: CraftingRecipe, materials: Record<string, number>, widgets: number): boolean {
  if (widgets < (recipe.widgetCost ?? 0)) return false;
  return recipe.materialCosts.every((cost) => (materials[cost.materialId] ?? 0) >= cost.count);
}

interface CraftState {
  materials: Record<string, number>;
  widgets: number;
  ownedGearIds: string[];
  gearCondition: Record<string, Condition>;
}

/**
 * Deducts a recipe's costs and grants the result via mergeFoundGear (same
 * path as quest rewards and found gear) so it gets the same initial-condition
 * and already-owned handling. Caller must check canCraft first — this
 * doesn't re-verify affordability.
 */
export function applyCraft(recipe: CraftingRecipe, state: CraftState): CraftState {
  const materials = { ...state.materials };
  for (const cost of recipe.materialCosts) {
    materials[cost.materialId] = (materials[cost.materialId] ?? 0) - cost.count;
  }

  const widgets = state.widgets - (recipe.widgetCost ?? 0);

  const { ownedGearIds, gearCondition } = mergeFoundGear(state.ownedGearIds, state.gearCondition, [
    { gearId: recipe.resultGearId, condition: 'sound' },
  ]);

  return { materials, widgets, ownedGearIds, gearCondition };
}
