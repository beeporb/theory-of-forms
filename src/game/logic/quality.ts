import { CONDITION_ORDER, type Condition } from '../types/condition';
import { WEIRDNESS_ORDER, type Weirdness } from '../types/weirdness';

// Equal-weighted sum: a beat-up-but-impossible find and a pristine-but-mundane
// one can rate the same overall quality — a collector cares about both axes,
// not one primarily.
export function qualityScore(condition: Condition, weirdness: Weirdness): number {
  return CONDITION_ORDER.indexOf(condition) + WEIRDNESS_ORDER.indexOf(weirdness);
}
