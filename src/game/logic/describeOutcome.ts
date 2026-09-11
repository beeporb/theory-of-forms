import type { Outcome } from '../types/outcome';
import type { IconName } from '../types/icon';
import { CONDITION_LABEL } from '../types/condition';
import { WEIRDNESS_LABEL } from '../types/weirdness';
import { getItemForm } from '../content/items';
import { getVersion } from '../content/versions';
import { itemQualityFilter } from './itemStyle';

export interface OutcomeDescription {
  icon: IconName | null;
  filter?: string;
  tone?: 'bad' | 'good';
  text: string;
}

export function describeOutcome(outcome: Outcome): OutcomeDescription {
  switch (outcome.kind) {
    case 'loot': {
      const version = getVersion(outcome.versionId);
      const form = getItemForm(version.formId);
      return {
        icon: form.icon,
        filter: itemQualityFilter(outcome.condition, outcome.weirdness),
        text: `Found a ${CONDITION_LABEL[outcome.condition].toLowerCase()}, ${WEIRDNESS_LABEL[outcome.weirdness].toLowerCase()} ${version.name}.`,
      };
    }
    case 'hazard':
      return {
        icon: 'bomb',
        tone: 'bad',
        text: outcome.stealsItem
          ? `${outcome.message} (-${outcome.damage} HP, an item was stolen)`
          : `${outcome.message} (-${outcome.damage} HP)`,
      };
    case 'positive':
      return { icon: 'sparkles', tone: 'good', text: `${outcome.message} (+${outcome.heal} HP)` };
    case 'empty':
      return { icon: null, text: outcome.message };
  }
}
