import type { Condition } from '../types/condition';

export const CONDITION_WEIGHTS: { weight: number; value: Condition }[] = [
  { weight: 15, value: 'wrecked' },
  { weight: 40, value: 'worn' },
  { weight: 35, value: 'sound' },
  { weight: 10, value: 'pristine' },
];
