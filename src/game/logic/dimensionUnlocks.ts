import type { PlayerMeta } from '../types/player';
import { DIMENSIONS } from '../content/dimensions';

/** Every dimension that should be unlocked given the current meta state, existing unlocks included. */
export function unlockedDimensionIdsAfter(meta: PlayerMeta): string[] {
  const unlocked = new Set(meta.unlockedDimensionIds);
  for (const dimension of DIMENSIONS) {
    if (!unlocked.has(dimension.id) && (!dimension.unlockCondition || dimension.unlockCondition(meta))) {
      unlocked.add(dimension.id);
    }
  }
  return [...unlocked];
}

/** Re-checks dimension unlocks against a just-updated meta and folds the result back in. */
export function withDimensionUnlocks(meta: PlayerMeta): PlayerMeta {
  return { ...meta, unlockedDimensionIds: unlockedDimensionIdsAfter(meta) };
}
