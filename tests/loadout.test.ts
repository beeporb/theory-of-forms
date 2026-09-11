import { describe, expect, it } from 'vitest';
import { buildLoadoutFromEquipped } from '../src/game/logic/loadout';

describe('buildLoadoutFromEquipped', () => {
  it('resolves each equipped slot to its gear item', () => {
    const loadout = buildLoadoutFromEquipped({
      weapon: 'rusty-crowbar',
      armor: 'patched-jacket',
      tool: 'hand-lamp',
    });
    expect(loadout.map((g) => g.id).sort()).toEqual(['hand-lamp', 'patched-jacket', 'rusty-crowbar']);
  });

  it('omits missing slots rather than inserting a placeholder', () => {
    const loadout = buildLoadoutFromEquipped({ weapon: 'rusty-crowbar' });
    expect(loadout).toHaveLength(1);
    expect(loadout[0].id).toBe('rusty-crowbar');
  });

  it('returns an empty array when nothing is equipped', () => {
    expect(buildLoadoutFromEquipped({})).toEqual([]);
  });
});
