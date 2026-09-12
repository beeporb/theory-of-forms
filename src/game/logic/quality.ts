import { CONDITION_ORDER, type Condition } from '../types/condition';
import { WEIRDNESS_ORDER, type Weirdness } from '../types/weirdness';

// Equal-weighted sum of each axis normalised to its own 0-1 range, so a
// beat-up-but-impossible find and a pristine-but-mundane one can rate the
// same overall quality — a collector cares about both axes, not one
// primarily, regardless of how many tiers either axis has.
export function qualityScore(condition: Condition, weirdness: Weirdness): number {
  const conditionScore = CONDITION_ORDER.indexOf(condition) / (CONDITION_ORDER.length - 1);
  const weirdnessScore = WEIRDNESS_ORDER.indexOf(weirdness) / (WEIRDNESS_ORDER.length - 1);
  return conditionScore + weirdnessScore;
}
