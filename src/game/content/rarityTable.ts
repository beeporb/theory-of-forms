import type { Rarity } from '../types/rarity';

export const RARITY_WEIGHTS: { weight: number; value: Rarity }[] = [
  { weight: 60, value: 'broken' },
  { weight: 30, value: 'cartoon' },
  { weight: 10, value: 'anthropomorphized' },
];
