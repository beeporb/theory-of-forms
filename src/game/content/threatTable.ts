import type { ThreatLevel } from '../types/threat';

// Weighted like OUTCOME_KIND_WEIGHTS/CONDITION_WEIGHTS/WEIRDNESS_WEIGHTS — a
// tuning table, not id-referenced content, so no getX lookup alongside it.
export const THREAT_LEVEL_WEIGHTS: { weight: number; value: ThreatLevel }[] = [
  { weight: 28, value: 'safe' },
  { weight: 30, value: 'low' },
  { weight: 22, value: 'medium' },
  { weight: 13, value: 'high' },
  { weight: 7, value: 'danger' },
];
