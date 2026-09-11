import type { ItemInstance } from './item';
import type { CollectorProgress } from './collector';
import type { PocketDimensionInstance } from './grid';

export interface LoadoutItem {
  id: string;
  name: string;
  slot: 'weapon' | 'armor' | 'tool';
}

/** Persisted forever: meta-progression that survives across runs. */
export interface PlayerMeta {
  version: number;
  stash: ItemInstance[];
  collectors: Record<string, CollectorProgress>;
  unlockedDimensionIds: string[];
  carryCapacity: number;
}

/** Ephemeral: exists only for the duration of a single pocket-dimension run. */
export interface RunState {
  dimension: PocketDimensionInstance;
  health: number;
  maxHealth: number;
  loadout: LoadoutItem[];
  inventory: ItemInstance[];
  status: 'active' | 'died' | 'extracted';
}
