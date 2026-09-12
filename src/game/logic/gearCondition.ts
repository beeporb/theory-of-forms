import type { Condition } from '../types/condition';
import { CONDITION_ORDER } from '../types/condition';
import type { FoundGear } from '../types/gear';

/** Steps a condition down by `tiers`, floored at 'wrecked'. */
export function degradeCondition(condition: Condition, tiers: number): Condition {
  const index = Math.max(0, CONDITION_ORDER.indexOf(condition) - tiers);
  return CONDITION_ORDER[index];
}

/**
 * Folds gear found during a run into the player's owned gear + condition
 * map. A gear id already owned is left alone rather than re-rolled — gear is
 * owned by id, not by instance, so a duplicate find has nothing to add.
 */
export function mergeFoundGear(
  ownedGearIds: string[],
  gearCondition: Record<string, Condition>,
  found: FoundGear[],
): { ownedGearIds: string[]; gearCondition: Record<string, Condition> } {
  const nextOwned = [...ownedGearIds];
  const nextCondition = { ...gearCondition };
  for (const { gearId, condition } of found) {
    if (nextOwned.includes(gearId)) continue;
    nextOwned.push(gearId);
    nextCondition[gearId] = condition;
  }
  return { ownedGearIds: nextOwned, gearCondition: nextCondition };
}
