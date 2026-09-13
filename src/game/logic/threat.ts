import type { ThreatLevel } from '../types/threat';
import { THREAT_LEVEL_WEIGHTS } from '../content/threatTable';
import { weightedPick } from '../utils/rng';

/** How a rolled threat level reshapes a dimension's generation, on top of everything a character/gear already contributes. */
export interface ThreatModifiers {
  actorCountMultiplier: number;
  /** Overrides the dimension's own extractionPointCountRange entirely — used to force a single, hard-to-reach extraction at 'danger'. */
  extractionPointCountOverride?: [number, number];
  minMovesMultiplier: number;
  hazardWeightBonus: number;
  positiveWeightMultiplier: number;
  conditionTierBias: number;
  weirdnessTierBias: number;
}

// 'low' is the neutral tier — every multiplier is 1 and every bonus is 0, so
// it reproduces a dimension's own authored ranges exactly. 'safe' is calmer
// than that; 'medium'/'high'/'danger' escalate density, hazard odds, and loot
// quality while extraction gets harder to reach.
const THREAT_MODIFIERS: Record<ThreatLevel, ThreatModifiers> = {
  safe: {
    actorCountMultiplier: 0.5,
    minMovesMultiplier: 0.8,
    hazardWeightBonus: -10,
    positiveWeightMultiplier: 1.3,
    conditionTierBias: 0,
    weirdnessTierBias: 0,
  },
  low: {
    actorCountMultiplier: 1,
    minMovesMultiplier: 1,
    hazardWeightBonus: 0,
    positiveWeightMultiplier: 1,
    conditionTierBias: 0,
    weirdnessTierBias: 0,
  },
  medium: {
    actorCountMultiplier: 1.5,
    minMovesMultiplier: 1.15,
    hazardWeightBonus: 10,
    positiveWeightMultiplier: 0.85,
    conditionTierBias: 0,
    weirdnessTierBias: 0,
  },
  high: {
    actorCountMultiplier: 2,
    minMovesMultiplier: 1.3,
    hazardWeightBonus: 20,
    positiveWeightMultiplier: 0.4,
    conditionTierBias: 1,
    weirdnessTierBias: 0,
  },
  danger: {
    actorCountMultiplier: 2.5,
    extractionPointCountOverride: [1, 1],
    minMovesMultiplier: 1.5,
    hazardWeightBonus: 30,
    positiveWeightMultiplier: 0,
    conditionTierBias: 1,
    weirdnessTierBias: 1,
  },
};

export function getThreatModifiers(level: ThreatLevel): ThreatModifiers {
  return THREAT_MODIFIERS[level];
}

export function rollThreatLevel(): ThreatLevel {
  return weightedPick(THREAT_LEVEL_WEIGHTS);
}

/** Scales a [min, max] range by a multiplier, flooring at 0 and keeping min <= max after rounding. */
export function scaleRange([min, max]: [number, number], multiplier: number): [number, number] {
  const scaledMin = Math.max(0, Math.round(min * multiplier));
  const scaledMax = Math.max(scaledMin, Math.round(max * multiplier));
  return [scaledMin, scaledMax];
}
