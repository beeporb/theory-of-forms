import type { Condition } from './condition';
import type { Weirdness } from './weirdness';
import type { IconName } from './icon';

export type LeafOutcome =
  | { kind: 'loot'; versionId: string; condition: Condition; weirdness: Weirdness }
  | { kind: 'gear'; gearId: string; condition: Condition }
  | { kind: 'hazard'; damage: number; stealsItem: boolean; message: string }
  | { kind: 'positive'; heal: number; message: string }
  | { kind: 'empty'; message: string };

export interface EventChoice {
  id: string;
  label: string;
  description: string;
  outcome: LeafOutcome;
}

export interface EventOutcome {
  kind: 'event';
  eventId: string;
  icon: IconName;
  prompt: string;
  choices: EventChoice[];
}

export type Outcome = LeafOutcome | EventOutcome;
