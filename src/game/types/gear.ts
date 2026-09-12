import type { IconName } from './icon';
import type { Weirdness } from './weirdness';

export type GearSlot = 'weapon' | 'armor' | 'tool';

export interface GearItem {
  id: string;
  name: string;
  slot: GearSlot;
  icon: IconName;
  rarity: Weirdness;
  flavorText: string;
}
