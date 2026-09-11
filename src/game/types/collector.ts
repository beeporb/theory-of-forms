import type { Condition } from './condition';
import type { Weirdness } from './weirdness';

export interface CollectorDefinition {
  id: string;
  name: string;
  flavorText: string;
  requiredFormIds: string[];
}

export interface DonatedEntry {
  condition: Condition;
  weirdness: Weirdness;
}

export interface CollectorProgress {
  collectorId: string;
  donated: Record<string, DonatedEntry>;
}
