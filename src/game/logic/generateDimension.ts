import type { Cell, PocketDimensionDefinition, PocketDimensionInstance } from '../types/grid';
import type { Outcome } from '../types/outcome';
import { RARITY_WEIGHTS } from '../content/rarityTable';
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

function rollOutcome(itemPoolFormIds: string[]): Outcome {
  const kind = weightedPick(OUTCOME_KIND_WEIGHTS);
  switch (kind) {
    case 'loot':
      return {
        kind: 'loot',
        formId: pickOne(itemPoolFormIds),
        rarity: weightedPick(RARITY_WEIGHTS),
      };
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
  const cells: Cell[][] = definition.shape.map((row, y) =>
    row.map((exists, x): Cell => ({
      x,
      y,
      exists,
      status: 'unopened',
      outcome: exists ? rollOutcome(definition.itemPoolFormIds) : null,
    })),
  );

  return { definitionId: definition.id, cells };
}
