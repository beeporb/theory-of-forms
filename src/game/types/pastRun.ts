import type { ItemInstance } from './item';
import type { GearItem } from './gear';
import type { RunLogEntry } from './runLog';
import type { ThreatLevel } from './threat';

export type RunOutcome = 'extracted' | 'died' | 'abandoned';

export interface PastRunRecord {
  id: string;
  dimensionId: string;
  outcome: RunOutcome;
  endedAt: number;
  moveCount: number;
  loadout: GearItem[];
  items: ItemInstance[];
  log: RunLogEntry[];
  /** Absent on runs recorded before threat levels shipped. */
  threatLevel?: ThreatLevel;
}
