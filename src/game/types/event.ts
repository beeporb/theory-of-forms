import type { IconName } from './icon';
import type { LeafOutcomeKind } from '../content/encounterTable';

export interface EventChoiceDefinition {
  id: string;
  label: string;
  description: string;
  /** Weighted pool of possible resolutions for this choice, rolled at generation time. */
  outcomeWeights: { weight: number; value: LeafOutcomeKind }[];
}

export interface EventDefinition {
  id: string;
  icon: IconName;
  prompt: string;
  choices: EventChoiceDefinition[];
}
