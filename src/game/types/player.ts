import type { ItemInstance } from './item';
import type { Condition } from './condition';
import type { CollectorProgress } from './collector';
import type { GridPoint, PocketDimensionInstance } from './grid';
import type { FoundGear, GearItem, GearSlot } from './gear';
import type { RunLogEntry } from './runLog';
import type { PastRunRecord } from './pastRun';
import type { CharacterProgress } from './character';

/** Persisted forever: meta-progression that survives across runs. */
export interface PlayerMeta {
  version: number;
  stash: ItemInstance[];
  collectors: Record<string, CollectorProgress>;
  unlockedDimensionIds: string[];
  carryCapacity: number;
  ownedGearIds: string[];
  equippedGearIds: Partial<Record<GearSlot, string>>;
  /** Current condition of each owned gear piece, keyed by gear id — degrades after runs it's equipped for. */
  gearCondition: Record<string, Condition>;
  pastRuns: PastRunRecord[];
  character: CharacterProgress;
  /** Generic currency paid out by quests. Flat counter, not tied to any item/condition system. */
  widgets: number;
  /** Crafting materials by material id — the resource #54 (crafting) will consume. */
  materials: Record<string, number>;
  /** Quests are one-time per player; completing one just adds its id here. */
  completedQuestIds: string[];
}

/** Ephemeral: exists only for the duration of a single pocket-dimension run. */
export interface RunState {
  dimension: PocketDimensionInstance;
  health: number;
  maxHealth: number;
  loadout: GearItem[];
  inventory: ItemInstance[];
  /** Gear found this run but not yet granted — merged into owned gear on extraction, lost otherwise (mirrors inventory). */
  foundGear: FoundGear[];
  carryCapacity: number;
  status: 'active' | 'died' | 'extracted';
  log: RunLogEntry[];
  position: GridPoint;
  moveCount: number;
}
