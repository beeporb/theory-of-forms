import type { Cell, GridPoint, PocketDimensionDefinition, PocketDimensionInstance } from '../types/grid';
import type { Outcome } from '../types/outcome';
import type { ActorInstance } from '../types/actor';
import { CONDITION_ORDER } from '../types/condition';
import { WEIRDNESS_ORDER } from '../types/weirdness';
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
import { BASE_RUN_MODIFIERS, type RunModifiers } from './characterEffects';
import { generateLayout } from './generateLayout';

function spawnActors(
  shape: boolean[][],
  entry: GridPoint,
  actorPool: string[],
  actorCountRange: [number, number],
): ActorInstance[] {
  if (actorPool.length === 0) return [];

  const candidates: GridPoint[] = [];
  shape.forEach((row, y) =>
    row.forEach((exists, x) => {
      if (exists && !(x === entry.x && y === entry.y)) candidates.push({ x, y });
    }),
  );

  const count = Math.min(candidates.length, randomInt(...actorCountRange));
  const actors: ActorInstance[] = [];
  for (let i = 0; i < count; i++) {
    const index = randomInt(0, candidates.length - 1);
    const [position] = candidates.splice(index, 1);
    actors.push({ instanceId: crypto.randomUUID(), definitionId: pickOne(actorPool), position });
  }
  return actors;
}

function biasedPick<T>(order: readonly T[], picked: T, bias: number): T {
  if (bias === 0) return picked;
  const index = order.indexOf(picked);
  const biasedIndex = Math.min(order.length - 1, Math.max(0, index + bias));
  return order[biasedIndex];
}

function rollOutcome(itemPoolFormIds: string[], modifiers: RunModifiers): Outcome {
  const outcomeWeights = OUTCOME_KIND_WEIGHTS.map((entry) =>
    entry.value === 'loot' ? { ...entry, weight: entry.weight + modifiers.lootWeightBonus } : entry,
  );
  const kind = weightedPick(outcomeWeights);
  switch (kind) {
    case 'loot': {
      const formId = pickOne(itemPoolFormIds);
      const version = pickOne(getVersionsForForm(formId));
      return {
        kind: 'loot',
        versionId: version.id,
        condition: biasedPick(CONDITION_ORDER, weightedPick(CONDITION_WEIGHTS), modifiers.conditionTierBias),
        weirdness: biasedPick(WEIRDNESS_ORDER, weightedPick(WEIRDNESS_WEIGHTS), modifiers.weirdnessTierBias),
      };
    }
    case 'hazard':
      return {
        kind: 'hazard',
        damage: Math.max(1, Math.round(randomInt(...HAZARD_DAMAGE_RANGE) * modifiers.hazardDamageMultiplier)),
        stealsItem: Math.random() < HAZARD_STEAL_CHANCE * modifiers.hazardStealChanceMultiplier,
        message: pickOne(HAZARD_MESSAGES),
      };
    case 'positive':
      return {
        kind: 'positive',
        heal: Math.round(randomInt(...POSITIVE_HEAL_RANGE) * modifiers.positiveHealMultiplier),
        message: pickOne(POSITIVE_MESSAGES),
      };
    case 'empty':
      return { kind: 'empty', message: pickOne(EMPTY_MESSAGES) };
  }
}

export function generateDimension(
  definition: PocketDimensionDefinition,
  modifiers: RunModifiers = BASE_RUN_MODIFIERS,
): PocketDimensionInstance {
  const { shape, entry, extractionPoints } = generateLayout(definition);

  const cells: Cell[][] = shape.map((row, y) =>
    row.map((exists, x): Cell => ({
      x,
      y,
      exists,
      status: 'unopened',
      outcome: exists ? rollOutcome(definition.itemPoolFormIds, modifiers) : null,
    })),
  );

  const minMovesToExtract = randomInt(...definition.minMovesToExtractRange);
  const actors = spawnActors(shape, entry, definition.actorPool, definition.actorCountRange);

  return { definitionId: definition.id, cells, entry, extractionPoints, minMovesToExtract, actors };
}
