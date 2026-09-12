import type { RunState } from '../types/player';
import type { ActorEncounter, ActorInstance } from '../types/actor';
import { getActorDefinition } from '../content/actors';
import { randomInt } from '../utils/rng';

export interface ResolveActorEncounterResult {
  run: RunState;
  encounter: ActorEncounter;
}

/**
 * Resolves the player and a roaming actor sharing a cell. Adversaries and
 * traders are one-shot: they leave the board once the encounter resolves.
 * Collectors stick around so the player can donate to them again later.
 */
export function resolveActorEncounter(run: RunState, actor: ActorInstance): ResolveActorEncounterResult {
  const def = getActorDefinition(actor.definitionId);

  let health = run.health;
  let encounter: ActorEncounter;
  let removeActor = true;

  switch (def.kind) {
    case 'adversary': {
      const [min, max] = def.damageRange ?? [5, 10];
      const damage = randomInt(min, max);
      health = Math.max(0, health - damage);
      encounter = { kind: 'adversary', instanceId: actor.instanceId, definitionId: def.id, damage };
      break;
    }
    case 'trader': {
      const heal = def.healAmount ?? 10;
      health = Math.min(run.maxHealth, health + heal);
      encounter = { kind: 'trader', instanceId: actor.instanceId, definitionId: def.id, heal };
      break;
    }
    case 'collector': {
      if (!def.collectorId) throw new Error(`Actor ${def.id} is missing its collectorId`);
      encounter = {
        kind: 'collector',
        instanceId: actor.instanceId,
        definitionId: def.id,
        collectorId: def.collectorId,
      };
      removeActor = false;
      break;
    }
  }

  const status = health <= 0 ? 'died' : run.status;
  const actors = removeActor
    ? run.dimension.actors.filter((a) => a.instanceId !== actor.instanceId)
    : run.dimension.actors;

  return {
    run: { ...run, health, status, dimension: { ...run.dimension, actors } },
    encounter,
  };
}
