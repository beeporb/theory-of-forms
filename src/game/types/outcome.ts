import type { Rarity } from './rarity';

export type Outcome =
  | { kind: 'loot'; formId: string; rarity: Rarity }
  | { kind: 'hazard'; damage: number; stealsItem: boolean; message: string }
  | { kind: 'positive'; heal: number; message: string }
  | { kind: 'empty'; message: string };
