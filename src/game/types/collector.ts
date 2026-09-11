import type { Condition } from './condition';
import type { Weirdness } from './weirdness';
import type { PlayerMeta } from './player';

export interface CollectorDefinition {
  id: string;
  name: string;
  flavorText: string;
  requiredFormIds: string[];
  secret?: boolean;
  revealCondition?: (meta: PlayerMeta) => boolean;
}

export interface DonatedEntry {
  condition: Condition;
  weirdness: Weirdness;
}

export interface CollectorProgress {
  collectorId: string;
  donated: Record<string, DonatedEntry>;
}
