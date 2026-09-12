import type { ItemInstance } from '../types/item';
import type { Condition } from '../types/condition';
import type { QuestDefinition, QuestReward } from '../types/quest';
import { getVersionsForForm } from '../content/versions';
import { mergeFoundGear } from './gearCondition';

/** Counts stash items matching a form, across any version/condition/rarity. */
export function countMatchingStash(stash: ItemInstance[], formId: string): number {
  const versionIds = new Set(getVersionsForForm(formId).map((v) => v.id));
  return stash.filter((item) => versionIds.has(item.versionId)).length;
}

export function canCompleteQuest(
  quest: QuestDefinition,
  stash: ItemInstance[],
  completedQuestIds: string[],
): boolean {
  if (completedQuestIds.includes(quest.id)) return false;
  return countMatchingStash(stash, quest.requirement.formId) >= quest.requirement.count;
}

/** Removes exactly `requirement.count` matching items, arbitrarily from the front. */
export function removeQuestItems(stash: ItemInstance[], quest: QuestDefinition): ItemInstance[] {
  const versionIds = new Set(getVersionsForForm(quest.requirement.formId).map((v) => v.id));
  let remaining = quest.requirement.count;
  return stash.filter((item) => {
    if (remaining > 0 && versionIds.has(item.versionId)) {
      remaining -= 1;
      return false;
    }
    return true;
  });
}

interface QuestRewardState {
  widgets: number;
  materials: Record<string, number>;
  ownedGearIds: string[];
  gearCondition: Record<string, Condition>;
}

/**
 * Applies a quest's reward to the relevant slices of PlayerMeta. Gear is
 * granted via mergeFoundGear (same path as found-gear-on-extraction) so it
 * gets the same "already owned = no-op" and initial-condition handling.
 */
export function applyQuestReward(reward: QuestReward, state: QuestRewardState): QuestRewardState {
  const widgets = state.widgets + (reward.widgets ?? 0);

  const materials =
    reward.materialId && reward.materialCount
      ? {
          ...state.materials,
          [reward.materialId]: (state.materials[reward.materialId] ?? 0) + reward.materialCount,
        }
      : state.materials;

  const { ownedGearIds, gearCondition } = reward.gearId
    ? mergeFoundGear(state.ownedGearIds, state.gearCondition, [{ gearId: reward.gearId, condition: 'sound' }])
    : { ownedGearIds: state.ownedGearIds, gearCondition: state.gearCondition };

  return { widgets, materials, ownedGearIds, gearCondition };
}
