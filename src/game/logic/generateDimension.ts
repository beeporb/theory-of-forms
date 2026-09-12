import type { Cell, PocketDimensionDefinition, PocketDimensionInstance } from '../types/grid';
import type { Outcome } from '../types/outcome';
import { getVersionsForForm } from '../content/versions';
import { CONDITION_WEIGHTS } from '../content/conditionTable';
import { WEIRDNESS_WEIGHTS } from '../content/weirdnessTable';
import {
  EMPTY_MESSAGES,
  HAZARD_DAMAGE_RANGE,
  HAZARD_MESSAGES,
  HAZARD_STEAL_CHANCE,
  OUTCOME_KIND_WEIGHTS,
  POSITIVE_HEAL_RANGE,
  POSITIVE_MESSAGES,
} from '../content/encounterTable';
import { pickOne, randomInt, weightedPick } from '../utils/rng';
import { generateLayout } from './generateLayout';

function rollOutcome(itemPoolFormIds: string[]): Outcome {
  const kind = weightedPick(OUTCOME_KIND_WEIGHTS);
  switch (kind) {
    case 'loot': {
      const formId = pickOne(itemPoolFormIds);
      const version = pickOne(getVersionsForForm(formId));
      return {
        kind: 'loot',
        versionId: version.id,
        condition: weightedPick(CONDITION_WEIGHTS),
        weirdness: weightedPick(WEIRDNESS_WEIGHTS),
      };
    }
    case 'hazard':
      return {
        kind: 'hazard',
        damage: randomInt(...HAZARD_DAMAGE_RANGE),
        stealsItem: Math.random() < HAZARD_STEAL_CHANCE,
        message: pickOne(HAZARD_MESSAGES),
      };
    case 'positive':
      return {
        kind: 'positive',
        heal: randomInt(...POSITIVE_HEAL_RANGE),
        message: pickOne(POSITIVE_MESSAGES),
      };
    case 'empty':
      return { kind: 'empty', message: pickOne(EMPTY_MESSAGES) };
  }
}

export function generateDimension(definition: PocketDimensionDefinition): PocketDimensionInstance {
  const { shape, entry, extractionPoints } = generateLayout(definition);

  const cells: Cell[][] = shape.map((row, y) =>
    row.map((exists, x): Cell => ({
      x,
      y,
      exists,
      status: 'unopened',
      outcome: exists ? rollOutcome(definition.itemPoolFormIds) : null,
    })),
  );

  const minMovesToExtract = randomInt(...definition.minMovesToExtractRange);

  return { definitionId: definition.id, cells, entry, extractionPoints, minMovesToExtract };
}
