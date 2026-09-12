import type { IconName } from './icon';
import type { GridPoint } from './grid';

export type ActorKind = 'adversary' | 'trader' | 'collector';

export interface ActorDefinition {
  id: string;
  kind: ActorKind;
  name: string;
  icon: IconName;
  flavorText: string;
  /** adversary only: HP damage dealt on encounter. */
  damageRange?: [number, number];
  /** trader only: HP healed on encounter. */
  healAmount?: number;
  /** collector only: which collector this roaming actor accepts donations for. */
  collectorId?: string;
}

export interface ActorInstance {
  instanceId: string;
  definitionId: string;
  position: GridPoint;
}

export type ActorEncounter =
  | { kind: 'adversary'; instanceId: string; definitionId: string; damage: number }
  | { kind: 'trader'; instanceId: string; definitionId: string; heal: number }
  | { kind: 'collector'; instanceId: string; definitionId: string; collectorId: string };
