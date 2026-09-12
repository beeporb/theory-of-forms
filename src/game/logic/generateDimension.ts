import type { Cell, GridPoint, PocketDimensionDefinition, PocketDimensionInstance } from '../types/grid';
import type { LeafOutcome, Outcome } from '../types/outcome';
import type { ActorInstance } from '../types/actor';
import { CONDITION_ORDER } from '../types/condition';
import { WEIRDNESS_ORDER } from '../types/weirdness';
import { getVersionsForForm } from '../content/versions';
import { CONDITION_WEIGHTS } from '../content/conditionTable';
import { WEIRDNESS_WEIGHTS } from '../content/weirdnessTable';
import { EVENTS } from '../content/events';
import {
  EMPTY_MESSAGES,
  GEAR_DROP_CHANCE,
  HAZARD_DAMAGE_RANGE,
  HAZARD_DEPTH_DAMAGE_MULTIPLIER_BONUS,
  HAZARD_DEPTH_WEIGHT_BONUS,
  HAZARD_MESSAGES,
  HAZARD_STEAL_CHANCE,
  type LeafOutcomeKind,
  OUTCOME_KIND_WEIGHTS,
  POSITIVE_HEAL_RANGE,
  POSITIVE_MESSAGES,
} from '../content/encounterTable';
import { pickOne, randomInt, weightedPick } from '../utils/rng';
import { BASE_RUN_MODIFIERS, type RunModifiers } from './characterEffects';
import { generateLayout, pointKey } from './generateLayout';

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

/** `depthFactor` is 0 at the entry and 1 at the farthest reachable cell in this layout. */
function rollLeafOutcome(
  kind: LeafOutcomeKind,
  itemPoolFormIds: string[],
  gearPoolIds: string[],
  modifiers: RunModifiers,
  depthFactor: number,
): LeafOutcome {
  switch (kind) {
    case 'loot': {
      // A 'loot' roll occasionally hands over a gear piece instead of an item —
      // gear found this way still rolls its initial condition the same way an
      // item's does, rather than always starting 'sound'.
      if (gearPoolIds.length > 0 && Math.random() < GEAR_DROP_CHANCE) {
        return {
          kind: 'gear',
          gearId: pickOne(gearPoolIds),
          condition: biasedPick(CONDITION_ORDER, weightedPick(CONDITION_WEIGHTS), modifiers.conditionTierBias),
        };
      }
      const formId = pickOne(itemPoolFormIds);
      const version = pickOne(getVersionsForForm(formId));
      return {
        kind: 'loot',
        versionId: version.id,
        condition: biasedPick(CONDITION_ORDER, weightedPick(CONDITION_WEIGHTS), modifiers.conditionTierBias),
        weirdness: biasedPick(WEIRDNESS_ORDER, weightedPick(WEIRDNESS_WEIGHTS), modifiers.weirdnessTierBias),
      };
    }
    case 'hazard': {
      const depthDamageMultiplier = 1 + depthFactor * HAZARD_DEPTH_DAMAGE_MULTIPLIER_BONUS;
      return {
        kind: 'hazard',
        damage: Math.max(
          1,
          Math.round(randomInt(...HAZARD_DAMAGE_RANGE) * modifiers.hazardDamageMultiplier * depthDamageMultiplier),
        ),
        stealsItem: Math.random() < HAZARD_STEAL_CHANCE * modifiers.hazardStealChanceMultiplier,
        message: pickOne(HAZARD_MESSAGES),
      };
    }
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

/**
 * Rolls which vignette occurs, then pre-rolls each choice's own resolution.
 * `carriedGearIds` is checked here (generation time) rather than at choice
 * time so a choice's own key check follows the same pre-roll pattern as
 * everything else in this file — see the comment on generateDimension for
 * why that means "carried" means "equipped" rather than "owned".
 */
function rollEvent(
  itemPoolFormIds: string[],
  gearPoolIds: string[],
  modifiers: RunModifiers,
  depthFactor: number,
  carriedGearIds: string[],
): Outcome {
  const template = pickOne(EVENTS);
  return {
    kind: 'event',
    eventId: template.id,
    icon: template.icon,
    prompt: template.prompt,
    choices: template.choices.map((choice) => {
      const guaranteed = !!choice.guaranteedByGearId && carriedGearIds.includes(choice.guaranteedByGearId);
      const kind = guaranteed ? choice.guaranteedKind! : weightedPick(choice.outcomeWeights);
      // A guaranteed resolution is also a *good* one — nudge condition up a
      // tier so "the key made it a sure thing" reads as a sure good thing.
      const effectiveModifiers = guaranteed
        ? { ...modifiers, conditionTierBias: modifiers.conditionTierBias + 1 }
        : modifiers;
      return {
        id: choice.id,
        label: choice.label,
        description: choice.description,
        outcome: rollLeafOutcome(kind, itemPoolFormIds, gearPoolIds, effectiveModifiers, depthFactor),
      };
    }),
  };
}

function rollOutcome(
  itemPoolFormIds: string[],
  gearPoolIds: string[],
  modifiers: RunModifiers,
  depthFactor: number,
  carriedGearIds: string[],
): Outcome {
  const outcomeWeights = OUTCOME_KIND_WEIGHTS.map((entry) => {
    if (entry.value === 'loot') return { ...entry, weight: entry.weight + modifiers.lootWeightBonus };
    if (entry.value === 'hazard') return { ...entry, weight: entry.weight + depthFactor * HAZARD_DEPTH_WEIGHT_BONUS };
    return entry;
  });
  const kind = weightedPick(outcomeWeights);
  if (kind === 'event') return rollEvent(itemPoolFormIds, gearPoolIds, modifiers, depthFactor, carriedGearIds);
  return rollLeafOutcome(kind, itemPoolFormIds, gearPoolIds, modifiers, depthFactor);
}

/**
 * `carriedGearIds` are the gear ids actually brought into this run — i.e. the
 * player's *equipped* loadout (buildLoadoutFromEquipped), not everything they
 * own. Keys/keycards only unlock anything while equipped in the key slot,
 * matching how weapon/armor/tool gear already only helps a run once equipped.
 */
export function generateDimension(
  definition: PocketDimensionDefinition,
  modifiers: RunModifiers = BASE_RUN_MODIFIERS,
  carriedGearIds: string[] = [],
): PocketDimensionInstance {
  const { shape, entry, extractionPoints, distances } = generateLayout(definition);
  const maxDistance = Math.max(1, ...distances.values());

  const cells: Cell[][] = shape.map((row, y) =>
    row.map((exists, x): Cell => {
      const depthFactor = (distances.get(pointKey({ x, y })) ?? 0) / maxDistance;
      return {
        x,
        y,
        exists,
        status: 'unopened',
        outcome: exists
          ? rollOutcome(definition.itemPoolFormIds, definition.gearPool, modifiers, depthFactor, carriedGearIds)
          : null,
      };
    }),
  );

  const minMovesToExtract = randomInt(...definition.minMovesToExtractRange);
  const actors = spawnActors(shape, entry, definition.actorPool, definition.actorCountRange);

  return { definitionId: definition.id, cells, entry, extractionPoints, minMovesToExtract, actors };
}
