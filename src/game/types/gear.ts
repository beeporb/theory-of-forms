import type { IconName } from './icon';
import type { Weirdness } from './weirdness';
import type { Condition } from './condition';

export type GearSlot = 'weapon' | 'armor' | 'tool' | 'key';

export interface GearItem {
  id: string;
  name: string;
  slot: GearSlot;
  icon: IconName;
  rarity: Weirdness;
  flavorText: string;
}

/** A gear piece found mid-run, not yet granted to the player — see RunState.foundGear. */
export interface FoundGear {
  gearId: string;
  condition: Condition;
}
