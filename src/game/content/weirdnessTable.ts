import type { Weirdness } from '../types/weirdness';

export const WEIRDNESS_WEIGHTS: { weight: number; value: Weirdness }[] = [
  { weight: 70, value: 'mundane' },
  { weight: 20, value: 'odd' },
  { weight: 8, value: 'uncanny' },
  { weight: 2, value: 'impossible' },
];
