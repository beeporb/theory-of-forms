import type { Weirdness } from '../types/weirdness';

export const WEIRDNESS_WEIGHTS: { weight: number; value: Weirdness }[] = [
  { weight: 55, value: 'mundane' },
  { weight: 22, value: 'odd' },
  { weight: 12, value: 'uncanny' },
  { weight: 6, value: 'unstable' },
  { weight: 3, value: 'impossible' },
  { weight: 1.5, value: 'paradoxical' },
  { weight: 0.5, value: 'forbidden' },
];
