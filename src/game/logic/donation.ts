import type { ItemInstance } from '../types/item';
import type { CollectorDefinition, CollectorProgress } from '../types/collector';
import { getRequiredVersionIds } from './masterSet';
import { qualityScore } from './quality';

export function canDonate(
  item: ItemInstance,
  collector: CollectorDefinition,
  progress: CollectorProgress,
): boolean {
  if (!getRequiredVersionIds(collector).includes(item.versionId)) return false;
  const held = progress.donated[item.versionId];
  if (!held) return true;
  return qualityScore(item.condition, item.weirdness) > qualityScore(held.condition, held.weirdness);
}

export function applyDonation(progress: CollectorProgress, item: ItemInstance): CollectorProgress {
  return {
    ...progress,
    donated: {
      ...progress.donated,
      [item.versionId]: { condition: item.condition, weirdness: item.weirdness },
    },
  };
}
