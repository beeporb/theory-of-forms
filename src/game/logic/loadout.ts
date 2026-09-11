import type { GearItem } from '../types/gear';
import type { PlayerMeta } from '../types/player';
import { getGear } from '../content/gear';

export function buildLoadoutFromEquipped(equipped: PlayerMeta['equippedGearIds']): GearItem[] {
  return Object.values(equipped)
    .filter((id): id is string => !!id)
    .map(getGear);
}
