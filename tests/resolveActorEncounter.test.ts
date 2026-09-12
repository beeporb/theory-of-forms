import { describe, expect, it } from 'vitest';
import { resolveActorEncounter } from '../src/game/logic/resolveActorEncounter';
import type { RunState } from '../src/game/types/player';
import type { ActorInstance } from '../src/game/types/actor';

function makeRun(overrides: Partial<RunState> = {}): RunState {
  return {
    dimension: {
      definitionId: 'test',
      cells: [],
      entry: { x: 0, y: 0 },
      extractionPoints: [],
      minMovesToExtract: 0,
      actors: [],
    },
    health: 100,
    maxHealth: 100,
    loadout: [],
    inventory: [],
    status: 'active',
    log: [],
    position: { x: 0, y: 0 },
    moveCount: 0,
    ...overrides,
  };
}

function makeActor(definitionId: string, instanceId = 'a1'): ActorInstance {
  return { instanceId, definitionId, position: { x: 0, y: 0 } };
}

describe('resolveActorEncounter', () => {
  it('damages the player on an adversary encounter and removes it from the board', () => {
    const actor = makeActor('feral-scavenger');
    const run = makeRun({ dimension: { ...makeRun().dimension, actors: [actor] } });

    const { run: next, encounter } = resolveActorEncounter(run, actor);

    expect(encounter.kind).toBe('adversary');
    expect(next.health).toBeLessThan(100);
    expect(next.dimension.actors).toHaveLength(0);
  });

  it('kills the player when adversary damage exceeds remaining health', () => {
    const actor = makeActor('feral-scavenger');
    const run = makeRun({ health: 1, dimension: { ...makeRun().dimension, actors: [actor] } });

    const { run: next } = resolveActorEncounter(run, actor);

    expect(next.health).toBe(0);
    expect(next.status).toBe('died');
  });

  it('heals the player on a trader encounter, capped at max health, and removes it from the board', () => {
    const actor = makeActor('wandering-peddler');
    const run = makeRun({ health: 95, dimension: { ...makeRun().dimension, actors: [actor] } });

    const { run: next, encounter } = resolveActorEncounter(run, actor);

    expect(encounter.kind).toBe('trader');
    expect(next.health).toBe(100);
    expect(next.dimension.actors).toHaveLength(0);
  });

  it('leaves a collector on the board and does not change health', () => {
    const actor = makeActor('roaming-miner');
    const run = makeRun({ dimension: { ...makeRun().dimension, actors: [actor] } });

    const { run: next, encounter } = resolveActorEncounter(run, actor);

    expect(encounter).toEqual({
      kind: 'collector',
      instanceId: actor.instanceId,
      definitionId: 'roaming-miner',
      collectorId: 'the-miner',
    });
    expect(next.health).toBe(100);
    expect(next.dimension.actors).toHaveLength(1);
  });
});
