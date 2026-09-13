import type { IconName } from './icon';
import type { Weirdness } from './weirdness';
import type { Condition } from './condition';
import type { StatEffect } from './effect';

export type GearSlot = 'weapon' | 'armor' | 'tool' | 'key';

export interface GearItem {
  id: string;
  name: string;
  slot: GearSlot;
  icon: IconName;
  rarity: Weirdness;
  flavorText: string;
  /** How this piece affects a run while equipped, scaled by its current condition. Keys guarantee event outcomes instead (see EventChoiceDefinition.guaranteedByGearId) and carry no stat effect. */
  effect?: StatEffect;
}

/** A gear piece found mid-run, not yet granted to the player — see RunState.foundGear. */
export interface FoundGear {
  gearId: string;
  condition: Condition;
}
