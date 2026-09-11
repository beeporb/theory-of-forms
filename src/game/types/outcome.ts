import type { Condition } from './condition';
import type { Weirdness } from './weirdness';

export type Outcome =
  | { kind: 'loot'; versionId: string; condition: Condition; weirdness: Weirdness }
  | { kind: 'hazard'; damage: number; stealsItem: boolean; message: string }
  | { kind: 'positive'; heal: number; message: string }
  | { kind: 'empty'; message: string };
