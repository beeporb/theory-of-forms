import type { LoadoutItem } from '../types/player';

export function createStartingLoadout(): LoadoutItem[] {
  return [
    { id: 'rusty-crowbar', name: 'Rusty Crowbar', slot: 'weapon' },
    { id: 'patched-jacket', name: 'Patched Jacket', slot: 'armor' },
    { id: 'hand-lamp', name: 'Hand Lamp', slot: 'tool' },
  ];
}
