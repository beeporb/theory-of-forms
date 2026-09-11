import type { Outcome } from '../types/outcome';
import { CONDITION_LABEL } from '../types/condition';
import { WEIRDNESS_LABEL } from '../types/weirdness';
import { getItemForm } from '../content/items';
import { getVersion } from '../content/versions';

export interface OutcomeDescription {
  icon: string;
  text: string;
}

export function describeOutcome(outcome: Outcome): OutcomeDescription {
  switch (outcome.kind) {
    case 'loot': {
      const version = getVersion(outcome.versionId);
      const form = getItemForm(version.formId);
      return {
        icon: form.icon,
        text: `Found a ${CONDITION_LABEL[outcome.condition].toLowerCase()}, ${WEIRDNESS_LABEL[outcome.weirdness].toLowerCase()} ${version.name}.`,
      };
    }
    case 'hazard':
      return {
        icon: '💥',
        text: outcome.stealsItem
          ? `${outcome.message} (-${outcome.damage} HP, an item was stolen)`
          : `${outcome.message} (-${outcome.damage} HP)`,
      };
    case 'positive':
      return { icon: '✨', text: `${outcome.message} (+${outcome.heal} HP)` };
    case 'empty':
      return { icon: '·', text: outcome.message };
  }
}
