import { describe, expect, it } from 'vitest';
import { applyLeafOutcome } from '../src/game/logic/applyOutcome';
import type { RunState } from '../src/game/types/player';

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
    foundGear: [],
    carryCapacity: 10,
    status: 'active',
    log: [],
    position: { x: 0, y: 0 },
    moveCount: 0,
    ...overrides,
  };
}

describe('applyLeafOutcome', () => {
  it('adds a loot item to inventory', () => {
    const run = makeRun();
    const { inventory } = applyLeafOutcome(run, {
      kind: 'loot',
      versionId: 'iron-ore-standard',
      condition: 'worn',
      weirdness: 'mundane',
    });
    expect(inventory).toHaveLength(1);
    expect(inventory[0].versionId).toBe('iron-ore-standard');
  });

  it('adds found gear to foundGear, leaving inventory untouched', () => {
    const run = makeRun();
    const { inventory, foundGear } = applyLeafOutcome(run, { kind: 'gear', gearId: 'bent-pipe', condition: 'worn' });
    expect(inventory).toHaveLength(0);
    expect(foundGear).toEqual([{ gearId: 'bent-pipe', condition: 'worn' }]);
  });

  it('applies hazard damage and can steal an item', () => {
    const run = makeRun({
      inventory: [{ instanceId: '1', versionId: 'iron-ore-standard', condition: 'worn', weirdness: 'mundane' }],
    });
    const { health, inventory } = applyLeafOutcome(run, {
      kind: 'hazard',
      damage: 20,
      stealsItem: true,
      message: 'ouch',
    });
    expect(health).toBe(80);
    expect(inventory).toHaveLength(0);
  });

  it('heals but does not exceed maxHealth', () => {
    const run = makeRun({ health: 90 });
    const { health } = applyLeafOutcome(run, { kind: 'positive', heal: 30, message: 'nice' });
    expect(health).toBe(100);
  });

  it('does nothing for an empty outcome', () => {
    const run = makeRun();
    const result = applyLeafOutcome(run, { kind: 'empty', message: 'nothing' });
    expect(result.health).toBe(run.health);
    expect(result.inventory).toBe(run.inventory);
  });

  it('sets status to died when health hits zero', () => {
    const run = makeRun({ health: 10 });
    const { status } = applyLeafOutcome(run, { kind: 'hazard', damage: 50, stealsItem: false, message: 'ouch' });
    expect(status).toBe('died');
  });
});
