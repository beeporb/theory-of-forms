import { describe, expect, it } from 'vitest';
import { degradeCondition, mergeFoundGear } from '../src/game/logic/gearCondition';

describe('degradeCondition', () => {
  it('steps down one tier per point', () => {
    expect(degradeCondition('pristine', 1)).toBe('sound');
    expect(degradeCondition('sound', 1)).toBe('worn');
    expect(degradeCondition('worn', 1)).toBe('wrecked');
  });

  it('floors at wrecked instead of going negative', () => {
    expect(degradeCondition('wrecked', 1)).toBe('wrecked');
    expect(degradeCondition('worn', 5)).toBe('wrecked');
  });

  it('supports degrading by more than one tier at once', () => {
    expect(degradeCondition('pristine', 2)).toBe('worn');
  });
});

describe('mergeFoundGear', () => {
  it('adds a newly found gear id with its rolled condition', () => {
    const result = mergeFoundGear(['rusty-crowbar'], { 'rusty-crowbar': 'sound' }, [
      { gearId: 'bent-pipe', condition: 'pristine' },
    ]);
    expect(result.ownedGearIds).toContain('bent-pipe');
    expect(result.gearCondition['bent-pipe']).toBe('pristine');
  });

  it('leaves an already-owned gear id and its condition untouched', () => {
    const result = mergeFoundGear(['bent-pipe'], { 'bent-pipe': 'wrecked' }, [
      { gearId: 'bent-pipe', condition: 'pristine' },
    ]);
    expect(result.ownedGearIds).toEqual(['bent-pipe']);
    expect(result.gearCondition['bent-pipe']).toBe('wrecked');
  });

  it('does not mutate the inputs', () => {
    const ownedGearIds = ['rusty-crowbar'];
    const gearCondition = { 'rusty-crowbar': 'sound' as const };
    mergeFoundGear(ownedGearIds, gearCondition, [{ gearId: 'bent-pipe', condition: 'worn' }]);
    expect(ownedGearIds).toEqual(['rusty-crowbar']);
    expect(gearCondition).toEqual({ 'rusty-crowbar': 'sound' });
  });
});
