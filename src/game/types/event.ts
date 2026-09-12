import type { IconName } from './icon';
import type { LeafOutcomeKind } from '../content/encounterTable';

export interface EventChoiceDefinition {
  id: string;
  label: string;
  description: string;
  /** Weighted pool of possible resolutions for this choice, rolled at generation time. */
  outcomeWeights: { weight: number; value: LeafOutcomeKind }[];
  /**
   * When the player carries this gear id (checked against their equipped
   * loadout at generation time), this choice skips outcomeWeights entirely
   * and resolves as guaranteedKind instead — the key/keycard making the
   * risky option a sure thing.
   */
  guaranteedByGearId?: string;
  guaranteedKind?: LeafOutcomeKind;
}

export interface EventDefinition {
  id: string;
  icon: IconName;
  prompt: string;
  choices: EventChoiceDefinition[];
}
