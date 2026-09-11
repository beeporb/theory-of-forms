import type { ItemInstance } from './item';
import type { CollectorProgress } from './collector';
import type { GridPoint, PocketDimensionInstance } from './grid';
import type { GearItem, GearSlot } from './gear';
import type { RunLogEntry } from './runLog';
import type { PastRunRecord } from './pastRun';

/** Persisted forever: meta-progression that survives across runs. */
export interface PlayerMeta {
  version: number;
  stash: ItemInstance[];
  collectors: Record<string, CollectorProgress>;
  unlockedDimensionIds: string[];
  carryCapacity: number;
  ownedGearIds: string[];
  equippedGearIds: Partial<Record<GearSlot, string>>;
  pastRuns: PastRunRecord[];
}

/** Ephemeral: exists only for the duration of a single pocket-dimension run. */
export interface RunState {
  dimension: PocketDimensionInstance;
  health: number;
  maxHealth: number;
  loadout: GearItem[];
  inventory: ItemInstance[];
  status: 'active' | 'died' | 'extracted';
  log: RunLogEntry[];
  position: GridPoint;
  moveCount: number;
}
